using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sora.Models.SaraModel;
using Sora.ViewModel;

namespace Sora.Factory
{  
    public class CuentasFactory 
    {      
        private readonly SaraContext db;
        public CuentasFactory(SaraContext _db){
            db = _db;
        }

        public Cuentas[] GetAll()
        {
             return db.Cuentas.ToArray();
        }

        public CuentaAsCatalog[] GetAsCatalog(){

            return db.Cuentas.Select(x => new CuentaAsCatalog{
                Id = x.Id,
                Numero = x.Numero,
                Descripcion =x.Descripcion
            }).ToArray();

        }
    }
}