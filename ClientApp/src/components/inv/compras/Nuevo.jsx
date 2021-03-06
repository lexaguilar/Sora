import React from 'react';
import { Popup, Button } from 'devextreme-react';
import Form, { SimpleItem, GroupItem, Label, AsyncRule } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStore, createStoreLocal } from '../../../utils/proxy';
import { Column, SearchPanel, Lookup, Editing, RequiredRule, StringLengthRule, Scrolling, Button as ButtonGrid }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import uri from '../../../utils/uri';
import { customizeTextAsPercent, cellRender, formatId, formatToMoney } from '../../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultCompra, defaultComprasDetalle } from '../../../data/compra';
import { updateCompra } from '../../../store/compra/compraActions';
import Resumen from '../../shared/Resumen';
import { formaPago } from '../../../data/catalogos';
import { editorOptionsSelect } from '../../../data/app';

class Nuevo extends React.Component {
  constructor(props) {
    super(props);

    this.refComprasDetalle = null;

    this.onShowing = this.onShowing.bind(this);
    this.onHiding = this.onHiding.bind(this);
    this.onRowInserted = this.onRowInserted.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.onCellPrepared = this.onCellPrepared.bind(this);
    this.setCellValue = this.setCellValue.bind(this);
    this.setCellValueFromCant = this.setCellValue.bind(this, "cantidadSolicitada");
    this.setCellValueFromCosto = this.setCellValue.bind(this, "costo");
    this.setCellValueFromDesc = this.setCellValue.bind(this, "descuentoAverage");
    this.onRowRemoved = this.onRowRemoved.bind(this);
    this.calculateResumen = this.calculateResumen.bind(this);
    this.onRowInserting = this.onRowInserting.bind(this);
    this.save = this.save.bind(this);
    this.validationCallback = this.validationCallback.bind(this);
    this.validationTipoPago = this.validationTipoPago.bind(this);

    this.state = {
      compra: { ...defaultCompra },
      comprasDetalle: [],
      monedaId: 0,
      saving: false,
      esCredito: false
    };

    this.storeTransient = {
      inventario: [],
      compraEstado: [],
      proveedores: [],
      formaPago: [],
      tipoPago: [],
      moneda: []
    }

  }

  onRowRemoved(e) {
    this.calculateResumen();
  }

  onRowInserted(e) {
    this.calculateResumen();

    let detalle = this.refComprasDetalle.instance.option('dataSource');

    if (detalle.filter(x => x.inventarioId == undefined).length == 0) {
      e.component.saveEditData();
      e.component.addRow();
    }

    let row = 0;
    let pending = detalle.find(x => x.inventarioId == undefined);
    if (pending)
      row = this.refComprasDetalle.instance.getRowIndexByKey(pending);
    let element = this.refComprasDetalle.instance.getCellElement(row, 0);
    this.refComprasDetalle.instance.focus(element);
    this.refComprasDetalle.instance.editCell(row, 0);

  }

  onRowInserting(e) {

    if (e.data.inventarioId == undefined) {
      e.cancel = true;
      e.component.cancelEditData();
    }
    else {
      e.data = { ...defaultComprasDetalle, ...e.data };
    }

  }

  onRowUpdated(e) {
    this.calculateResumen();
  }

  onShowing(e) {
    const { compra, app } = this.props;

    if (compra.id > 0) {
      http(uri.compras.getById(compra.id)).asGet().then(r => {
        this.setState({
          compra: {
            ...r
          },
          comprasDetalle: r.comprasDetalle,
        })
      })
    } else {
      this.setState({
        compra: { ...defaultCompra, ...{ monedaId: app.monedaId } },
        comprasDetalle: []
      });
    }

  }

