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
}
    from 'devextreme-react/data-grid';
import { DataGrid, Button } from 'devextreme-react';
import { createStore } from "../../../utils/proxy";
import { store } from "../../../services/store";
import Nuevo from "./Nuevo";
import numeral from 'numeral'
import { connect } from 'react-redux';
import { updateAsiento } from '../../../store/asiento/asientoActions'
import { estadoAsiento } from "../../../data/catalogos";
import BlockHeader from "../../shared/BlockHeader";

class Asientos extends Component {

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

        let { updateAsiento } = this.props;

        updateAsiento({
            id: id,
            open: true,
            editable: editable
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
                onClick: this.openDialog
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

        return (
            <div className="container">
                <BlockHeader title="Comprobantes" />
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
                    <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
                    <Paging defaultPageSize={10} />
                    <SearchPanel visible={true} width={250} />
                    <FilterRow visible={true} />
                    <ColumnChooser enabled={true} />
                    <Export enabled={true} fileName="Comprobantes" allowExportSelectedData={true} />
                    <Column
                        dataField="id"
                        width={100}
                        allowFiltering={false}
                        allowSorting={false}
                        cellRender={data => 
                        <div>
                            <Button
                                className='links'
                                width={30}
                                text='Ver'
                                type="normal"
                                stylingMode="contained"
                                onClick={e => this.openDialog(data.data.id, false)}
                            /><Button
                                className='links'
                                width={50}
                                text='Editar'
                                type="normal"
                                stylingMode="contained"
                                onClick={e => this.openDialog(data.data.id, true)}
                            />
                        </div>
                        }
                    />

                    <Column dataField="numero" width={100} cellRender={data => `${data.data.tipoComprobante.abrev}-${numeral(data.value).format('000000')}`} />
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
