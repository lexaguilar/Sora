﻿
using Microsoft.AspNetCore.Mvc;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{
    public class GrupoController : Controller
    {
        private GenericFactory<Grupos> factory = null;
        public GrupoController(SaraContext db)
        {
            this.factory = new GenericFactory<Grupos>(db);
        }

        [Route("api/grupos/get")]
        public IActionResult Get() => Json(factory.GetAll());       

        [HttpPost("api/grupos/post")]
        public IActionResult Post([FromBody] Grupos grupos)
        {
            grupos.ToUpperCase();
            
            if (grupos.Id > 0)
                factory.Update(grupos);
            else
                factory.Insert(grupos);

            factory.Save();

            return Json(grupos);

        }
      
        [HttpGet("api/grupos/{id}/delete")]
        public IActionResult Delete(int id) => Json(new { n = factory.DeleteAndSave(id) });
    }
}
