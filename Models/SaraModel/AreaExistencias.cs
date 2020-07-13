using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class AreaExistencias
    {
        public int AreaId { get; set; }
        public int InventarioId { get; set; }
        public double Existencias { get; set; }
        public decimal CostoPromedio { get; set; }
        public decimal CostoReal { get; set; }
        public double Minimo { get; set; }
        public decimal Precio { get; set; }

        public virtual Areas Area { get; set; }
        public virtual Inventario Inventario { get; set; }
    }
}
