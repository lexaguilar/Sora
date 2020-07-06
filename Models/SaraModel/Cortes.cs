using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class Cortes
    {
        public Cortes()
        {
            Asientos = new HashSet<Asientos>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Final { get; set; }
        public bool Activo { get; set; }

        public virtual ICollection<Asientos> Asientos { get; set; }
    }
}
