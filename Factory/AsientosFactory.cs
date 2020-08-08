using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sora.Models.SaraModel;
using Sora.ViewModel;
using static Sora.Enumerators;

namespace Sora.Factory
{
    public class AsientosFactory
    {
        private readonly SaraContext db;
        private GenericFactory<Asientos> factory = null;
        private GenericFactory<AsientosDetalle> factoryDetalle = null;
        public AsientosFactory(SaraContext _db)
        {
            db = _db;
            this.factory = new GenericFactory<Asientos>(db);
            this.factoryDetalle = new GenericFactory<AsientosDetalle>(db);
        }

        public Asientos Save(Asientos asiento)
        {
            //TODO Validar que el asietno que se editar no este cerrado el corte
            if (asiento.Id > 0)
            {
                //Actializar encabezado
                var asientoModificado = factory.FirstOrDefault(x => x.Id == asiento.Id);
                asientoModificado.CopyFrom(asiento, x => new
                {
                    x.CorteId,
                    x.Fecha,
                    x.MonedaId,
                    x.Referencia,
                    x.TipoComprobanteId,
                    x.Concepto,
                    x.EstadoId,
                    x.Observacion,
                    x.TipoCambio
                });

                factory.Save();

                //eliminar registros anteriores
                var oldAsientoDetalle = factoryDetalle.GetAll(x => x.AsientoId == asiento.Id);
                foreach (var item in oldAsientoDetalle)
                    factoryDetalle.Delete(item);
                factoryDetalle.Save();

                //agregar nuevos registros
                var detalle = asiento.AsientosDetalle;
                foreach (var item in detalle)
                {

                    var asientosDetalle = new AsientosDetalle();
                    asientosDetalle.CopyAllFromExcept(item, x => new { x.Id });
                    factoryDetalle.Insert(asientosDetalle);

                }

                factoryDetalle.Save();

            }
            else
            {

                asiento.Numero = getMax(asiento.CorteId);
                factory.Insert(asiento);
                factory.Save();

            }

            return asiento;
        }

        private int getMax(int corteId)
        {
            var maxresult = db.Asientos.Where(x => x.CorteId == corteId);//
            if (maxresult.Count() > 0)
                return maxresult.Max(x => x.Numero) + 1;
            else
                return 1;
        }

        public Asientos CreateFromSalida(Salidas salida)
        {
            //Contabilizar

            //Encabezado                    
            var corte = db.Cortes.FirstOrDefault(x => x.Activo);
            var asiento = new Asientos
            {
                CorteId = corte.Id,
                Fecha = DateTime.Today,
                Concepto = "Registro de factura",
                TipoComprobanteId = (int)TipoComprobante.Ingreso,
                EstadoId = (int)Estados.Elaborado,
                Referencia = $"Factura#{salida.Numero}",
                //TODO, corregir la moneda, dejar con enumerador
                MonedaId = 1,
                //TODO obtener la tasa de camnbio del  dia
                TipoCambio = 0

            };

            var app = db.App.FirstOrDefault();

            var costo = Convert.ToDouble(salida.SalidasDetalle.Sum(x => Convert.ToDouble(x.CostoPromedio) * x.Cantidad));

            //Inventario
            var asientoDetalleInv = CreateDetalle(app.VtaInventarioCuentaId, "Inventario", 0, costo);

            //Costo de venta
            var asientoDetalleCV = CreateDetalle(app.VtaCostoVentaCuentaId, "Costo de venta", costo, 0);

            var precio = Convert.ToDouble(salida.SalidasDetalle.Sum(x => x.Importe));

            //Venta
            var asientoDetalleV = CreateDetalle(app.VtaVentaCuentaId, "Venta", 0, precio);

            //Iva por pagar
            var iva = Convert.ToDouble(salida.SalidasDetalle.Sum(x => x.IvaMonto));
            var asientoDetalleIPP = CreateDetalle(app.VtaIvaPorPagarCuentaId, "IVA por pagar", 0, iva);

            //ContraCuenta
            var asientoDetalle = CreateDetalle(null, "", precio + iva, 0);

            if (salida.FormaPagoId == (int)FormaPagos.Contado)
            {
                asientoDetalle.CuentaId = app.VtaCajaGeneralCuentaId ?? 0;
                asientoDetalle.Referencia = "Caja general";
            }

            if (salida.FormaPagoId == (int)FormaPagos.Credito)
            {
                asientoDetalle.CuentaId = app.VtaClienteCuentaId ?? 0;
                asientoDetalle.Referencia = "Cta Cliente";
            }

            asiento.AsientosDetalle.Add(asientoDetalleInv);
            asiento.AsientosDetalle.Add(asientoDetalleCV);
            asiento.AsientosDetalle.Add(asientoDetalleV);
            asiento.AsientosDetalle.Add(asientoDetalleIPP);
            asiento.AsientosDetalle.Add(asientoDetalle);

            asiento = Save(asiento);

            return asiento;
        }

        private AsientosDetalle CreateDetalle(int? cuentaId, string referencia, double debe, double haber)
        {
            return new AsientosDetalle
            {
                CuentaId = cuentaId ?? 0,
                Referencia = referencia,
                Debe = debe,
                Haber = haber
            };
        }

    }
}