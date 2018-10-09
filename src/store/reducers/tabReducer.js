const initialState={
    currentKey: sessionStorage.getItem("currentKey")?sessionStorage.getItem("currentKey"):"10",
    panes:sessionStorage.getItem("panes")?JSON.parse(sessionStorage.getItem("panes")):[{ title: '首页', openKeys:'10' ,  key: '10', path:"/main/homePage", closable: false}]
};


const tabRelation = (state = initialState, action)=>{
    if(action.type=="SET_TAB_RELATION"){
        if(action.panes){
            action.panes=state.panes.concat(action.panes);
            sessionStorage.setItem("panes",JSON.stringify(action.panes));
        }
        return Object.assign({...state, ...action})
    }
    if(action.type=="DEL_TAB_RELATION"){
        sessionStorage.setItem("panes",JSON.stringify(action.panes));
        return Object.assign({...state, ...action})
    }
    return state
};

export default tabRelation