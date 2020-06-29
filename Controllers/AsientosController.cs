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
         private IGenericFactory<AsientosDetalle> factoryDetalle = null;
        public AsientosController(SaraContext _db){
            db = _db;
            this.factory = new GenericFactory<Asientos>(db);
            this.factoryDetalle = new GenericFactory<AsientosDetalle>(db);
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


            if (asiento.Id > 0){
                //Actializar encabezado
                var asientoModificado = factory.FirstOrDefault(x => x.Id == asiento.Id);
                asientoModificado.CopyFrom(asiento , x => new { 
                    x.CorteId, 
                    x.Fecha, 
                    x.MonedaId, 
                    x.Referencia,
                    x.TipoComprobanteId, 
                    x.Concepto,
                    x.EstadoId,
                    x.Observacion, 
                    x.TipoCambio });
                                
                factory.Save();

                var detalle = asiento.AsientosDetalle;

                //eliminar registros anteriores
                var oldAsientoDetalle = factoryDetalle.GetAll(x => x.AsientoId == asiento.Id);
                foreach (var item in oldAsientoDetalle)                
                    factoryDetalle.Delete(item);
                factoryDetalle.Save();

                //agregar nuevos registros
                foreach (var item in detalle)  {

                    factoryDetalle.Insert(new AsientosDetalle{
                        Id =0,
                        CuentaId = item.CuentaId,
                        Debe = item.Debe,
                        Haber= item.Haber,
                        Referencia= item.Referencia,
                        AsientoId =asiento.Id
                    });
                }
                factoryDetalle.Save();

                
            }
            else{

                asiento.Numero = getMax(asiento.CorteId);
                factory.Insert(asiento);
                factory.Save(); 
            }


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
