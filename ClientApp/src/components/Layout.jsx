// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './home/HomePage';
import app from '../data/app';

// application
import Footer from './footer';
import Header from './header';
import Cuentas from './cuentas/Cuentas';
import Catalogo from './cuentas/Catalogos';
import catalogos from '../data/catalogos';

function Layout(props) {
    const { match, headerLayout } = props;
    const PrintCatalogos = catalogos.map(c => {
        return  <Route exact path={`/cuenta/${c}`} render={(props) => (
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
                        <Route exact path={`/cuentas`} component={Cuentas} />                         
                        {PrintCatalogos}
                        <Route exact path={`/tipoComprobantes`} render={props => <Catalogo {...props} catalogo={'tipoComprobantes'} /> } />                         
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

