using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class TipoPago
    {
        public TipoPago()
        {
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
