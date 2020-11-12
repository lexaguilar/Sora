
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class BancosController : Controller
    {
        private GenericFactory<Bancos> factory = null;
        public BancosController(SaraContext db)
        {
            this.factory = new GenericFactory<Bancos>(db);
        }

        [Route("api/bancos/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/bancos/post")]
        public IActionResult Post([FromBody] Bancos banco)
        {
            banco.ToUpperCase();
            factory.InsertOrUpdateAndSave(banco, x => x.CuentaId == banco.CuentaId );
            return Json(banco);

        }
      
        [HttpGet("api/bancos/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });

        
    }
}
