using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sora.Factory;
using Sora.Models.SaraModel;
using Sora.ViewModel;
using static Sora.Enumerators;

namespace Sora.Controllers
{  
    public class ComprasController : Controller
    {      
        private readonly SaraContext db;
         private GenericFactory<Compras> factory = null;
         private GenericFactory<ComprasDetalle> factoryDetalle = null;
        public ComprasController(SaraContext _db){
            db = _db;
            this.factory = new GenericFactory<Compras>(db);
            this.factoryDetalle = new GenericFactory<ComprasDetalle>(db);
        }

        [Route("api/compras/get")]
        public IActionResult Get(int corteId, int skip,int take, IDictionary<string, string> values) 
        {
            IQueryable<Compras> compras = db.Compras
            .OrderByDescending(x => x.Id);           

            if(values.ContainsKey("formaPagoId")){
                var formaPagoId = Convert.ToInt32(values["formaPagoId"]) ;
                compras = compras.Where(x => x.FormaPagoId == formaPagoId);
            }

            if(values.ContainsKey("proveedorId")){
                var proveedorId = Convert.ToInt32(values["proveedorId"]) ;
                compras = compras.Where(x => x.ProveedorId == proveedorId);
            }

            if(values.ContainsKey("estadoId")){
                var estadoId = Convert.ToInt32(values["estadoId"]) ;
                compras = compras.Where(x => x.EstadoId == estadoId);
            }

            var items = compras.Skip(skip).Take(take);

            return Json(new{
                items,
                totalCount =compras.Count()
            });
        }         


        [Route("api/compras/get/{id}")]
        public IActionResult GetById(int id){

            var compra = db.Compras.Include(x =>x.ComprasDetalle).FirstOrDefault(x => x.Id == id);
            return Json(compra);

        }

        [Route("api/compras/post")]
        public IActionResult Post([FromBody] Compras compra){

            if (compra.Id > 0){
                //Actializar encabezado
                var compraModificada = factory.FirstOrDefault(x => x.Id == compra.Id);
                compraModificada.CopyAllFromExcept(compra , x => new { 
                    x.Id
                });
                                
                factory.Save();

                //eliminar registros anteriores
                var oldComprasDetalle = factoryDetalle.GetAll(x => x.CompraId == compra.Id);
                foreach (var item in oldComprasDetalle)                
                    factoryDetalle.Delete(item);
                factoryDetalle.Save();

                //agregar nuevos registros
                var detalle = compra.ComprasDetalle;
                foreach (var item in detalle)  {

                    var comprasDetalle = new ComprasDetalle();
                    comprasDetalle.CopyAllFromExcept(item, x => new { x.Id });
                    factoryDetalle.Insert(comprasDetalle);

                }

                factoryDetalle.Save();
                
            }
            else{

                factory.Insert(compra);
                factory.Save(); 

            }

            return Json(compra);

        }


        [HttpGet("api/compras/{id}/delete")]
        public IActionResult Delete(int id)
        {

            var n = factory.DeleteAndSave(id);
            return Json(new { n });

        }    
    }
}
