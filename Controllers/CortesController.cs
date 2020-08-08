
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class CortesController : Controller
    {
        private readonly GenericFactory<Cortes> factory = null;
        private readonly SaraContext _db = null;
        public CortesController(SaraContext db)
        {
            this.factory = new GenericFactory<Cortes>(db);
            _db = db;
        }

        [Route("api/cortes/get")]
        public IActionResult Get() => Json(factory.GetAll().OrderByDescending(x => x.Id));       

        
        [Route("api/cortes/get/{id}")]
        public IActionResult GetById(int id){

            return Json(factory.GetById(id));

        }

        [HttpPost("api/cortes/post")]
        public IActionResult Post([FromBody] Cortes cortes)
        {
            var newDB = new SaraContext();
            var allCortes = newDB.Cortes;
            allCortes.ToList().ForEach(corte => corte.Activo = false);
            newDB.SaveChanges();
            
            
            if (cortes.Id > 0)
                factory.Update(cortes);
            else
                factory.Insert(cortes);

            factory.Save();

            return Json(cortes);

        }
      
        [HttpGet("api/cortes/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
