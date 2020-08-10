using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Entradas
    {
        public Entradas()
        {
            EntradasDetalle = new HashSet<EntradasDetalle>();
        }

        public int Id { get; set; }
        public int AreaId { get; set; }
        public int TipoId { get; set; }
        public DateTime Fecha { get; set; }
        public int Numero { get; set; }
        public string Observacion { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Descuento { get; set; }
        public decimal Iva { get; set; }
        public decimal Total { get; set; }
        public int? CompraId { get; set; }
        public int EstadoId { get; set; }
        public int? TipoPagoId { get; set; }
        public int MonedaId { get; set; }
        public int? BancoId { get; set; }

        public virtual Areas Area { get; set; }
        public virtual Bancos Banco { get; set; }
        public virtual Compras Compra { get; set; }
        public virtual EntradaEstado Estado { get; set; }
        public virtual Moneda Moneda { get; set; }
        public virtual EntradaTipos Tipo { get; set; }
        public virtual TipoPago TipoPago { get; set; }
        public virtual ICollection<EntradasDetalle> EntradasDetalle { get; set; }
    }
}
