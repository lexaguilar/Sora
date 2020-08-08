
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class ClientesController : Controller
    {
        private GenericFactory<Clientes> factory = null;
        public ClientesController(SaraContext db)
        {
            this.factory = new GenericFactory<Clientes>(db);
        }

        [Route("api/clientes/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/clientes/post")]
        public IActionResult Post([FromBody] Clientes cliente)
        {
            cliente.ToUpperCase();
            
            if (cliente.Id > 0)
                factory.Update(cliente);
            else
                factory.Insert(cliente);

            factory.Save();

            return Json(cliente);

        }
      
        [HttpGet("api/clientes/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
