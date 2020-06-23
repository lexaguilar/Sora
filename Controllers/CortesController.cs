
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class CortesController : Controller
    {
        private IGenericFactory<Cortes> factory = null;
        public CortesController(SaraContext db)
        {
            this.factory = new GenericFactory<Cortes>(db);
        }

        [Route("api/cortes/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/cortes/post")]
        public IActionResult Post([FromBody] Cortes cortes)
        {

            if (cortes.Id > 0)
                factory.Update(cortes);
            else
                factory.Insert(cortes);

            factory.Save();

            return Json(cortes);

        }
      
        [HttpGet("api/cortes/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }
    }
}
