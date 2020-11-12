import React from 'react';
import { Popup, Button } from 'devextreme-react';
import Form, { SimpleItem, GroupItem, Label, AsyncRule } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { createStoreLocal } from '../../../utils/proxy';
import { Column, SearchPanel, Lookup, Editing, RequiredRule, StringLengthRule, Scrolling, Button as ButtonGrid }
    from 'devextreme-react/data-grid';
import { DataGrid } from 'devextreme-react';
import http from '../../../utils/http';
import uri from '../../../utils/uri';
import { customizeTextAsPercent, cellRender, formatId } from '../../../utils/common';
import notify from 'devextreme/ui/notify';
import { connect } from 'react-redux';
import { defaultServicio, defaultServicioStandar } from '../../../data/servicio';
import { updateServicio } from '../../../store/servicio/servicioActions';
import { useState } from 'react';
import InventarioDDBComponent from '../facturas/InventarioDDBComponent';

const Nuevo = props => {

    let [newServicio, setServicio] = useState(defaultServicio);
    let [newServicioStandar, setServicioStandar] = useState([]);

    const { servicio: { editable, open, id } } = props;

    let storeTransient = {
        inventario: []
    }

    const onHiding = ({ cancel }) => {

        let { updateServicio } = props;

        updateServicio({
            id: 0,
            open: false
        });

        if (cancel) {

            let { onSave } = props;
            onSave();

        }

    }

    const onShowing = e => {
        const { servicio } = props;

        if (servicio.id > 0) {
            http(uri.servicios.getById(servicio.id)).asGet().then(r => {
                setServicio({ ...r });
                setServicioStandar(r.salidasDetalle);
            });
        } else {
            setServicio({ ...defaultServicio });
            setServicioStandar([]);
        }

    }

    const setCellValue = (prop, newData, value, currentRowData) => {

        let detalle = { ...defaultServicioStandar, ...currentRowData };

        if (prop == "inventarioId") {
            let inventario = this.storeTransient.inventario.find(x => x.id == value);
            if (inventario) {
                detalle.precio = inventario.precio;
                detalle.ivaAverage = inventario.iva ? 0.15 : 0;
            }
        }

        newData[prop] = value || 0;
        detalle[prop] = newData[prop];

        newData.precio = detalle.precio;
        newData.subTotal = detalle.cantidad * detalle.precio;
        newData.importe = newData.subTotal - (newData.subTotal * detalle.descuentoAverage / 100);
        newData.ivaAverage = detalle.ivaAverage;
        newData.ivaMonto = newData.importe * newData.ivaAverage;
        newData.total = newData.importe + newData.ivaMonto;

    }


    return (
        <Popup
            width={600}
            height={400}
            title={`Servicio`}
            onHiding={onHiding}
            onShowing={onShowing}
            visible={open}
        >
            <Form formData={newServicio}>
                <GroupItem cssClass="second-group" colCount={3}>

                    <SimpleItem dataField="nombre" colSpan={2}
                        editorType="dxTextBox"                         >
                        <Label text="Nombre" />
                    </SimpleItem>

                    <SimpleItem dataField="precio" colSpan={1}
                        editorType="dxNumberBox">
                        <Label text="Precio" />
                    </SimpleItem>
                    <GroupItem colSpan={3}>
                        <DataGrid
                            id="gridFacturasDetalle"
                            height={280}
                            width={'100%'}
                            //ref={(ref) => this.refFacturaDetalle = ref}
                            dataSource={newServicioStandar}
                            selection={{ mode: 'single' }}
                            showBorders={true}
                            showRowLines={false}
                            allowColumnResizing={true}
                            allowColumnReordering={true}
                            hoverStateEnabled={true}
                        >
                            <Scrolling mode="virtual" />
                            <SearchPanel visible={true} />
                            <Editing
                                mode="cell"
                                allowAdding={editable}
                                allowDeleting={editable}
                                allowUpdating={editable}
                                selectTextOnEditStart={editable}
                                useIcons={editable}
                            />
                            <Column dataField="inventarioId" caption="Inventario" cssClass='cellDetail'
                            >
                                <Lookup
                                    dataSource={createStoreLocal({ name: 'inventario', local: storeTransient, url: 'inventario/por-area' })}
                                    valueExpr="id"
                                    displayExpr={item => item ? `${item.numero} - ${item.nombre}` : ''}
                                >
                                </Lookup>
                            </Column>
                            <Column type="buttons" width={50}>
                                <ButtonGrid name="delete" />
                            </Column>
                        </DataGrid>
                    </GroupItem>
                </GroupItem>


            </Form>
            <Button
                // ref={ref => btn = ref}
                visible={editable}
                width={120}
                text={'Guardar'}
                type="success"
                icon="save"
                stylingMode="contained"
                className="m-1"
            // onClick={this.save}
            // disabled= {this.state.saving}
            />
        </Popup>
    )
}

const mapStateToProps = (state) => ({
    servicio: state.servicio,
});

const mapDispatchToPros = ({
    updateServicio
});

export default connect(mapStateToProps, mapDispatchToPros)(Nuevo);

