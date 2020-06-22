import http from '../../utils/http';
import uri from '../../utils/uri';
import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';

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
    insert: (cuenta) => {
        return new Promise(resolve =>
            http(uri.cuentas.insert).asPost(cuenta).then(result => {
                notify(`Cuenta contable agregada`);
                resolve(result);
            })
        )
    },
    update: (id, cuentaModificada) => {
        return new Promise(resolve =>
            store.byKey(id).then(cuenta => {
                http(uri.cuentas.insert).asPost({...cuenta, ...cuentaModificada }).then(result => {
                    notify(`Cuenta contable agregada`);
                    resolve(result);
                })
            })
        )
    },
    remove: id => {
        return new Promise(resolve =>
            http(uri.cuentas.remove(id)).asGet().then(result => {
                notify(`Registro eliminado`, 'error');
                resolve(result);
            })
        )
    },
    byKey: id => http(uri.cuentas.getById(id)).asGet()

});

export { store }