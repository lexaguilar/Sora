import { combineReducers } from 'redux';

// reducers
import currencyReducer from './currency';
import localeReducer from './locale';
import mobileMenuReducer from './mobile-menu';
import sidebarReducer from './sidebar';


export default combineReducers({
    currency: currencyReducer,
    locale: localeReducer,
    mobileMenu: mobileMenuReducer,
    sidebar: sidebarReducer,
});