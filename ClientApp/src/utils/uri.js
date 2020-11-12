import { createProxy, createProxyBase } from "./proxy";

const uri = {
    areas: createProxyBase('areas'),
    asientos: createProxyBase('asientos'),
    bancos: createProxyBase('bancos'),
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
    clientes: createProxyBase('clientes'),
    formaPago: createProxyBase('formaPago'),
    tipoPago: createProxyBase('tipoPago'),
    compras: createProxyBase('compras'),
    salidas: createProxyBase('salidas'),
    servicios: createProxyBase('servicios'),
};

uri.compras.descargar = `compras/descargar`;
uri.salidas.asFactura = `salidas/factura`;
uri.cuentasLevels = level => `cuentas/get/nivel/${level}`;
uri.account = 'account/auth';

export default uri;