﻿using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Presentacion
    {
        public Presentacion()
        {
            Inventario = new HashSet<Inventario>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Inventario> Inventario { get; set; }
    }
}
