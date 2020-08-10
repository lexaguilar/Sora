using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Bancos
    {
        public Bancos()
        {
            Compras = new HashSet<Compras>();
            Entradas = new HashSet<Entradas>();
            Salidas = new HashSet<Salidas>();
        }

        public int Id { get; set; }
        public int CuentaId { get; set; }
        public string Descripcion { get; set; }
        public bool Activo { get; set; }

        public virtual Cuentas Cuenta { get; set; }
        public virtual ICollection<Compras> Compras { get; set; }
        public virtual ICollection<Entradas> Entradas { get; set; }
        public virtual ICollection<Salidas> Salidas { get; set; }
    }
}
