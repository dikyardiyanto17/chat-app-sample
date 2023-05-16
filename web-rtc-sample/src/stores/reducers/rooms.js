import { fetchRoom } from "../action/actionCreator"
import { FetchingRooms } from "../action/actionType"

const initialState = {
    rooms: [],
    room: {}
}

export default function roomReducer(state = initialState, action) {
    switch (action.type) {
        case FetchingRooms:
            return { ...state, rooms: action.payload }
        case fetchRoom:
            return {...state, room: action.payload}
        default:
            return state
    }
}