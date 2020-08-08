import React from 'react';
import { connect } from 'react-redux';
import Form, {
    ButtonItem,
    SimpleItem,
    GroupItem,
    Label,
    EmailRule,
    PatternRule,
    RangeRule,
    RequiredRule,
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { setAppInfo } from '../../store/app/appActions';
import notify from 'devextreme/ui/notify';
import { createStore, createCustomStore } from '../../utils/proxy';
class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {

        let { setAppInfo, app } = this.props;

        setAppInfo(app);

        console.log(app);
        notify({
          message: 'You have submitted the form',
          position: {
            my: 'center top',
            at: 'center top'
          }
        }, 'success', 3000);

        e.preventDefault();
    }

    render() {

        let { app } = this.props;

        let render = x => {
            return  <SimpleItem dataField={x.name} editorType="dxSelectBox" 
                        editorOptions={{
                            searchEnabled: true,
                            dataSource: createCustomStore('cuentas/get/nivel/4')(), 
                            valueExpr: "id", 
                            displayExpr: item => item ? `${item.numero} - ${item.descripcion}` : ''
                        }}>
                        <Label text={x.caption} />
                    </SimpleItem>
        }

        const selectsVta = [
                 {name : 'vtaInventarioCuentaId',caption: 'Cuenta Inventario'}
                ,{name : 'vtaCostoVentaCuentaId', caption: 'Cuenta Costo Vta'}
                ,{name : 'vtaIvaPorPagarCuentaId', caption: 'Iva Por Pagar'}
                ,{name : 'vtaVentaCuentaId', caption: 'Cuenta de venta'}
                ,{name : 'vtaCajaGeneralCuentaId', caption: 'Cuenta Caja'}
                ,{name : 'vtaClienteCuentaId', caption: 'Cuenta Cliente'}
        ].map(render);

        const selectsComp = [
           {name : 'compIvaAcreditableCuentaId', caption: 'Cuenta Iva Acred'}
           ,{name : 'compBancoCuentaId', caption: 'Cuenta Banco'}
           ,{name : 'compProveedorCuentaId', caption: 'Cuenta Proveedor'}
        ].map(render);

        return (
            <div className="container small">
                <form onSubmit={this.handleSubmit}>            
                <Form formData={app}>
                    <GroupItem caption="Datos Generales"  colCount={4}>
                        <GroupItem colSpan={3}>                        
                            <SimpleItem dataField="name" editorType="dxTextBox">
                                <RequiredRule message="El nombre es requerido" />
                                <Label text="Nombre" />
                            </SimpleItem>
                            <SimpleItem dataField="fullName" editorType="dxTextBox">
                                <Label text="Nombre completo" />
                            </SimpleItem>
                            <SimpleItem dataField="slogan" editorType="dxTextBox"/>
                            <SimpleItem dataField="Correo" editorType="dxTextBox">
                                <EmailRule message="Correo no es valido" />
                            </SimpleItem>
                            <SimpleItem dataField="telefono" editorType="dxTextBox">
                                <RequiredRule message="El telefono es requerido" />
                            </SimpleItem>                                      
                        </GroupItem>
                    </GroupItem>

                    <GroupItem caption="Configuración" colCount={4}>                  
                        <GroupItem colSpan={2}>
                            <SimpleItem dataField="cantDecimales"  editorType="dxNumberBox" >
                                <RequiredRule message="El nombre es requerido" />
                                <Label text="Decimales" />
                            </SimpleItem>
                            <SimpleItem dataField="ivaAverage" editorType="dxNumberBox" >
                                <RequiredRule message="El iva es requerido" />
                                <Label text="IVA" />
                            </SimpleItem>  
                            <SimpleItem dataField="areaId" editorType="dxSelectBox" 
                                editorOptions={{
                                    dataSource: createStore('areas'), valueExpr: "id", displayExpr: "descripcion"
                                }}>
                                <RequiredRule message="El area es requerida" />
                                <Label text="Area Inicial" />
                            </SimpleItem>                            
                        </GroupItem>
                    </GroupItem>

                    <GroupItem caption="Configuración Contable Venta" colCount={4}>                  
                        <GroupItem colSpan={3}>                            
                            {selectsVta}                       
                        </GroupItem>
                    </GroupItem>  

                    <GroupItem caption="Configuración Contable Compra" colCount={4}>                  
                        <GroupItem colSpan={3}>                            
                            {selectsComp}                       
                        </GroupItem>
                    </GroupItem>                    
                    
                    <ButtonItem horizontalAlignment="left" buttonOptions={{
                        text: 'Guardar Informacion',
                        type: 'success',
                        useSubmitBehavior: true
                    }} />

                </Form>
            </form>
            </div>            
        );
    }
}

const mapStateToProps = state => ({
    app: state.appInfo
});

const mapDispatchToPros = ({
    setAppInfo
});

export default connect(mapStateToProps, mapDispatchToPros)(App);

