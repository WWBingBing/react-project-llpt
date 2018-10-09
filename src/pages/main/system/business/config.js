import React from 'react'
import {Card, Button,Form,Input} from 'antd'

import Page from '@src/class/page'
import store from '@src/store/store'
import {timeTranAll} from "@src/js/until"
import BusSearch from './search'
import BusModal from './modal'
import Modals from './modals'

let statusType={
    "0":{
        text:"未完成",
        icon:require("@src/static/unfinish.png"),
        color:"#FF8B41"
    },
    "1":{
        text:"进行中",
        icon:require("@src/static/loading.png"),
        color:"#54B3F5"
    },
    "2":{
        text:"已完成",
        icon:require("@src/static/finish.png"),
        color:"#62CB31"
    },
    "3":{
        text:"错误",
        icon:require("@src/static/error.png"),
        color:"#FF5A58"
    },
};




class Config  extends Page {
    searchList(data) {
        let param={};
        param.phone=data.phone;
        param.taskId=data.taskId;
        if(data.startDay!=null){
            param.startDay= data.startDay.format('YYYY-MM-DD');
        }else{
            param.startDay=null;
        }
        if(data.endDay!=null){
            param.endDay= data.endDay.format('YYYY-MM-DD');
        }else{
            param.endDay=null;
        }
        param.pageNum=1;
        this.loadData(param);
    }

    getOperationPanel(){
        return <Card>
                <BusSearch searchList={(data)=>this.searchList(data)}/>
        </Card>
    }
    getModals(){
        return(
            <div>
                <Modals/>
                <BusModal save={(data,reset)=>this.operation.save(data,reset)}/>
            </div>
        )
    }
    constructor(){
        super();
        this.init();
    }
    init(){
        this.getColumns();
        this.initOperationParams();
        this.loadData()
    }
    initOperationParams(){
        this.operationParams={
            id:"id",
            status:"",
            table:{
                url:"user/list"
            },
            save:{
                url:"user/save",
                type:'SET_MODAL_STARUS'
            }
        }
    }
    showModal(type,value={}){
        if(type=="edit"){
            let param={
                    type:'SET_MODAL_STARUS',
                    visible:true,
                    operation:type,
                    title:"修改用户信息",
                    detail:value
                };
            Object.assign(param,{id:value.id});
            store.dispatch(param)
        }else if(type == "find"){
            let param={
                type:'SET_MODAL_STARUS',
                visibleTask:true
            };
            Object.assign(param,{id:value.id});
            store.dispatch(param)
        }
    }

    /*是否*/
    yesNoShowFn(initVal) {
        //
        let showValue = initVal == 1 ? '是' : '否'
        let colorStyle=initVal == 1 ? "62CB31" :   "E74C3C"
        return (<span  style={{color: colorStyle}} >   <font color={colorStyle}> {showValue} </font> </span>)
    }
    /*是否认证*/
    authenticationShowFn(initVal){
        return (<span style={{"color":statusType[initVal].color}}>{statusType[initVal].text}</span>
             )
    }
    getColumns(){

        let columns=[{
            title:"操作",
            key:"action",
            fixed:"left",
            width:160,
            render:(text,record)=>{
                return (<span>
                    <Button onClick={()=>this.showModal("find",record)}>任务状态</Button>
                    <Button style={{marginLeft: '5px'}} onClick={()=>this.showModal("edit",record)}>修改</Button>
                </span>)
            }
        },{
            title:'序号',
            dataIndex: '$index',
            width:50
        },{
            title:'客户名字',
            dataIndex: 'userName'
        },{
            title: '登录账号(手机号)',
            dataIndex: 'loginname',
        }, {
            title:'积分',
            dataIndex: 'coinBalance'
        },{
            title: '管理员',
            dataIndex: 'isAdmin',
            render:(text,record)=> this.yesNoShowFn(record.isAdmin)
        }, {
            title: '完成的任务数',
            dataIndex: 'taskSuccess',
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
            render:(roleName)=>{
                return roleName?roleName:"未绑定角色"
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            render:(value) => timeTranAll(value)
        }];
        this.setColumns(columns)
    }
}
export default Config