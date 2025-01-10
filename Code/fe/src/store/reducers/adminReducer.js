import actionTypes from '../actions/actionTypes';

const initialState = {
    // isLoadingGender: false,
    // genders: [],
    
}

const adminReducer = (state = initialState, action) => {
    let copyState = {...state};
    switch (action.type) {
        // case actionTypes.GET_PRODUCT_SUCCESS:
        //     state.listProduct =action.data.map(newItem => {
        //         const existingItem = state.listProduct.find(item => item.id === newItem.id);
        //         return {
        //             ...newItem,
        //             showLove: existingItem ? existingItem.showLove : false // Giữ trạng thái cũ nếu có, ngược lại đặt mặc định là false
        //         };
        //     });
        //     return{
        //         ...state,
        //     }
        // case actionTypes.GET_PRODUCT_FAILED:
        //     state.listProduct = [];
        //     return{
        //         ...state,
        //     }
        default:
            return state;
    }
}

export default adminReducer;