import React from 'react';
import { connect } from 'react-redux';
import { SelectBox, DataGrid } from 'devextreme-react';
import { Column, Summary, TotalItem }
  from 'devextreme-react/data-grid';
import { createStore } from '../../../utils/proxy';
import { Export } from 'devextreme-react/bar-gauge';
import { cellRender, cellAsBold, formatId } from '../../../utils/common';
import Title from '../../shared/Title';
import { store } from '../../../services/store';
import BlockHeader from '../../shared/BlockHeader';

class Kardex extends React.Component {
    constructor(props) {
        super(props);
        this.store = [];
        this.state = {
            id: 0,
            inventarioId: 0,
            areaId: 0
        }
        this.onInventarioChanged = this.onInventarioChanged.bind(this);
        this.onAreaChanged = this.onAreaChanged.bind(this);
    }

    onInventarioChanged(data) {
        let inv = data.component.option('selectedItem');
        this.setState({
            inventarioId: inv ? data.value : 0
        });
    }

    onAreaChanged(data) {
        let area = data.component.option('selectedItem');
        this.setState({
            areaId: area ? data.value : 0,
        });
    }   

    
    render() {
        const title = "Kardex";
        this.store = store(
            {
                uri: { get: `inventario/kardex/area/${this.state.areaId}/producto/${this.state.inventarioId}` },
                cb:  model => model.map((d) =>{
                    d.totalEntradas = d.entradas * d.costo;
                    d.totalSalidas = d.salidas * d.costoPromedioSalida;
                    return d;
                })
            });

        return (
            <div className="container medium">
                <Title title={title} />
                <BlockHeader title={title} />
                <div className="dx-field" style={{width: 400}}>
                    <div className="dx-field-label">Producto:</div>
                    <div className="dx-field-value">
                        <SelectBox
                            dataSource={createStore('inventario')}
                            showClearButton={true}
                            valueExpr="id"
                            displayExpr={item => item ? `${item.numero} - ${item.nombre}` : ''}
                            searchEnabled={true} onValueChanged={this.onInventarioChanged} />
                    </div>
                </div>
               
                <div className="dx-field" style={{width: 400}}>
                    <div className="dx-field-label">Area:</div>
                    <div className="dx-field-value">
                        <SelectBox
                            dataSource={createStore('areas')}
                            showClearButton={true}
                            valueExpr="id"
                            displayExpr="descripcion"
                            searchEnabled={true} onValueChanged={this.onAreaChanged} />
                    </div>
                </div>

                <DataGrid
                    dataSource={this.state.areaId > 0 && this.state.inventarioId > 0 ? this.store : []}
                    showBorders={true}
                    showRowLines={true}
                    allowColumnResizing={true}
                    allowColumnReordering={true} >
                    
                    <Export enabled={true} fileName="Kardex" allowExportSelectedData={true} />
                    <Column dataField="fecha" dataType="date" format="dd/MM/yyyy" />
                    <Column dataField="origen" />
                    <Column dataField="documento" cellRender={data => cellAsBold(formatId(data.value))} />
                    <Column dataField="referencia" />
                    <Column caption="Entradas" alignment="center">
                        <Column dataField="entradas" dataType="number" alignment="right"/>
                        <Column dataField="costo" dataType="number" alignment="right" cellRender={cellRender} />
                        <Column dataField="totalEntradas" dataType="number" alignment="right" cellRender={cellRender} />
                    </Column>
                    <Column caption="Salidas" alignment="center">
                        <Column dataField="salidas" dataType="number" alignment="right" />
                        <Column dataField="costoPromedioSalida" dataType="number" alignment="right"  cellRender={cellRender} />
                        <Column dataField="totalSalidas" dataType="number" alignment="right"  cellRender={cellRender} />
                    </Column>
                    <Column caption="Existencias" alignment="center">
                        <Column dataField="existencias" dataType="number" alignment="right" />
                        <Column dataField="costoPromedio" dataType="number" alignment="right" cellRender={cellRender}/>
                        <Column dataField="total" dataType="number" alignment="right" cellRender={cellRender}/>
                    </Column>
                </DataGrid>
            </div>
        )
    }
}

// const mapDispatchToPros = ({
//     updateLibroMayor
// });

//export default connect(null, mapDispatchToPros)(Kardex);
export default Kardex;