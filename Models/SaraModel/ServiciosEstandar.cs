using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class ServiciosEstandar
    {
        public int Id { get; set; }
        public int ServicioId { get; set; }
        public int InventarioId { get; set; }

        public virtual Inventario Inventario { get; set; }
        public virtual Servicios Servicio { get; set; }
    }
}
