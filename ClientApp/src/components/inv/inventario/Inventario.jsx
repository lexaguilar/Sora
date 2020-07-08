import React, { Component } from "react";
import {
    Column,
    ColumnChooser,
    FilterRow,
    SearchPanel,
    Lookup,
    Pager,
    Paging,
    Editing,
    Popup, Form
}
    from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import numeral from 'numeral'
import { connect } from 'react-redux';
import uri from "../../../utils/uri";
import { store } from "../../../services/store";
import { createStore } from "../../../utils/proxy";
import { Item } from 'devextreme-react/form';
import BlockHeader from "../../shared/BlockHeader";

class Inventario extends Component {

    constructor(props) {
        super(props)

        this.store = null
        this.dataGrid = null;
        this.onRowDblClick = this.onRowDblClick.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);

    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'add',
                text: 'Nuevo inventario',
                onClick: () => {
                    this.dataGrid.instance.addRow();
                }
            }
        })
    }

    // onRowPrepared(e) {
    //     if (e.rowType == 'data') {
    //         if (e.data.estadoId == estadoAsiento.anulado) {
    //             e.rowElement.classList.add('asiento-anulado');
    //         }
    //     }
    // }

    onRowDblClick(e) {
        this.openDialog(e.data.id);
    }

    render() {
        let { user } = this.props;
        let remoteOperations = true;
        this.store = store(
            {
                uri: uri.inventario,
                msgInserted: 'Inventario agregado correctamente',
                msgUpdated: 'Inventario modificado correctamente',
                msgDeleted: 'Inventario eliminado correctamente',
                remoteOperations: remoteOperations
            });

        return (
                <div className="container">       
                    <BlockHeader title="Inventario"/>             
                    <DataGrid
                        ref={(ref) => this.dataGrid = ref}
                        dataSource={this.store}
                        selection={{ mode: 'single' }}
                        showBorders={true}
                        showRowLines={true}
                        allowColumnResizing={true}
                        allowColumnReordering={true}
                        hoverStateEnabled={true}
                        remoteOperations={{
                            paging: true,
                            filtering: true
                        }}
                        onToolbarPreparing={this.onToolbarPreparing}
                        onRowDblClick={this.onRowDblClick}
                        onRowPrepared={this.onRowPrepared}
                    >
                        <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                        <Paging defaultPageSize={10} />
                        <SearchPanel visible={true} width={250} />
                        <FilterRow visible={true} />
                        <ColumnChooser enabled={true} />
                        <Editing
                            mode="popup"
                            allowUpdating={true}
                            allowDeleting={true}
                            allowAdding={true}
                        >
                            <Popup title="Inventario" showTitle={true} width={800} height={300}>
                            </Popup>
                            <Form>
                                <Item itemType="group" colCount={2} colSpan={2}>
                                    <Item dataField="numero" editorOptions={{disabled : true}} colCount={2} colSpan={2}/>
                                    <Item dataField="nombre" />
                                    <Item dataField="descripcion" />
                                    <Item dataField="familiaId" />
                                    <Item dataField="presentacionId" />
                                    <Item dataField="unidadMedidaId" />
                                    <Item dataField="stockMinimo" />
                                    <Item dataField="iva" />
                                    <Item dataField="estadoId" />                                
                                </Item>                           
                            </Form>
                        </Editing>
                        <Column dataField="numero" width={100} alignment="right" cellRender={ data => (<b>{data.data.numero}</b>)} />
                        <Column dataField="nombre" width={260} />
                        <Column dataField="descripcion" />
                        <Column dataField="familiaId" width={150} caption="Familia">
                            <Lookup dataSource={createStore('familia')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                        <Column dataField="presentacionId" width={130} caption="Presentacion">
                            <Lookup disabled={true} dataSource={createStore('presentacion')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                        <Column dataField="unidadMedidaId" width={130} caption="Unidad Medidad">
                            <Lookup disabled={true} dataSource={createStore('unidadMedida')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                        <Column dataField="stockMinimo" width={80} dataType="number" />
                        <Column dataField="iva" width={60} dataType="boolean" />
                        <Column dataField="estadoId" caption="Estado" width={80}>
                            <Lookup disabled={true} dataSource={createStore('inventarioEstado')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                    </DataGrid>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps, null)(Inventario);
