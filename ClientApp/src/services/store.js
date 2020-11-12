import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';
import http from '../utils/http';
import { required } from '../utils/proxy';

/**
 * returna un new CustomStore/ 
 * @param {model} model -  uri para enlazar los datos
 * @return {CustomStore} CustomStore
 */


const store =
    (
        defaultModel
    ) => {

        let model = {... {
                uri: required('uri'),
                msgInserted: 'Registro agregado correctamente',
                msgUpdated: 'Registro modificado correctamente',
                msgDeleted: 'Registro eliminado correctamente',
                cb: null,
                remoteOperations: false,
                extraParameter: null
            },
            ...defaultModel
        };

        const customStore = new CustomStore({
            load: (loadOptions) => {

                let params = {};
                params.skip = loadOptions.skip || 0;
                params.take = loadOptions.take || 10;

                if (model.extraParameter)
                    params[model.extraParameter.key] = model.extraParameter.value;

                if (loadOptions.filter) {
                    if (typeof loadOptions.filter[0] == 'object') {

                        for (var filter in loadOptions.filter) {
                            if (loadOptions.filter.hasOwnProperty(filter)) {
                                const element = loadOptions.filter[filter];
                                if (typeof element == 'object') {
                                    if (typeof element[0] == 'object') {
                                        var t = element[0];
                                        if (!params[t[0]])
                                            params[t[0]] = t[2];
                                    } else {
                                        if (!params[element[0]])
                                            params[element[0]] = element[2];
                                    }

                                }
                            }
                        }
                    } else {
                        params[loadOptions.filter[0]] = loadOptions.filter[2];
                    }
                }

                return http(model.uri.get)
                    .asGet(params)
                    .then((data) => {

                        let resp = data;

                        if (model.cb)
                            resp = model.cb(data);

                        if (model.remoteOperations)
                            return {
                                data: resp.items,
                                totalCount: resp.totalCount,
                            }
                        else
                            return {
                                data: resp,
                                totalCount: resp.length,
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
            update: (data, dataModificada) => {

                return new Promise(resolve =>
                    http(model.uri.insert).asPost({...data, ...dataModificada }).then(result => {
                        notify(model.msgUpdated);
                        resolve(result);
                    })

                )
            },
            remove: catalogo => {
                return new Promise(resolve =>
                    http(model.uri.remove(catalogo.id)).asGet().then(result => {
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