using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class Usuarios
    {
        public string Username { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int EstadoId { get; set; }
    }
}
