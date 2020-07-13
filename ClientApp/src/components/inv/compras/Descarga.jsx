import React from 'react';
import { Popup, Button } from 'devextreme-react';
import Form, { SimpleItem, GroupItem, Label } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStore } from '../../../utils/proxy';
import { Column, SearchPanel, Lookup, Editing, RequiredRule, StringLengthRule, Scrolling }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import uri from '../../../utils/uri';
import { customizeTextAsPercent, cellRender, formatId } from '../../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultCompra, defaultComprasDetalle } from '../../../data/compra';
import { updateCompra } from '../../../store/compra/compraActions';
import Resumen from '../../shared/Resumen';

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
    this.setCellValueFromCant = this.setCellValue.bind(this, "cantidadRecibida");
    this.setCellValueFromCosto = this.setCellValue.bind(this, "costo");
    this.setCellValueFromDesc = this.setCellValue.bind(this, "descuentoAverage");
    this.calculateResumen = this.calculateResumen.bind(this);
    this.onRowInserting = this.onRowInserting.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      compra: Object.assign({}, defaultCompra),
      comprasDetalle: []
    };

  }

  onRowInserted(e) {
    this.calculateResumen();

    let detalle = this.refComprasDetalle.instance.option('dataSource');

    if (detalle.filter(x => x.inventarioId == undefined).length == 0) {
      e.component.saveEditData()
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

    if (e.data.inventarioId == undefined){
      e.cancel = true;
      e.component.cancelEditData();
    }   

  }

  onRowUpdated(e) {
    this.calculateResumen();
  }

  onShowing(e) {
    const { compra } = this.props;

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
        compra: Object.assign({}, defaultCompra),
        comprasDetalle: []
      });
    }

  }

  onHiding({ cancel }) {

    this.setState({
      compra: Object.assign({}, defaultCompra),
      comprasDetalle: []
    });

    this.refComprasDetalle.instance.saveEditData();

    let { updateCompra } = this.props;

    updateCompra({
      id: 0,
      descarga: false
    });

    if (cancel) {

      let { onSave } = this.props;
      onSave();

    }

  }

  save() {

    var result = this.refCompra.instance.validate();
    if (result.isValid) {
      let detalle = this.refComprasDetalle.instance.option('dataSource');
      let compra = this.refCompra.instance.option('formData');

      if (detalle.length != 0) {

        compra.comprasDetalle = detalle;

        http(uri.compras.descargar).asPost(compra).then(r => {
          notify({ message: "Registro guardado correctamente" });
          this.onHiding({ cancel: true });

        });
      } 
      else
        notify({ message: "Debe de registrar al menos un productp" }, 'error');
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
      if (['cantidadRecibida', 'costo', 'descuentoAverage'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-editable');

      if (['total'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-bold');

      if (['nuevoPrecio'].includes(e.column.dataField))
        e.cellElement.classList.add('cell-price');
    }
  }

  setCellValue(prop, newData, value, currentRowData) {

    let detalle = { ...defaultComprasDetalle, ...currentRowData };

    newData[prop] = value || 0;
    detalle[prop] = newData[prop];

    newData.subTotal = detalle.cantidadRecibida * detalle.costo;
    newData.importe = newData.subTotal - (newData.subTotal * detalle.descuentoAverage / 100);
    newData.ivaAverage = 0.15;
    newData.ivaMonto = newData.importe * newData.ivaAverage;
    newData.total = newData.importe + newData.ivaMonto;

  }

  addMenuItems(e) {
    if(e.row)
    if (e.row.rowType == "data") {
        // e.items can be undefined
        if (!e.items) e.items = [];

        // Add a custom menu item
        e.items.push({
          text: 'Igualar todas cantidades',
          icon: 'increaseindent',
          onItemClick: () => {
              console.log(e.column.caption);
          }
      });
    }
}

  render() {

    const { compra: { editable, descargar: open, id } } = this.props;

    return (
      <div id="container">

        <Popup
          width={1000}
          height={550}
          title={`Descargar orden ${formatId(id)}`}
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={open}
        >
          <Form formData={this.state.compra} ref={ref => this.refCompra = ref}>
            <GroupItem cssClass="second-group" colCount={3}>
              <SimpleItem dataField="estadoId"
                editorType="dxSelectBox" editorOptions={{
                  readOnly: !editable,
                  dataSource: createStore('compraEstado'), valueExpr: "id", displayExpr: "descripcion"
                }} >
                <RequiredRule message="Seleccione el estado" />
                <Label text="Estado" />
              </SimpleItem>
              <SimpleItem
                dataField="fecha"
                editorType="dxDateBox"
                editorOptions={{
                  readOnly: !editable,
                  displayFormat: "dd/MM/yyyy"
                }}
              >
                <RequiredRule message="Seleccione la fecha" />
              </SimpleItem>
              <SimpleItem dataField="plazoCredito"
                editorType="dxNumberBox"
                editorOptions={{
                  readOnly: !editable
                }} >
              </SimpleItem>
              <SimpleItem dataField="formaPagoId"
                editorType="dxSelectBox"
                editorOptions={{
                  readOnly: !editable,
                  dataSource: createStore('formaPago'),
                  valueExpr: "id",
                  displayExpr: "descripcion"
                }} >
                <Label text="Forma de pago" />
                <RequiredRule message="Seleccione la forma de pago" />
              </SimpleItem>
              <SimpleItem dataField="proveedorId"
                editorType="dxSelectBox"
                editorOptions={{
                  readOnly: !editable,
                  dataSource: createStore('proveedores'),
                  valueExpr: "id",
                  displayExpr: "nombre"
                }} >
                <Label text="Proveedor" />
                <RequiredRule message="Seleccione el proveedor" />
              </SimpleItem>
              <SimpleItem dataField="referencia">
                <StringLengthRule max={50} message="Maximo 50 caracteres" />
              </SimpleItem>

            </GroupItem>
            <GroupItem colCount={3}>
              <SimpleItem dataField="observacion"
                colSpan={3}>
                <StringLengthRule max={250} message="Maximo 250 caracteres" />
              </SimpleItem>
            </GroupItem>

            <GroupItem>
              <DataGrid
                id="gridComprasDetalle"
                height={280}
                ref={(ref) => this.refComprasDetalle = ref}
                dataSource={this.state.comprasDetalle}
                selection={{ mode: 'single' }}
                showBorders={true}
                showRowLines={false}
                allowColumnResizing={true}
                allowColumnReordering={true}
                onRowInserted={this.onRowInserted}
                onRowInserting={this.onRowInserting}
                onRowUpdated={this.onRowUpdated}
                onCellPrepared={this.onCellPrepared}
                onContextMenuPreparing={this.addMenuItems}
                hoverStateEnabled={true}
              >
                <Scrolling mode="virtual" />
                <SearchPanel visible={true} />
                <Editing
                  mode="cell"
                  allowAdding={editable}
                  allowDeleting={editable}
                  allowUpdating={true}
                  selectTextOnEditStart={true}
                  useIcons={true}
                />
                <Column dataField="inventarioId" caption="Inventario" cssClass='cellDetail' fixed={true}>
                  <Lookup
                    dataSource={createStore('inventario')}
                    valueExpr="id"
                    displayExpr={item => item ? `${item.numero} - ${item.nombre}` : ''}
                  >
                  </Lookup>
                </Column>
                <Column dataField="cantidadSolicitada" allowEditing={false} caption="Cant. Soli" dataType="number" width={75}></Column>
                <Column dataField="cantidadRecibida" caption="Cant. Rec" dataType="number" width={75} setCellValue={this.setCellValueFromCant}></Column>
                <Column dataField="costo" width={70} dataType="number" setCellValue={this.setCellValueFromCosto}></Column>
                <Column dataField="subTotal" width={80} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="descuentoAverage" caption="Desc" width={70} dataType="number" customizeText={customizeTextAsPercent} setCellValue={this.setCellValueFromDesc}></Column>
                <Column dataField="importe" width={75} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="ivaAverage" width={70} visible={false} allowEditing={false} dataType="number"></Column>
                <Column dataField="ivaMonto" caption="Iva" width={70} allowEditing={false} dataType="number" cellRender={cellRender}></Column>
                <Column dataField="total" width={85} allowEditing={false} dataType="number" cellRender={cellRender}></Column>               
                <Column dataField="ultimoPrecio" caption="Ult Precio" allowEditing={false} width={70} dataType="number" cellRender={cellRender}></Column>               
                <Column dataField="nuevoPrecio" caption="Nvo Precio" width={70} dataType="number" cellRender={cellRender}></Column>   
              </DataGrid>
            </GroupItem>
            <GroupItem colCount={1}>
              <div className="resumen">
                <Resumen title="Sub total" value={this.state.compra.subTotal} />
                <Resumen title="Descuento" value={this.state.compra.descuento} />
                <Resumen title="Iva" value={this.state.compra.iva} />
                <Resumen title="Total" value={this.state.compra.total} />
              </div>
            </GroupItem>
          </Form>
          <Button
            width={120}
            text="Guardar"
            type="success"
            icon="save"
            stylingMode="contained"
            className="m-1"
            onClick={this.save}
          />
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
