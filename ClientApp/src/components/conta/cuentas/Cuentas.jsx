import React, { Component } from "react";
import TreeList, { Column, ColumnChooser, HeaderFilter, SearchPanel, Lookup, Editing, Paging, Pager, FilterRow } 
from 'devextreme-react/tree-list';

import { createStore } from "../../../utils/proxy";
import { store } from "../../../services/store";
import uri from "../../../utils/uri";
import BlockHeader from "../../shared/BlockHeader";
import { Export } from "devextreme-react/data-grid";

class Cuentas extends Component {
    constructor(props) {
        super(props)
        this.onInitNewRow = this.onInitNewRow.bind(this);
    }

    onInitNewRow(e) {
        if (e.data.cuentaPadreId > 0) {

            let parent = e.component.getNodeByKey(e.data.cuentaPadreId);
            e.data.grupoId = parent.data.grupoId;
            e.data.tipoCuentaId = parent.data.tipoCuentaId;
            e.data.naturalezaId = parent.data.naturalezaId;
            e.data.nivel = parent.data.nivel + 1;
        }

    }

    // onEditorPreparing(e) {
    //     if (e.parentType === 'dataRow' && e.dataField === 'grupoId') {
    //         console.log(e)
    //         e.editorOptions.disabled =  e.row.data.cuentaPadreId > 0;
    //     }
    // }

    render() {
        const allowedPageSizes = [5, 10, 20];
        return (
            <div className="container">
                <BlockHeader title="Cuentas contables" />
                <TreeList
                    dataSource={store(
                        {
                            uri: uri.cuentas,
                            msgInserted: 'Cuenta agregada correctamente',
                            msgUpdated: 'Cuenta modificada correctamente',
                            msgDeleted: 'Cuenta eliminada correctamente',
                        })}
                    showBorders={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}                    
                    keyExpr="id"
                    parentIdExpr="cuentaPadreId"
                    onInitNewRow={this.onInitNewRow}
                >
                    <SearchPanel visible={true} width={250} />
                    <HeaderFilter visible={true} />
                    <FilterRow visible={true} />                   
                    <ColumnChooser enabled={true} />
                    <Export enabled={true} fileName="Cuentas contables" allowExportSelectedData={true} />                    
                    <Paging
                        enabled={true}
                        defaultPageSize={10} />
                    <Pager
                        showPageSizeSelector={true}
                        allowedPageSizes={allowedPageSizes}
                        showInfo={true} />
                    <Editing
                        allowUpdating={true}
                        allowDeleting={true}
                        allowAdding={true}
                        mode="popup" >
                    </Editing>
                    <Column dataField="numero" minWidth={200} />
                    <Column dataField="descripcion" />

                    <Column dataField="grupoId" width={180}>
                        <Lookup disabled={true} dataSource={createStore('grupos')} valueExpr="id" displayExpr="descripcion" />
                    </Column>

                    <Column dataField="naturalezaId" width={80} >
                        <Lookup dataSource={createStore('naturaleza')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="tipoCuentaId" width={150} >
                        <Lookup dataSource={createStore('tipoCuenta')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="cuentaPadreId" width={100} >
                        <Lookup dataSource={createStore('cuentas')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="clasificacionId" width={80} >
                        <Lookup dataSource={createStore('clasificacion')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="nivel" width={80} />

                </TreeList>
            </div>
        )
    }

}

export default Cuentas;