const initialState = {
        dataSource:[],
        columns:[],
        total : 10,
        loading:false,
        current:1,
        selectType:"",
        searchData:{},
        postMethods:"POST"
};

const tableData= (state = initialState, action)=>{
    if(action.type === 'SET_TABLE_DATA'){
        return Object.assign({}, state, {...action})
    }
    if(action.type === 'DEL_TABLE_DATA'){
        delete state.searchData[action.value];
    }
    return state
};

export default tableData