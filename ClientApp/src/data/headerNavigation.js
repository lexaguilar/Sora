export default [{
        title: 'Inicio',
        url: ''
    },
    /*{
        title: 'Megamenu',
        url: '',
        submenu: {
            type: 'megamenu',
            menu: {
                size: 'nl',
                columns: [{
                        size: 6,
                        links: [{
                                title: 'Power Tools',
                                url: '',
                                links: [
                                    { title: 'Engravers', url: '' },
                                    { title: 'Wrenches', url: '' },
                                    { title: 'Wall Chaser', url: '' },
                                    { title: 'Pneumatic Tools', url: '' },
                                ],
                            },
                            {
                                title: 'Machine Tools',
                                url: '',
                                links: [
                                    { title: 'Thread Cutting', url: '' },
                                    { title: 'Chip Blowers', url: '' },
                                    { title: 'Sharpening Machines', url: '' },
                                    { title: 'Pipe Cutters', url: '' },
                                    { title: 'Slotting machines', url: '' },
                                    { title: 'Lathes', url: '' },
                                ],
                            },
                        ],
                    },
                    {
                        size: 6,
                        links: [{
                                title: 'Hand Tools',
                                url: '',
                                links: [
                                    { title: 'Screwdrivers', url: '' },
                                    { title: 'Handsaws', url: '' },
                                    { title: 'Knives', url: '' },
                                    { title: 'Axes', url: '' },
                                    { title: 'Multitools', url: '' },
                                    { title: 'Paint Tools', url: '' },
                                ],
                            },
                            {
                                title: 'Garden Equipment',
                                url: '',
                                links: [
                                    { title: 'Motor Pumps', url: '' },
                                    { title: 'Chainsaws', url: '' },
                                    { title: 'Electric Saws', url: '' },
                                    { title: 'Brush Cutters', url: '' },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    },*/
    {
        title: 'Catalogos',
        url: '/cuentas',
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
                                { title: 'Cuentas contables', url: '/cuentas' },
                                { title: 'Naturaleza de las cuentas', url: '/cuenta/naturaleza' },
                                { title: 'Grupo de cuentas', url: '/cuenta/grupos' },
                                { title: 'Tipo de cuentas', url: '/cuenta/tipoCuenta' },
                                { title: 'Clasificacion de cuentas', url: '/cuenta/clasificacion' }
                            ],
                        }, ]
                    },
                    {
                        size: 6,
                        links: [{
                            title: 'Comprobantes',
                            url: '',
                            links: [
                                { title: 'Tipos de comprobantes', url: '/tipoComprobantes' },
                            ],
                        }, ]
                    }
                ]
            }

        },
    },
    {
        title: 'Comprobantes',
        url: '/asientos'
    },
    {
        title: 'Cheques',
        url: '/blog/category-classic'
    },
    {
        title: 'Bancos',
        url: '/site/about-us'
    },
    {
        title: 'Reportes',
        url: '/site/about-us',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Estado resultado', url: '/' },
                { title: 'Balance General', url: '/' },
                { title: 'Balanza de comprobacion', url: '/' },
                { title: 'Libro diario', url: '/' },
                { title: 'Libro Mayor Auxiliar', url: '/' },
                { title: 'Cheques', url: '/' },
            ],
        },
    },
    {
        title: 'Configuracion',
        submenu: {
            type: 'menu',
            menu: [
                { title: 'Cortes', url: '/configuracion/cortes' },
                { title: 'Tasa de cambio', url: '/configuracion/tasa-cambio' },
            ],
        },
    }
];