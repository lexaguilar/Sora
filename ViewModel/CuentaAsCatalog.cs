using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using sora.Models.SaraModel;

namespace sora.ViewModel
{  
    public class CuentaAsCatalog
    {      
        public int Id { get; set; }
        public string Numero { get; set; }
        public string Descripcion { get; set; }
    }
}