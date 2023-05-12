import { FetchingUser, FetchingUsers } from "../action/actionType"

const initialState = {
    users: [],
    user: {}
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case FetchingUsers:
            return { ...state, users: action.payload }
        case FetchingUser:
            return {...state, user: action.payload}
        default:
            return state
    }
}