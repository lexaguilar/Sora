import React, { Component } from "react";
import {
    Column,
    ColumnChooser,
    FilterRow,
    SearchPanel,
    Lookup,
    Pager,
    Paging,
    Export,
    Button as ButtonGrid 
}
    from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import { createStore } from "../../../utils/proxy";
import { store } from "../../../services/store";
import Nuevo from "./Nuevo";
import { connect } from 'react-redux';
import { updateFactura } from '../../../store/factura/facturaActions';
import { estadoSalida } from "../../../data/catalogos";
import BlockHeader from "../../shared/BlockHeader";
import uri from "../../../utils/uri";
import { formatId, cellAsBold, cellRender } from "../../../utils/common";
import Title from "../../shared/Title";

class Facturas extends Component {

    constructor(props) {
        super(props)

        this.store = null
        this.dataGrid = null;
        this.reload = this.reload.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.onRowDblClick = this.onRowDblClick.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);

    }

    reload() {
        this.dataGrid.instance.refresh();
    }

    openDialog(id = 0, editable=true) {

        let { updateFactura } = this.props;

        updateFactura({
            id,
            open: true,
            editable
        });
    }   

    onRowDblClick(e) {
        this.openDialog(e.data.id);
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'add',
                text: 'Nueva factura',
                onClick: e => this.openDialog(0, true)
            }
        })
    }

    onRowPrepared(e) {
        if (e.rowType == 'data') {

            if (e.data.estadoId == estadoSalida.anulado) 
                e.rowElement.classList.add('estado-anulado');
            
        }
    }

    render() {
        let remoteOperations = true;
        this.store = store(
            {
                uri: uri.salidas,
                msgInserted: 'Factura agregada correctamente',
                msgUpdated: 'Factura modificada correctamente',
                msgDeleted: 'Factura eliminada correctamente',
                remoteOperations: remoteOperations,
                extraParameter : {
                    key : 'tipoId',
                    value : '1'
                }
            });
        const title = "Facturas"; 
        return (
            <div className="container">
                <Title title={title} />
                <BlockHeader title={title} />
                <Nuevo onSave={this.reload}  />
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
                    <Export enabled={true} fileName={title} allowExportSelectedData={true} />
                    <Column type="buttons">
                        <ButtonGrid name="ver" text="Ver" onClick={e => this.openDialog(e.row.data.id, false)}/>
                        <ButtonGrid name="modificar" text="Editar" onClick={e => this.openDialog(e.row.data.id, true)}/>
                    </Column>
                    <Column dataField="numero" width={80} cellRender={data => cellAsBold(formatId(data.value))} />
                    <Column dataField="fecha" width={100} dataType="date" format="dd/MM/yyyy" />
                    <Column dataField="areaId" width={180} caption="Area">
                        <Lookup disabled={true} dataSource={createStore('areas')} valueExpr="id" displayExpr="descripcion" />
                    </Column>                    
                    <Column dataField="tipoPagoId" width={130} caption="TipoPago">
                        <Lookup disabled={true} dataSource={createStore('tipoPago')} valueExpr="id" displayExpr="descripcion" />
                    </Column>                    
                    <Column dataField="formaPagoId" width={130} caption="Forma Pago">
                        <Lookup disabled={true} dataSource={createStore('formaPago')} valueExpr="id" displayExpr="descripcion" />
                    </Column>  
                    <Column dataField="clienteId" caption="Cliente">
                        <Lookup disabled={true} dataSource={createStore('clientes')} valueExpr="id" displayExpr="nombre" />
                    </Column>                    
                    <Column dataField="total" width={80} allowFiltering={false} cellRender={cellRender} />
                    <Column dataField="estadoId" caption="Estado" width={120}>
                        <Lookup disabled={true} dataSource={createStore('salidaEstado')} valueExpr="id" displayExpr="descripcion" />
                    </Column>                    
                </DataGrid>
            </div>
        )
    }

}

const mapDispatchToPros = ({
    updateFactura
});

export default connect(null, mapDispatchToPros)(Facturas);

