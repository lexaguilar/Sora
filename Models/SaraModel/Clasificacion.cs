﻿using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Clasificacion
    {
        public Clasificacion()
        {
            Cuentas = new HashSet<Cuentas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Cuentas> Cuentas { get; set; }
    }
}
