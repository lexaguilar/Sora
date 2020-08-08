using System;
using System.Collections.Generic;

namespace Sora.Models.SaraModel
{
    public partial class App
    {
        public string Name { get; set; }
        public string Slogan { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public int CantDecimales { get; set; }
        public int IvaAverage { get; set; }
        public int AreaId { get; set; }
        public int? VtaInventarioCuentaId { get; set; }
        public int? VtaCostoVentaCuentaId { get; set; }
        public int? VtaIvaPorPagarCuentaId { get; set; }
        public int? VtaVentaCuentaId { get; set; }
        public int? VtaCajaGeneralCuentaId { get; set; }
        public int? VtaClienteCuentaId { get; set; }
        public int? CompIvaAcreditableCuentaId { get; set; }
        public int? CompBancoCuentaId { get; set; }
        public string FullName { get; set; }
    }
}
