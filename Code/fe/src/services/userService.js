import { stringify } from "react-auth-wrapper/helpers";
import axios from "../axios"

const handleLoginApi = (userEmail,userPassword) =>{
    return axios.post('/api/login', {
        email:userEmail,
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

export {
    handleLoginApi, getAllUserService, createNewUserService, 
    deleteUserService, editUserService, getUserById,
};