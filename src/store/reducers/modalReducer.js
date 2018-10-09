
const initialState={
    visible:false,
    visibleOther:false,
    visibleTask:false,
    title:'新建任务',
    operation:"add",
    imageUrl:"",
    id:0,
    detail:{}
};


const modalStatus = (state = initialState, action)=>{
    if(action.type=="SET_MODAL_STARUS"){
        return Object.assign({...state, ...action})
    }

    return state
};




export default modalStatus