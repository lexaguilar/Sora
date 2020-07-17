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
    RequiredRule,
    StringLengthRule
} from 'devextreme-react/data-grid';


import uri from '../../../utils/uri';
import { store } from '../../../services/store';
import Title from '../../shared/Title';
import BlockHeader from '../../shared/BlockHeader';


function TipoComprobante(props) {
    const title = "Tipo de Comrobante";
    return (
        <div className="container small">
            <Title title={title} />
            <BlockHeader title={title} />
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({ uri: uri.tipoComprobantes })}
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
                <Export enabled={true} fileName="TipoComprobantes" allowExportSelectedData={true} />
                <Column dataField="descripcion" />
                <Column dataField="abrev" width={80} />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title="Tipo Comprobantes" showTitle={true} width={550} height={220}>

                    </Popup>
                    <Form>
                        <Item dataField="descripcion" editorOptions={{ width: 250 }} >
                            <RequiredRule message="La descripcion es requerida" />
                            <StringLengthRule max={150} min={4} message="Máximo de caracteres 150 y 4 mínimo" />
                        </Item>
                        <Item dataField="abrev" editorOptions={{ width: 80 }} >
                            <RequiredRule message="La descripcion es requerida" />
                            <StringLengthRule max={50} min={2} message="Máximo de caracteres 50 y 2 mínimo" />
                        </Item>
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default TipoComprobante; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);