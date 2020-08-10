using static Sora.Enumerators;

namespace Sora.Models.SaraModel
{
    public partial class Compras : ModelExtension<Compras> 
    {
        internal Compras ApplyRules()
        {
            if(FormaPagoId == (int)FormaPagos.Contado)
                PlazoCredito = 0;

            if(FormaPagoId == (int)FormaPagos.Credito)
                TipoPagoId = null;

            return this;
        }

        internal bool
    }   


}