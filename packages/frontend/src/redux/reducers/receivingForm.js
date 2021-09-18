import * as types from '../constants/ActionTypes';

let initialState = {
    receivingList: []
};

let reducer = (state = initialState, action) => {
    switch(action.type) {
        case types.UPDATE_RECEIVING_LIST:
            return {
                ...state,
                receivingList: action.receivingList
            }
        default:
            return state;
    }
}

export default reducer;