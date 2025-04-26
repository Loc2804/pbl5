import { handleLoginApi } from '../../services/userService';
import actionTypes from './actionTypes';
import { toast } from 'react-toastify';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLogin = (username, password) =>{
    return async(dispatch, getState) =>{
        try {
            let res = await handleLoginApi(username, password);
            if(res && res.errCode === 0){
                console.log("check login", res);
                dispatch(userLoginSuccess(res.data));
            }
            else{
                toast.error("Error from server !");
                dispatch(userLoginFail());
            }
        } catch (error) {
            toast.error("Error from server-2 !");
            dispatch(userLoginFail());
            console.log("Error from server: ",error);
        }
    }
}  


export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo,
})

export const setUserRole = (role) => ({
    type: actionTypes.SET_USER_ROLE,
    userRole: role
});

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})