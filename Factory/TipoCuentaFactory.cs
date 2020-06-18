using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sora.Models.SaraModel;

namespace sora.Factory
{  
    public class TipoCuentaFactory
    {      
        private readonly SaraContext db;
        public TipoCuentaFactory(SaraContext _db){
            db = _db;
        }

        public TipoCuenta[] GetAll(){

            return db.TipoCuenta.ToArray();

        }
    }
}