import actionTypes from './actionTypes';
// import { getProduct , getAllBillService} from '../../services/userService';
import { toast } from 'react-toastify';
// import { types } from 'node-sass';



// export const getAllBill = (userId) => {
//     return async(dispatch, getState) =>{
//         try {
//             let res = await getAllBillService(userId);
//             if(res && res.errCode === 0){
//                 dispatch(getBillSuccess(res.data));
//             }
//             else{
//                 toast.error("Error from server !");
//                 dispatch(getBillFailed());
//             }
//         } catch (error) {
//             toast.error("Error from server !");
//             dispatch(getBillFailed());
//             console.log("Error from server: ",error);
//         }
//     }
// }

// export const getBillSuccess = (data) => ({
//     type: actionTypes.GET_BILL_SUCCESS,
//     data:data,
// })

// export const getBillFailed = () => ({
//     type: actionTypes.GET_BILL_FAILED,
// })

