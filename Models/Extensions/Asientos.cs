using System.Linq;
using Sora.ViewModel;

namespace Sora.Models.SaraModel
{
    public partial class Asientos : ModelExtension<Asientos>, IModelValidation<Asientos>
    {
        public ModelValidationSource<Asientos> validate()
        {
            var modelValidation = new ModelValidationSource<Asientos>(this);
            modelValidation.model = this;

            if(TipoComprobanteId == 0) return modelValidation.AsError("Debe seleccionar el tipo de comprobante");
            
            if(CorteId == 0) return modelValidation.AsError("Debe indicar el corte contable");
            
            if(MonedaId == 0) return modelValidation.AsError("Debe seleccionar el tipo de moneda");

            return modelValidation.AsOk();
        }

        public ModelValidationSource<Asientos> validateForCortes(IQueryable<Cortes> cortes){
            var modelValidation = new ModelValidationSource<Asientos>(this);

            if(cortes.Count() == 0)
                return modelValidation.AsError("No se encontró ningun corte activo");
            
            if(cortes.Count() > 1)
                return modelValidation.AsError("No se pueden generar comprobantes con varios cortes contables activos");
                        
            var corteActual = cortes.FirstOrDefault();
            
            if(Fecha < corteActual.Inicio || Fecha > corteActual.Final)
                return modelValidation.AsError("La fecha del comprobante esta fuera del rango del corte activo");

            CorteId = corteActual.Id;

            return modelValidation.AsOk();

        }
    }
    public partial class AsientosDetalle : ModelExtension<AsientosDetalle>
    {

    }

}