using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Inventario
    {
        public Inventario()
        {
            AreaExistencias = new HashSet<AreaExistencias>();
            ComprasDetalle = new HashSet<ComprasDetalle>();
            EntradasDetalle = new HashSet<EntradasDetalle>();
        }

        public int Id { get; set; }
        public int Numero { get; set; }
        public int FamiliaId { get; set; }
        public int PresentacionId { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public bool? Iva { get; set; }
        public int StockMinimo { get; set; }
        public int EstadoId { get; set; }
        public int UnidadMedidaId { get; set; }

        public virtual InventarioEstado Estado { get; set; }
        public virtual Familia Familia { get; set; }
        public virtual Presentacion Presentacion { get; set; }
        public virtual UnidadMedida UnidadMedida { get; set; }
        public virtual ICollection<AreaExistencias> AreaExistencias { get; set; }
        public virtual ICollection<ComprasDetalle> ComprasDetalle { get; set; }
        public virtual ICollection<EntradasDetalle> EntradasDetalle { get; set; }
    }
}
