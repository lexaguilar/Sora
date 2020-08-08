using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Clientes
    {
        public Clientes()
        {
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Contacto { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }

        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
