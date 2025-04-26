import actionTypes from '../actions/actionTypes';

const initialState = {
    listUser:[],
    listVoc:[],
    listCategory:[],
    learnedListVoc:[],
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
        case actionTypes.GET_ALL_VOC_SUCCESS:
            copyState = {...state};
            copyState.listVoc = action.data;
            return{
                ...copyState,
            }
        case actionTypes.GET_ALL_VOC_FAILED:
            state.listVoc = [];
            return{
                ...state,
            }
        case actionTypes.GET_ALL_LEARNED_VOC_SUCCESS:
            copyState = {...state};
            copyState.learnedListVoc = action.data;
            return{
                ...copyState,
            }
        case actionTypes.GET_ALL_LEARNED_VOC_FAILED:
            state.learnedListVoc = [];
            return{
                ...state,
            }
        case actionTypes.GET_ALL_CATEGORY_SUCCESS:
            copyState = {...state};
            copyState.listCategory = action.data;
            return{
                ...copyState,
            }
        case actionTypes.GET_ALL_CATEGORY_FAILED:
            state.listCategory = [];
            return{
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;