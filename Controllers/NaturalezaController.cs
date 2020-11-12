
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class NaturalezaController : Controller
    {
        private GenericFactory<Naturaleza> factory = null;
        public NaturalezaController(SaraContext db)
        {
            this.factory = new GenericFactory<Naturaleza>(db);
        }

        [Route("api/naturaleza/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/naturaleza/post")]
        public IActionResult Post([FromBody] Naturaleza naturaleza)
        {
            naturaleza.ToUpperCase();
            
            if (naturaleza.Id > 0)
                factory.Update(naturaleza);
            else
                factory.Insert(naturaleza);

            factory.Save();

            return Json(naturaleza);

        }
      
        [HttpGet("api/naturaleza/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
