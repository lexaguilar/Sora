﻿using System.Collections.Generic;
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
    public class AsientosController : Controller
    {      
        private readonly SaraContext db;
         private IGenericFactory<Asientos> factory = null;
         private IGenericFactory<AsientosDetalle> factoryDetalle = null;
        public AsientosController(SaraContext _db){
            db = _db;
            this.factory = new GenericFactory<Asientos>(db);
            this.factoryDetalle = new GenericFactory<AsientosDetalle>(db);
        }

        [Route("api/asientos/get/cortes/{corteId}")]
        public IActionResult Get(int corteId)
        {
            var asientos = db.Asientos.Include(x => x.TipoComprobante).Where(x => x.CorteId == corteId);
            return Json(asientos);
        }
        // => Json(factory.GetAll(x => x.CorteId == corteId));            


        [Route("api/asientos/get/{id}")]
        public IActionResult GetById(int id){

            var asiento = db.Asientos.Include(x =>x.AsientosDetalle).FirstOrDefault(x => x.Id == id);
            return Json(asiento);

        }

        [Route("api/asientos/post")]
        public IActionResult Post([FromBody] Asientos asiento){


            if (asiento.Id > 0){
                //Actializar encabezado
                var asientoModificado = factory.FirstOrDefault(x => x.Id == asiento.Id);
                asientoModificado.CopyFrom(asiento , x => new { 
                    x.CorteId, 
                    x.Fecha, 
                    x.MonedaId, 
                    x.Referencia,
                    x.TipoComprobanteId, 
                    x.Concepto,
                    x.EstadoId,
                    x.Observacion, 
                    x.TipoCambio });
                                
                factory.Save();

                var detalle = asiento.AsientosDetalle;

                //eliminar registros anteriores
                var oldAsientoDetalle = factoryDetalle.GetAll(x => x.AsientoId == asiento.Id);
                foreach (var item in oldAsientoDetalle)                
                    factoryDetalle.Delete(item);
                factoryDetalle.Save();

                //agregar nuevos registros
                foreach (var item in detalle)  {

                    factoryDetalle.Insert(new AsientosDetalle{
                        Id =0,
                        CuentaId = item.CuentaId,
                        Debe = item.Debe,
                        Haber= item.Haber,
                        Referencia= item.Referencia,
                        AsientoId =asiento.Id
                    });
                }
                factoryDetalle.Save();

                
            }
            else{

                asiento.Numero = getMax(asiento.CorteId);
                factory.Insert(asiento);
                factory.Save(); 
            }


            return Json(asiento);

        }

        private int getMax(int corteId)
        {
            var maxresult = db.Asientos.Where(x => x.CorteId == corteId);//
            if(maxresult.Count() > 0)
                return maxresult.Max(x => x.Numero) +1 ;
            else
                return 1;
        }

        [HttpGet("api/asientos/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }


        [HttpGet("api/asientos/cuenta/{cuentaId}/year/{year}/libro-mayor")]
        public IActionResult LibroMayor(int cuentaId, int year)
        {

            var resultPrev = 
            (from a in db.Asientos 
            join ad in db.AsientosDetalle on a.Id equals ad.AsientoId
            join c in db.Cuentas on ad.CuentaId equals c.Id
            where a.Fecha.Year < year && ad.CuentaId == cuentaId && a.EstadoId == (int)Estados.Elaborado
            select new { ad.CuentaId, c.NaturalezaId, ad.Debe, ad.Haber } into x
            group x by new { x.CuentaId, x.NaturalezaId } into g
            select new LibroMayorViewModel{
                Periodo = "Saldo anterior",
                Debe = 0,
                Haber = 0,
                Saldo = 0,
                SaldoAcumulado = (g.Sum(x => x.Debe) - g.Sum(x => x.Haber)) * naturaleza((Naturalezas)g.Key.NaturalezaId)
            }).ToArray();

            var result = (from a in db.Asientos 
            join ad in db.AsientosDetalle on a.Id equals ad.AsientoId            
            where a.Fecha.Year == year && ad.CuentaId == cuentaId && a.EstadoId == (int)Estados.Elaborado
            select new { a.Fecha.Month , ad.Debe, ad.Haber } into x
            group x by new { x.Month } into g
            select new LibroMayorViewModel {
                Periodo = GetName(g.Key.Month),
                Debe = g.Sum(x => x.Debe),
                Haber = g.Sum(x => x.Haber),
            }).ToArray();

            var Months = new List<LibroMayorViewModel>();

            foreach (var month in GetMonths())
            {
                Months.Add(new LibroMayorViewModel{
                    Periodo = month,
                    Debe = result.Where(r => r.Periodo == month).Select(r => r.Debe).FirstOrDefault(),
                    Haber = result.Where(r => r.Periodo == month).Select(r => r.Haber).FirstOrDefault()
                });
            };           


            return Json(resultPrev.Concat(Months));

        }

        private static string GetName(int month){
            string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month);
            return monthName;
        }
        
        private static int naturaleza(Naturalezas naturalezas){
            return naturalezas == Naturalezas.Deudora ? 1 : -1;
        }

        private static string[] GetMonths(){
            string[] str = { "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" };
            return str;
        }
    }
}
