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
import Cuentas from './cuentas/Cuentas';
import Catalogo from './cuentas/Catalogos';
import Asientos from './asiento/Asientos';
import catalogos from '../data/catalogos';
import Cortes from './cuentas/configuracion/Cortes';
import TasaCambio from './tasaDeCambio/TasaCambio';
import TipoComprobante from './tipoComprobante/TipoComprobante';
import CentroCosto from './centroCosto/CentroCosto';
import LibroMayor from './libros/LibroMayor';
import { CONTA } from '../data/headerNavigation';

function Layout(props) {
    const { match, headerLayout } = props;
    const PrintCatalogos = catalogos.map(c => {
        return  <Route key={c} exact path={`${CONTA}/cuenta/${c}`} render={(props) => (
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
                        <Route exact path={`${CONTA}/cuentas`} component={Cuentas} />                         
                        {PrintCatalogos}
                        <Route exact path={`${CONTA}/tipoComprobantes`} render={props => <TipoComprobante {...props} /> } />                         
                        <Route exact path={`${CONTA}/asientos`} component={Asientos} />                         
                        <Route exact path={`${CONTA}/configuracion/cortes`} component={Cortes} />                         
                        <Route exact path={`${CONTA}/configuracion/tasa-cambio`} component={TasaCambio} />                         
                        <Route exact path={`${CONTA}/centro-costo`} component={CentroCosto} />                         
                        <Route exact path={`${CONTA}/libro/mayor`} component={LibroMayor} />                         
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

