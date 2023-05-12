import { combineReducers } from "redux";
import userReducer from "./users";
import chatReducer from "./chats";

const rootReducer = combineReducers({
    users: userReducer,
    chats: chatReducer
})

export default rootReducer