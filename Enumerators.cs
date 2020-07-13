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
    }
}
