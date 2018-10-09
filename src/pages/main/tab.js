import React,{ Component } from "react"
import { connect } from 'react-redux'
import store from '@src/store/store'


import { Tabs, Button, Dropdown ,Menu,Icon } from 'antd';
const TabPane = Tabs.TabPane;

class Tab extends Component{
    constructor(props, context) {
        super(props, context);
    }
    clearQuery(){//对?后面请求的参数清空(query)
        store.dispatch({
            type:"SET_TABLE_DATA",
            selectType:"",
            searchData:{}
        })
    }
    onChange=(key)=>{
        this.clearQuery();
        let { panes, history} = this.props;
        let menuHeader=JSON.parse(JSON.stringify(panes));
        store.dispatch({
            type:"SET_TAB_RELATION",
            currentKey:key
        });
        sessionStorage.setItem("currentKey",key);
        if(menuHeader){
            let path=menuHeader.filter(value=>value.key==key)[0];
            store.dispatch({
                type:"SET_MENU_EXPAND",
                openKeys:[path["openKeys"]],
                selectedKeys: [path['key']]
            });
            history.replace(path.path)
        }
    };
    onEdit=(key)=>{
        this.clearQuery();
        // 单个删除标签
        let delData=[],
            { currentKey , panes, history} = this.props,
            lastTab;

        delData=panes.filter(child=>child.key!=key);
        let params={
                type:"DEL_TAB_RELATION",
                panes:[...delData]
            };
        lastTab=delData[delData.length-1];
        if(currentKey==key){
            params.currentKey=lastTab["key"];
            sessionStorage.setItem("currentKey",params.currentKey);
        }
        store.dispatch(params);
        store.dispatch({
            type:"SET_MENU_EXPAND",
            openKeys:[lastTab["openKeys"]],
            selectedKeys:[lastTab["key"]]
        });
        history.replace(lastTab.path)
    };
    getTAbs(){
        let { panes } = this.props;
        return panes.map((pane)=>{
            return <TabPane tab={pane.title} key={pane.key} closable={pane.closable} />
        })
    }
    closeHandle=({key})=>{
        this.clearQuery();
        let {panes,currentKey} = this.props ,
            currentData = panes.filter(pane => pane.key == currentKey),
            { history } = this.props;
        if(key=="01"){
            store.dispatch({
                type:"DEL_TAB_RELATION",
                currentKey:panes[0]["key"],
                panes:[panes[0]]
            });
            store.dispatch({
                type:"SET_MENU_EXPAND",
                openKeys:[panes[0]["openKeys"]],
                selectedKeys:[panes[0]["key"]]
            });
            sessionStorage.setItem('currentKey',panes[0]["key"]);
            history.replace(panes[0]["path"])
        }
        if(key=="02" && currentData[0]["key"]!=panes[0]["key"]){
            store.dispatch({
                type:"DEL_TAB_RELATION",
                currentKey:currentData[0]["key"],
                panes:[panes[0],...currentData]
            });
            store.dispatch({
                type:"SET_MENU_EXPAND",
                openKeys:[currentData[0]["openKeys"]],
                selectedKeys:[currentData[0]["key"]]
            });
            history.replace(currentData[0]["path"])
        }
    };
    render(){
        let { currentKey } = this.props;
        const menu=(
            <Menu onClick={this.closeHandle}>
                <Menu.Item key="01">
                    关闭所有页面
                </Menu.Item>
                <Menu.Item key="02">
                    关闭其他页面
                </Menu.Item>
            </Menu>
        );
        let operationIcon= <Dropdown overlay={menu} trigger={['click']}>
                                <Icon type='menu-unfold' />
                           </Dropdown>
        return(
            <Tabs
                type="editable-card"
                hideAdd='true'
                onChange={this.onChange}
                activeKey={currentKey}
                onEdit={this.onEdit}
                tabBarExtraContent={operationIcon}
                style={{position:"absolute",left:0,right:0,backgroundColor:"#fff"}}
            >
                {this.getTAbs()}
            </Tabs>
        )
    }
}



const stateToProps = ({ menuExpand,tabRelation }) => ({
    openKeys: menuExpand.openKeys,
    selectedKeys: menuExpand.selectedKeys,
    panes:tabRelation.panes,
    currentKey:tabRelation.currentKey
});

export default connect(stateToProps)(Tab)
