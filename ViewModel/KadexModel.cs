
using System;

namespace Sora.ViewModel
{  
    public class KardexModel
    {      
        public DateTime Fecha { get; set; }
        public string Origen { get; set; }
        public string Documento { get; set; }
        public string Referencia { get; set; }
        public decimal Costo { get; set; }
        public double Entradas { get; set; }
        public double Salidas { get; set; }
        public decimal CostoPromedioSalida { get; set; }
        public double Existencias { get; set; }
        public decimal CostoPromedio { get; set; }
        public decimal Total { get; set; }
        public int Tipo { get; set; }
    }
}