const catalogos = ['naturaleza', 'tipoCuenta', 'grupos', 'clasificacion', 'presentacion', 'unidadMedida', 'formaPago'];

const estadoGeneric = {
    elaborado: 1,
    anulado: 2
}

export const estadoAsiento = {...estadoGeneric };

export const estadoCompra = {...estadoGeneric };

export const etapaCompra = {...estadoGeneric, ... { recibida: 2 } };

export const formaPago = { contado: 1, credito: 2 }

export default catalogos;