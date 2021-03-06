﻿using System;
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
    public class AsientosController : Controller
    {      
        private readonly SaraContext db;
        private GenericFactory<Asientos> factory = null;
        private GenericFactory<AsientosDetalle> factoryDetalle = null;
        public AsientosController(SaraContext _db){
            db = _db;
            this.factory = new GenericFactory<Asientos>(db);
            this.factoryDetalle = new GenericFactory<AsientosDetalle>(db);
        }

        [Route("api/asientos/get/cortes/{corteId}")]
        public IActionResult Get(int corteId, int skip,int take, IDictionary<string, string> values) 
        {
            IQueryable<Asientos> asientos = db.Asientos
            .Include(x => x.TipoComprobante)
            .Where(x => x.CorteId == corteId)
            .OrderByDescending(x => x.Id);

            if(values.ContainsKey("numero")){
                var numero = Convert.ToInt32(values["numero"]) ;
                asientos = asientos.Where(x => x.Numero == numero);
            }

            if(values.ContainsKey("tipoComprobanteId")){
                var tipoComprobanteId = Convert.ToInt32(values["tipoComprobanteId"]) ;
                asientos = asientos.Where(x => x.TipoComprobanteId == tipoComprobanteId);
            }

            if(values.ContainsKey("estadoId")){
                var estadoId = Convert.ToInt32(values["estadoId"]) ;
                asientos = asientos.Where(x => x.EstadoId == estadoId);
            }

            var items = asientos.Skip(skip).Take(take);

            return Json(new{
                items,
                totalCount =asientos.Count()
            });
        }         


        [Route("api/asientos/get/{id}")]
        public IActionResult GetById(int id){

            var asiento = db.Asientos.Include(x =>x.AsientosDetalle).FirstOrDefault(x => x.Id == id);
            return Json(asiento);

        }

        [Route("api/asientos/post")]
        public IActionResult Post([FromBody] Asientos asiento){

            var asientosFactory = new AsientosFactory(db);

            asientosFactory.Save(asiento);

            return Json(asiento);

        }

        

        [HttpGet("api/asientos/{id}/delete")]
        public IActionResult Delete(int id)
        {

            var n = factory.DeleteAndSave(id);
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
            var PeriodoId = 0;
            foreach (var month in GetMonths())
            {
                PeriodoId++;
                Months.Add(new LibroMayorViewModel{
                    PeriodoId=PeriodoId,
                    Periodo = month,
                    Debe = result.Where(r => r.Periodo == month).Select(r => r.Debe).FirstOrDefault(),
                    Haber = result.Where(r => r.Periodo == month).Select(r => r.Haber).FirstOrDefault()
                });
            };           


            return Json(resultPrev.Concat(Months));

        }


         [HttpGet("api/asientos/cuenta/{cuentaId}/year/{year}/month/{month}/debe/{debe}/libro-mayor")]
         
        public IActionResult LibroMayorDetalle(int cuentaId, int year, int month, bool debe)
        {
         
            var result = from a in db.Asientos
                        join ad in db.AsientosDetalle on a.Id equals ad.AsientoId
                        join tc in db.TipoComprobantes on a.TipoComprobanteId equals tc.Id
                        where ad.CuentaId == cuentaId 
                        && a.Fecha.Year == year 
                        && a.Fecha.Month == month                        
                        select new {
                            a.Numero,
                            a.Fecha,
                            anio = year,
                            tc.Descripcion,
                            monto=debe? ad.Debe: ad.Haber,
                            a.Concepto,
                            a.Referencia
                        };

            return Json(result.Where(x => x.monto > 0));

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
