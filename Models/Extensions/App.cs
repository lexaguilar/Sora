using Sora.ViewModel;
using static Sora.Enumerators;

namespace Sora.Models.SaraModel
{
    public partial class App : ModelExtension<App> , IModelValidation<App> 
    {
        internal App ApplyRules()
        {
            if(!GererarProcesosContables)
            {
                VtaInventarioCuentaId = null;
                VtaCostoVentaCuentaId = null;
                VtaIvaPorPagarCuentaId = null;
                VtaVentaCuentaId = null;
                VtaCajaGeneralCuentaId = null;
                VtaClienteCuentaId = null;
                CompIvaAcreditableCuentaId = null;
                CompCtaxPagarCuentaId = null;                
            }
            return this;
        }

        public ModelValidationSource<App> validate()
        {
            var modelValidation = new ModelValidationSource<App>(this);

            if(GererarProcesosContables)
            {
                if(VtaInventarioCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de inventario");
                if(VtaCostoVentaCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de costo de venta");
                if(VtaIvaPorPagarCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de IVA por pagar");
                if(VtaVentaCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de venta");
                if(VtaCajaGeneralCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de Caja general");
                if(VtaClienteCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta por cobrar o cliente");
                if(CompIvaAcreditableCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de IVA acreditable");
                if(CompCtaxPagarCuentaId == null)
                    return modelValidation.AsError("Debe establecer la cuenta de pagar");
            } 

            if(AreaId == 0)
                return modelValidation.AsError("Debe establecer la bodega o area inicial");
            
            return modelValidation.AsOk();
        }
        
    }    

}