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
    Lookup
} from 'devextreme-react/data-grid';


import uri from '../../../utils/uri';
import { store } from '../../../services/store';
import Title from '../../shared/Title';
import BlockHeader from '../../shared/BlockHeader';
import { createCustomStore } from '../../../utils/proxy';


function Bancos(props) {
    const title = "Bancos";
    return (
        <div className="container small">
            <Title title={title} />
            <BlockHeader title={title} />
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({ uri: uri.bancos })}
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
                <Column dataField="descripcion" />
                <Column dataField="cuentaId" >
                    <Lookup
                        dataSource={createCustomStore(uri.cuentasLevels(4))()}
                        valueExpr="id"
                        displayExpr={item => item ? `${item.numero} - ${item.descripcion}` : ''}
                    >
                    </Lookup>
                </Column>                
                <Column dataField="activo" width={80} dataType="boolean" />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title={title} showTitle={true} width={400} height={220}/>                   
                    <Form>
                        <Item itemType="group" colCount={2} colSpan={2}>
                            <Item dataField="descripcion" colSpan={2}>
                                <RequiredRule message="La descripcion es requerida" />
                                <StringLengthRule min={4} max={50} message="Mínimo de caracteres 4 y 50 máximo" />
                            </Item>
                            <Item dataField="cuentaId" colSpan={2}>
                                <RequiredRule message="La cuenta es requerida" />
                            </Item>
                            <Item dataField="activo" colSpan={2} />                       
                        </Item>                       
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Bancos; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);