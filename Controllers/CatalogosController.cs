using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sora.Factory;
using sora.Models.SaraModel;

namespace sora.Controllers
{  
     [Route("api/catalogos")]
    public class CatalogosController : Controller
    {      
        private readonly SaraContext db;
        public CatalogosController(SaraContext _db){
            db = _db;
        }

        [Route("clasificacion")]
        public IActionResult Clasificacion(){

            var result = new ClasificacionFactory(db);

            return Json(result.GetAll());

        }

        [Route("grupos")]
        public IActionResult Grupos(){

            var result = new GruposFactory(db);

            return Json(result.GetAll());

        }

        [Route("naturaleza")]
        public IActionResult Naturaleza(){

            var result = new NaturalezaFactory(db);

            return Json(result.GetAll());

        }

        [Route("tipoCuenta")]
        public IActionResult TipoCuenta(){

            var result = new TipoCuentaFactory(db);

            return Json(result.GetAll());

        }

        [Route("cuentas")]
        public IActionResult Cuentas(){

            var result = new CuentasFactory(db);

            return Json(result.GetAsCatalog());

        }
    }
}
