using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class ServicioEstado
    {
        public ServicioEstado()
        {
            Servicios = new HashSet<Servicios>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Servicios> Servicios { get; set; }
    }
}
