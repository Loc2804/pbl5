import { stringify } from "react-auth-wrapper/helpers";
import axios from "../axios"

const handleLoginApi = (userEmail,userPassword) =>{
    return axios.post('/api/login/', {
        username:userEmail,
        password: userPassword
    } );
}

const getAllUserService = () => {
    return axios.get("/api/users")
}


const getUserById = (inputId) => {
    return axios.get(`/api/users/${inputId}/`)
}

const createNewUserService = (data) =>{
    return axios.post('/api/users/', data)
    
}

const deleteUserService = (userId) =>{
    return axios.delete(`/api/users/${userId}/`);
}

const editUserService = (data) =>{
    return axios.put(`/api/users/${data.id}/`, data);
}

const getAllCategory = () =>{
    return axios.get(`/api/categories/`);
}


const getAllVocService = () => {
    return axios.get("/api/vocs/")
}


const getVocById = (inputId) => {
    return axios.get(`/api/vocs/${inputId}/`)
}

const createNewVocService = (data) =>{
    return axios.post('/api/vocs/', data)  
}

const deleteVocService = (vocId) =>{
    return axios.delete(`/api/vocs/${vocId}/`);
}

const editVocService = (data) =>{
    return axios.put(`/api/vocs/${data.id}/`, data);
}

const speakingTest = (data) =>{
    return axios.post('/api/speaking/', data)
}

const saveUserResult = (data) =>{
    return axios.post('/api/test_result/', data)
}

const updateProgress = (data) =>{
    return axios.post('/api/update_progress/', data)
}

const getListUserVoc = (user_id) =>{
    return axios.get(`/api/learned_voc/${user_id}/`)
}

const getPredictionImage = (data) =>{
    return axios.post(`/api/predict/`,data)
}

const getListHistoryTest = (user_id) =>{
    return axios.get(`/api/history/${user_id}/`)
}


const userRegister = (data) =>{
    return axios.post(`/api/account/`,data)
}

const forgotPassword = (data) =>{
    return axios.put(`/api/forgot-password/`,data)
}


export {
    handleLoginApi, getAllUserService, createNewUserService, 
    deleteUserService, editUserService, getUserById, getAllCategory,
    getAllVocService, createNewVocService, deleteVocService, editVocService, getVocById,
    speakingTest,saveUserResult,updateProgress,getListUserVoc,getPredictionImage,
    getListHistoryTest,userRegister,forgotPassword
};