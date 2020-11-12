using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class UsuarioEstado
    {
        public UsuarioEstado()
        {
            Usuarios = new HashSet<Usuarios>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Usuarios> Usuarios { get; set; }
    }
}
