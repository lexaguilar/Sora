// react
import React from 'react';

// third-party
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './home/HomePage';

// application
import Footer from './footer';
import Header from './header';
import MobileMenu from './mobile/MobileMenu';

import catalogos from '../data/catalogos';
import Cuentas from './conta/cuentas/Cuentas';
import Asientos from './conta/asiento/Asientos';
import Cortes from './conta/cuentas/configuracion/Cortes';
import TasaCambio from './tasaDeCambio/TasaCambio';
import TipoComprobante from './conta/tipoComprobante/TipoComprobante';
import CentroCosto from './conta/centroCosto/CentroCosto';
import LibroMayor from './conta/libros/LibroMayor';
import Catalogo from './shared/Catalogos';
import { _path } from '../data/headerNavigation';
import Familia from './inv/familia/Familia';
import Inventario from './inv/inventario/Inventario';
import Proveedores from './inv/entidades/Proveedores';
import Compras from './inv/compras';
import Facturas from './inv/facturas/Index';
import Kardex from './inv/reportes/Kardex';
import Clientes from './inv/entidades/Clientes';
import MobileHeader from './mobile/MobileHeader';
import App from './app/Index';
import Bancos from './conta/bancos/Index';
import PrivateRoute from './header/PrivateRouter';
import Login from './app/login';
import Logout from './app/logout';
import Servicios from './inv/servicios';

function Layout(props) {
    const { match, headerLayout } = props;

    const PrintCatalogos = catalogos.map(c => {
        return  <PrivateRoute key={c} exact path={`${_path[String(headerLayout).toUpperCase()]}/${c}`} render={(props) => (
                    <Catalogo {...props} catalogo={c} />
        )} />
    });

    return (
        <React.Fragment>          

            <ToastContainer autoClose={5000} hideProgressBar />

            <MobileMenu layout={headerLayout}/>

            <div className="site">
                <header className="site__header d-lg-none">
                    <MobileHeader />
                </header>

                <header className="site__header d-lg-block d-none">
                    <Header layout={headerLayout} />
                </header>

                <div className="site__body">
                
                    <Switch>
                        <PrivateRoute exact path={`${match.path}`} component={HomePage} />
                        <PrivateRoute exact path={`${_path.CONTA}/cuentas`} component={Cuentas} />                         
                        {PrintCatalogos}
                        <PrivateRoute exact  path={`${_path.CONTA}/tipoComprobantes`} render={props => <TipoComprobante {...props} /> } />                         
                        <PrivateRoute exact path={`${_path.CONTA}/asientos`} component={Asientos} />                         
                        <PrivateRoute exact path={`${_path.CONTA}/bancos`} component={Bancos} />                         
                        <PrivateRoute exact path={`${_path.CONTA}/configuracion/cortes`} component={Cortes} />                         
                        <PrivateRoute exact path={`${_path.CONTA}/configuracion/tasa-cambio`} component={TasaCambio} />                         
                        <PrivateRoute exact path={`${_path.CONTA}/centro-costo`} component={CentroCosto} />                         
                        <PrivateRoute exact path={`${_path.CONTA}/libro/mayor`} component={LibroMayor} />       
                        <PrivateRoute exact path={`${_path.INV}/inventario`} component={Inventario} />              
                        <PrivateRoute exact path={`${_path.INV}/familia`} component={Familia} />                    
                        <PrivateRoute exact path={`${_path.INV}/proveedores`} component={Proveedores} />                    
                        <PrivateRoute exact path={`${_path.INV}/clientes`} component={Clientes} />                    
                        <PrivateRoute exact path={`${_path.INV}/compras`} component={Compras} />                    
                        <PrivateRoute exact path={`${_path.INV}/facturas`} component={Facturas} />                    
                        <PrivateRoute exact path={`${_path.INV}/kardex`} component={Kardex} />                    
                        <PrivateRoute exact path={`${_path.APP}/inicio`} component={App} />   
                        <Route exact path={`${_path.APP}/login`} component={Login} />   
                        <Route exact path={`${_path.APP}/logout`} component={Logout} />   
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>
        </React.Fragment>

    )
}

export default Layout;

