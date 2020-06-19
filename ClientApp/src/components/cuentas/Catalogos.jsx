import React, { Component } from 'react';
import { DataGrid } from 'devextreme-react';
import { Item } from 'devextreme-react/form';
import { 
    Paging, 
    Pager, 
    FilterRow, 
    HeaderFilter, 
    ColumnChooser, 
    Column, 
    Export, 
    Editing,
    Popup,        
    Position,
    Form } from 'devextreme-react/data-grid';

import { Helmet } from 'react-helmet';
import CustomStore from 'devextreme/data/custom_store';
import http from '../../utils/http';
import app from '../../data/app';
import uri from '../../utils/uri';
import notify from 'devextreme/ui/notify';
import toCapital from '../../utils/common';

const store = function (name) {
    return new CustomStore({
        key: 'id',
        load: (loadOptions) => {
            return http(`catalogos/${name}`)
                .asGet()
                .then((data) => {
                    return {
                        data: data,
                        totalCount: data.length,
                    };
                })
                .catch(() => { throw 'Data Loading Error'; });
        },
        insert: catalog => {
            return new Promise(resolve =>
                http(uri[name].insert).asPost(catalog).then(result => {
                    notify(`Registro ${name} agregado`);
                    resolve(result);
                })
            )
        },
        update: (id, catalog) => {
            return new Promise(resolve =>
                http(uri[name].insert).asPost({ ...catalog, ...{ id } }).then(result => {
                    notify(`Registro ${name} modificado`);
                    resolve(result);
                })
            );
        },
        remove: id => {
            return new Promise(resolve =>
                http(uri[name].remove(id)).asGet().then(result => {
                    notify(`Registro ${name} eliminado`, 'error');
                    resolve(result);
                })
            )
        }
    });
}


function Catalogo(props) {
    const { catalogo } = props;

    return (
        <div className="container small">
            <Helmet>
                <title>{app.Name} {catalogo}</title>
            </Helmet>
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store(catalogo)}
                showBorders={true}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}
            >
                <Paging defaultPageSize={20} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[10, 20, 50]}
                />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <ColumnChooser enabled={true} />
                <Export enabled={true} fileName="Catalogos" allowExportSelectedData={true} />
                <Column dataField="descripcion" />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title={toCapital(catalogo)} showTitle={true} width={500} height={220}>
                        
                    </Popup>
                    <Form>
                        <Item  dataField="descripcion" editorOptions={{ width:300 }} />                       
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Catalogo; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);