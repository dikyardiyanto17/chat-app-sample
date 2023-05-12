import {
    FetchingChats,
    FetchingUser,
    FetchingUsers,
} from "./actionType";
const baseUrl = "http://localhost:2222";

export const fetchUsers = (payload) => {
    return { type: FetchingUsers, payload };
};

export const fetchUser = (payload) => {
    return { type: FetchingUser, payload }
}

export const fetchChats = (payload) => {
    return { type: FetchingChats, payload }
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
            .then((data) => dispatch(fetchUsers(data)))
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
                dispatch(fetchUser(data))
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
                console.log("HELLO FROM ACTION CREATER")
                dispatch(fetchChats(data))
                return data
            })
    }
}