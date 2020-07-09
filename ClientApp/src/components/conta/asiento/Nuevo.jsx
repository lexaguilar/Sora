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
import { defaultComprobante } from '../../../data/comprobante';
import moment from 'moment';
import numeral from 'numeral';
import { updateAsiento } from '../../../store/asiento/asientoActions';

class Nuevo extends React.Component {
  constructor(props) {
    super(props);

    this.refAsiento = null;
    this.refAsientosDetalle = [];
    this.centroCostos = [];

    this.onShowing = this.onShowing.bind(this);
    this.onHiding = this.onHiding.bind(this);
    this.save = this.save.bind(this);
    this.obtTasaCambio = this.obtTasaCambio.bind(this);
    this.onRowInserting = this.onRowInserting.bind(this);
    this.onRowInserted = this.onRowInserted.bind(this);
    //this.onRowUpdating = this.onRowUpdating.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.getFilteredCentroCosto = this.getFilteredCentroCosto.bind(this);
    this.state = {
      loading: true,
      comprobante: Object.assign({}, defaultComprobante),
      comprobanteDetalle: []
    };
  }

  componentDidMount() {
    http('centrocosto/get').asGet().then(cc => this.centroCostos = cc);
  }

  getFilteredCentroCosto(options) {
    return {
      store: this.centroCostos,
      filter: options.data ? ['cuenta', '=', String(options.cells[0].displayValue).substring(0, 2)] : null
    }
  }

  resetValues(e) {
    if (e.data.debe > 0)
      e.data.haber = 0;

    if (e.data.haber > 0)
      e.data.debe = 0;
  }

  onRowInserting(e) {

    if (e.data.cuentaId == undefined){
      e.cancel = true;
      e.component.cancelEditData();
    }
    else    
    this.resetValues(e);
  

  }

  onRowInserted(e) {

    this.resetValues(e);

    if (e.data.cuentaId > 0 && ((e.data.debe > 0 && e.data.haber == 0) || (e.data.debe == 0 && e.data.haber > 0))) {

      let detalle = this.refAsientosDetalle.instance.option('dataSource');
      let pending = detalle.find(x => x.cuentaId == undefined);

      let row = 0;
      if (pending)
        row = this.refAsientosDetalle.instance.getRowIndexByKey(pending);

      if (detalle.filter(x => x.cuentaId == undefined).length == 0) {
        e.component.saveEditData()
        e.component.addRow();
      }

      let element = this.refAsientosDetalle.instance.getCellElement(row, 0);
      this.refAsientosDetalle.instance.focus(element);
      this.refAsientosDetalle.instance.editCell(row, 0);

    }

  }

  onRowUpdated(e) { 

    this.onRowInserted(e);

  }

  onShowing(e) {

    this.setState({ loading: true });

    const { asiento } = this.props;
    if (asiento.id > 0) {
      http(uri.asientos.getById(asiento.id)).asGet().then(r => {
        this.setState({
          loading: false,
          comprobante: {
            id: r.id,
            numero: r.numero,
            tipoComprobanteId: r.tipoComprobanteId,
            fecha: r.fecha,
            concepto: r.concepto,
            observacion: r.observacion,
            tipoCambio: r.tipoCambio,
            referencia: r.referencia,
            monedaId: r.monedaId,
            estadoId: r.estadoId
          },
          comprobanteDetalle: r.asientosDetalle,
        })
      })
    } else {
      this.setState({
        loading: false,
        comprobante: Object.assign({}, defaultComprobante),
        comprobanteDetalle: []
      });
    }

  }

  onHiding({ cancel }) {

    this.setState({
      comprobante: Object.assign({}, defaultComprobante),
      comprobanteDetalle: []
    });

    this.refAsientosDetalle.instance.saveEditData();

    let { updateAsiento } = this.props;

    updateAsiento({
      id: 0,
      open: false
    });


    if (cancel) {

      let { onSave } = this.props;
      onSave();

    }
  }

  save() {

    const { user } = this.props;
    var result = this.refAsiento.instance.validate();
    if (result.isValid) {
      let detalle = this.refAsientosDetalle.instance.option('dataSource').filter(x => x.cuentaId > 0);

      let debe = detalle.sum('debe');
      let haber = detalle.sum('haber');

      if (debe != haber)
        notify({ message: "El comprobante no cuadra, revise los debe y haber" }, 'error')
      else if (debe == 0 && haber == 0)
        notify({ message: "Debe de registrar al menos un movimiento" }, 'error')
      else {


        let asiento = this.refAsiento.instance.option('formData');

        asiento.asientosDetalle = detalle;
        asiento.corteId = user.corteId;

        http(uri.asientos.insert).asPost(asiento).then(r => {
          notify({ message: "Registro guardado correctamente" });
          this.onHiding({ cancel: true });

        });
      }
    }

  }

  obtTasaCambio(e) {
    let v = new Date(moment(e.value).format());
    let ticks = getTicks(v);
    http(`tasaCambio/firstOrDefault/${ticks}`).asGet().then(r => {
      let asiento = this.refAsiento.instance.option('formData');
      let newState = { ...asiento, ...{ tipoCambio: r ? r.cambio : 0 } }

      this.setState({
        comprobante: Object.assign({}, newState)
      });
    })
  }

  onRowPrepared(e) {
    if (e.rowType == "totalFooter" && (e.columnIndex == 3 || e.columnIndex == 4)) {
      if (e.totalItem.summaryCells[3][0].value != e.totalItem.summaryCells[4][0].value) {
        e.cellElement.classList.remove('asiento-cuadra');
        e.cellElement.classList.add('asiento-nocuadra');
      } else {
        e.cellElement.classList.remove('asiento-nocuadra');
        e.cellElement.classList.add('asiento-cuadra');
      }
    }
  }

