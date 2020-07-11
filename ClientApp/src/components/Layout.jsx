// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './home/HomePage';
import app from '../data/app';

// application
import Footer from './footer';
import Header from './header';
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
import Proveedores from './inv/Entidades/Proveedores';
import compras from './inv/compras';


function Layout(props) {
    const { match, headerLayout } = props;
    const PrintCatalogos = catalogos.map(c => {
        return  <Route key={c} exact path={`${_path[String(headerLayout).toUpperCase()]}/${c}`} render={(props) => (
                    <Catalogo {...props} catalogo={c} />
        )} />
    })
    return (
        <React.Fragment>
            <Helmet>
                <title>{app.Name}</title>
                <meta name="description" content={app.fullName} />
            </Helmet>

            <ToastContainer autoClose={5000} hideProgressBar />

            <div className="site">
                <header className="site__header d-lg-block d-none">
                    <Header layout={headerLayout} />
                </header>

                <div className="site__body">
                    <Switch>
                        <Route exact path={`${match.path}`} component={HomePage} />
                        <Route exact path={`${_path.CONTA}/cuentas`} component={Cuentas} />                         
                        {PrintCatalogos}
                        <Route exact path={`${_path.CONTA}/tipoComprobantes`} render={props => <TipoComprobante {...props} /> } />                         
                        <Route exact path={`${_path.CONTA}/asientos`} component={Asientos} />                         
                        <Route exact path={`${_path.CONTA}/configuracion/cortes`} component={Cortes} />                         
                        <Route exact path={`${_path.CONTA}/configuracion/tasa-cambio`} component={TasaCambio} />                         
                        <Route exact path={`${_path.CONTA}/centro-costo`} component={CentroCosto} />                         
                        <Route exact path={`${_path.CONTA}/libro/mayor`} component={LibroMayor} />                         
                        <Route exact path={`${_path.INV}/`} component={HomePage} />                   
                        <Route exact path={`${_path.INV}/inventario`} component={Inventario} />                   
                        <Route exact path={`${_path.INV}/familia`} component={Familia} />                    
                        <Route exact path={`${_path.INV}/proveedores`} component={Proveedores} />                    
                        <Route exact path={`${_path.INV}/compras`} component={compras} />                    
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

