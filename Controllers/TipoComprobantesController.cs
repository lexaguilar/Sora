
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class TipoComprobantesController : Controller
    {
        private GenericFactory<TipoComprobantes> factory = null;
        public TipoComprobantesController(SaraContext db)
        {
            this.factory = new GenericFactory<TipoComprobantes>(db);
        }

        [Route("api/tipoComprobantes/get")]
        public IActionResult Get() => Json(factory.GetAll());
        
        [Route("api/tipoComprobantes/get/{id}")]
        public IActionResult GetById(int id){

            return Json(factory.GetById(id));

        }

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
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
