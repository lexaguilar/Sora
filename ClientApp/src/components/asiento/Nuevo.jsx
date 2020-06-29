import React from 'react';
import { Popup, ScrollView, Button } from 'devextreme-react';
import Form, {
  SimpleItem,
  GroupItem
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStore, createCustomStore } from '../../utils/proxy';
import { Column, ColumnChooser, HeaderFilter, SearchPanel, Lookup, Editing, Summary, TotalItem, RequiredRule, StringLengthRule }
  from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../utils/http';
import uri from '../../utils/uri';
import { getTicks, cellRender } from '../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultComprobante } from '../../data/comprobante';
import moment from 'moment';
import numeral from 'numeral';

class Nuevo extends React.Component {
  constructor(props) {
    super(props);
    this.asiento = null;
    this.asientosDetalle = [];
    this.centroCostos = [];
    this.hideInfo = this.hideInfo.bind(this);
    this.save = this.save.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.obtTasaCambio = this.obtTasaCambio.bind(this);
    this.onRowInserting = this.onRowInserting.bind(this);
    this.onRowInserted = this.onRowInserted.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.getFilteredCentroCosto = this.getFilteredCentroCosto.bind(this);

    this.state = {
      popupVisible: false,
      comprobante: Object.assign({}, defaultComprobante),
      comprobanteDetalle: []
    };
  }

  componentDidMount(){
    http('centrocosto/get').asGet().then(cc => this.centroCostos = cc);
  }

  getFilteredCentroCosto(options) {
    return {
      store:this.centroCostos,
      filter : options.data ? ['cuenta', '=', String(options.cells[0].displayValue).substring(0, 2)] : null
    } 
  }

  onRowInserting(e) {


    if (e.data.debe > 0)
      e.data.haber = 0;

    if (e.data.haber > 0)
      e.data.debe = 0;

  }

  onRowInserted(e) {

    if (e.data.debe > 0)
      e.data.haber = 0;

    if (e.data.haber > 0)
      e.data.debe = 0;

    if (e.data.cuentaId > 0 && ((e.data.debe > 0 && e.data.haber == 0) || (e.data.debe == 0 && e.data.haber > 0))) {

      let detalle = this.asientosDetalle.instance.option('dataSource');
      let pending = detalle.find(x => x.cuentaId == undefined);

      let row = 0;
      if (pending)
        row = this.asientosDetalle.instance.getRowIndexByKey(pending);

      if (detalle.filter(x => x.cuentaId == undefined).length == 0) {
        e.component.addRow();
      }

      let element = this.asientosDetalle.instance.getCellElement(row, 0);
      this.asientosDetalle.instance.focus(element);
      this.asientosDetalle.instance.editCell(row, 0);

    }
  }

  onRowUpdated(e) {

    this.onRowInserted(e);

  }

