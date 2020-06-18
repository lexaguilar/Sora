using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sora.Models.SaraModel;

namespace sora.Factory
{  
    public class ClasificacionFactory
    {      
        private readonly SaraContext db;
        public ClasificacionFactory(SaraContext _db){
            db = _db;
        }

        public Clasificacion[] GetAll(){

            return db.Clasificacion.ToArray();

        }
    }
}