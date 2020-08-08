
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class FormaPagoController : Controller
    {
        private GenericFactory<FormaPago> factory = null;
        public FormaPagoController(SaraContext db)
        {
            this.factory = new GenericFactory<FormaPago>(db);
        }

        [Route("api/FormaPago/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/FormaPago/post")]
        public IActionResult Post([FromBody] FormaPago formaPago)
        {
            formaPago.ToUpperCase();
            
            if (formaPago.Id > 0)
                factory.Update(formaPago);
            else
                factory.Insert(formaPago);

            factory.Save();

            return Json(formaPago);

        }
      
        [HttpGet("api/FormaPago/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
