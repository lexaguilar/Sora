using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Moneda
    {
        public Moneda()
        {
            Asientos = new HashSet<Asientos>();
            Compras = new HashSet<Compras>();
            Entradas = new HashSet<Entradas>();
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }
        public string Abrev { get; set; }
        public int? AppId { get; set; }

        public virtual App App { get; set; }
        public virtual ICollection<Asientos> Asientos { get; set; }
        public virtual ICollection<Compras> Compras { get; set; }
        public virtual ICollection<Entradas> Entradas { get; set; }
        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
