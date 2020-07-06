
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class ClasificacionController : Controller
    {
        private IGenericFactory<Clasificacion> factory = null;
        public ClasificacionController(SaraContext db)
        {
            this.factory = new GenericFactory<Clasificacion>(db);
        }

        [Route("api/clasificacion/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/clasificacion/post")]
        public IActionResult Post([FromBody] Clasificacion clasificacion)
        {

            if (clasificacion.Id > 0)
                factory.Update(clasificacion);
            else
                factory.Insert(clasificacion);

            factory.Save();

            return Json(clasificacion);

        }
      
        [HttpGet("api/clasificacion/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
