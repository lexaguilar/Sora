import http from '../../utils/http';
import uri from '../../utils/uri';
import CustomStore from 'devextreme/data/custom_store';

const store = new CustomStore({
    key: 'id',
    load: (loadOptions) => {
        return http(uri.cuentas.get)
            .asGet()
            .then((data) => {
                return {
                    data: data,
                    totalCount: data.length,
                };
            })
            .catch(() => { throw 'Data Loading Error'; });
    },
    insert: (values) => {
        // ...
    },
    update: (key, values) => {
        // ...
    },
    remove: (key) => {
        // ...
    }
});

export { store }