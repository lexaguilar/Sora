import React, { Component } from "react";
import { Column, ColumnChooser, HeaderFilter, SearchPanel, Lookup } from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import { createStore } from "../../utils/proxy";
import { store } from "../../services/store";
import Nuevo from "./Nuevo";
import numeral from 'numeral'

import { connect } from 'react-redux';

class Asientos extends Component {

    constructor(props) {
        super(props)
     
        this.store = null
        this.reload = this.reload.bind(this);
        this.dataGrid = null;
    }  

    reload(){
        this.dataGrid.instance.refresh();
    }

    render() {
        let {user} = this.props;

        this.store = store(
            {
                uri: {get : `asientos/get/cortes/${user.corteId}`},
                msgInserted: 'Cuenta agregada correctamente',
                msgUpdated: 'Cuenta modificada correctamente',
                msgDeleted: 'Cuenta eliminada correctamente',
            });    

        return (
            <div className="container">        
                <Nuevo onSave={this.reload} isNew={true} />
                <DataGrid
                    ref={(ref) => this.dataGrid = ref}
                    dataSource={this.store}                    
                    selection={{ mode: 'single' }}
                    showBorders={true}
                    showRowLines={true}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                >
                    <SearchPanel visible={true} width={250} />
                    <HeaderFilter visible={true} />
                    <ColumnChooser enabled={true} />                  
                    <Column 
                        dataField="id"
                        width={75}
                        allowSorting={false}
                        cellRender={data => <Nuevo onSave={this.reload} isNew={false} data={data.data}/>}
                        />
                    <Column dataField="numero" width={100} cellRender={data => `${data.data.tipoComprobante.abrev}-${numeral(data.value).format('000000')}` }/>
                    <Column dataField="fecha"  width={120} dataType="datetime" format="dd/MM/yyyy" />
                    <Column dataField="concepto" />
                    <Column dataField="tipoComprobanteId" width={260} caption="Tipo Comprobante">
                        <Lookup disabled={true} dataSource={createStore('tipoComprobantes')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="monedaId" width={130}>
                        <Lookup disabled={true} dataSource={createStore('moneda')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                    <Column dataField="tipoCambio" width={120} />
                    <Column dataField="referencia" width={120} />
                    <Column dataField="estadoId" caption="Estado" width={130}>
                        <Lookup disabled={true} dataSource={createStore('asientoEstado')} valueExpr="id" displayExpr="descripcion" />
                    </Column>
                </DataGrid>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({    
    user: state.user,
  });
  
  export default connect(mapStateToProps)(Asientos);
  