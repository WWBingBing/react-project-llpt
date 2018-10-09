
const initialState = {
    logged: sessionStorage.getItem("backstage-line")=='true'?true:false,
    menus:[]
};

const loginStatus = (state = initialState, action) => {
    if (action.type === 'SET_LOGGED_USER') {
        return Object.assign({}, state, {...action})
    }
    return state
};

export default loginStatus
