import { invalid } from "moment";

export const CONTA = '/conta';
export const INV = '/inv';



const menuConta = [{
        layout: 'conta',
        title: 'Inicio',
        url: ''
    },
    {
        layout: 'conta',
        title: 'Catalogos',
        url: `${CONTA}/cuentas`,
        submenu: {
            type: 'megamenu',
            menu: {
                size: 'nl',
                columns: [{
                        size: 6,
                        links: [{
                            title: 'Catalos de cuentas',
                            url: '',
                            links: [
                                { title: 'Cuentas contables', url: `${CONTA}/cuentas` },
                                { title: 'Naturaleza de las cuentas', url: `${CONTA}/cuenta/naturaleza` },
                                { title: 'Grupo de cuentas', url: `${CONTA}/cuenta/grupos` },
                                { title: 'Tipo de cuentas', url: `${CONTA}/cuenta/tipoCuenta` },
                                { title: 'Clasificacion de cuentas', url: `${CONTA}/cuenta/clasificacion` }
                            ],
                        }, ]
                    },
                    {
                        size: 6,
                        links: [{
                            title: 'Comprobantes',
                            url: '',
                            links: [
                                { title: 'Tipos de comprobantes', url: `${CONTA}/tipoComprobantes` },
                                { title: 'Centro de costo', url: `${CONTA}/centro-costo` },
                            ],
                        }, ]
                    }
                ]
            }

        },
    },
    {
        layout: 'conta',
        title: 'Comprobantes',
        url: `${CONTA}/asientos`
    },
    {
        layout: 'conta',
        title: 'Libros',
        url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Libro mayor', url: `${CONTA}/libro/mayor` },
                { title: 'Libro auxiliar', url: `${CONTA}/` },
            ],
        },
    },
    {
        layout: 'conta',
        title: 'Bancos',
        url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Bancos', url: `${CONTA}/` },
                { title: 'Cheques', url: `${CONTA}/` },
            ],
        },
    },
    {
        layout: 'conta',
        title: 'Reportes',
        url: '/site/about-us',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Estado resultado', url: `${CONTA}/` },
                { title: 'Balance General', url: `${CONTA}/` },
                { title: 'Balanza de comprobacion', url: `${CONTA}/` },
                { title: 'Libro diario', url: `${CONTA}/` },
                { title: 'Libro Mayor Auxiliar', url: `${CONTA}/` },
                { title: 'Cheques', url: `${CONTA}/` },
            ],
        },
    },
    {
        layout: 'conta',
        title: 'Configuracion',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Cortes', url: `${CONTA}/configuracion/cortes` },
                { title: 'Tasa de cambio', url: `${CONTA}/configuracion/tasa-cambio` },
            ],
        },
    }
];

const menuInv = [{
        layout: 'inv',
        title: 'Facturas',
        url: '/facturas'
    },
    {
        layout: 'inv',
        title: 'Inventario',
        url: `${INV}/asientos`
    },
    {
        layout: 'inv',
        title: 'Catalogos',
        url: `${INV}/cuentas`,
        submenu: {
            type: 'megamenu',
            menu: {
                size: 'nl',
                columns: [{
                    size: 6,
                    links: [{
                        title: 'Catalos del inventario',
                        url: '',
                        links: [
                            { title: 'Unidad medida', url: `${INV}/un` },
                            { title: 'Laboratorio', url: `${INV}/laboratirio` },
                            { title: 'Familias', url: `${INV}/cuenta/familias` },
                        ],
                    }]
                }, {
                    size: 6,
                    links: [{
                        title: 'Entidades',
                        url: '',
                        links: [
                            { title: 'Clientes', url: `${CONTA}/clientes` },
                            { title: 'Proveedores', url: `${CONTA}/proveedores` },
                        ],
                    }]
                }, ]
            }

        },
    },
    {
        layout: 'inv',
        title: 'Compras',
        url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Compras', url: `${INV}/compras` },
                { title: 'Entradas', url: `${INV}/entradas` },
                { title: 'Salidas', url: `${INV}/salidas` },
            ],
        },
    },
    {
        layout: 'inv',
        title: 'Reportes',
        url: '/site/about-us',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Inventario Stock', url: `${INV}/` },
                { title: 'Existencias', url: `${INV}/` },
                { title: 'Kardex', url: `${INV}/` },
            ],
        },
    },
    {
        layout: 'inv',
        title: 'Configuracion',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Unidades de conversion', url: `${INV}/configuracion/unidadcoversion` },
                { title: 'Utilidades', url: `${INV}/configuracion/utilidades` },
            ],
        },
    }
];

export default [...menuConta, ...menuInv];