import * as types from '../constants/ActionTypes';

export const setLogin = (role) => {
    return {
        type: types.SET_LOGIN,
        role
    }
}

export const logout = () => {
    return {
        type: types.LOGOUT
    }
}

export const updateReceivingList = (receivingList) => {
    return {
        type: types.UPDATE_RECEIVING_LIST,
        receivingList
    }
}