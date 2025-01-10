import { stringify } from "react-auth-wrapper/helpers";
import axios from "../axios"

const handleLoginApi = (userEmail,userPassword) =>{
    return axios.post('/api/login', {
        email:userEmail,
        password: userPassword
    } );
}

export {
    handleLoginApi
};