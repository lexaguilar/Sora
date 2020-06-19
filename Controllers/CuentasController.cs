using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{  
    public class CuentasController : Controller
    {      
        private readonly SaraContext db;
        public CuentasController(SaraContext _db){
            db = _db;
        }

        [Route("api/cuentas/get")]
        public IActionResult Get(){

            var cuentasfactory = new CuentasFactory(db);

            return Json(cuentasfactory.GetAll());

        }
    }
}
