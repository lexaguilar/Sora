using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class TipoComprobantes
    {
        public TipoComprobantes()
        {
            Asientos = new HashSet<Asientos>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Asientos> Asientos { get; set; }
    }
}
