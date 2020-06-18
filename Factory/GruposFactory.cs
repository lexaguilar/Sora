using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sora.Models.SaraModel;

namespace sora.Factory
{  
    public class GruposFactory
    {      
        private readonly SaraContext db;
        public GruposFactory(SaraContext _db){
            db = _db;
        }

        public Grupos[] GetAll(){

            return db.Grupos.ToArray();

        }
    }
}