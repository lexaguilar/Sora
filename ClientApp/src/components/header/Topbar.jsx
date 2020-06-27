// react
import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// third-party
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// application
import Dropdown from './Dropdown';
import DropdownCorte from './DropdownCorte';


function Topbar() {

    const links = [
        { title: <FormattedMessage id="topbar.Cuentas" defaultMessage="Cuentas" />, url: '/cuentas' },
        // { title: <FormattedMessage id="topbar.contacts" defaultMessage="Contacts" />, url: '/site/contact-us' },
        // { title: <FormattedMessage id="topbar.storeLocation" defaultMessage="Store Location" />, url: '' },
        // { title: <FormattedMessage id="topbar.trackOrder" defaultMessage="Track Order" />, url: '/shop/track-order' },
        // { title: <FormattedMessage id="topbar.blog" defaultMessage="Blog" />, url: '/blog/category-classic' },
    ];

    const accountLinks = [
        { title: 'Editar Perfil', url: '/account/profile' },
        { title: 'Password', url: '/account/password' },
        { title: 'Salir', url: '/account/login' },
    ];

    const linksList = links.map((item, index) => (
        <div key={index} className="topbar__item topbar__item--link">
            <Link className="topbar-link" to={item.url}>{item.title}</Link>
        </div>
    ));


    return (
        <div className="site-header__topbar topbar">
            <div className="topbar__container container">
                <div className="topbar__row">
                    {linksList}
                    <div className="topbar__spring" />
                    <div className="topbar__item">
                        <Dropdown
                            title={<FormattedMessage id="topbar.miCuenta" defaultMessage="Mi Cuenta" />}
                            items={accountLinks}
                        />
                    </div>
                    {/* <div className="topbar__item">
                            Corte : {corte[0].descripcion}
                        </div> */}
                    <div className="topbar__item">
                        <DropdownCorte />
                    </div>                   
                </div>
            </div>
        </div>
    );

}




export default Topbar;
