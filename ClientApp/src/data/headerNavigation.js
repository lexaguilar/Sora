export const _path = {
    CONTA: '/conta',
    INV: '/inv'
}



const menuConta = [{
        layout: 'conta',
        title: 'Inicio',
        url: ''
    },
    {
        layout: 'conta',
        title: 'Catalogos',
        url: `${_path.CONTA}/cuentas`,
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
                                { title: 'Cuentas contables', url: `${_path.CONTA}/cuentas` },
                                { title: 'Naturaleza de las cuentas', url: `${_path.CONTA}/naturaleza` },
                                { title: 'Grupo de cuentas', url: `${_path.CONTA}/grupos` },
                                { title: 'Tipo de cuentas', url: `${_path.CONTA}/tipoCuenta` },
                                { title: 'Clasificacion de cuentas', url: `${_path.CONTA}/clasificacion` }
                            ],
                        }, ]
                    },
                    {
                        size: 6,
                        links: [{
                            title: 'Comprobantes',
                            url: '',
                            links: [
                                { title: 'Tipos de comprobantes', url: `${_path.CONTA}/tipoComprobantes` },
                                { title: 'Centro de costo', url: `${_path.CONTA}/centro-costo` },
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
        url: `${_path.CONTA}/asientos`
    },
    {
        layout: 'conta',
        title: 'Libros',
        url: '',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Libro mayor', url: `${_path.CONTA}/libro/mayor` },
                { title: 'Libro auxiliar', url: `${_path.CONTA}/` },
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
                { title: 'Bancos', url: `${_path.CONTA}/` },
                { title: 'Cheques', url: `${_path.CONTA}/` },
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
                { title: 'Estado resultado', url: `${_path.CONTA}/` },
                { title: 'Balance General', url: `${_path.CONTA}/` },
                { title: 'Balanza de comprobacion', url: `${_path.CONTA}/` },
                { title: 'Libro diario', url: `${_path.CONTA}/` },
                { title: 'Libro Mayor Auxiliar', url: `${_path.CONTA}/` },
                { title: 'Cheques', url: `${_path.CONTA}/` },
            ],
        },
    },
    {
        layout: 'conta',
        title: 'Configuracion',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Cortes', url: `${_path.CONTA}/configuracion/cortes` },
                { title: 'Tasa de cambio', url: `${_path.CONTA}/configuracion/tasa-cambio` },
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
        url: `${_path.INV}/asientos`
    },
    {
        layout: 'inv',
        title: 'Catalogos',
        url: `${_path.INV}/cuentas`,
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
                            { title: 'Unidad medida', url: `${_path.INV}/unidadMedida` },
                            { title: 'Laboratorio', url: `${_path.INV}/laboratirio` },
                            { title: 'Familias', url: `${_path.INV}/familia` },
                        ],
                    }]
                }, {
                    size: 6,
                    links: [{
                        title: 'Entidades',
                        url: '',
                        links: [
                            { title: 'Clientes', url: `${_path.INV}/clientes` },
                            { title: 'Proveedores', url: `${_path.INV}/proveedores` },
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
                { title: 'Compras', url: `${_path.INV}/compras` },
                { title: 'Entradas', url: `${_path.INV}/entradas` },
                { title: 'Salidas', url: `${_path.INV}/salidas` },
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
                { title: 'Inventario Stock', url: `${_path.INV}/` },
                { title: 'Existencias', url: `${_path.INV}/` },
                { title: 'Kardex', url: `${_path.INV}/` },
            ],
        },
    },
    {
        layout: 'inv',
        title: 'Configuracion',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Unidades de conversion', url: `${_path.INV}/configuracion/unidadcoversion` },
                { title: 'Utilidades', url: `${_path.INV}/configuracion/utilidades` },
            ],
        },
    }
];

export default [...menuConta, ...menuInv];