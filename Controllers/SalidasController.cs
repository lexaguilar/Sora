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
    public class SalidasController : Controller
    {
        private readonly SaraContext db;
        private GenericFactory<Salidas> factory = null;
        private GenericFactory<SalidasDetalle> factoryDetalle = null;
        public SalidasController(SaraContext _db)
        {
            db = _db;
            this.factory = new GenericFactory<Salidas>(db);
            this.factoryDetalle = new GenericFactory<SalidasDetalle>(db);
        }

        [Route("api/salidas/get")]
        public IActionResult Get(int corteId, int skip, int take, IDictionary<string, string> values)
        {
            var user = this.GetAppUser();

            IQueryable<Salidas> salidas = db.Salidas.Where(x => x.AreaId == user.AreaId)
            .OrderByDescending(x => x.Id);

            if (values.ContainsKey("tipoId"))
            {
                var tipoId = Convert.ToInt32(values["tipoId"]);
                salidas = salidas.Where(x => x.TipoId == tipoId);
            }

            if (values.ContainsKey("areaId"))
            {
                var areaId = Convert.ToInt32(values["areaId"]);
                salidas = salidas.Where(x => x.AreaId == areaId);
            }

            if (values.ContainsKey("formaPagoId"))
            {
                var formaPagoId = Convert.ToInt32(values["formaPagoId"]);
                salidas = salidas.Where(x => x.FormaPagoId == formaPagoId);
            }

            if (values.ContainsKey("estadoId"))
            {
                var estadoId = Convert.ToInt32(values["estadoId"]);
                salidas = salidas.Where(x => x.EstadoId == estadoId);
            }

            var items = salidas.Skip(skip).Take(take);

            return Json(new
            {
                items,
                totalCount = salidas.Count()
            });
        }


        [Route("api/salidas/get/{id}")]
        public IActionResult GetById(int id)
        {

            var salida = db.Salidas.Include(x => x.SalidasDetalle).FirstOrDefault(x => x.Id == id);
            return Json(salida);

        }

        [Route("api/salidas/factura")]
        public IActionResult Factura([FromBody] Salidas salida)
        {
            var user = this.GetAppUser();
            salida.AreaId = user.AreaId;
            salida.TipoId = (int)SalidaTipo.Factura;

            if (salida.Id > 0)
            {
                var salidaModificada = db.Salidas.FirstOrDefault(x => x.Id == salida.Id);
                if (salidaModificada.EstadoId == (int)Estados.Elaborado)
                    return BadRequest($"No se puede editar una factura, debe anular y emitir otra");
            }

            return Post(salida, user);

        }

        private IActionResult Post(Salidas salida, AppUser user)
        {
            if (salida.Id > 0)
            {
                //Actializar encabezado
                var salidaModificada = db.Salidas.FirstOrDefault(x => x.Id == salida.Id);
                if (salidaModificada.EstadoId == (int)Estados.Anulado)
                    return BadRequest($"No se puede editar una salida en estado anulado");

                salidaModificada.CopyAllFromExcept(salida, x => new
                {
                    x.Id
                });


                //eliminar registros anteriores
                var oldComprasDetalle = db.SalidasDetalle.Where(x => x.SalidaId == salida.Id);
                foreach (var item in oldComprasDetalle)
                    db.SalidasDetalle.Remove(item);

                //agregar nuevos registros
                var detalle = salida.SalidasDetalle;
                foreach (var item in detalle)
                {

                    var salidasDetalle = new SalidasDetalle();
                    salidasDetalle.CopyAllFromExcept(item, x => new { x.Id });
                    db.SalidasDetalle.Add(salidasDetalle);

                }

                db.SaveChanges();

            }
            else
            {
                salida.Numero = getMax(salida.AreaId);

                //Actualizar existencias
                foreach (var item in salida.SalidasDetalle)
                {
                    var inventario = db.Inventario.Find(item.InventarioId);
                    var areaExistencias = inventario.RegisterTransactionOut(db, item, salida.AreaId);

                    if (areaExistencias.Existencias < 0)
                        return BadRequest($"No se puede registrar la salida porque el inventario {inventario.Nombre} quedaria con existencia negativa");

                    item.Existencias = areaExistencias.Existencias;
                    item.CostoPromedio = areaExistencias.CostoPromedio;
                    item.Costo = areaExistencias.CostoReal;
                }

                db.Salidas.Add(salida);

                db.SaveChanges();

            }

            var app = db.App.FirstOrDefault();
            if (app.GererarProcesosContables)
            {
                var asientosFactory = new AsientosFactory(db);
                asientosFactory.CreateFromSalida(salida, app);
            }

            return Json(salida);
        }


        [HttpGet("api/salidas/{id}/delete")]
        public IActionResult Delete(int id)
        {

            var n = factory.DeleteAndSave(id);
            return Json(new { n });

        }

        private int getMax(int areaId)
        {
            var maxresult = db.Salidas.Where(x => x.AreaId == areaId);//
            if (maxresult.Count() > 0)
                return maxresult.Max(x => x.Numero) + 1;
            else
                return 1;
        }
    }
}
