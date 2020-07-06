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
        public IActionResult Get() => Json(factory.GetAll());

         [Route("api/cuentas/get/nivel/{nivel}")]
        public IActionResult GetByNivel(int nivel) => Json(factory.GetAll(x => x.Nivel == nivel));

        [Route("api/cuentas/get/{id}")]
        public IActionResult GetById(int id){

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
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
