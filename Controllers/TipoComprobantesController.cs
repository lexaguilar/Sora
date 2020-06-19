
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class TipoComprobantesController : Controller
    {
        private IGenericFactory<TipoComprobantes> factory = null;
        public TipoComprobantesController(SaraContext _db)
        {
            this.factory = new GenericFactory<TipoComprobantes>();
        }

        [Route("api/tipoComprobantes/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/tipoComprobantes/post")]
        public IActionResult Post([FromBody] TipoComprobantes tipoComprobantes)
        {

            if (tipoComprobantes.Id > 0)
                factory.Update(tipoComprobantes);
            else
                factory.Insert(tipoComprobantes);

            factory.Save();

            return Json(tipoComprobantes);

        }
      
        [HttpGet("api/tipoComprobantes/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }
    }
}
