using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Entidades
    {
        public Entidades()
        {
            Asientos = new HashSet<Asientos>();
        }

        public int Id { get; set; }
        public string Identificacion { get; set; }
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Celular { get; set; }
        public string Direccion { get; set; }
        public bool EsProveedor { get; set; }

        public virtual ICollection<Asientos> Asientos { get; set; }
    }
}
