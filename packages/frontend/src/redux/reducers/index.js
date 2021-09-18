import { combineReducers } from "redux";
import authorization from "./authorization";
import receivingForm from "./receivingForm";

const appReducer = combineReducers({
    authorization,
    receivingForm
});

export default appReducer;