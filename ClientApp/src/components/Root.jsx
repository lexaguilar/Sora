import React, { Component } from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import Layout from './Layout';
import { locale, loadMessages } from "devextreme/localization";
import { esMessages } from '../data/dx.messages.es';
import PrivateRoute from './header/PrivateRouter';

export default class Root extends Component {

    constructor(props) {
        super(props);
        loadMessages({
            'es': esMessages
        });
        locale(navigator.language);
    }

    componentDidMount() {
        setTimeout(() => {
            const preloader = document.querySelector('.site-preloader');

            preloader.addEventListener('transitionend', (event) => {
                if (event.propertyName === 'opacity') {
                    preloader.parentNode.removeChild(preloader);
                }
            });
            preloader.classList.add('site-preloader__fade');
        }, 500);
    }

    render(){
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <PrivateRoute
                        path="/conta"
                        render={(props) => (
                            <Layout {...props} headerLayout='conta'  />
                        )}
                    />
                    <Route
                        path="/inv"
                        render={(props) => (
                            <Layout {...props} headerLayout='inv'/>
                        )}
                    />
                    <Route
                        path="/app"
                        render={(props) => (
                            <Layout {...props} headerLayout='app'/>
                        )}
                    />
                    <Redirect to='/conta'/>
                </Switch>
            </BrowserRouter>
        )
    }    
}

