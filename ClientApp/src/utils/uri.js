import { createProxy } from "./proxy";

const uri = {
    cuentas: createProxy('cuentas/get'),
    clasificacion: createProxy('clasificacion/get', 'clasificacion/post', id => `clasificacion/${id}/delete`),
    naturaleza: createProxy('naturaleza/get', 'naturaleza/post', id => `naturaleza/${id}/delete`),
    grupos: createProxy('grupos/get', 'grupos/post', id => `grupos/${id}/delete`),
    tipoCuenta: createProxy('tipoCuenta/get', 'tipoCuenta/post', id => `tipoCuenta/${id}/delete`),
    tipoComprobantes: createProxy('tipoComprobantes/get', 'tipoComprobantes/post', id => `tipoComprobantes/${id}/delete`)
};

export default uri;