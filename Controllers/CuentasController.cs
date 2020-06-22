using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{  
    public class CuentasController : Controller
    {      
        private readonly SaraContext db;
         private IGenericFactory<Cuentas> factory = null;
        public CuentasController(SaraContext _db){
            db = _db;
            this.factory = new GenericFactory<Cuentas>(db);
        }

        [Route("api/cuentas/get")]
        public IActionResult Get(){

            var cuentasfactory = new CuentasFactory(db);

            return Json(cuentasfactory.GetAll());

        }

        [Route("api/cuentas/get/{id}")]
        public IActionResult Get(int id){

            return Json(factory.GetById(id));

        }

        [Route("api/cuentas/post")]
        public IActionResult Post([FromBody] Cuentas cuentas){

            if (cuentas.Id > 0)
                factory.Update(cuentas);
            else
                factory.Insert(cuentas);

            factory.Save();

            return Json(cuentas);

        }

        [HttpGet("api/cuentas/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }
    }
}
