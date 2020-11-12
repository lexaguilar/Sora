using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class Cuentas
    {
        public Cuentas()
        {
            AppCompCtaxPagarCuenta = new HashSet<App>();
            AppCompIvaAcreditableCuenta = new HashSet<App>();
            AppVtaCajaGeneralCuenta = new HashSet<App>();
            AppVtaClienteCuenta = new HashSet<App>();
            AppVtaCostoVentaCuenta = new HashSet<App>();
            AppVtaInventarioCuenta = new HashSet<App>();
            AppVtaIvaPorPagarCuenta = new HashSet<App>();
            AppVtaVentaCuenta = new HashSet<App>();
            Asientos = new HashSet<Asientos>();
            Bancos = new HashSet<Bancos>();
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
        public virtual ICollection<App> AppCompCtaxPagarCuenta { get; set; }
        public virtual ICollection<App> AppCompIvaAcreditableCuenta { get; set; }
        public virtual ICollection<App> AppVtaCajaGeneralCuenta { get; set; }
        public virtual ICollection<App> AppVtaClienteCuenta { get; set; }
        public virtual ICollection<App> AppVtaCostoVentaCuenta { get; set; }
        public virtual ICollection<App> AppVtaInventarioCuenta { get; set; }
        public virtual ICollection<App> AppVtaIvaPorPagarCuenta { get; set; }
        public virtual ICollection<App> AppVtaVentaCuenta { get; set; }
        public virtual ICollection<Asientos> Asientos { get; set; }
        public virtual ICollection<Bancos> Bancos { get; set; }
    }
}
