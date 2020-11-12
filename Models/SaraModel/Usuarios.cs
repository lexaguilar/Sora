using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Usuarios
    {
        public string Username { get; set; }
        public int AreaId { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int EstadoId { get; set; }

        public virtual Areas Area { get; set; }
        public virtual UsuarioEstado Estado { get; set; }
    }
}
