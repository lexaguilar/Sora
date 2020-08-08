using System.Linq;
using Sora.Extensions;

namespace Sora.Models.SaraModel
{
    public partial class Inventario : ModelExtension<Inventario>
    {
        internal void RegisterTransactionIn(SaraContext db, EntradasDetalle detalle, AppUser user, int AreaId)
        {
            var resumen = db.AreaExistencias
                    .FirstOrDefault(x => x.AreaId == AreaId && x.InventarioId == this.Id);

            if (resumen == null)
            {
                db.AreaExistencias.Add(new AreaExistencias
                {
                    AreaId = AreaId,
                    InventarioId = this.Id,
                    Existencias = detalle.Cantidad,
                    CostoPromedio = detalle.CostoPromedio,
                    CostoReal = detalle.Costo,
                    Precio = detalle.Precio,
                    //Hereda de Catalogo de inventario
                    Minimo = this.StockMinimo,
                });
            }
            else
            {

                resumen.Existencias += detalle.Cantidad;
                resumen.CostoPromedio = detalle.CostoPromedio;
                resumen.CostoReal = detalle.Costo;
                resumen.Precio = detalle.Precio;

            }

        }

        internal AreaExistencias RegisterTransactionOut(SaraContext db, SalidasDetalle detalle, int AreaId)
        {
            var resumen = db.AreaExistencias
                    .FirstOrDefault(x => x.AreaId == AreaId && x.InventarioId == this.Id);

            resumen.Existencias -= detalle.Cantidad;

            return resumen;

        }
    }

}