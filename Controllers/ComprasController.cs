using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

            var compra = db.Compras.Include(x => x.ComprasDetalle).FirstOrDefault(x => x.Id == id);
            return Json(compra);

        }

        [Route("api/compras/post")]
        public IActionResult Post([FromBody] Compras compra)
        {

            if (compra.Id > 0)
            {
                //Actializar encabezado
                var compraModificada = factory.FirstOrDefault(x => x.Id == compra.Id);
                if (compraModificada.EtapaId == (int)CompraEtapas.Recibida)
                    return BadRequest($"No se puede editar una compra en la etapa recibida");

                compraModificada.CopyAllFromExcept(compra, x => new
                {
                    x.Id,
                    x.EstadoId,
                    x.Etapa
                });

                factory.Save();

                //eliminar registros anteriores
                var oldComprasDetalle = factoryDetalle.GetAll(x => x.CompraId == compra.Id);
                foreach (var item in oldComprasDetalle)
                    factoryDetalle.Delete(item);
                factoryDetalle.Save();

                //agregar nuevos registros
                var detalle = compra.ComprasDetalle;
                foreach (var item in detalle)
                {

                    var comprasDetalle = new ComprasDetalle();
                    comprasDetalle.CopyAllFromExcept(item, x => new { x.Id });
                    factoryDetalle.Insert(comprasDetalle);

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
                }
            }

            //Hacer la entrada
            //Craer encabezado
            var entrada = new Entradas();
            entrada.InitFromCompras(db, compra);
            foreach (var item in compra.ComprasDetalle)
            {

                var entradasDetalle = new EntradasDetalle();

                entradasDetalle.InitFromComprasDetalle(entrada, item, db);

                entrada.EntradasDetalle.Add(entradasDetalle);


                //Actualizar existencias
                var resumen = db.AreaExistencias
                .FirstOrDefault(x => x.AreaId == entrada.AreaId && x.InventarioId == item.InventarioId);

                if (resumen == null)
                {
                    var inventario = db.Inventario.Find(entradasDetalle.InventarioId);
                    db.AreaExistencias.Add(new AreaExistencias
                    {
                        AreaId = entrada.AreaId,
                        InventarioId = item.InventarioId,
                        Existencias = entradasDetalle.Existencias,
                        CostoPromedio = entradasDetalle.CostoPromedio,
                        CostoReal = entradasDetalle.Costo,
                        Precio = entradasDetalle.Precio,
                        //Hereda de Catalogo de inventario
                        Minimo = inventario.StockMinimo,
                    });
                }
                else
                {

                    resumen.Existencias += entradasDetalle.Existencias;
                    resumen.CostoPromedio = entradasDetalle.CostoPromedio;
                    resumen.CostoReal = entradasDetalle.Costo;
                    resumen.Precio = entradasDetalle.Precio;

                }

            }

            db.Entradas.Add(entrada);
            compra.EntradaId = entrada.Id;
            
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
