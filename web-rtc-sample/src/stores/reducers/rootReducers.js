import { combineReducers } from "redux";
import userReducer from "./users";
import chatReducer from "./chats";
import roomReducer from "./rooms";

const rootReducer = combineReducers({
    users: userReducer,
    chats: chatReducer,
    rooms: roomReducer
})

export default rootReducer