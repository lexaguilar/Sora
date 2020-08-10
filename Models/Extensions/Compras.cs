using Sora.ViewModel;
using static Sora.Enumerators;

namespace Sora.Models.SaraModel
{
    public partial class Compras : ModelExtension<Compras> , IModelValidation<Compras> 
    {
        internal Compras ApplyRules()
        {
            if(FormaPagoId == (int)FormaPagos.Contado)
                PlazoCredito = 0;

            if(FormaPagoId == (int)FormaPagos.Credito)
                TipoPagoId = null;

            return this;
        }

        public ModelValidation validate()
        {
            var modelValidation = new ModelValidation();

            if(FormaPagoId == 0) return modelValidation.AsError("Debe seleccionar la forma de pago");

            if(ProveedorId == 0) return modelValidation.AsError("Debe seleccionar un proveedor");

            if(MonedaId == 0) return modelValidation.AsError("Debe seleccionar una moneda");
            
            return modelValidation.AsOk();
        }

        public ModelValidation validate(Compras compraModificada)
        {
            var modelValidation = new ModelValidation();

             if (compraModificada.EtapaId == (int)CompraEtapas.Recibida)
                return modelValidation.AsError($"No se puede editar una compra en la etapa recibida");
            
            return modelValidation.AsOk();
        }
    }   

    public partial class ComprasDetalle : ModelExtension<ComprasDetalle>
    {

    }


}