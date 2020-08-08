import React from 'react';
import { Popup, Button } from 'devextreme-react';
import Form, { SimpleItem, GroupItem, Label } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStoreLocal } from '../../../utils/proxy';
import { Column, SearchPanel, Lookup, Editing, RequiredRule, StringLengthRule, Scrolling, Button as ButtonGrid }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import uri from '../../../utils/uri';
import { customizeTextAsPercent, cellRender, formatId } from '../../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultFactura, defaultFacturasDetalle } from '../../../data/factura';
import { updateFactura } from '../../../store/factura/facturaActions';
import Resumen from '../../shared/Resumen';
import { formaPago } from '../../../data/catalogos';
import InventarioDDBComponent from './InventarioDDBComponent';

class Nuevo extends React.Component {
  constructor(props) {
    super(props);

    this.refFacturaDetalle = null;
    this.btn = null;

    this.onShowing = this.onShowing.bind(this);
    this.onHiding = this.onHiding.bind(this);
    this.onRowInserted = this.onRowInserted.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.onCellPrepared = this.onCellPrepared.bind(this);
    this.setCellValue = this.setCellValue.bind(this);
    this.setCellValueFromInv = this.setCellValue.bind(this, "inventarioId");
    this.setCellValueFromCant = this.setCellValue.bind(this, "cantidad");
    this.setCellValueFromDesc = this.setCellValue.bind(this, "descuentoAverage");
    this.onRowRemoved = this.onRowRemoved.bind(this);
    this.calculateResumen = this.calculateResumen.bind(this);
    this.onRowInserting = this.onRowInserting.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      factura: Object.assign({}, defaultFactura),
      facturasDetalle: [],
      saving: false,
      esCredito : false
    };