  render() {

    const { asiento } = this.props;
    return (
      <div id="container">

        <Popup
          width={800}
          height={550}
          title={`${asiento.id == 0 ? 'Nuevo asiento 000000' : `Comprobante ${numeral(this.state.comprobante.numero).format('000000')}`}`}
          onHiding={this.onHiding}
          onShowing={this.onShowing}
          visible={asiento.open}
        >
          <Form id="scroll" formData={this.state.comprobante} ref={(ref) => this.refAsiento = ref}>
            <GroupItem cssClass="first-group" colCount={2}>

              <GroupItem>
                <SimpleItem dataField="estadoId"
                  editorType="dxSelectBox" editorOptions={{
                    disabled: !asiento.editable,
                    dataSource: createStore('asientoEstado'), valueExpr: "id", displayExpr: "descripcion"
                  }} >
                  <RequiredRule message="Seleccione el estado" />
                </SimpleItem>
              </GroupItem>
              <GroupItem>
                <GroupItem>
                  <SimpleItem dataField="monedaId"
                    editorType="dxSelectBox" editorOptions={{
                      disabled: !asiento.editable,
                      dataSource: createStore('moneda'), valueExpr: "id", displayExpr: "descripcion"
                    }} >
                    <RequiredRule message="Seleccione el comprobante" />
                  </SimpleItem>
                </GroupItem>
              </GroupItem>
            </GroupItem>
            <GroupItem cssClass="first-group" colCount={2}>
              <GroupItem >

                <SimpleItem
                  dataField="fecha"
                  editorType="dxDateBox"
                  editorOptions={{
                    disabled: !asiento.editable,
                    displayFormat: "dd/MM/yyyy", onValueChanged: this.obtTasaCambio
                  }}
                >
                  <RequiredRule message="Seleccione la fecha" />
                </SimpleItem>
              </GroupItem>
              <GroupItem >
                <SimpleItem dataField="tipoCambio" editorType="dxNumberBox" editorOptions={{ disabled: true }}></SimpleItem>
              </GroupItem>
            </GroupItem>
            <GroupItem cssClass="second-group" colCount={2}>
              <GroupItem>
                <SimpleItem dataField="tipoComprobanteId" label={{ text: "Tipo Comprobante" }}
                  editorType="dxSelectBox" editorOptions={{
                    disabled: !asiento.editable,
                    dataSource: createStore('tipoComprobantes'), valueExpr: "id", displayExpr: "descripcion",
                  }} >
                  <RequiredRule message="Seleccione el comprobante" />
                </SimpleItem>
              </GroupItem>
              <GroupItem>
                <SimpleItem dataField="referencia" editorOptions={{
                    disabled: !asiento.editable}} >
                  <StringLengthRule max={50} message="Maximo 50 caracteres" />
                </SimpleItem>
              </GroupItem>
              <SimpleItem
                colSpan={2}
                dataField="concepto"
                editorType="dxTextArea"
                editorOptions={{
                  disabled: !asiento.editable
                }}
              >
                <RequiredRule message="Esta dato es requerido" />
                <StringLengthRule max={500} message="Maximo 500 caracteres" />
              </SimpleItem>
              <SimpleItem
                colSpan={2}
                dataField="observacion"
                editorType="dxTextArea"
                editorOptions={{
                  disabled: !asiento.editable
                }}
              >
                <StringLengthRule max={500} message="Maximo 500 caracteres" />
              </SimpleItem>
            </GroupItem>
            <GroupItem>
              <DataGrid
                id="gridAsientoDetalle"
                height={250}
                ref={(ref) => this.refAsientosDetalle = ref}
                dataSource={this.state.comprobanteDetalle}
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
                  allowAdding={asiento.editable}
                  allowDeleting={asiento.editable}
                  allowUpdating={asiento.editable}
                  selectTextOnEditStart={asiento.editable}
                  useIcons={asiento.editable}
                />
                <Column dataField="cuentaId" cssClass='cellDetail'>
                  <Lookup
                    dataSource={createCustomStore('cuentas/get/nivel/4')()}
                    valueExpr="id"
                    displayExpr={item => item ? `${item.numero} - ${item.descripcion}` : ''}
                  >
                  </Lookup>
                </Column>
                <Column dataField="centroCostoId" width={150} cssClass='cellDetail'>
                  <Lookup
                    dataSource={this.getFilteredCentroCosto}
                    valueExpr="id"
                    displayExpr='descripcion'
                  >
                  </Lookup>
                </Column>
                <Column dataField="referencia" width={100} ></Column>
                <Column dataField="debe" width={90} cssClass="col-debe" dataType="number" cellRender={cellRender} />
                <Column dataField="haber" width={90} cssClass="col-debe" dataType="number" cellRender={cellRender} />
                <Summary recalculateWhileEditing={true}>
                  <TotalItem
                    column="debe"
                    summaryType="sum"
                    customizeText={cellRender}
                    valueFormat="currency" cssClass="col-summary-ok" />
                  <TotalItem
                    column="haber"
                    summaryType="sum"
                    customizeText={cellRender}
                    valueFormat="currency" cssClass="col-summary-ok" />
                </Summary>
              </DataGrid>
            </GroupItem>
          </Form>          
          <Button
            visible={asiento.editable}
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
  user: state.user,
  asiento: state.asiento
});

const mapDispatchToPros = ({
  updateAsiento
});

export default connect(mapStateToProps, mapDispatchToPros)(Nuevo);
