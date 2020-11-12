import React from "react";
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
import BlockHeader from "../../shared/BlockHeader";
import uri from "../../../utils/uri";
import { formatId, cellAsBold, cellRender } from "../../../utils/common";
import Title from "../../shared/Title";
import { estadoServicio } from "../../../data/catalogos";
import { updateServicio } from '../../../store/servicio/servicioActions';

const Servicios = props => {

    const title = "Servicios"; 
    let remoteOperations = true;
    let dataGrid;
    let _store = store(
        {
            uri: uri.salidas,
            msgInserted: 'Servicio agregado correctamente',
            msgUpdated: 'Servicio modificado correctamente',
            msgDeleted: 'Servicio eliminado correctamente',
            remoteOperations: remoteOperations,
            extraParameter : {
                key : 'tipoId',
                value : '1'
            }
        });

    const reload = () => {
            dataGrid.instance.refresh();
    }

    const openDialog = (id = 0, editable=true) => {

        let { updateServicio } = props;      

        updateServicio({
            id,
            open: true,
            editable
        });

    }     

    const onRowDblClick = e => {
        openDialog(e.data.id);
    }

    const onToolbarPreparing = e => {
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'add',
                text: 'Nueva factura',
                onClick: e => openDialog(0, true)
            }
        })
    }

    const onRowPrepared = e => {
        if (e.rowType == 'data') {

            if (e.data.estadoId == estadoServicio.anulado) 
                e.rowElement.classList.add('estado-anulado');
            
        }
    }

    return (
        <div className="container">
            <Title title={title} />
            <BlockHeader title={title} />
            <Nuevo onSave={reload}/>
            <DataGrid
                ref={(ref) => dataGrid = ref}
                dataSource={_store}
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
                onToolbarPreparing={onToolbarPreparing}
                onRowDblClick={onRowDblClick}
                onRowPrepared={onRowPrepared}
            >
                <Pager allowedPageSizes={[10, 15, 30, 50]} showPageSizeSelector={true} showInfo={true} />
                <Paging defaultPageSize={15} />
                <SearchPanel visible={true} width={250} />
                <FilterRow visible={true} />
                <ColumnChooser enabled={true} />
                <Export enabled={true} fileName={title} allowExportSelectedData={true} />
                <Column type="buttons">
                    <ButtonGrid name="ver" text="Ver" onClick={e => openDialog(e.row.data.id, false)}/>
                    <ButtonGrid name="modificar" text="Editar" onClick={e => openDialog(e.row.data.id, true)}/>
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

const mapDispatchToPros = ({
    updateServicio
});

export default connect(null, mapDispatchToPros)(Servicios);

