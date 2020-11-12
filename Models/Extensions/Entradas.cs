using System;
using System.Linq;
using Sora.Extensions;
using static Sora.Enumerators;

namespace Sora.Models.SaraModel
{
    public partial class Entradas : ModelExtension<Entradas>
    {
        internal void InitFromCompras(SaraContext db, Compras compras,AppUser user)
        {
            this.AreaId = user.AreaId;
            this.TipoId = (int)EntradaTipo.Compras;
            this.Fecha = DateTime.Today;
            this.Numero = getMax(db);
            this.Observacion = compras.Observacion;
            this.SubTotal = compras.SubTotal;
            this.Descuento = compras.Descuento;
            this.Iva = compras.Total;
            this.Total = compras.Iva;
            this.CompraId = compras.Id;
            this.EstadoId = (int)Estados.Elaborado;
            this.BancoId = compras.BancoId;
            this.MonedaId = compras.MonedaId;
            this.TipoPagoId = compras.TipoPagoId;
        }

        private int getMax(SaraContext db)
        {
            var maxresult = db.Entradas.Where(x => x.AreaId == this.AreaId);//
            if (maxresult.Count() > 0)
                return maxresult.Max(x => x.Numero) + 1;
            else
                return 1;
        }
    }



    public partial class EntradasDetalle : ModelExtension<EntradasDetalle>
    {
        internal void InitFromComprasDetalle(Entradas entrada, ComprasDetalle comprasDetalle, SaraContext db)
        {

            this.InventarioId = comprasDetalle.InventarioId;
            this.Cantidad = comprasDetalle.CantidadRecibida;
            this.Costo = comprasDetalle.Costo;
            this.CostoPromedio = comprasDetalle.Costo;
            this.Existencias = comprasDetalle.CantidadRecibida;
            this.Precio = comprasDetalle.NuevoPrecio;
            this.SubTotal = comprasDetalle.SubTotal;
            this.DescuentoAverage = comprasDetalle.DescuentoAverage;
            this.DescuentoMonto = comprasDetalle.DescuentoMonto;
            this.Importe = comprasDetalle.Importe;
            this.IvaAverage = comprasDetalle.IvaAverage;
            this.IvaMonto = comprasDetalle.IvaMonto;
            this.Total = comprasDetalle.Total;

            this.CalcularCostoPromedio(entrada, db);

        }

        private void CalcularCostoPromedio(Entradas entrada, SaraContext db)
        {

            var resumen = db.AreaExistencias
                .FirstOrDefault(x => x.AreaId == entrada.AreaId && x.InventarioId == this.InventarioId);

            if (resumen != null)
            {

                this.CostoPromedio = (
                                        (resumen.CostoPromedio * Convert.ToDecimal(resumen.Existencias)) +
                                        (this.Costo * Convert.ToDecimal(this.Cantidad))
                                     )/ 
                                        Convert.ToDecimal(this.Cantidad + resumen.Existencias);


                this.Existencias = this.Cantidad + resumen.Existencias;
            }
        }
    }


}