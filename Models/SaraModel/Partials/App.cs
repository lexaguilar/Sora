using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sora.Models.SaraModel
{    
    public partial class App {
        [NotMapped]
        public string Version { get; set; }
      } 
}
