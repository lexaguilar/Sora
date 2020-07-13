using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class EntradasDetalle
    {
        public int Id { get; set; }
        public int EntradaId { get; set; }
        public int InventarioId { get; set; }
        public double Cantidad { get; set; }
        public decimal Costo { get; set; }
        public decimal Precio { get; set; }
        public decimal SubTotal { get; set; }
        public double DescuentoAverage { get; set; }
        public decimal DescuentoMonto { get; set; }
        public decimal Importe { get; set; }
        public double IvaAverage { get; set; }
        public decimal IvaMonto { get; set; }
        public decimal Total { get; set; }
        public decimal CostoPromedio { get; set; }
        public double Existencias { get; set; }

        public virtual Entradas Entrada { get; set; }
        public virtual Inventario Inventario { get; set; }
    }
}
