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
    StringLengthRule,
    EmailRule,
    PatternRule
} from 'devextreme-react/data-grid';

import uri from '../../../utils/uri';
import { store } from '../../../services/store';
import Title from '../../shared/Title';
import BlockHeader from '../../shared/BlockHeader';
import { phonePattern, phoneRules } from '../../../utils/common';

function Proveedores() {
    const title = "Proveedores";
    return (
        <div className="container medium">
            <Title title={title} />
            <BlockHeader title={title} />
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({ uri: uri.proveedores })}
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
                <Export enabled={true} fileName={title} allowExportSelectedData={true} />
                <Column dataField="nombre" width={300} />
                <Column dataField="contacto" width={300}  />
                <Column dataField="telefono" />
                <Column dataField="correo" />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title="Proveedor" showTitle={true} width={380} height={270}>

                    </Popup>
                    <Form>
                        <Item itemType="group" colCount={1} colSpan={1}>
                            <Item dataField="nombre" editorOptions={{ width: 250 }} >
                                <RequiredRule message="El nombre es requerido" />
                                <StringLengthRule min={5} max={150} message="Mínimo de caracteres 5 y 150 máximo" />
                            </Item>
                            <Item dataField="contacto" editorOptions={{ width: 250 }} >
                                <StringLengthRule max={150} message="150 caracteres como máximo" />
                            </Item>
                            <Item dataField="telefono" editorOptions={{ width: 250, mask:"0000-0000", maskRules: phoneRules }} >
                                <PatternRule message="The phone must have a correct USA phone format" pattern={phonePattern} />
                            </Item>
                            <Item dataField="correo" editorOptions={{ width: 250 }} >
                                <StringLengthRule max={50} message="50 caracteres como máximo" />
                                <EmailRule message="Correo invalida" />
                            </Item>
                        </Item>
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Proveedores; 

//connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);