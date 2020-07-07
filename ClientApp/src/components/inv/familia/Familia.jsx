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


function Familia() {

    return (
        <div className="container small">
            <Title title="Familias"/>
          
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({uri:uri.familia})}
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
                <Column dataField="iva" />
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >
                    <Popup title="Tipo Comprobantes" showTitle={true} width={550} height={180}>
                        
                    </Popup>
                    <Form>
                        <Item  dataField="descripcion" editorOptions={{ width:250 }} />                       
                        <Item  dataField="iva" editorOptions={{ width:80 }} />                       
                    </Form>
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Familia; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);