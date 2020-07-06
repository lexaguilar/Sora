
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class TipoCuentaController : Controller
    {
        private IGenericFactory<TipoCuenta> factory = null;
        public TipoCuentaController(SaraContext db)
        {
            this.factory = new GenericFactory<TipoCuenta>(db);
        }

        [Route("api/tipoCuenta/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/tipoCuenta/post")]
        public IActionResult Post([FromBody] TipoCuenta tipoCuenta)
        {

            if (tipoCuenta.Id > 0)
                factory.Update(tipoCuenta);
            else
                factory.Insert(tipoCuenta);

            factory.Save();

            return Json(tipoCuenta);

        }
      
        [HttpGet("api/tipoCuenta/{id}/delete")]
         public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
