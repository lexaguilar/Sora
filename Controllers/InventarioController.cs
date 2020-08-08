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
    public class InventarioController : Controller
    {
        private readonly SaraContext db;
        private GenericFactory<Inventario> factory = null;
        public InventarioController(SaraContext _db)
        {
            db = _db;
            this.factory = new GenericFactory<Inventario>(db);
        }

        [Route("api/inventario/get")]
        public IActionResult Get(int skip, int take, IDictionary<string, string> values)
        {
            IQueryable<Inventario> inventarios = db.Inventario
            .OrderByDescending(x => x.Numero);

            if (values.ContainsKey("nombre"))
            {
                var nombre = values["nombre"];
                inventarios = inventarios.Where(x => x.Nombre.StartsWith(nombre));
            }

            if (values.ContainsKey("numero"))
            {
                var numero = Convert.ToInt32(values["numero"]);
                inventarios = inventarios.Where(x => x.Numero == numero);
            }

            if (values.ContainsKey("familiaId"))
            {
                var familiaId = Convert.ToInt32(values["familiaId"]);
                inventarios = inventarios.Where(x => x.FamiliaId == familiaId);
            }

            if (values.ContainsKey("presentacionId"))
            {
                var presentacionId = Convert.ToInt32(values["presentacionId"]);
                inventarios = inventarios.Where(x => x.PresentacionId == presentacionId);
            }

            if (values.ContainsKey("unidadMedidaId"))
            {
                var unidadMedidaId = Convert.ToInt32(values["unidadMedidaId"]);
                inventarios = inventarios.Where(x => x.UnidadMedidaId == unidadMedidaId);
            }

            if (values.ContainsKey("estadoId"))
            {
                var estadoId = Convert.ToInt32(values["estadoId"]);
                inventarios = inventarios.Where(x => x.EstadoId == estadoId);
            }

            if (values.ContainsKey("iva"))
            {
                var iva = Convert.ToBoolean(values["iva"]);
                inventarios = inventarios.Where(x => x.Iva == iva);
            }


            var items = inventarios.Skip(skip).Take(take);

            return Json(new
            {
                items,
                totalCount = inventarios.Count()
            });
        }


        [Route("api/inventario/get/{id}")]
        public IActionResult GetById(int id)
        {

            var inventario = db.Inventario.FirstOrDefault(x => x.Id == id);
            return Json(inventario);

        }

        [Route("api/inventario/post")]
        public IActionResult Post([FromBody] Inventario inventario)
        {

            var numeroMax = 0;
            if (inventario.Id > 0)
            {
                var inventarioModificado = factory.FirstOrDefault(x => x.Id == inventario.Id);

                if (inventarioModificado.FamiliaId != inventario.FamiliaId)
                    numeroMax = getMax(inventario.FamiliaId);

                inventarioModificado.CopyFrom(inventario, x => new
                {
                    x.FamiliaId,
                    x.PresentacionId,
                    x.UnidadMedidaId,
                    x.Iva,
                    x.StockMinimo,
                    x.Nombre,
                    x.Descripcion,
                    x.EstadoId,
                    x.Numero
                });

                if (numeroMax != 0)
                    inventarioModificado.Numero = numeroMax;


            }
            else
            {
                numeroMax = getMax(inventario.FamiliaId);
                inventario.Numero = numeroMax;
                factory.Insert(inventario);
            }

            factory.Save();

            return Json(inventario);

        }

        private int getMax(int familiaId)
        {
            var familia = db.Familia.FirstOrDefault(x => x.Id == familiaId);

            const int rate = 100000;

            var maxresult = db.Inventario.Where(x => x.FamiliaId == familiaId);//
            if (maxresult.Count() > 0)
            {
                var min = familia.Prefijo * rate;
                var max = Convert.ToInt32(maxresult.Max(x => x.Numero)) + 1;
                var i = max;

                while (i > min)
                {

                    var _inventario = maxresult.FirstOrDefault(x => x.Numero == i);
                    if (_inventario == null && i < max)
                    {
                        max = i;
                        i = min;
                    }
                    i--;
                }

                return max;

            }
            else
                return familia.Prefijo * rate + 1;
        }

        [HttpGet("api/inventario/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });

        [Route("api/inventario/por-area")]
        public IActionResult GetByIdForArea()
        {
            var user = this.GetAppUser();
            
            var inventario = from i in db.Inventario
            join ae in db.AreaExistencias on 
            new{ inventarioId = i.Id, areaId = user.AreaId } equals
            new{ inventarioId = ae.InventarioId, areaId = ae.AreaId } into iet
            from subint in iet.DefaultIfEmpty()
            select new  {
                i.Id,
                i.Numero,
                i.Nombre, 
                Precio = subint==null ? 0 : subint.Precio,
                Existencias = subint==null ? 0 : subint.Existencias,
                i.Iva
            };

            return Json(inventario);

        }

        [HttpGet("api/inventario/kardex/area/{areaId}/producto/{inventarioId}")]
        public IActionResult Kardex(int areaId, int inventarioId)
        {
            var resultEntradas = (from ed in db.EntradasDetalle
                        join e in db.Entradas on ed.EntradaId equals e.Id
                        join c in db.Compras on e.CompraId equals c.Id
                        join t in db.EntradaTipos on e.TipoId equals t.Id
                        where e.AreaId == areaId 
                            &&  e.TipoId == (int)EntradaTipo.Compras
                            && ed.InventarioId == inventarioId
                            && e.EstadoId == (int)Estados.Elaborado
                        select new KardexModel{
                            Fecha = e.Fecha,
                            Origen = t.Descripcion,
                            Documento = c.Id.ToString(),
                            Referencia = c.Referencia,
                            Costo = ed.Costo,
                            Entradas = ed.Cantidad,
                            Salidas = 0,
                            CostoPromedioSalida = 0,
                            Existencias = ed.Existencias,
                            CostoPromedio = ed.CostoPromedio,
                            Total = Convert.ToDecimal(ed.Existencias) * ed.CostoPromedio,
                            Tipo = (int)TipoMovimiento.Entrada
                        }).ToArray();

            var resultSalidas = (from sd in db.SalidasDetalle
                        join s in db.Salidas on sd.SalidaId equals s.Id
                        join t in db.SalidaTipos on s.TipoId equals t.Id
                        where s.AreaId == areaId 
                            &&  s.TipoId == (int)SalidaTipo.Factura
                            && sd.InventarioId == inventarioId
                            && s.EstadoId == (int)Estados.Elaborado
                        select new KardexModel{
                            Fecha = s.Fecha,
                            Origen = t.Descripcion,
                            Documento = s.Id.ToString(),
                            Referencia = "",
                            Costo = 0,
                            Entradas = 0,
                            Salidas = sd.Cantidad,
                            CostoPromedioSalida = sd.CostoPromedio,
                            Existencias = sd.Existencias,
                            CostoPromedio = sd.CostoPromedio,
                            Total = Convert.ToDecimal(sd.Existencias) * sd.CostoPromedio,
                            Tipo = (int)TipoMovimiento.Salida
                        }).ToArray();

            return Json(resultEntradas.Concat(resultSalidas).OrderBy(x => x.Fecha));


                        
        }

    }
}
