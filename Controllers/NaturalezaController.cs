
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class NaturalezaController : Controller
    {
        private IGenericFactory<Naturaleza> factory = null;
        public NaturalezaController(SaraContext _db)
        {
            this.factory = new GenericFactory<Naturaleza>();
        }

        [Route("api/naturaleza/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/naturaleza/post")]
        public IActionResult Post([FromBody] Naturaleza naturaleza)
        {

            if (naturaleza.Id > 0)
                factory.Update(naturaleza);
            else
                factory.Insert(naturaleza);

            factory.Save();

            return Json(naturaleza);

        }
      
        [HttpGet("api/naturaleza/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }
    }
}
