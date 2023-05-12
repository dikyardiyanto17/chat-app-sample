import { FetchingChats } from "../action/actionType"

const initialState = {
    chats: [],
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case FetchingChats:
            return { ...state, chats: action.payload }
        default:
            return state
    }
}