
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class PresentacionController : Controller
    {
        private GenericFactory<Presentacion> factory = null;
        public PresentacionController(SaraContext db)
        {
            this.factory = new GenericFactory<Presentacion>(db);
        }

        [Route("api/presentacion/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/presentacion/post")]
        public IActionResult Post([FromBody] Presentacion presentacion)
        {
            presentacion.ToUpperCase();
            
            if (presentacion.Id > 0)
                factory.Update(presentacion);
            else
                factory.Insert(presentacion);

            factory.Save();

            return Json(presentacion);

        }
      
        [HttpGet("api/presentacion/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });

        
    }
}
