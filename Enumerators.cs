using System;

namespace Sora
{
    static public class Enumerators
    {
        public enum Naturalezas { Deudora = 1, Acrredora = 2 }
        public enum Estados { Elaborado = 1, Anulado = 2 }
        public enum CompraEtapas { Pendiente = 1, Recibida = 2 }
        public enum EntradaTipo
        {
            SaldoInicial = 1,
            Compras = 2
        }

        public enum SalidaTipo
        {
            Factura = 1
        }

        public enum TipoMovimiento{
            Entrada =1,
            Salida=2
        }

        public enum FormaPagos{
            Contado = 1,
            Credito = 2
        }

        public enum TipoComprobante{
            Apertura = 1,
            Diario = 2,
            Ingreso = 3,
            Egreso = 4
        }
    }
}
