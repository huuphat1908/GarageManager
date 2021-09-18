import * as types from '../constants/ActionTypes';

let initialState = {
    isLogin: false,
    role: null
};

if(sessionStorage && sessionStorage.getItem('role'))
    initialState = {
        isLogin: true,
        role: sessionStorage.getItem('role')
    };

let reducer = (state = initialState, action) => {
    switch(action.type) {
        case types.SET_LOGIN:
            sessionStorage.setItem('role', action.role);
            return {
                ...state,
                isLogin: true,
                role: action.role,
            };
        case types.LOGOUT:
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('username');
            return {
                ...state,
                isLogin: false,
                role: null,
            };
        default:
            return state;
    }
}

export default reducer;