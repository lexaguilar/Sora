import { GET_CORTE } from './corteActionTypes';
import { createAction } from 'redux-actions';
import http from '../../utils/http'
import uri from '../../utils/uri'


const getCorteSuccess = createAction(GET_CORTE);
export const getCorte = () => async(dispatch) => {

    const resp = await http(uri.cortes.get).asGet();
    dispatch(getCorteSuccess(resp));

};