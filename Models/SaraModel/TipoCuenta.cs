using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class TipoCuenta
    {
        public TipoCuenta()
        {
            Cuentas = new HashSet<Cuentas>();
        }

        public int Id { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Cuentas> Cuentas { get; set; }
    }
}
