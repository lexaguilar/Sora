using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sora.Models.SaraModel;

namespace Sora.ViewModel
{  
    public class CuentaAsCatalog
    {      
        public int Id { get; set; }
        public string Numero { get; set; }
        public string Descripcion { get; set; }
    }
}