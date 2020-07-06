import { combineReducers } from 'redux';

// reducers
import currencyReducer from './currency';
import localeReducer from './locale';
import mobileMenuReducer from './mobile-menu';
import sidebarReducer from './sidebar';
import corteReducer from './corte'
import userReducer from './user'
import asientoReducer from './asiento'
import libroMayorReducer from './libroMayor'


export default combineReducers({
    currency: currencyReducer,
    locale: localeReducer,
    mobileMenu: mobileMenuReducer,
    sidebar: sidebarReducer,
    cortes: corteReducer,
    user: userReducer,
    asiento: asientoReducer,
    libroMayor: libroMayorReducer,
});