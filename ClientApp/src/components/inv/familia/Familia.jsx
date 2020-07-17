import React from 'react';
import { DataGrid } from 'devextreme-react';
import { Item } from 'devextreme-react/form';
import {
    Paging,
    Pager,
    FilterRow,
    HeaderFilter,
    ColumnChooser,
    Column,
    Export,
    Editing,
    Popup,
    Form,
    NumericRule,
    RequiredRule,
    StringLengthRule
} from 'devextreme-react/data-grid';


import uri from '../../../utils/uri';
import { store } from '../../../services/store';
import Title from '../../shared/Title';
import BlockHeader from '../../shared/BlockHeader';


function Familia() {
    const title = "Familias";
    return (
        <div className="container small">
            <Title title={title} />
            <BlockHeader title={title} />
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({ uri: uri.familia })}
                showBorders={true}
                showRowLines={true}
                allowColumnResizing={true}
                allowColumnReordering={true}
            >
                <Paging defaultPageSize={20} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[10, 20, 50]}
                />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <ColumnChooser enabled={true} />
                <Export enabled={true} fileName="Familia" allowExportSelectedData={true} />
                <Column dataField="descripcion" width={250} />
                <Column dataField="prefijo" dataType="number" />
                <Column dataField="iva" />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title="Familia" showTitle={true} width={400} height={220}>

                    </Popup>
                    <Form>
                        <Item itemType="group" colCount={1} colSpan={1}>
                            <Item dataField="descripcion" editorOptions={{ width: 250 }} >
                                <RequiredRule message="La descripcion es requerida" />
                                <StringLengthRule max={50} min={2} message="Máximo de caracteres 50 y 2 mínimo" />
                            </Item>
                            <Item dataField="prefijo" editorOptions={{ width: 100 }} >
                                <RequiredRule message="El prefijo es requerido" />
                            </Item>
                            <Item dataField="iva" editorOptions={{ width: 80 }} />
                        </Item>
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Familia; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);