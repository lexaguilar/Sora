
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class UnidadMedidaController : Controller
    {
        private IGenericFactory<UnidadMedida> factory = null;
        public UnidadMedidaController(SaraContext db)
        {
            this.factory = new GenericFactory<UnidadMedida>(db);
        }

        [Route("api/unidadMedida/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/unidadMedida/post")]
        public IActionResult Post([FromBody] UnidadMedida unidadMedida)
        {

            if (unidadMedida.Id > 0)
                factory.Update(unidadMedida);
            else
                factory.Insert(unidadMedida);

            factory.Save();

            return Json(unidadMedida);

        }
      
        [HttpGet("api/unidadMedida/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });

        
    }
}
