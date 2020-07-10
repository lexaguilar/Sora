﻿using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class FormaPago
    {
        public FormaPago()
        {
            Compras = new HashSet<Compras>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Compras> Compras { get; set; }
    }
}
