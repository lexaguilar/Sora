import React from 'react';
import { connect } from 'react-redux';
import { SelectBox, DataGrid } from 'devextreme-react';
import { Column, Summary, TotalItem }
  from 'devextreme-react/data-grid';
import { createCustomStore } from '../../../utils/proxy';
import { Export } from 'devextreme-react/bar-gauge';
import { cellRender } from '../../../utils/common';
import { updateLibroMayor } from '../../../store/libroMayor/libroMayorActions'
import Detalle from './Detalle';
import Title from '../../shared/Title';
import { store } from '../../../services/store';

class LibroMayor extends React.Component {
    constructor(props) {
        super(props);
        this.store = [];
        this.state = {
            id: 0,
            anio: 0,
            naturalezaId: 0
        }
        this.onValueChanged = this.onValueChanged.bind(this);
        this.onAnioChanged = this.onAnioChanged.bind(this);
        this.onCellDblClick = this.onCellDblClick.bind(this);
    }

    onValueChanged(data) {
        let cuenta = data.component.option('selectedItem');
        this.setState({
            id: cuenta ? data.value : 0,
            naturalezaId : cuenta ? cuenta.naturalezaId : 0
        });
    }

    onAnioChanged(data) {
        let anio = data.component.option('selectedItem');
        this.setState({
            anio: anio ? data.value : 0
        });
    }

    onCellDblClick(e){

        let { updateLibroMayor } = this.props;

        updateLibroMayor(
            {
                id: this.state.id, 
                year: this.state.anio,
                mes: e.data.periodoId,
                debe: e.column.dataField == 'debe' ? true : false,
                open: true
            }
        );
    }

    render() {

        this.store = store(
            {
                uri: { get: `asientos/cuenta/${this.state.id}/year/${this.state.anio}/libro-mayor` },
                cb: model => model.map((d,i,array) =>{
                    d.saldo = (d.debe - d.haber) * (this.state.naturalezaId == 1 ? 1 : -1);
                    if(i>0)
                        d.saldoAcumulado = array[i-1].saldoAcumulado + d.saldo;
                    return d;
                })
            });

        return (
            <div className="container medium">
                <Detalle />
                <Title title="Libro mayor" />
                <div className="dx-field" style={{width: 600}}>
                    <div className="dx-field-label">Cuenta contable</div>
                    <div className="dx-field-value">
                        <SelectBox
                            dataSource={createCustomStore('cuentas/get')()}
                            showClearButton={true}
                            valueExpr="id"
                            displayExpr={item => item ? `${item.numero} - ${item.descripcion}` : ''}
                            searchEnabled={true} onValueChanged={this.onValueChanged} />
                    </div>
                </div>
               
                <div className="dx-field" style={{width: 600}}>
                    <div className="dx-field-label">Año</div>
                    <div className="dx-field-value">
                        <SelectBox
                            dataSource={[2020, 2021]}
                            showClearButton={true}
                            searchEnabled={true} onValueChanged={this.onAnioChanged} />
                    </div>
                </div>


                <DataGrid
                    dataSource={this.state.id > 0 && this.state.anio > 0 ? this.store : []}
                    showBorders={true}
                    showRowLines={true}
                    allowColumnResizing={true}
                    allowColumnReordering={true} 
                    onCellDblClick={this.onCellDblClick}>
                    
                    <Export enabled={true} fileName="Cortes" allowExportSelectedData={true} />
                    <Column cssClass="libro" dataField="periodo" />
                    <Column cssClass="libro" dataField="debe" cellRender={cellRender} />
                    <Column cssClass="libro" dataField="haber" cellRender={cellRender} />
                    <Column cssClass="libro" dataField="saldo" cellRender={cellRender} />
                    <Column cssClass="libro" dataField="saldoAcumulado" cellRender={cellRender} />
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
                      <TotalItem
                      column="saldo"
                      summaryType="sum"
                      customizeText={cellRender}
                      valueFormat="currency" cssClass="col-summary" />
                  </Summary>
                </DataGrid>
            </div>
        )
    }
}

const mapDispatchToPros = ({
    updateLibroMayor
});

export default connect(null, mapDispatchToPros)(LibroMayor);