using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sora.Factory;
using Sora.Models.SaraModel;

namespace Sora.Controllers
{  
    public class AsientosController : Controller
    {      
        private readonly SaraContext db;
         private IGenericFactory<Asientos> factory = null;
        public AsientosController(SaraContext _db){
            db = _db;
            this.factory = new GenericFactory<Asientos>(db);
        }

        [Route("api/asientos/get/cortes/{corteId}")]
        public IActionResult Get(int corteId)
        {
            var asientos = db.Asientos.Include(x => x.TipoComprobante).Where(x => x.CorteId == corteId);
            return Json(asientos);
        }
        // => Json(factory.GetAll(x => x.CorteId == corteId));            


        [Route("api/asientos/get/{id}")]
        public IActionResult GetById(int id){

            var asiento = db.Asientos.Include(x =>x.AsientosDetalle).FirstOrDefault(x => x.Id == id);
            return Json(asiento);

        }

        [Route("api/asientos/post")]
        public IActionResult Post([FromBody] Asientos asiento){


            if (asiento.Id > 0)
                factory.Update(asiento);
            else{

                asiento.Numero = getMax(asiento.CorteId);
                asiento.EstadoId = 1;
                factory.Insert(asiento);
            }

            factory.Save();

            return Json(asiento);

        }

        private int getMax(int corteId)
        {
            var maxresult = db.Asientos.Where(x => x.CorteId == corteId);//
            if(maxresult.Count() > 0)
                return maxresult.Max(x => x.Numero) +1 ;
            else
                return 1;
        }

        [HttpGet("api/asientos/{id}/delete")]
        public IActionResult Delete(int id)
        {

            factory.Delete(id);
            var n = factory.Save();
            return Json(new { n });

        }

        
    }
}
