
import { createStore, combineReducers } from 'redux'
import loginStatus from './reducers/loginReducer'
import menuExpand from "./reducers/menuReducer"
import tabRelation from "./reducers/tabReducer";
import tableData from "./reducers/tableReducer"
import modalStatus from "./reducers/modalReducer";


const reducers = combineReducers({
    loginStatus,
    menuExpand,
    tabRelation,
    tableData,
    modalStatus
});

const store = createStore(reducers);

export default store;
