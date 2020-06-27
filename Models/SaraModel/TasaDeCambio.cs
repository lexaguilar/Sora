using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Sora.Models.SaraModel
{
    public partial class TasaDeCambio
    {        
        [Key]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public double Cambio { get; set; }
    }
}
