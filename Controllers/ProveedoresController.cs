
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
        public IActionResult Post([FromBody] Proveedores proveedor)
        {
            proveedor.ToUpperCase();

            if (proveedor.Id > 0)
                factory.Update(proveedor);
            else
                factory.Insert(proveedor);

            factory.Save();

            return Json(proveedor);

        }
      
        [HttpGet("api/proveedores/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
