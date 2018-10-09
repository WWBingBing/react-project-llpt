import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Button } from 'antd';

import { Layout } from 'antd';
import store from '@src/store/store'
import  { Menus } from "@src/js/menu"
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;


class Side extends Component{
    constructor(props){
        super(props);
        let path = location.hash.substr(1);
        let openMenu=this.getOpenKeys(path),
            params={
                type: 'SET_MENU_EXPAND'
            };
        if(openMenu.length){
            let child=openMenu[0].children;
            params= child.length?
                {...params,openKeys:[openMenu[0].key+''],selectedKeys:[this.props.currentKey]}:
                {...params,openKeys:[],selectedKeys:[this.props.currentKey]};
            store.dispatch(params);
        }
    }
    clearQuery(){//对?后面请求的参数清空(query)
        store.dispatch({
            type:"SET_TABLE_DATA",
            selectType:"",
            searchData:{}
        })
    }
    getOpenKeys(path){
        return Menus().filter((menu)=>path.indexOf(`/main/${menu.path}`)!=-1).map((menu)=>menu)
    }
    getMenus(){
        return Menus().map((menu,i)=>{
            const childMenu=menu.children.map((child,j)=>{
                return <Menu.Item key={child.key} to={"/main/"+menu.path+"/"+child.component}>
                    {child.title}
                </Menu.Item>
            });
            if(menu.children.length){
                return <SubMenu key={menu.key} title={<span><Icon type={menu.icon} /><span>{menu.title}</span></span>}>
                    {childMenu}
                </SubMenu>
            }else {
                return <Menu.Item key={menu.key} to={"/main/"+menu.path}>
                    <Icon type={menu.icon} />
                    <span>{menu.title}</span>
                </Menu.Item>
            }
        })
    }
    onClick=({ item,key })=>{
        this.clearQuery();
        let path=item.props.to;
        let openMenu=this.getOpenKeys(path),{ props }= item,{ history,panes } = this.props;
        //和tab联动 selectedKeys openKeys
        let data=JSON.parse(JSON.stringify(panes));
        let keydata = data.map((item) => {
            return item.key
        });
        let keyBool=keydata.indexOf(props.eventKey)!=-1;//判断点击的的key是否已存在panes
        if(!keyBool){//panes  false不存在  true存在
            let title;
            if(openMenu[0].children.length){
                title=openMenu[0].children.filter((child)=>(child.key==props.eventKey))[0].title
            }else {
                title=openMenu[0].title;
            }
            let openKeys = props.level==2?props.openKeys[0]:props.eventKey;
            store.dispatch({
                type:"SET_TAB_RELATION",
                panes:{title: title, openKeys:openKeys,  key: props.eventKey, path:props.to}
            });
        }
        store.dispatch({
            type:"SET_TAB_RELATION",
            currentKey:props.eventKey
        });
        sessionStorage.setItem("currentKey",props.eventKey);

        let params={
            type: 'SET_MENU_EXPAND',
            selectedKeys:[key]
        };
        params= openMenu[0].children.length?{...params}:{...params,openKeys:[]};
        store.dispatch(params);
        history.replace(props.to);
    };
    onOpenChange=(_openKeys)=>{
        let openKeys = _openKeys.length==2 ?[_openKeys[1]] : _openKeys;
        store.dispatch({
            type: 'SET_MENU_EXPAND',
            openKeys
        });
    };
    render(){
        let {openKeys,selectedKeys,collapse}=this.props;
        let config={
                openKeys,
                selectedKeys,
                mode:"inline",
                theme:"dark",
                onOpenChange:this.onOpenChange,
                onClick:this.onClick
            };
        return(
            <Sider
                trigger={null}
                collapsible
                collapsed={collapse}
                className="sideMenu"
            >
                {/*{
                    collapse?
                        <div className="logo logoShrink">
                            <div></div>
                        </div>
                        :<div className="logo logoExpand">
                            <div></div>
                            <div>薪动</div>
                        </div>
                }*/}
                <div className="logo">
                    <div></div>
                    {collapse?null:<div>薪动</div>}
                </div>
                <Menu
                    {...config}
                >
                    {this.getMenus()}
                </Menu>
            </Sider>
        )
    }
}






const stateToProps = ({ menuExpand,tabRelation }) => ({
    collapse: menuExpand.collapse,
    openKeys: menuExpand.openKeys,
    selectedKeys: menuExpand.selectedKeys,
    panes:tabRelation.panes,
    currentKey:tabRelation.currentKey
});

export default connect(stateToProps)(Side)