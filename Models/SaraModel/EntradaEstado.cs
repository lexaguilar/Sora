﻿using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class EntradaEstado
    {
        public EntradaEstado()
        {
            Entradas = new HashSet<Entradas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Entradas> Entradas { get; set; }
    }
}
