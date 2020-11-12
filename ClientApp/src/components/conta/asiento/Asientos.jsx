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
import { updateAsiento } from '../../../store/asiento/asientoActions'
import { estadoAsiento } from "../../../data/catalogos";
import BlockHeader from "../../shared/BlockHeader";
import { formatId } from "../../../utils/common";
import Title from "../../shared/Title";

class Asientos extends Component {

    constructor(props) {
        super(props)

        this.store = null
        this.dataGrid = null;
        this.reload = this.reload.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.onRowDblClick = this.onRowDblClick.bind(this);
        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);

        console.log('asientos');
    }

    reload() {
        this.dataGrid.instance.refresh();
    }

    openDialog(id = 0, editable=true) {

        let { updateAsiento } = this.props;

        updateAsiento({
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
                text: 'Nuevo asiento',
                onClick: e => this.openDialog(0, true)
            }
        })
    }

    onRowPrepared(e) {
        if (e.rowType == 'data') {
            if (e.data.estadoId == estadoAsiento.anulado) {
                e.rowElement.classList.add('asiento-anulado');
            }
        }
    }

    render() {
        let { user } = this.props;
        let remoteOperations = true;
        this.store = store(
            {
                uri: { get: `asientos/get/cortes/${user.corteId}` },
                msgInserted: 'Cuenta agregada correctamente',
                msgUpdated: 'Cuenta modificada correctamente',
                msgDeleted: 'Cuenta eliminada correctamente',
                remoteOperations: remoteOperations
            });
        const title = "Comprobantes";
        return (
            <div className="container">
                <Title title={title}/>
                <BlockHeader title={title} />
                <Nuevo onSave={this.reload} />
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
                    <Column dataField="numero" width={100} cellRender={data => `${data.data.tipoComprobante.abrev}-${formatId(data.value)}`} />
                    <Column dataField="fecha" width={120} dataType="date" format="dd/MM/yyyy" />
                    <Column dataField="concepto" allowFiltering={false} />
                    <Column dataField="tipoComprobanteId" width={260} caption="Tipo Comprobante">
                        <Lookup disabled={true} dataSource={createStore('tipoComprobantes')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="monedaId" width={130}>
                        <Lookup disabled={true} dataSource={createStore('moneda')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="tipoCambio" width={120} allowFiltering={false} />
                    <Column dataField="referencia" width={120} allowFiltering={false} />
                    <Column dataField="estadoId" caption="Estado" width={130}>
                        <Lookup disabled={true} dataSource={createStore('asientoEstado')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                </DataGrid>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToPros = ({
    updateAsiento
});

export default connect(mapStateToProps, mapDispatchToPros)(Asientos);
