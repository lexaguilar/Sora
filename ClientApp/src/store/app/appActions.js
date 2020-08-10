import { GET_APPINFO, UPDATE_APPINFO } from './appActionTypes';
import { createAction } from 'redux-actions';
import http from '../../utils/http'

const getAppInfoSuccess = createAction(GET_APPINFO);
export const getAppInfo = () => async(dispatch) => {

    http('about/get-info').asGet()
        .then(resp => dispatch(getAppInfoSuccess(resp)))
        .catch(message => console.log(message));

};

const setAppInfoSuccess = createAction(UPDATE_APPINFO);
export const setAppInfo = data => async(dispatch) => {

    http('about/set-info').asPost(data)
        //dispatch(setAppInfoSuccess(setData(data, resp)));
        .then(resp => dispatch(setAppInfoSuccess(setData(data, resp))))
        .catch(message => console.log(message));

};

const setData = (currentData, newData) => {
    let result = {...currentData, ...exluyeVersion(newData) };
    return result;
}

const exluyeVersion = ({ version, ...resp }) => resp;