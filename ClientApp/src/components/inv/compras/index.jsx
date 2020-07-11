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
import numeral from 'numeral'
import { connect } from 'react-redux';
import { updateCompra } from '../../../store/compra/compraActions'
import { estadoCompra, etapaCompra } from "../../../data/catalogos";
import BlockHeader from "../../shared/BlockHeader";
import uri from "../../../utils/uri";

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

    openDialog(id = 0, editable=true) {

        let { updateCompra } = this.props;

        console.log(updateCompra);

        updateCompra({
            id: 0,
            open: true,
            editable: true
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

        return (
            <div className="container">
                <BlockHeader title="Compras" />
                <Nuevo  />
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
                    <Column dataField="id" width={100} cellRender={data => `${data.data.tipoComprobante.abrev}-${numeral(data.value).format('000000')}`} />
                    <Column dataField="fecha" width={120} dataType="date" format="dd/MM/yyyy" />
                    <Column dataField="proveedorId" width={260} caption="Proveedor">
                        <Lookup disabled={true} dataSource={createStore('proveedores')} valueExpr="id" displayExpr="nombre" />
                    </Column>                    
                    <Column dataField="formaPagoId" width={260} caption="Forma Pago">
                        <Lookup disabled={true} dataSource={createStore('formaPago')} valueExpr="id" displayExpr="descripcion" />
                    </Column>                    
                    <Column dataField="referencia" width={120} allowFiltering={false} />
                    <Column dataField="total" width={120} allowFiltering={false} />
                    <Column dataField="estadoId" caption="Estado" width={130}>
                        <Lookup disabled={true} dataSource={createStore('compraEstado')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="etapaId" caption="Etapa" width={130}>
                        <Lookup disabled={true} dataSource={createStore('compraEtapa')} valueExpr="id" displayExpr="descripcion" />
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
