
const initialState={
    collapse:false,
    openKeys:[],
    selectedKeys:[]
};


const menuExpand = (state = initialState, action)=>{
    if(action.type=="SET_MENU_EXPAND"){
        return Object.assign({...state, ...action})
    }
    return state
};




export default menuExpand





