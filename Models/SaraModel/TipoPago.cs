using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class TipoPago
    {
        public TipoPago()
        {
            Compras = new HashSet<Compras>();
            Entradas = new HashSet<Entradas>();
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Compras> Compras { get; set; }
        public virtual ICollection<Entradas> Entradas { get; set; }
        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
