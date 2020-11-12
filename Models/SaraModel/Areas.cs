using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Areas
    {
        public Areas()
        {
            App = new HashSet<App>();
            AreaExistencias = new HashSet<AreaExistencias>();
            Entradas = new HashSet<Entradas>();
            Salidas = new HashSet<Salidas>();
            Usuarios = new HashSet<Usuarios>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<App> App { get; set; }
        public virtual ICollection<AreaExistencias> AreaExistencias { get; set; }
        public virtual ICollection<Entradas> Entradas { get; set; }
        public virtual ICollection<Salidas> Salidas { get; set; }
        public virtual ICollection<Usuarios> Usuarios { get; set; }
    }
}
