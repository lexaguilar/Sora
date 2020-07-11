import { GET_APPINFO } from './appActionTypes';
import { createAction } from 'redux-actions';
import http from '../../utils/http'

const getAppInfoSuccess = createAction(GET_APPINFO);
export const getAppInfo = () => async(dispatch) => {

    const resp = await http('about/get-info').asGet();
    dispatch(getAppInfoSuccess(resp));

};