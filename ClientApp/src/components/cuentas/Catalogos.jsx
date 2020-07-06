import React, { Component } from 'react';
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
    Form } from 'devextreme-react/data-grid';

import uri from '../../utils/uri';
import toCapital from '../../utils/common';
import { store } from '../../services/store';
import Title from '../shared/Title';

function Catalogo(props) {
    const { catalogo } = props;

    return (
        <div className="container small">
            <Title title={catalogo}/>
          
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({uri:uri[catalogo]})}
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
                <Export enabled={true} fileName="Catalogos" allowExportSelectedData={true} />
                <Column dataField="descripcion" />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title={toCapital(catalogo)} showTitle={true} width={500} height={220}>
                        
                    </Popup>
                    <Form>
                        <Item  dataField="descripcion" editorOptions={{ width:300 }} />                       
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Catalogo; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);