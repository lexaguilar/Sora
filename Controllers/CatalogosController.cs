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

        [Route("asientoEstado")]
        public IActionResult AsientoEstado(){

            var factory = new GenericFactory<AsientoEstado>(db);
            return Json(factory.GetAll());
        }

        [Route("moneda")]
        public IActionResult Moneda(){

            var factory = new GenericFactory<Moneda>(db);
            return Json(factory.GetAll());
        }

        [Route("centroCosto")]
        public IActionResult CentroCosto(){

            var factory = new GenericFactory<CentroCosto>(db);
            return Json(factory.GetAll());
        }

        [Route("familia")]
        public IActionResult Familia(){

            var factory = new GenericFactory<Familia>(db);
            return Json(factory.GetAll());
        }

        [Route("presentacion")]
        public IActionResult Presentacion(){

            var factory = new GenericFactory<Presentacion>(db);
            return Json(factory.GetAll());
        }

        [Route("UnidadMedida")]
        public IActionResult UnidadMedida(){

            var factory = new GenericFactory<UnidadMedida>(db);
            return Json(factory.GetAll());
        }
    }
}
