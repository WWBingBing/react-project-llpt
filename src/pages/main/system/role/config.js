import React from 'react'
import {Card, Button, Modal, Popconfirm,message,Select,Input} from 'antd'

import Page from '@src/class/page'
import Circle from "@src/components/circle"
import store from '@src/store/store'
import RoleModal from './roleModal'
import RoleSearch from './search'

import {timeTran} from "@src/js/until"


class Config  extends Page{
    searchList=(data)=>{
        let param={};
        if(data.archive=="false"){
            param.archive=0
        }else if(data.archive=="true"){
            param.archive=1
        }else{
            param={};
            store.dispatch({
                type:"DEL_TABLE_DATA",
                value:"archive"
            })
        }
        param.name=data.roleName;
        param.pageNum=1;
        this.loadData(param);
    };
    getOperationPanel(){
        return <Card>
            <RoleSearch searchList={(data)=>this.searchList(data)}/>
            <Button  style={{verticalAlign: "bottom"}}  type="primary" onClick={()=>this.showModal("add")}>添加角色</Button>
        </Card>
    }
    showModal(type,value={}){
        if(!value.archive){
            let param={
                type:'SET_MODAL_STARUS',
                visible:true,
                operation:type,
                title:type=="edit"?"修改角色":"新建角色",
                detail:value
            };
            param= type=="edit"? Object.assign(param,{id:value.roleId}):param;
            store.dispatch(param)
        }else{
            message.config({
                top: 130,
                duration: 1,
            });
            message.warning('该角色已被禁用,不能修改');
        }
    };
    getModals(){
        return <RoleModal  save={(data,reset)=>this.operation.save(data,reset)}/>
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
            id:"roleId",
            status:"archive",
            table:{
                url:"role/getRoleList"
            },
            save:{
                url:"role/saveRole",
                type:"SET_MODAL_STARUS"
            },
            stop:{
                url:"role/setRoleStatus"
            }
        }
    }
    confirm(data){
        this.operation.stopBody(data)
    }
    getColumns(){
        let columns=[{
            title:"操作",
            key:"action",
            fixed:"left",
            width:130,
            render:(text,record)=>{
                let context = record.archive != false ? '启用' : '停用';
                let popConfig={
                    placement:"right",
                    title:`您是否确认${context}该角色`,
                    onConfirm:this.confirm.bind(this,record),
                    okText:"是",
                    cancelText:"否"
                };
                return (<span>
                    <Popconfirm {...popConfig}>
                        <Button type={record.archive == true ? 'danger' : ''} style={{marginLeft: '5px'}}>{context}</Button>
                     </Popconfirm>
                    <Button style={{marginLeft: '5px'}} onClick={()=>this.showModal("edit",record)}>修改</Button>
                </span>)
            }
        },{
            title:'序号',
            dataIndex : "$index",
            width:50
        },{
            title:'角色名称',
            dataIndex: 'roleName'
        },{
            title: '用户数',
            dataIndex: 'userNum',
        }, {
            title: '备注',
            dataIndex: 'roleDesc',
        },{
            title:'角色状态',
            dataIndex: 'archive',
            width: 80,
            render:(value) => {
                let showValue = value != true ? '有效' : '无效';
                let colorStyle= value != true ? "62CB31" :   "E74C3C";
                return (<span  style={{color: colorStyle}} >  <Circle colorStyle={colorStyle}/> <font color={colorStyle}> {showValue} </font> </span>)
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            render:(value) => timeTran(value)
        }, {
            title: '修改时间',
            dataIndex: 'modifyTime',
            render:(value) => timeTran(value)
        }];
        this.setColumns(columns)
    }
}
export default Config