  showPopup(e) {

    const { isNew, data } = this.props;
    if (!isNew) {
      http(uri.asientos.getById(data.id)).asGet().then(r => {
        this.setState({
          popupVisible: true,
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
        popupVisible: true,
        comprobante: Object.assign({}, defaultComprobante),
        comprobanteDetalle: []
      });
    }

  }

  hideInfo({ cancel }) {

    this.setState({
      popupVisible: false,
      comprobante: Object.assign({}, defaultComprobante),
      comprobanteDetalle: []
    });

    this.asientosDetalle.instance.saveEditData();

    if (cancel) {

      let { onSave } = this.props;
      onSave();

    }
  }

  save() {

    const { user } = this.props;
    var result = this.asiento.instance.validate();
    if (result.isValid) {
      let detalle = this.asientosDetalle.instance.option('dataSource').filter(x => x.cuentaId > 0);

      let debe = detalle.sum('debe');
      let haber = detalle.sum('haber');

      if (debe != haber)
        notify({ message: "El comprobante debe de cuadrar" }, 'error')
      else {


        let asiento = this.asiento.instance.option('formData');

        asiento.asientosDetalle = detalle;
        asiento.corteId = user.corteId;

        http(uri.asientos.insert).asPost(asiento).then(r => {
          notify({ message: "Registro guardado correctamente" });
          this.hideInfo({ cancel: true });

        });
      }
    }


  }

  obtTasaCambio(e) {
    let v = new Date(moment(e.value).format());
    let ticks = getTicks(v)
    http(`tasaCambio/firstOrDefault/${ticks}`).asGet().then(r => {
      let asiento = this.asiento.instance.option('formData');
      let newState = { ...asiento, ...{ tipoCambio: r ? r.cambio : 0 } }

      this.setState({
        comprobante: Object.assign({}, newState)
      });
    })
  }
 

  render() {

    const { isNew } = this.props;
    return (
      <div id="container">

        <Button
          className={`${isNew ? '' : 'links'}`}
          width={(isNew ? 180 : 60)}
          text={`${isNew ? 'Nuevo Asiento' : 'Editar'}`}
          type="normal"
          icon={`${isNew ? 'add' : ''}`}
          stylingMode="contained"
          onClick={this.showPopup}
        />

        <Popup
          width={850}
          height={650}
          title={`${isNew ? 'Nuevo asiento 000000' : `Editar comprobante ${numeral(this.state.comprobante.numero).format('000000')}`}`}
          onHiding={this.hideInfo}
          visible={this.state.popupVisible}
        >

          <ScrollView width='100%' height='100%'>
            <Form formData={this.state.comprobante} ref={(ref) => this.asiento = ref}>
              <GroupItem cssClass="first-group" colCount={2}>

                {/* <GroupItem>
                  <SimpleItem dataField="numero" render={r => numeral(this.state.comprobante.numero).format('000000')} ></SimpleItem>
                </GroupItem> */}
                <GroupItem>
                  <SimpleItem dataField="estadoId"
                    editorType="dxSelectBox" editorOptions={{
                      dataSource: createStore('asientoEstado'), valueExpr: "id", displayExpr: "descripcion"
                    }} >
                    <RequiredRule message="Seleccione el estado" />
                  </SimpleItem>
                </GroupItem>
                <GroupItem>
                  <GroupItem>
                    <SimpleItem dataField="monedaId"
                      editorType="dxSelectBox" editorOptions={{
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
                      dataSource: createStore('tipoComprobantes'), valueExpr: "id", displayExpr: "descripcion",
                    }} >
                    <RequiredRule message="Seleccione el comprobante" />
                  </SimpleItem>
                </GroupItem>
                <GroupItem>
                  <SimpleItem dataField="referencia"  >
                    <StringLengthRule max={50} message="Maximo 50 caracteres" />
                  </SimpleItem>
                </GroupItem>
                <SimpleItem

                  colSpan={2}
                  dataField="concepto"
                  editorType="dxTextArea"
                >
                  <StringLengthRule max={500} message="Maximo 500 caracteres" />
                </SimpleItem>
                <SimpleItem
                  colSpan={2}
                  dataField="observacion"
                  editorType="dxTextArea"
                >
                  <StringLengthRule max={500} message="Maximo 500 caracteres" />
                </SimpleItem>
              </GroupItem>
              <GroupItem>
                <DataGrid
                  id="gridAsientoDetalle"
                  ref={(ref) => this.asientosDetalle = ref}
                  dataSource={this.state.comprobanteDetalle}
                  selection={{ mode: 'single' }}
                  showBorders={true}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                  onRowInserting={this.onRowInserting}
                  onRowInserted={this.onRowInserted}
                  onRowUpdated={this.onRowUpdated}

                >
                  <SearchPanel visible={true} />
                  <Editing
                    mode="cell"
                    allowAdding={true}
                    allowDeleting={true}
                    allowUpdating={true}
                    selectTextOnEditStart={true}
                    useIcons={true}
                  />
                  <HeaderFilter visible={true} />
                  <ColumnChooser enabled={true} />
                  <Column dataField="cuentaId" cssClass='cellDetail'>
                    <Lookup
                      dataSource={createCustomStore('cuentas/get/nivel/4')()}
                      valueExpr="id"
                      displayExpr={item => item ? `${item.numero} - ${item.descripcion}` : ''}
                    >
                    </Lookup>
                  </Column>
                  <Column dataField="centroCostoId" cssClass='cellDetail'>
                    <Lookup
                      dataSource={this.getFilteredCentroCosto}//{createStore('centrocosto')}
                      valueExpr="id"
                      displayExpr='descripcion'
                    >
                    </Lookup>
                  </Column>
                  <Column dataField="referencia" width={100} ></Column>
                  <Column dataField="debe" width={100} cssClass="col-debe" dataType="number"  cellRender={cellRender}/>
                  <Column dataField="haber" width={100} cssClass="col-debe" dataType="number" cellRender={cellRender}/>
                  <Summary recalculateWhileEditing={true} >
                    <TotalItem
                      column="debe"
                      summaryType="sum"
                      customizeText={cellRender}
                      valueFormat="currency" cssClass="col-summary" />
                    <TotalItem
                      column="haber"
                      summaryType="sum"
                      customizeText={cellRender}
                      valueFormat="currency" cssClass="col-summary" />
                  </Summary>
                </DataGrid>
              </GroupItem>
              <GroupItem>
                <Button
                  width={120}
                  text="Guardar"
                  type="success"
                  icon="save"
                  stylingMode="contained"
                  onClick={this.save}
                />
              </GroupItem>
            </Form>
          </ScrollView>

        </Popup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nuevo);
