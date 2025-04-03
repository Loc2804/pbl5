import actionTypes from '../actions/actionTypes';

const initialState = {
    listUser:[],
    listVoc:[],
}

const adminReducer = (state = initialState, action) => {
    let copyState = {...state};
    switch (action.type) {
        case actionTypes.GET_ALL_USERS_SUCCESS:
            copyState = {...state};
            copyState.listUser = action.data;
            return{
                ...copyState,
            }
        case actionTypes.GET_ALL_USERS_FAILED:
            state.listUser = [];
            return{
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;