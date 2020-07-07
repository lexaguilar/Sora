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


import uri from '../../../utils/uri';
import { store } from '../../../services/store';
import Title from '../../shared/Title';


function CentroCosto(props) {

    return (
        <div className="container small">
            <Title title="Centro de costo"/>
          
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({uri:uri.centroCosto})}
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
                <Export enabled={true} fileName="CentroCosto" allowExportSelectedData={true} />
                <Column dataField="descripcion" />
                <Column dataField="cuenta" width={80} />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title="Centro Costo" showTitle={true} width={550} height={220}>
                        
                    </Popup>
                    <Form>
                        <Item  dataField="descripcion" editorOptions={{ width:250 }} />                       
                        <Item  dataField="cuenta" editorOptions={{ width:80 }} />                       
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default CentroCosto;