using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class TasaDeCambio
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public double Cambio { get; set; }
    }
}
