import { createProxy, createProxyBase } from "./proxy";

const uri = {
    asientos: createProxyBase('asientos'),
    centroCosto: createProxyBase('centroCosto'),
    clasificacion: createProxyBase('clasificacion'),
    cortes: createProxyBase('cortes'),
    cuentas: createProxyBase('cuentas'),
    grupos: createProxyBase('grupos'),
    naturaleza: createProxyBase('naturaleza'),
    moneda: createProxyBase('moneda'),
    tipoCuenta: createProxyBase('tipoCuenta'),
    tipoComprobantes: createProxyBase('tipoComprobantes'),
    tasaCambio: createProxyBase('tasaCambio'),
    file: createProxy('', 'tasaCambio/post/file'),
    //inv
    inventario: createProxyBase('inventario'),
    familia: createProxyBase('familia'),
    unidadMedida: createProxyBase('unidadMedida'),
    presentacion: createProxyBase('presentacion'),
    proveedores: createProxyBase('proveedores'),
    formaPago: createProxyBase('formaPago'),
};

export default uri;