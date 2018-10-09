
import store from '@src/store/store'

export const Menus=()=>{
    let {loginStatus:{menus}}=store.getState();
    let menu = menus.length?menus:JSON.parse(sessionStorage.getItem("menus"));
    return menu;
};
