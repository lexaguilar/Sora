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

            IGenericFactory<Clasificacion> factory = new GenericFactory<Clasificacion>();
            return Json(factory.GetAll());

        }

        [Route("grupos")]
        public IActionResult Grupos(){
          
            IGenericFactory<Grupos> factory = new GenericFactory<Grupos>();
            return Json(factory.GetAll());

        }

        [Route("naturaleza")]
        public IActionResult Naturaleza(){

            IGenericFactory<Naturaleza> factory = new GenericFactory<Naturaleza>();
            return Json(factory.GetAll());

        }

        [Route("tipoCuenta")]
        public IActionResult TipoCuenta(){

            IGenericFactory<TipoCuenta> factory = new GenericFactory<TipoCuenta>();
            return Json(factory.GetAll());

        }

        [Route("tipoComprobantes")]
        public IActionResult TipoComprobante(){

            IGenericFactory<TipoComprobantes> factory = new GenericFactory<TipoComprobantes>();
            return Json(factory.GetAll());

        }

        [Route("cuentas")]
        public IActionResult Cuentas(){

            var result = new CuentasFactory(db);

            return Json(result.GetAsCatalog());

        }
    }
}
