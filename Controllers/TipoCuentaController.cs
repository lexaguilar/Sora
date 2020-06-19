
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class TipoCuentaController : Controller
    {
        private IGenericFactory<TipoCuenta> factory = null;
        public TipoCuentaController(SaraContext _db)
        {
            this.factory = new GenericFactory<TipoCuenta>();
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
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }
    }
}
