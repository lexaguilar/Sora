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
    Popup, Form, Export, StringLengthRule, RequiredRule
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
import { editorOptions } from "../../../data/app";
import { cellAsBold } from "../../../utils/common";
import Title from "../../shared/Title";

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
        });

        e.toolbarOptions.items.unshift({
            location: 'beore',
            widget: 'dxButton',
            options: {
                icon: 'export',
                text: 'Importar desde excel',
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
        this.dataGrid.instance.editRow(e.rowIndex);
    }

    render() {
        let remoteOperations = true;
        const title = "Inventario"
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
                    <Title title={title} />
                    <BlockHeader title={title} />          
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
                        <Pager allowedPageSizes={[10, 15, 30, 50]} showPageSizeSelector={true} showInfo={true} />
                        <Paging defaultPageSize={15} />
                        <SearchPanel visible={true} width={250} />
                        <FilterRow visible={true} />
                        <ColumnChooser enabled={true} />
                        <Export enabled={true} fileName="Inventario" allowExportSelectedData={true} />
                        <Editing
                            mode="popup"
                            allowUpdating={true}
                            allowDeleting={true}
                            allowAdding={true}
                        >
                            <Popup title="Inventario" showTitle={true} width={400} height={450}>
                            </Popup>
                            <Form>
                                <Item itemType="group" colCount={1} colSpan={2} >
                                    <Item dataField="numero" editorOptions={{readOnly : true}}/>
                                    <Item dataField="nombre" editorOptions={editorOptions} />
                                    <Item dataField="descripcion" editorOptions={editorOptions}/>
                                    <Item dataField="familiaId" editorOptions={{...editorOptions, ...{displayExpr: data => data ? `${data.prefijo} - ${data.descripcion}` : null}}}/>
                                    <Item dataField="presentacionId" editorOptions={editorOptions}/>
                                    <Item dataField="unidadMedidaId" editorOptions={editorOptions}/>
                                    <Item dataField="stockMinimo" editorOptions={editorOptions}/>
                                    <Item dataField="iva" editorType="dxSwitch" editorOptions={{...editorOptions, ...{switchedOffText:"NO",switchedOnText:"SI",}}}/>
                                    <Item dataField="estadoId" editorOptions={editorOptions}/>                                
                                </Item>                           
                            </Form>
                        </Editing>
                        <Column dataField="numero" width={100} alignment="right" cellRender={ data => cellAsBold(data.data.numero)} />
                        <Column dataField="nombre" width={260} >
                            <RequiredRule message="Esta dato es requerido" />
                            <StringLengthRule max={150} message="Maximo 150 caracteres" />
                        </Column>
                        <Column dataField="descripcion" >
                            <RequiredRule message="Esta dato es requerido" />
                            <StringLengthRule max={250} message="Maximo 250 caracteres" />
                        </Column>
                        <Column dataField="familiaId" width={150} caption="Familia">
                            <RequiredRule message="Esta dato es requerido" />
                            <Lookup dataSource={createStore('familia')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                        <Column dataField="presentacionId" width={130} caption="Presentacion">
                            <RequiredRule message="Esta dato es requerido" />
                            <Lookup disabled={true} dataSource={createStore('presentacion')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                        <Column dataField="unidadMedidaId" width={130} caption="Unidad Medidad">
                            <RequiredRule message="Esta dato es requerido" />
                            <Lookup disabled={true} dataSource={createStore('unidadMedida')} valueExpr="id" displayExpr="descripcion" />
                        </Column>
                        <Column dataField="stockMinimo" width={80} dataType="number">
                            <RequiredRule message="Esta dato es requerido" />
                        </Column>
                        <Column dataField="iva" caption="Aplica IVA" width={60} dataType="boolean"/>
                        <Column dataField="estadoId" caption="Estado" width={80}>
                            <RequiredRule message="Esta dato es requerido" />
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
