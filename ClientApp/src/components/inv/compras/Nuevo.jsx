import React from 'react';
import { Popup, Button } from 'devextreme-react';
import Form, { SimpleItem, GroupItem } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStore, createCustomStore } from '../../../utils/proxy';
import { Column, SearchPanel, Lookup, Editing, Summary, TotalItem, RequiredRule, StringLengthRule, Scrolling }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import uri from '../../../utils/uri';
import { getTicks, cellRender } from '../../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultCompra } from '../../../data/compra';
import moment from 'moment';
import numeral from 'numeral';
import { updateCompra } from '../../../store/compra/compraActions';

class Nuevo extends React.Component {
  constructor(props) {
    super(props);

    this.onShowing = this.onShowing.bind(this);
    this.onHiding = this.onHiding.bind(this);
    this.onRowInserting = this.onRowInserting.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);

    this.state = {
      compra: Object.assign({}, defaultCompra),
      compraDetalle: []
    };
    
  }

  onRowInserting(e) {  

  }

  onRowUpdated(e) { 

  }

  onShowing(e) {   

  }

  onHiding({ cancel }) {

    let { updateCompra } = this.props;

    updateCompra({
      id: 0,
      open: false
    });

  }

  render() {

    const { compra : { editable, open, id }} = this.props;

    return (
      <div id="container">

        <Popup
          width={800}
          height={550}
          title="afasd"
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={open}
        >
          <Form formData={this.state.compra}>       
            <GroupItem cssClass="second-group" colCount={3}>
              <SimpleItem dataField="estadoId"
                label= {{text: "Estado"}}
                editorType="dxSelectBox" editorOptions={{
                  disabled: !editable,
                  dataSource: createStore('compraEstado'), valueExpr: "id", displayExpr: "descripcion"
                }} >
                <RequiredRule message="Seleccione el estado" />
              </SimpleItem>
              <SimpleItem
                dataField="fecha"
                editorType="dxDateBox"
                editorOptions={{
                  disabled: !editable,
                  displayFormat: "dd/MM/yyyy"
                }}
              >
                <RequiredRule message="Seleccione la fecha" />
              </SimpleItem>
              <SimpleItem dataField="plazoCredito" 
                editorType="dxNumberBox"
                editorOptions={{
                  disabled: !editable
                }} >                
              </SimpleItem>           
              <SimpleItem dataField="formaPagoId"
                label= {{text: "Forma de pago"}}
                editorType="dxSelectBox"
                editorOptions={{
                  disabled: !editable,
                  dataSource: createStore('formaPago'), 
                  valueExpr: "id", 
                  displayExpr: "descripcion"
                }} >
                <RequiredRule message="Seleccione la forma de pago" />
              </SimpleItem>
              <SimpleItem dataField="proveedorId"
                label= {{text: "Proveedor"}}
                editorType="dxSelectBox"
                editorOptions={{
                  disabled: !editable,
                  dataSource: createStore('proveedores'), 
                  valueExpr: "id", 
                  displayExpr: "nombre"
                }} >
                <RequiredRule message="Seleccione el proveedor" />
              </SimpleItem>
              <SimpleItem dataField="referencia" 
                editorOptions={{
                  disabled: !editable
                }} >
                <StringLengthRule max={50} message="Maximo 50 caracteres" />
              </SimpleItem>               
                  
            </GroupItem>
            <GroupItem cssClass="first-group" colCount={3}>
              <SimpleItem dataField="observacion" 
                colSpan={3} 
                editorOptions={{
                  disabled: !editable
                }} >
                <StringLengthRule max={250} message="Maximo 250 caracteres" />
              </SimpleItem>
            </GroupItem>

            <GroupItem>
              <DataGrid
                id="gridCompraDetalle"
                height={250}
                ref={(ref) => this.refCompraDetalle = ref}
                dataSource={this.state.compraDetalle}
                selection={{ mode: 'single' }}
                showBorders={true}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}
                onRowInserting={this.onRowInserting}
                onRowInserted={this.onRowInserted}
                onRowUpdated={this.onRowUpdated}
                onRowUpdating={this.onRowUpdating}
                onCellPrepared={this.onRowPrepared}
              >
                <Scrolling mode="virtual" />
                <SearchPanel visible={true} />
                <Editing
                  mode="cell"
                  allowAdding={editable}
                  allowDeleting={editable}
                  allowUpdating={editable}
                  selectTextOnEditStart={editable}
                  useIcons={editable}
                />
                <Column dataField="inventarioId" cssClass='cellDetail'>
                  <Lookup
                    dataSource={createStore('inventario')}
                    valueExpr="id"
                    displayExpr={item => item ? `${item.numero} - ${item.nombre}` : ''}
                  >
                  </Lookup>
                </Column>               
                <Column dataField="cantidadSolicitada" width={50}></Column>
                <Column dataField="costo" width={50}></Column>
                <Column dataField="subTotal" width={50}></Column>
                <Column dataField="DescuentoAverage" caption="Desc" width={50}></Column>
                <Column dataField="importe" width={50}></Column>
                <Column dataField="iva" width={50}></Column>
                <Column dataField="total" width={50}></Column>
                <Column dataField="debe" width={90} cssClass="col-debe" dataType="number" cellRender={cellRender} />
                <Column dataField="haber" width={90} cssClass="col-debe" dataType="number" cellRender={cellRender} />
                <Summary recalculateWhileEditing={true}>
                  <TotalItem
                    column="total"
                    summaryType="sum"
                    customizeText={cellRender}
                    valueFormat="currency" cssClass="col-summary-ok" />                
                </Summary>
              </DataGrid>
            </GroupItem>
          </Form>
        </Popup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  compra: state.compra
});

const mapDispatchToPros = ({
  updateCompra
});

export default connect(mapStateToProps, mapDispatchToPros)(Nuevo);