  onHiding({ cancel }) {

    this.refCompra.instance.resetValues();

    this.refComprasDetalle.instance.saveEditData();

    let { updateCompra } = this.props;

    updateCompra({
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

    let result = this.refCompra.instance.validate();
    isValid = result.isValid;

    let compra = this.refCompra.instance.option('formData');
    if (compra.formaPagoId == formaPago.credito && (compra.plazoCredito == '' || compra.plazoCredito <= 0)) {
      isValid = false;
      notify({ message: "Cuando la forma de pago es crédito debe ingresar el plazo de crédito" }, 'error');
    }

    if (compra.formaPagoId == formaPago.credito)
      compra.tipoPagoId = null;

    if (compra.formaPagoId == formaPago.contado)
      compra.plazoCredito = 0;

    if (compra.formaPagoId == formaPago.contado && (compra.tipoPagoId == 0 || compra.tipoPagoId == null)) {
      isValid = false;
      notify({ message: "Debe ingresar el tipo de pago" }, 'error');
    }

    let detalle = this.refComprasDetalle.instance.option('dataSource');
    if (detalle.length == 0) {

      isValid = false;
      notify({ message: "Debe ingresar al menos un producto" }, 'error');

    }

    if (isValid) {

      compra.comprasDetalle = detalle;
      this.setState({ saving: true });

      http(uri.compras.insert).asPost(compra).then(r => {

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

    let currentDetalle = this.refComprasDetalle.instance.option('dataSource');

    this.setState({
      compra: {
        ...this.state.compra,
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
      if (['cantidadSolicitada', 'costo', 'descuentoAverage'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-editable');

      if (['total'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-bold');
    }
  }

  setCellValue(prop, newData, value, currentRowData) {

    let detalle = { ...defaultComprasDetalle, ...currentRowData };

    newData[prop] = value || 0;
    detalle[prop] = newData[prop];

    newData.subTotal = detalle.cantidadSolicitada * detalle.costo;
    newData.importe = newData.subTotal - (newData.subTotal * detalle.descuentoAverage / 100);
    newData.ivaAverage = 0.15;
    newData.ivaMonto = newData.importe * newData.ivaAverage;
    newData.total = newData.importe + newData.ivaMonto;

  }

  onValueChanged = e => {

    this.setState({
      monedaId: e.value
    });

  }

  validationCallback(params) {
    return new Promise(resolve => {

      if (this.refCompra) {
        
        let compra = this.refCompra.instance.option('formData')
        
        let result = compra.formaPagoId == formaPago.credito && params.value > 0;
        resolve(result);
      }
      resolve(true);
    })

  }

  validationTipoPago(params) {

    return new Promise(resolve => {

      if (this.refCompra) {
        let compra = this.refCompra.instance.option('formData')
        
        let result = compra.formaPagoId == formaPago.contado && parseInt(params.value) > 0;
        resolve(result);
      }

      resolve(true)
    });

  }

  render() {

    const { compra: { editable, open, id }, app } = this.props;

    return (
      <div id="container">

        <Popup
          width={850}
          height={550}
          title={`Orden de compra ${formatId(id)}`}
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={open}
        >
          <Form formData={this.state.compra} ref={ref => this.refCompra = ref}>
            <GroupItem cssClass="second-group" colCount={3}>
              <SimpleItem dataField="estadoId"
                editorType="dxSelectBox" editorOptions={{
                  ...editorOptionsSelect,
                  ...{ disabled: !editable, dataSource: createStoreLocal({ name: 'compraEstado', local: this.storeTransient }) }
                }} >
                <RequiredRule message="Seleccione el estado" />
                <Label text="Estado" />
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
              <SimpleItem dataField="referencia"
                editorOptions={{
                  disabled: !editable
                }} >
                <StringLengthRule max={50} message="Maximo 50 caracteres" />
              </SimpleItem>

              <SimpleItem dataField="formaPagoId"
                editorType="dxSelectBox"
                editorOptions={{
                  ...editorOptionsSelect,
                  ...{
                    disabled: !editable, dataSource: createStoreLocal({ name: 'formaPago', local: this.storeTransient }),
                    onValueChanged: item => {

                      this.setState({ esCredito: item.value == formaPago.credito })

                    }
                  }
                }} >
                <Label text="Forma de pago" />
                <RequiredRule message="Seleccione la forma de pago" />
              </SimpleItem>
              <SimpleItem dataField="tipoPagoId"
                editorType="dxSelectBox"
                editorOptions={{
                  ...editorOptionsSelect,
                  ...{ disabled: !editable || this.state.esCredito, dataSource: createStoreLocal({ name: 'tipoPago', local: this.storeTransient }) }
                }} >
                <Label text="Tipo de pago" />
                <AsyncRule
                  message="El tipo de pago es requerido"
                  validationCallback={this.validationTipoPago} />
              </SimpleItem>

              <SimpleItem dataField="plazoCredito"
                editorType="dxNumberBox"
                editorOptions={{
                  disabled: !editable || !this.state.esCredito
                }} >
                <Label text="Dias crédito" />
                <AsyncRule
                  message="Los dias de plazo son requerido"
                  validationCallback={this.validationCallback} />
              </SimpleItem>

            </GroupItem>
            <GroupItem colCount={3}>
              <SimpleItem dataField="monedaId"
                editorType="dxSelectBox"
                editorOptions={{
                  ...editorOptionsSelect,
                  ...{ disabled: !editable, dataSource: app.moneda, onValueChanged: this.onValueChanged }
                }} >
                <Label text="Moneda" />
                <RequiredRule message="Seleccione la moneda" />
              </SimpleItem>
              <SimpleItem dataField="proveedorId"
                colSpan={2}
                editorType="dxSelectBox"
                editorOptions={{
                  valueExpr: "id", displayExpr: "nombre",
                  searchEnabled: true,
                  disabled: !editable, dataSource: createStoreLocal({ name: 'proveedores', local: this.storeTransient })
                }} >
                <Label text="Proveedor" />
                <RequiredRule message="Seleccione el proveedor" />
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
                id="gridComprasDetalle"
                height={250}
                ref={(ref) => this.refComprasDetalle = ref}
                dataSource={this.state.comprasDetalle}
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
                <Column dataField="inventarioId" caption="Inventario" cssClass='cellDetail' >
                  <Lookup
                    dataSource={createStoreLocal({ name: 'inventario', local: this.storeTransient })}
                    valueExpr="id"
                    displayExpr={item => item ? `${item.numero} - ${item.nombre}` : ''}
                  >
                  </Lookup>
                </Column>
                <Column dataField="cantidadSolicitada" caption="Cant" dataType="number" width={60} setCellValue={this.setCellValueFromCant}></Column>
                <Column dataField="costo" width={70} dataType="number" setCellValue={this.setCellValueFromCosto} cellRender={cellRender}></Column>
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
                <Resumen title="Sub total" value={this.state.compra.subTotal} monedaId={this.state.compra.monedaId} />
                <Resumen title="Descuento" value={this.state.compra.descuento} monedaId={this.state.compra.monedaId} />
                <Resumen title="Iva" value={this.state.compra.iva} monedaId={this.state.compra.monedaId} />
                <Resumen title="Total" value={this.state.compra.total} monedaId={this.state.compra.monedaId} />
              </div>
            </GroupItem>
          </Form>
          <Button
            visible={editable}
            width={120}
            text={this.state.saving ? 'Guardando' : 'Guardar'}
            type="success"
            icon="save"
            stylingMode="contained"
            className="m-1"
            onClick={this.save}
            disabled={this.state.saving}
          />
        </Popup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  compra: state.compra,
  app: state.appInfo
});

const mapDispatchToPros = ({
  updateCompra
});

export default connect(mapStateToProps, mapDispatchToPros)(Nuevo);
