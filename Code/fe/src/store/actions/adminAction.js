import actionTypes from './actionTypes';
import { getAllUserService} from '../../services/userService';
import { toast } from 'react-toastify';
// import { types } from 'node-sass';

export const getAllUserStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res = await getAllUserService();
            if(res && res.errCode === 0){
                dispatch(getAllUserSuccess(res.data));
            }
            else{
                toast.error("Error from server !");
                dispatch(getAllUserFailed());
            }
        } catch (error) {
            toast.error("Error from server-2 !");
            dispatch(getAllUserFailed());
            console.log("Error from server: ",error);
        }
    }
}

export const getAllUserSuccess = (data) => ({
    type: actionTypes.GET_ALL_USERS_SUCCESS,
    data:data,
})

export const getAllUserFailed = () => ({
    type: actionTypes.GET_ALL_USERS_FAILED,
})

