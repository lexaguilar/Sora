using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Familia
    {
        public Familia()
        {
            Inventario = new HashSet<Inventario>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }
        public bool Iva { get; set; }
        public int Prefijo { get; set; }

        public virtual ICollection<Inventario> Inventario { get; set; }
    }
}
