const user = JSON.parse(localStorage.getItem("user"));
const token = JSON.parse(localStorage.getItem("token"));

const initialState = {
    user: user ? user : {},
    token: token ? token :undefined,
    isLog: user ? true:false
};

const usersReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case "ADD_USER":
            localStorage.setItem("user", JSON.stringify(payload));
            console.log(payload);
            return {
               user: payload,
               token: state.token,
               isLog: true 
            };
        case "ADD_TOKEN":
            localStorage.setItem("token", JSON.stringify(payload));
            return {
                user: state.user,
                token: payload,
                isLog: true
            };
        default:
            return state;
    }
};

export default usersReducer;