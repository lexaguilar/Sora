using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sora.Extensions;
using Sora.Factory;
using Sora.Models.SaraModel;
using Sora.ViewModel;
using static Sora.Enumerators;

namespace Sora.Controllers
{
    public class ComprasController : Controller
    {
        private readonly SaraContext db;
        private GenericFactory<Compras> factory = null;
        private GenericFactory<ComprasDetalle> factoryDetalle = null;
        public ComprasController(SaraContext _db)
        {
            db = _db;
            this.factory = new GenericFactory<Compras>(db);
            this.factoryDetalle = new GenericFactory<ComprasDetalle>(db);
        }

        [Route("api/compras/get")]
        public IActionResult Get(int corteId, int skip, int take, IDictionary<string, string> values)
        {
            IQueryable<Compras> compras = db.Compras
            .OrderByDescending(x => x.Id);

            if (values.ContainsKey("formaPagoId"))
            {
                var formaPagoId = Convert.ToInt32(values["formaPagoId"]);
                compras = compras.Where(x => x.FormaPagoId == formaPagoId);
            }

            if (values.ContainsKey("proveedorId"))
            {
                var proveedorId = Convert.ToInt32(values["proveedorId"]);
                compras = compras.Where(x => x.ProveedorId == proveedorId);
            }

            if (values.ContainsKey("estadoId"))
            {
                var estadoId = Convert.ToInt32(values["estadoId"]);
                compras = compras.Where(x => x.EstadoId == estadoId);
            }

            var items = compras.Skip(skip).Take(take);

            return Json(new
            {
                items,
                totalCount = compras.Count()
            });
        }


        [Route("api/compras/get/{id}")]
        public IActionResult GetById(int id)
        {

            var compra = db.Compras.Include(x => x.ComprasDetalle).ThenInclude(x => x.Inventario).ThenInclude(x =>x.AreaExistencias).FirstOrDefault(x => x.Id == id);
            return Json(compra);

        }

        [Route("api/compras/post")]
        public IActionResult Post([FromBody] Compras compra)
        {
            var model = compra
            .ApplyRules()
            .validate();

            if (!model.IsValid)
                return BadRequest(model.Error);


            if (compra.Id > 0)
            {
                //Actializar encabezado
                var compraModificada = factory.FirstOrDefault(x => x.Id == compra.Id);
                model = compra.validate(compraModificada);
                if (!model.IsValid)
                    return BadRequest(model.Error);

                compraModificada.CopyAllFromExcept(compra, x => new
                {
                    x.Id,
                    x.EtapaId
                });

                factory.Save();

                //eliminar registros anteriores
                var oldComprasDetalle = factoryDetalle.GetAll(x => x.CompraId == compra.Id);
                var idsToDelete = oldComprasDetalle.Select(x => x.InventarioId).Except(compra.ComprasDetalle.Select(x => x.InventarioId));
                var objToDelete = oldComprasDetalle.Where(x => idsToDelete.Contains(x.InventarioId)).ToList();
                objToDelete.ForEach(x => factoryDetalle.Delete(x));

                //agregar nuevos registros y actualizar                
                foreach (var item in compra.ComprasDetalle)
                {
                    var comprasDetalle = oldComprasDetalle.FirstOrDefault(x => x.InventarioId == item.InventarioId);
                    if (comprasDetalle == null)
                        factoryDetalle.Insert(item);
                    else
                        comprasDetalle.CopyAllFromExcept(item, x => new { x.Id, x.CompraId, x.Compra });

                }

                factoryDetalle.Save();

            }
            else
            {
                compra.EtapaId = (int)CompraEtapas.Pendiente;
                factory.Insert(compra);
                factory.Save();
            }

            return Json(compra);

        }

        [Route("api/compras/descargar")]
        public IActionResult Descargar([FromBody] Compras compra)
        {
            var user = this.GetAppUser();
            //Actializar encabezado
            var compraModificada = db.Compras.Include(x => x.ComprasDetalle).FirstOrDefault(x => x.Id == compra.Id);
            if (compraModificada == null)
                return BadRequest($"No se puede encontra la compra con identificador {compra.Id}");

            if (compraModificada.EstadoId == (int)Estados.Anulado)
                return BadRequest($"No se puede hacer una descarga de una compra en estado anulado");

            compraModificada.CopyFrom(compra, x => new
            {
                x.Referencia,
                x.Observacion
            });

            compraModificada.EtapaId = (int)CompraEtapas.Recibida;

            //Actualizar registros
            //var oldComprasDetalle = factoryDetalle.GetAll(x => x.CompraId == compra.Id);
            foreach (var item in compraModificada.ComprasDetalle)
            {
                var itemEnviado = compra.ComprasDetalle.FirstOrDefault(x => x.Id == item.Id);
                if (itemEnviado != null)
                {
                    item.CantidadRecibida = itemEnviado.CantidadRecibida;
                    item.Costo = itemEnviado.Costo;
                    item.NuevoPrecio = itemEnviado.NuevoPrecio;
                    item.SubTotal = itemEnviado.SubTotal;
                    item.DescuentoAverage = itemEnviado.DescuentoAverage;
                    item.DescuentoMonto = itemEnviado.DescuentoMonto;
                    item.Importe = itemEnviado.Importe;
                    item.IvaAverage = itemEnviado.IvaAverage;
                    item.IvaMonto = itemEnviado.IvaMonto;
                    item.Total = itemEnviado.Total;
                }
            }

            //Hacer la entrada
            //Craer encabezado
            var entrada = new Entradas();
            entrada.InitFromCompras(db, compra, user);

            foreach (var item in compra.ComprasDetalle)
            {

                var entradasDetalle = new EntradasDetalle();

                entradasDetalle.InitFromComprasDetalle(entrada, item, db);

                entrada.EntradasDetalle.Add(entradasDetalle);

                //Actualizar existencias
                var inventario = db.Inventario.Find(entradasDetalle.InventarioId);
                inventario.RegisterTransactionIn(db, entradasDetalle, user, entrada.AreaId);

            }

            db.Entradas.Add(entrada);
            compra.EntradaId = entrada.Id;
            entrada.CompraId = compra.Id;

            var app = db.App.FirstOrDefault();
            if (app.GererarProcesosContables)
            {
                var asientosFactory = new AsientosFactory(db);
                var result = asientosFactory.CreateFromEntrada(entrada, app); 
                if(!result.IsValid)
                    return BadRequest(result.Error);
            }        

            db.SaveChanges();

            return Json(compra);

        }


        [HttpGet("api/compras/{id}/delete")]
        public IActionResult Delete(int id)
        {

            var n = factory.DeleteAndSave(id);
            return Json(new { n });

        }
    }
}
