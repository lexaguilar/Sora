using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
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

            var factory = new GenericFactory<Clasificacion>(db);
            return Json(factory.GetAll());

        }

        [Route("grupos")]
        public IActionResult Grupos(){
          
            var factory = new GenericFactory<Grupos>(db);
            return Json(factory.GetAll());

        }

        [Route("naturaleza")]
        public IActionResult Naturaleza(){

            var factory = new GenericFactory<Naturaleza>(db);
            return Json(factory.GetAll());

        }

        [Route("tipoCuenta")]
        public IActionResult TipoCuenta(){

            var factory = new GenericFactory<TipoCuenta>(db);
            return Json(factory.GetAll());

        }

        [Route("tipoComprobantes")]
        public IActionResult TipoComprobante(){

            var factory = new GenericFactory<TipoComprobantes>(db);
            return Json(factory.GetAll());

        }

        [Route("cuentas")]
        public IActionResult Cuentas(){

            var result = new CuentasFactory(db);

            return Json(result.GetAsCatalog());

        }

        [Route("cortes")]
        public IActionResult Cortes(){

            var factory = new GenericFactory<Cortes>(db);
            return Json(factory.GetAll());
        }
    }
}
