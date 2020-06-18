using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sora.Models.SaraModel;

namespace sora.Factory
{  
    public class NaturalezaFactory
    {      
        private readonly SaraContext db;
        public NaturalezaFactory(SaraContext _db){
            db = _db;
        }

        public Naturaleza[] GetAll(){

            return db.Naturaleza.ToArray();

        }
    }
}