    this.storeTransient = {
      inventario: [],
      salidaEstado: [],
      cliente: [],
      formaPago: [],
      tipoPago: []
    }



  }

  onRowRemoved(e) {
    this.calculateResumen();
  }

  onRowInserted(e) {
    this.calculateResumen();

    let detalle = this.refFacturaDetalle.instance.option('dataSource');

    if (detalle.filter(x => x.inventarioId == undefined).length == 0) {
      e.component.saveEditData();
      e.component.addRow();
    }

    let row = 0;
    let pending = detalle.find(x => x.inventarioId == undefined);
    if (pending)
      row = this.refFacturaDetalle.instance.getRowIndexByKey(pending);
    let element = this.refFacturaDetalle.instance.getCellElement(row, 0);
    this.refFacturaDetalle.instance.focus(element);
    this.refFacturaDetalle.instance.editCell(row, 0);

  }

  onRowInserting(e) {

    if (e.data.inventarioId == undefined) {
      e.cancel = true;
      e.component.cancelEditData();
    }
    else {
      e.data = { ...defaultFacturasDetalle, ...e.data };
    }

  }

  onRowUpdated(e) {
    this.calculateResumen();
  }

  onShowing(e) {
    const { factura } = this.props;

    console.log(defaultFactura);

    if (factura.id > 0) {
      http(uri.salidas.getById(factura.id)).asGet().then(r => {
        this.setState({
          factura: {
            ...r
          },
          facturasDetalle: r.salidasDetalle,
        })
      })
    } else {      
      this.setState({
        factura: Object.assign({}, defaultFactura),
        facturasDetalle: []
      });
    }

  }

  onHiding({ cancel }) {

    this.refFactura.instance.resetValues();

    this.refFacturaDetalle.instance.saveEditData();

    let { updateFactura } = this.props;

    updateFactura({
      id: 0,
      open: false
    });

    if (cancel) {

      let { onSave } = this.props;
      onSave();

    }

  }

  save() {

    let isValid = true;

    let result = this.refFactura.instance.validate();
    isValid = result.isValid;

    console.log(formaPago);

    let factura = this.refFactura.instance.option('formData');
    if (factura.formaPagoId == formaPago.credito && (factura.plazoCredito == '' || factura.plazoCredito <= 0)) {
      isValid = false;
      notify({ message: "Cuando la forma de pago es crédito debe ingresar el plazo de crédito" }, 'error');
    }

    if(factura.formaPagoId == formaPago.credito)
      factura.tipoPagoId = null;

    console.log(factura.tipoPagoId);
    
    if(factura.formaPagoId == formaPago.contado && (factura.tipoPagoId == 0 || factura.tipoPagoId == null)){
      isValid = false;
      notify({ message: "Debe ingresar el tipo de pago" }, 'error');
    }

    let detalle = this.refFacturaDetalle.instance.option('dataSource');
    if (detalle.length == 0) {

      isValid = false;
      notify({ message: "Debe ingresar al menos un producto" }, 'error');

    }    

    if (isValid) {

      factura.salidasDetalle = detalle;
      this.setState({ saving: true });

      http(uri.salidas.asFactura).asPost(factura).then(r => {

        notify({ message: "Registro guardado correctamente" });
        this.setState({ saving: false });
        this.onHiding({ cancel: true });

      }).catch(message => {
        this.setState({ saving: false });
        notify({ message }, 'error');
      });
    }

  }

  calculateResumen() {

    let currentDetalle = this.refFacturaDetalle.instance.option('dataSource');

    this.setState({
      factura: {
        ...this.state.factura,
        ...{
          subTotal: currentDetalle.sum('subTotal'),
          descuento: currentDetalle.sum('subTotal') - currentDetalle.sum('importe'),
          iva: currentDetalle.sum('ivaMonto'),
          total: currentDetalle.sum('total')
        }
      }
    })

  }

  onCellPrepared(e) {
    if (e.rowType == 'data') {
      if (['cantidad', 'costo', 'descuentoAverage'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-editable');

      if (['total'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-bold');
    }
  }


  setCellValue(prop, newData, value, currentRowData) {


    let detalle = { ...defaultFacturasDetalle, ...currentRowData };

    if (prop == "inventarioId") {
      let inventario = this.storeTransient.inventario.find(x => x.id == value);
      if (inventario) {
        detalle.precio = inventario.precio;
        detalle.ivaAverage = inventario.iva ? 0.15 : 0;
      }
    }

    newData[prop] = value || 0;
    detalle[prop] = newData[prop];

    newData.precio = detalle.precio;
    newData.subTotal = detalle.cantidad * detalle.precio;
    newData.importe = newData.subTotal - (newData.subTotal * detalle.descuentoAverage / 100);
    newData.ivaAverage = detalle.ivaAverage
    newData.ivaMonto = newData.importe * newData.ivaAverage;
    newData.total = newData.importe + newData.ivaMonto;

  }

  render() {

    const { factura: { editable, open, id } } = this.props;

    return (
      <div id="container">

        <Popup
          width={850}
          height={550}
          title={`Factura ${formatId(this.state.factura.numero)}`}
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={open}
        >
          <Form formData={this.state.factura} ref={ref => this.refFactura = ref}>
            <GroupItem cssClass="second-group" colCount={3}>

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

              <SimpleItem dataField="clienteId" colSpan={2}
                editorType="dxSelectBox"
                editorOptions={{
                  disabled: !editable,
                  dataSource: createStoreLocal({ name: 'clientes', local: this.storeTransient }),
                  valueExpr: "id",
                  displayExpr: "nombre",
                  searchEnabled: true
                }} >
                <Label text="Cliente" />
                <RequiredRule message="Seleccione el cliente" />
              </SimpleItem>           
              
              <SimpleItem dataField="plazoCredito"
                editorType="dxNumberBox"
                editorOptions={{
                  disabled: !editable
                }} >
              </SimpleItem>

              <SimpleItem dataField="formaPagoId"
                editorType="dxSelectBox"
                editorOptions={{
                  disabled: !editable,
                  dataSource: createStoreLocal({ name: 'formaPago', local: this.storeTransient }),
                  valueExpr: "id",
                  displayExpr: "descripcion",
                  onValueChanged: item => {

                    this.setState({ esCredito : item.value == formaPago.credito })                     

                  } 
                }} >
                <Label text="Forma de pago" />
                <RequiredRule message="Seleccione la forma de pago" />
              </SimpleItem>

              <SimpleItem dataField="tipoPagoId"
                editorType="dxSelectBox"
                editorOptions={{
                  disabled: !editable || this.state.esCredito,
                  dataSource:  this.state.esCredito ? [] : createStoreLocal({ name: 'tipoPago', local: this.storeTransient }),
                  valueExpr: "id",
                  displayExpr: "descripcion"
                }} >
                <Label text="Tipo de pago" />
              </SimpleItem>
              
            </GroupItem>
            <GroupItem colCount={3}>
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
                id="gridFacturasDetalle"
                height={280}
                ref={(ref) => this.refFacturaDetalle = ref}
                dataSource={this.state.facturasDetalle}
                selection={{ mode: 'single' }}
                showBorders={true}
                showRowLines={false}
                allowColumnResizing={true}
                allowColumnReordering={true}
                onRowInserted={this.onRowInserted}
                onRowUpdated={this.onRowUpdated}
                onCellPrepared={this.onCellPrepared}
                onRowInserting={this.onRowInserting}
                onRowRemoved={this.onRowRemoved}
                hoverStateEnabled={true}
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
                <Column dataField="inventarioId" caption="Inventario" cssClass='cellDetail'
                  editCellComponent={InventarioDDBComponent}
                  setCellValue={this.setCellValueFromInv}>
                  <Lookup
                    dataSource={createStoreLocal({ name: 'inventario', local: this.storeTransient, url: 'inventario/por-area' })}
                    valueExpr="id"
                    displayExpr={item => item ? `${item.numero} - ${item.nombre}` : ''}
                  >
                  </Lookup>
                </Column>
                <Column dataField="cantidad" caption="Cant" dataType="number" width={60} setCellValue={this.setCellValueFromCant}></Column>
                <Column dataField="precio" width={70} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="subTotal" width={80} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="descuentoAverage" caption="Desc" width={70} dataType="number" customizeText={customizeTextAsPercent} setCellValue={this.setCellValueFromDesc}></Column>
                <Column dataField="importe" width={80} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="ivaAverage" width={70} visible={false} allowEditing={false} dataType="number"></Column>
                <Column dataField="ivaMonto" caption="Iva" width={70} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="total" width={90} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column type="buttons" width={50}>
                  <ButtonGrid name="delete" />
                </Column>
              </DataGrid>
            </GroupItem>
            <GroupItem colCount={1}>
              <div className="resumen">
                <Resumen title="Sub total" value={this.state.factura.subTotal} />
                <Resumen title="Descuento" value={this.state.factura.descuento} />
                <Resumen title="Iva" value={this.state.factura.iva} />
                <Resumen title="Total" value={this.state.factura.total} />
              </div>
            </GroupItem>
          </Form>
          <Button
            ref={ref => this.btn = ref}
            visible={editable}
            width={120}
            text={this.state.saving ? 'Guardando' : 'Guardar'}
            type="success"
            icon="save"
            stylingMode="contained"
            className="m-1"
            onClick={this.save}
            disabled= {this.state.saving}
          />
        </Popup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  factura: state.factura
});

const mapDispatchToPros = ({
  updateFactura
});

export default connect(mapStateToProps, mapDispatchToPros)(Nuevo);
