import actionTypes from './actionTypes';
import { getAllCategory, getAllUserService, getAllVocService} from '../../services/userService';
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


export const getAllCategoryStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res = await getAllCategory();
            if(res && res.errCode === 0){
                dispatch(getAllCategorySuccess(res.data));
            }
            else{
                toast.error("Error from server !");
                dispatch(getAllCategoryFailed());
            }
        } catch (error) {
            toast.error("Error from server-2 !");
            dispatch(getAllCategoryFailed());
            console.log("Error from server: ",error);
        }
    }
}

export const getAllCategorySuccess = (data) => ({
    type: actionTypes.GET_ALL_CATEGORY_SUCCESS,
    data:data,
})

export const getAllCategoryFailed = () => ({
    type: actionTypes.GET_ALL_CATEGORY_FAILED,
})


export const getAllVocStart = () => {
    return async(dispatch, getState) =>{
        try {
            let res = await getAllVocService();
            if(res && res.errCode === 0){
                dispatch(getAllVocSuccess(res.data));
            }
            else{
                toast.error("Error from server !");
                dispatch(getAllVocFailed());
            }
        } catch (error) {
            toast.error("Error from server-2 !");
            dispatch(getAllVocFailed());
            console.log("Error from server: ",error);
        }
    }
}

export const getAllVocSuccess = (data) => ({
    type: actionTypes.GET_ALL_VOC_SUCCESS,
    data:data,
})

export const getAllVocFailed = () => ({
    type: actionTypes.GET_ALL_VOC_FAILED,
})