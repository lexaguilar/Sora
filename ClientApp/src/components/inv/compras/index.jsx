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
import { updateCompra } from '../../../store/compra/compraActions'
import { estadoCompra, etapaCompra } from "../../../data/catalogos";
import BlockHeader from "../../shared/BlockHeader";
import uri from "../../../utils/uri";
import { formatId, cellAsBold, cellRender } from "../../../utils/common";
import Descarga from "./Descarga";
import Title from "../../shared/Title";

class Compras extends Component {

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

    openDialog(id = 0, editable=true, descargar=false) {

        let { updateCompra } = this.props;

        updateCompra({
            id,
            open: true,
            editable,
            descargar : false
        });
    }

    openDialogDescarga(id = 0) {

        let { updateCompra } = this.props;

        updateCompra({
            id,
            open: false,
            editable : false,
            descargar : true
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
                text: 'Nueva orden',
                onClick: e => this.openDialog(0, true)
            }
        })
    }

    onRowPrepared(e) {
        if (e.rowType == 'data') {

            if (e.data.estadoId == estadoCompra.anulado) 
                e.rowElement.classList.add('compra-anulado');

            if (e.data.etapaId == etapaCompra.recibida) 
                e.rowElement.classList.add('compra-recibida');
            
        }
    }

    render() {
        let remoteOperations = true;
        this.store = store(
            {
                uri: uri.compras,
                msgInserted: 'Orden de compra agregada correctamente',
                msgUpdated: 'Orden de compra modificada correctamente',
                msgDeleted: 'Orden de compra eliminada correctamente',
                remoteOperations: remoteOperations
            });
        const title = "Tipo de Comrobante"; 
        return (
            <div className="container">
                <Title title={title} />
                <BlockHeader title={title} />
                <Nuevo onSave={this.reload}  />
                <Descarga onSave={this.reload}  />
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
                    <Export enabled={true} fileName="Comprobantes" allowExportSelectedData={true} />
                    <Column type="buttons">
                        <ButtonGrid name="ver" text="Ver" onClick={e => this.openDialog(e.row.data.id, false)}/>
                        <ButtonGrid name="modificar" text="Editar" onClick={e => this.openDialog(e.row.data.id, true)}/>
                    </Column>
                    <Column dataField="id" width={90} cellRender={data => cellAsBold(formatId(data.value))} />
                    <Column dataField="fecha" width={120} dataType="date" format="dd/MM/yyyy" />
                    <Column dataField="proveedorId" width={260} caption="Proveedor">
                        <Lookup disabled={true} dataSource={createStore('proveedores')} valueExpr="id" displayExpr="nombre" />
                    </Column>                    
                    <Column dataField="formaPagoId" width={130} caption="Forma Pago">
                        <Lookup disabled={true} dataSource={createStore('formaPago')} valueExpr="id" displayExpr="descripcion" />
                    </Column>                    
                    <Column dataField="referencia" width={120} allowFiltering={false} />
                    <Column dataField="total" width={100} allowFiltering={false} cellRender={cellRender} />
                    <Column dataField="estadoId" caption="Estado" width={120}>
                        <Lookup disabled={true} dataSource={createStore('compraEstado')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="etapaId" caption="Etapa" width={100}>
                        <Lookup disabled={true} dataSource={createStore('compraEtapa')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column type="buttons">
                        <ButtonGrid name="descargar" text="Recibir" hint='click para dar ingreso a la compra' onClick={e => this.openDialogDescarga(e.row.data.id, true, true )}/>
                    </Column>
                </DataGrid>
            </div>
        )
    }

}

const mapDispatchToPros = ({
    updateCompra
});

export default connect(null, mapDispatchToPros)(Compras);

