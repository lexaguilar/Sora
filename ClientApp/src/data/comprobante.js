import moment from 'moment';

export const defaultComprobante = {
    id: 0,
    numero: 0,
    tipoComprobanteId: null,
    monedaId: null,
    fecha: new Date(moment().year(), moment().month(), moment().date(), 0, 0, 0, 0),
    concepto: '',
    observacion: '',
    tipoCambio: 0,
    referencia: '',
    asientosDetalle: []
}