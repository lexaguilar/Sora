using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class Asientos
    {
        public Asientos()
        {
            AsientosDetalle = new HashSet<AsientosDetalle>();
        }

        public int Id { get; set; }
        public int CorteId { get; set; }
        public int Numero { get; set; }
        public DateTime Fecha { get; set; }
        public string Concepto { get; set; }
        public int TipoComprobanteId { get; set; }
        public int EstadoId { get; set; }
        public string Observacion { get; set; }
        public string Referencia { get; set; }
        public string Codigo { get; set; }
        public bool EsCheque { get; set; }
        public string PagueseA { get; set; }
        public int? CuentaId { get; set; }
        public int? EntidadId { get; set; }
        public double Monto { get; set; }
        public double TipoCambio { get; set; }
        public int MonedaId { get; set; }

        public virtual Cortes Corte { get; set; }
        public virtual Cuentas Cuenta { get; set; }
        public virtual Entidades Entidad { get; set; }
        public virtual AsientoEstado Estado { get; set; }
        public virtual Moneda Moneda { get; set; }
        public virtual TipoComprobantes TipoComprobante { get; set; }
        public virtual ICollection<AsientosDetalle> AsientosDetalle { get; set; }
    }
}
