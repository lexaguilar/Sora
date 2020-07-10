
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class FamiliaController : Controller
    {
        private GenericFactory<Familia> factory = null;
        public FamiliaController(SaraContext db)
        {
            this.factory = new GenericFactory<Familia>(db);
        }

        [Route("api/familia/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/familia/post")]
        public IActionResult Post([FromBody] Familia familia)
        {

            if (familia.Id > 0)
                factory.Update(familia);
            else
                factory.Insert(familia);

            factory.Save();

            return Json(familia);

        }
      
        [HttpGet("api/familia/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
