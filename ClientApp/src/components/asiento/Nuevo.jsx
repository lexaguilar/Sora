import React from 'react';
import { Popup, ScrollView, Button } from 'devextreme-react';
import Form, {
  SimpleItem,
  GroupItem
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStore } from '../../utils/proxy';
import { Column, ColumnChooser, HeaderFilter, SearchPanel, Lookup, Editing, Summary, TotalItem, RequiredRule, StringLengthRule }
from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../utils/http';
import uri from '../../utils/uri';
import { getTicks } from '../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultComprobante } from '../../data/comprobante';
import moment from 'moment';
import numeral  from 'numeral';

class Nuevo extends React.Component {
  constructor(props) {
    super(props);
    this.asiento = null;
    this.asientosDetalle = [];
    this.hideInfo = this.hideInfo.bind(this);
    this.save = this.save.bind(this);
    this.showPopup = this.showPopup.bind(this);    
    this.obtTasaCambio = this.obtTasaCambio.bind(this);    
    this.state = {
      popupVisible: false,
      comprobante : Object.assign({}, defaultComprobante) 
        
      
    };
  }

  showPopup(e) {

     

    const { isNew, data } = this.props;
    if(!isNew){
      http(uri.asientos.getById(data.id)).asGet().then(r => {
        this.setState({
          popupVisible: true,
          comprobante : {
          id: r.id,
          numero: r.numero,
          tipoComprobanteId: r.tipoComprobanteId,
          fecha: r.fecha,
          concepto: r.concepto,
          observacion: r.observacion,
          tipoCambio: r.tipoCambio,
          referencia: r.referencia,
          monedaId: r.monedaId,
          asientosDetalle : r.asientosDetalle
        }})
      })
    }else{
      this.setState({
        popupVisible: true,
        comprobante :  Object.assign({}, defaultComprobante) 
      });  
    }

  }

  hideInfo({cancel}) { 

    this.setState({
      popupVisible: false,
      //comprobante :  Object.assign({}, defaultComprobante) 
    });

    if(cancel){

      let { onSave } = this.props;
      onSave();

    }
  }

  save(){

    const { user } = this.props;
    var result = this.asiento.instance.validate();
    if(result.isValid){

      let asiento = this.asiento.instance.option('formData');
      asiento.asientosDetalle = this.asientosDetalle.instance.option('dataSource');    
      asiento.corteId = user.corteId;
     
      http(uri.asientos.insert).asPost(asiento).then(r => {
        notify({message : "Registro guardado correctamente"});
        this.hideInfo({cancel:true}); 
        
      });
    }


  }

  obtTasaCambio(e){
    let v =new Date(moment(e.value).format());
    let ticks = getTicks(v)
    http(`tasaCambio/firstOrDefault/${ticks}`).asGet().then(r => {
      let asiento = this.asiento.instance.option('formData');
      let newState  = {...asiento, ...{tipoCambio : r?r.cambio:0}}

      this.setState({        
        comprobante :  Object.assign({}, newState) 
      });
    })
  }

  render() {
   
    const { isNew, data } = this.props;    
    
    return (
      <div id="container">
        
        <Button       
          className={`${isNew?'':'links'}`}
          width={(isNew?180:60)}
          text={`${isNew?'Nuevo Asiento':'Editar'}`}
          type="normal"
          icon={`${isNew?'add':''}`}
          stylingMode="contained"
          onClick={this.showPopup}
        />
        
        <Popup
          width={850}
          height={650}
          title={`${isNew?'Nuevo asiento':`Editar comprobante ${data.numero}`}`}
          onHiding={this.hideInfo}
          visible={this.state.popupVisible}
        >
          
          <ScrollView width='100%' height='100%'>
            <Form formData={this.state.comprobante} ref={(ref) => this.asiento = ref}>
              <GroupItem cssClass="first-group" colCount={2}>

                <GroupItem>
                  <SimpleItem dataField="numero" render={r => (console.log(r), numeral(this.state.comprobante.numero).format('000000'))} ></SimpleItem>
                </GroupItem>
                <GroupItem>
                  <GroupItem>
                    <SimpleItem dataField="monedaId" 
                      editorType="dxSelectBox" editorOptions={{
                        dataSource: createStore('moneda'), valueExpr: "id", displayExpr: "descripcion"
                      }} >
                      <RequiredRule message="Seleccione el comprobante"  />
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
                      displayFormat:"dd/MM/yyyy" , onValueChanged: this.obtTasaCambio
                    }}
                    >
                    <RequiredRule message="Seleccione la fecha"  />
                  </SimpleItem>
                </GroupItem>
                <GroupItem >                  
                  <SimpleItem dataField="tipoCambio" editorType="dxNumberBox" editorOptions={{disabled: true}}></SimpleItem>
                </GroupItem>
              </GroupItem>
              <GroupItem cssClass="second-group" colCount={2}>
                <GroupItem>
                  <SimpleItem dataField="tipoComprobanteId" label={{text:"Tipo Comprobante"}}
                    editorType="dxSelectBox" editorOptions={{
                      dataSource: createStore('tipoComprobantes'), valueExpr: "id", displayExpr: "descripcion" , 
                    }} >
                     <RequiredRule message="Seleccione el comprobante"  />
                  </SimpleItem>                  
                </GroupItem>
                <GroupItem>
                  <SimpleItem dataField="referencia"  >
                    <StringLengthRule max={50} message="Maximo 50 caracteres" />
                    <RequiredRule message="La referencia es requerida"  />
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
                  ref={(ref) => this.asientosDetalle = ref}
                  dataSource={this.state.comprobante.asientosDetalle}
                  selection={{ mode: 'single' }}
                  showBorders={true}
                  showRowLines={true}
                  allowColumnResizing={true}
                  allowColumnReordering={true}
                >
                  <SearchPanel visible={true} />
                  <Editing
                    mode="cell"
                    allowAdding={true}
                    allowUpdating={true} />
                  <HeaderFilter visible={true} />
                  <ColumnChooser enabled={true} />
                  <Column dataField="cuentaId">
                    <Lookup disabled={true} dataSource={createStore('cuentas')} valueExpr="id" displayExpr="descripcion" />
                    <RequiredRule />
                  </Column>
                  <Column dataField="referencia" >
                    <RequiredRule message="La ferencia es requerida" />
                  </Column>
                  <Column dataField="debe" cssClass="col-debe" dataType="number" >
                    <RequiredRule message="El debe es requerido"/>
                  </Column>
                  <Column dataField="haber" cssClass="col-debe" dataType="number" >
                    <RequiredRule message="El haber es requerido"/>
                  </Column>
                  <Summary recalculateWhileEditing={true}>                   
                    <TotalItem
                      column="debe"
                      summaryType="sum"
                      valueFormat="currency" cssClass="col-summary" />
                    <TotalItem
                      column="haber"
                      summaryType="sum"
                      valueFormat="currency" cssClass="col-summary"/>
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
