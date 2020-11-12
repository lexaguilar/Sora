using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class SalidaTipos
    {
        public SalidaTipos()
        {
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
