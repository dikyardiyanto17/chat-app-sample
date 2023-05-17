import {
    FetchingChats,
    FetchingRoom,
    FetchingRooms,
    FetchingUser,
    FetchingUsers,
} from "./actionType";
const baseUrl = "http://localhost:2222";

export const fetchRooms = (payload) => {
    return { type: FetchingRooms, payload }
}

export const fetchUsers = (payload) => {
    return { type: FetchingUsers, payload };
};

export const fetchUser = (payload) => {
    return { type: FetchingUser, payload }
}

export const fetchChats = (payload) => {
    return { type: FetchingChats, payload }
}

export const fetchRoom = (payload) => {
    return { type: FetchingRoom, payload }
}

export const login = (formLogin) => {
    return (dispatch) => {
        return fetch(baseUrl + "/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formLogin),
        })
            .then((resp) => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    return resp.json().then((error) => {
                        throw new Error(error.message);
                    });
                }
            })
            .then((data) => {
                localStorage.setItem("access_token", data.access_token);
                return data;
            });
    };
};

export const register = (formRegister) => {
    return (dispatch) => {
        return fetch(baseUrl + "/register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formRegister),
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            } else {
                return resp.json().then((error) => {
                    throw new Error(error.message);
                });
            }
        });
    };
};

export const getUsers = () => {
    return (dispatch) => {
        return fetch(baseUrl + "/users", {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            }
        }).then((resp) => resp.json())
            .then((data) => {
                dispatch(fetchUsers(data))
                return data
            })
    }
}

export const updateSocketId = (socketId) => {
    return fetch(baseUrl + "/users", {
        method: 'put',
        headers: {
            "Content-Type": "application/json",
            access_token: localStorage.access_token
        },
        body: JSON.stringify({ socketId })
    })
}

export const findUser = (id) => {
    return (dispatch) => {
        return fetch(baseUrl + "/finduser/" + id, {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            },
        }).then((resp) => resp.json())
            .then((data) => {
                return data
            })
    }
}

export const sendChat = (data) => {
    return (dispatch) => {
        return fetch(baseUrl + "/chat", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            },
            body: JSON.stringify(data)
        })
    }
}

export const findChat = (id) => {
    return (dispatch) => {
        return fetch(baseUrl + "/chat/" + id, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            }
        }).then((resp) => resp.json())
            .then((data) => {
                dispatch(fetchChats(data))
                return data
            })
    }
}

export const findGroup = () => {
    return (dispatch) => {
        return fetch(baseUrl + '/room', {
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            }
        }).then((resp) => resp.json())
            .then((data) => {
                dispatch(fetchRooms(data))
                return data
            })
    }
}

export const findTheGroup = (id) => {
    return (dispatch) => {
        return fetch(baseUrl + '/room/' + id, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            }
        }).then((resp) => resp.json())
            .then(((data) => {
                dispatch(fetchRoom(data))
                return data
            }))
    }
}

export const createGroupChat = (data) => {
    return (dispatch) => {
        return fetch(baseUrl + '/room', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            },
            body: JSON.stringify(data)
        }).then((resp) => resp.json())
    }
}

export const leaveRoom = (data) => {
    return (dispatch) => {
        return fetch(baseUrl + '/leave', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                access_token: localStorage.access_token
            },
            body: JSON.stringify(data)
        }).then((resp) => resp.json())
            .then((data) => data)
    }
}