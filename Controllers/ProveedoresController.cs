
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class ProveedoresController : Controller
    {
        private GenericFactory<Proveedores> factory = null;
        public ProveedoresController(SaraContext db)
        {
            this.factory = new GenericFactory<Proveedores>(db);
        }

        [Route("api/proveedores/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/proveedores/post")]
        public IActionResult Post([FromBody] Proveedores proveedores)
        {

            if (proveedores.Id > 0)
                factory.Update(proveedores);
            else
                factory.Insert(proveedores);

            factory.Save();

            return Json(proveedores);

        }
      
        [HttpGet("api/CentroCosto/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
