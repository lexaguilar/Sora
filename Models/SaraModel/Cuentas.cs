using System;
using System.Collections.Generic;

namespace sora.Models.SaraModel
{
    public partial class Cuentas
    {
        public Cuentas()
        {
            Asientos = new HashSet<Asientos>();
        }

        public int Id { get; set; }
        public string Numero { get; set; }
        public string Descripcion { get; set; }
        public int GrupoId { get; set; }
        public int NaturalezaId { get; set; }
        public int TipoCuentaId { get; set; }
        public int? CuentaPadreId { get; set; }
        public int ClasificacionId { get; set; }
        public int Nivel { get; set; }

        public virtual Clasificacion Clasificacion { get; set; }
        public virtual Grupos Grupo { get; set; }
        public virtual Naturaleza Naturaleza { get; set; }
        public virtual TipoCuenta TipoCuenta { get; set; }
        public virtual ICollection<Asientos> Asientos { get; set; }
    }
}
