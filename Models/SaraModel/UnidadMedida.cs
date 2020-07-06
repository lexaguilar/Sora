﻿using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class UnidadMedida
    {
        public UnidadMedida()
        {
            Inventario = new HashSet<Inventario>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Inventario> Inventario { get; set; }
    }
}
