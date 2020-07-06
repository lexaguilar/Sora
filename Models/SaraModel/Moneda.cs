using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class Moneda
    {
        public Moneda()
        {
            Asientos = new HashSet<Asientos>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }
        public string Abrev { get; set; }

        public virtual ICollection<Asientos> Asientos { get; set; }
    }
}
