﻿using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class SalidaEstado
    {
        public SalidaEstado()
        {
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
