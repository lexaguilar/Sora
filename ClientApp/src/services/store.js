import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';
import http from '../utils/http';

/**
 * returna un new CustomStore/ 
 * @param {model} model -  uri para enlazar los datos
 * @return {CustomStore} CustomStore
 */
const store =
    (
        model = {
            uri: '',
            msgInserted: '',
            msgUpdated: '',
            msgDeleted: '',
            key: 'id'
        }
    ) => {
        const customStore = new CustomStore({
            key: model.key || 'id',
            load: (loadOptions) => {
                return http(model.uri.get)
                    .asGet()
                    .then((data) => {
                        return {
                            data: data,
                            totalCount: data.length,
                        };
                    })
                    .catch(() => { throw 'Data Loading Error'; });
            },
            insert: (data) => {
                return new Promise(resolve =>
                    http(model.uri.insert).asPost(data).then(result => {
                        notify(model.msgInserted);
                        resolve(result);
                    })
                )
            },
            update: (id, dataModificada) => {
                return new Promise(resolve =>
                    customStore.byKey(id).then(data => {
                        http(model.uri.insert).asPost({...data, ...dataModificada }).then(result => {
                            notify(model.msgUpdated);
                            resolve(result);
                        })
                    })
                )
            },
            remove: id => {
                return new Promise(resolve =>
                    http(model.uri.remove(id)).asGet().then(result => {
                        notify(model.msgDeleted, 'error');
                        resolve(result);
                    })
                )
            },
            byKey: id => http(model.uri.getById(id)).asGet()

        });

        return customStore;
    }



export { store }