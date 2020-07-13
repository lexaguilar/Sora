﻿using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Areas
    {
        public Areas()
        {
            AreaExistencias = new HashSet<AreaExistencias>();
            Entradas = new HashSet<Entradas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<AreaExistencias> AreaExistencias { get; set; }
        public virtual ICollection<Entradas> Entradas { get; set; }
    }
}