using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class AsientosDetalle
    {
        public int Id { get; set; }
        public int AsientoId { get; set; }
        public int CuentaId { get; set; }
        public string Referencia { get; set; }
        public double Debe { get; set; }
        public double Haber { get; set; }
        public int CentroCostoId { get; set; }

        public virtual Asientos Asiento { get; set; }
        public virtual CentroCosto CentroCosto { get; set; }
    }
}
