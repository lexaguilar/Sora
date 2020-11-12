import React from 'react';
import DataGrid, {
    Column,
    Paging,
    Scrolling,
    Selection,
    FilterRow,
    HeaderFilter,
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';
import { cellRender, formatToMoney } from '../../../utils/common';

const dropDownOptions = { width: 500 };

export default class InventarioDDBComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentValue: props.data.value
        };
        this.dropDownBoxRef = React.createRef();
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.contentRender = this.contentRender.bind(this);
    }

    customCell(cellData) {
        
        return (
          <div>

            <div className="item-descripcion">
                <div className="item-numero">{cellData.data.numero}</div>
                <div className="item-nombre">{cellData.data.nombre}</div>
            </div>           
            <div className="item-values">
                
                <div className={cellData.data.existencias > 0 ? "stock" : "item-stock-zero"}>
                    Stock:  {cellData.data.existencias}
                </div>
                <div className="item-label">
                    Precio: <span className="item-price">{formatToMoney(cellData.data.precio)}</span>
                </div>
            </div>
          
          </div>
        );
      }

    contentRender() {
        return (
            <DataGrid
                dataSource={this.props.data.column.lookup.dataSource}
                remoteOperations={true}
                keyExpr="id"
                height={280}
                selectedRowKeys={[this.state.currentValue]}
                hoverStateEnabled={true}
                onSelectionChanged={this.onSelectionChanged}
                focusedRowEnabled={true}
                defaultFocusedRowKey={this.state.currentValue}
                rowAlternationEnabled={true}
            >
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <Column dataField="nombre" cellRender={this.customCell} />
                <Paging enabled={true} pageSize={10} />
                <Scrolling mode="virtual" />
                <Selection mode="single" />
            </DataGrid>
        );
    }

    onSelectionChanged(e) {

        this.setState({ currentValue: e.selectedRowKeys[0] });
        this.props.data.setValue(this.state.currentValue);
        if (e.selectedRowKeys.length > 0) {
            console.log(e.selectedRowsData[0]);
            if (e.selectedRowsData[0].existencias == 0) {

                e.component.deselectRows(e.selectedRowKeys);
            } else {

                this.dropDownBoxRef.current.instance.close();
            }
        }

    }

    render() {
        return (
            <DropDownBox
                ref={this.dropDownBoxRef}
                dropDownOptions={dropDownOptions}
                dataSource={this.props.data.column.lookup.dataSource}
                value={this.state.currentValue}
                displayExpr="nombre"
                valueExpr="id"                
                contentRender={this.contentRender}>
            </DropDownBox>
        );
    }
}