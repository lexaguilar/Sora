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

            IGenericFactory<Clasificacion> factory = new GenericFactory<Clasificacion>(db);
            return Json(factory.GetAll());

        }

        [Route("grupos")]
        public IActionResult Grupos(){
          
            IGenericFactory<Grupos> factory = new GenericFactory<Grupos>(db);
            return Json(factory.GetAll());

        }

        [Route("naturaleza")]
        public IActionResult Naturaleza(){

            IGenericFactory<Naturaleza> factory = new GenericFactory<Naturaleza>(db);
            return Json(factory.GetAll());

        }

        [Route("tipoCuenta")]
        public IActionResult TipoCuenta(){

            IGenericFactory<TipoCuenta> factory = new GenericFactory<TipoCuenta>(db);
            return Json(factory.GetAll());

        }

        [Route("tipoComprobantes")]
        public IActionResult TipoComprobante(){

            IGenericFactory<TipoComprobantes> factory = new GenericFactory<TipoComprobantes>(db);
            return Json(factory.GetAll());

        }

        [Route("cuentas")]
        public IActionResult Cuentas(){

            var result = new CuentasFactory(db);

            return Json(result.GetAsCatalog());

        }
    }
}
