
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class CentroCostoController : Controller
    {
        private GenericFactory<CentroCosto> factory = null;
        public CentroCostoController(SaraContext db)
        {
            this.factory = new GenericFactory<CentroCosto>(db);
        }

        [Route("api/CentroCosto/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/CentroCosto/post")]
        public IActionResult Post([FromBody] CentroCosto centroCosto)
        {

            if (centroCosto.Id > 0)
                factory.Update(centroCosto);
            else
                factory.Insert(centroCosto);

            factory.Save();

            return Json(centroCosto);

        }
      
        [HttpGet("api/CentroCosto/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
