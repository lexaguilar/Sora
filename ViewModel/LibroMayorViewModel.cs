
namespace Sora.ViewModel
{  
    public class LibroMayorViewModel
    {      
        public int PeriodoId { get; set; }
        public string Periodo { get; set; }
        public double Debe { get; set; }
        public double Haber { get; set; }
        public double Saldo { get; set; }
        public double SaldoAcumulado { get; set; }
    }
}