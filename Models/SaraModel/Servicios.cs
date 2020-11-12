using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Servicios
    {
        public Servicios()
        {
            ServiciosEstandar = new HashSet<ServiciosEstandar>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public int EstadoId { get; set; }

        public virtual ServicioEstado Estado { get; set; }
        public virtual ICollection<ServiciosEstandar> ServiciosEstandar { get; set; }
    }
}
