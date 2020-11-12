import React from 'react';
import { DataGrid } from 'devextreme-react';
import { 
    Paging, 
    Pager, 
    FilterRow, 
    HeaderFilter, 
    Column, 
    Export, 
    Editing} from 'devextreme-react/data-grid';
import Title from '../../../shared/Title';
import { store } from '../../../../services/store';
import uri from '../../../../utils/uri';
import BlockHeader from '../../../shared/BlockHeader';



function Cortes(props) {
    const title = "Coster";
    return (
        <div className="container small">
            <Title title={title} />
            <BlockHeader title={title} />
            <DataGrid id="gridContainer"
                selection={{ mode: 'single' }}
                dataSource={store({
                    uri: uri.cortes, 
                    msgInserted: 'Corte agregado correctamente',
                    msgUpdated: 'Corte modificado correctamente',
                    msgDeleted: 'Corte eliminado correctamente',}
                )}
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
                <Export enabled={true} fileName="Cortes" allowExportSelectedData={true} />
                <Column dataField="descripcion" width={200} />
                <Column dataField="inicio" dataType="date"  format='dd/MM/yyyy'/>
                <Column dataField="final" dataType="date" format='dd/MM/yyyy'/>
                <Column dataField="activo" />
                <Editing
                    mode="batch"
                    allowUpdating={true}
                    allowDeleting={true}
                    allowAdding={true}
                >                   
                </Editing>
            </DataGrid>
        </div>
    )

};

export default Cortes; //connect(mapStateToProps, mapDispatchToProps)(GridSprintStart);