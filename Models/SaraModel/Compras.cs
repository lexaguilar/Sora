using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Compras
    {
        public Compras()
        {
            ComprasDetalle = new HashSet<ComprasDetalle>();
            Entradas = new HashSet<Entradas>();
        }

        public int Id { get; set; }
        public int FormaPagoId { get; set; }
        public DateTime Fecha { get; set; }
        public int ProveedorId { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Descuento { get; set; }
        public decimal Iva { get; set; }
        public decimal Total { get; set; }
        public string Observacion { get; set; }
        public int EstadoId { get; set; }
        public string Referencia { get; set; }
        public int PlazoCredito { get; set; }
        public int EtapaId { get; set; }
        public int? EntradaId { get; set; }
        public int? TipoPagoId { get; set; }
        public int MonedaId { get; set; }
        public int? BancoId { get; set; }

        public virtual Bancos Banco { get; set; }
        public virtual CompraEstado Estado { get; set; }
        public virtual CompraEtapa Etapa { get; set; }
        public virtual FormaPago FormaPago { get; set; }
        public virtual Moneda Moneda { get; set; }
        public virtual Proveedores Proveedor { get; set; }
        public virtual TipoPago TipoPago { get; set; }
        public virtual ICollection<ComprasDetalle> ComprasDetalle { get; set; }
        public virtual ICollection<Entradas> Entradas { get; set; }
    }
}
