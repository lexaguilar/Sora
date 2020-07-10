using System;
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{  
     [Route("api/catalogos")]
    public class CatalogosController : Controller
    {      
        private readonly SaraContext db;
        public CatalogosController(SaraContext _db){
            db = _db;
        }

        [Route("{name}")]
        public IActionResult GenericsCatalogs(string name){

            var catalogoFactory = new CatalogoFactory(db);
            return Json(catalogoFactory.GetAll(name));            

        }
    }
}
