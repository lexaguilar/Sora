import moment from 'moment';
export const defaultCompra = {
    id: 0,
    formaPagoId: null,
    proveedorId: null,
    fecha: new Date(moment().year(), moment().month(), moment().date(), 0, 0, 0, 0),
    observacion: '',
    referencia: '',
    estadoId: 1,
    plazoCredito: 0
}