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
