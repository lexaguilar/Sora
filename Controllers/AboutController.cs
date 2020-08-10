
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sora.Factory;
using Sora.Models.SaraModel;
using Sora.ViewModel;

namespace Sora.Controllers
{
    public class AboutController : Controller
    {
        private GenericFactory<App> factory = null;
        private readonly SaraContext db = null;
        public AboutController(SaraContext _db)
        {
            this.factory = new GenericFactory<App>(_db);
            this.db = _db;
        }

        [Route("api/about/get-info")]
        public IActionResult Get()
        {
            App app = db.App.Include(x => x.Moneda).FirstOrDefault();

            if(app==null)
                return BadRequest("Los valores iniciales de la aplicacion no estan establecidos");

            app.Version =  Program.version.ToString();

            return Json(app);  
        }
             
        [HttpPost("api/about/set-info")]
        public IActionResult Set([FromBody]App app)
        {

            if(db.App.Any(x => x.Id == app.Id)){
                factory.Update(app);
            }else
                factory.Insert(app);
            
            factory.Save();

            return Json(app);
        }
    }
}
