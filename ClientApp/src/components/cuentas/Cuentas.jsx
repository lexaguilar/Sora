import React, { Component } from "react";
import TreeList, { Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, Lookup, Editing } from 'devextreme-react/tree-list';
import { store } from "./store";
import { createStore } from "../../utils/proxy";
import uri from "../../utils/uri";

class Cuentas extends Component {
    constructor(props) {
        super(props)

    }



    render() {
        const dataSourceOptions = [];
        return (
            <div className="container">
                <TreeList
                    dataSource={store}
                    showBorders={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    defaultExpandedRowKeys={[1, 2]}
                    defaultSelectedRowKeys={[1, 29, 42]}
                    keyExpr="id"
                    parentIdExpr="Task_Parent_ID"
                    id="tasks"
                >
                    <SearchPanel visible={true} width={250} />
                    <HeaderFilter visible={true} />
                    <Selection mode="multiple" />
                    <ColumnChooser enabled={true} />
                    <Editing
                        allowUpdating={true}
                        allowDeleting={true}
                        allowAdding={true}
                        mode="popup" />
                    <Column dataField="numero" minWidth={200} />
                    <Column dataField="descripcion"/>
                    <Column dataField="grupoId" width={180} >
                        <Lookup dataSource={createStore('grupos')} valueExpr="id" displayExpr="descripcion" />
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