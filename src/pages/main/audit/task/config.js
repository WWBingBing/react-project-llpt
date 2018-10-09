import React from 'react'
import {Card, Button} from 'antd'
import Page from '@src/class/page'
import store from '@src/store/store'
import TaskModal from './cModal'
import TaskSearch from './search'
import {timeTran} from "@src/js/until"


class Config  extends Page{
    searchList=(data)=>{
        let param={};
        if(data.archive=="0"){
            param.auditStatus=0;
            param.auditResult="";
        }else if(data.archive=="1"){
            param.auditStatus=1;
            param.auditResult=0;
        }else if(data.archive=="2"){
            param.auditStatus=1;
            param.auditResult=1;
        }else {
            param.auditStatus="";
            param.auditResult="";
        }
        param.phone=data.phone;
        param.taskName=data.taskName;
        param.pageNum=1;
        this.loadData(param)
    };
    getOperationPanel(){
        return <Card>
            <TaskSearch searchList={(data)=>this.searchList(data)}/>
        </Card>
    }
    getModals(){
        return <TaskModal check={(params)=>this.operation.check(params)}/>
    }
    showModal(value){
        let param={
            type:'SET_MODAL_STARUS',
            visibleOther:true,
            detail:value
        };
        store.dispatch(param)
    }
    getStatus(record){
        if(record['auditStatus']==0){
            return <span>未审核</span>
        }else if(record['auditStatus']==1){
            if(record['auditResult']==0){
                return <span style={{color:"#FF5A58"}}>审核不通过</span>
            }else if(record['auditResult']==1){
                return <span style={{color:"#76DB7E"}}>审核通过</span>
            }
        }
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
            status:"archive",
            table:{
                url:"taskAudit/list"
            },
            check:{//审核
                url:"taskAudit/auditCheck"
            }
        }
    }
    getColumns(){
        let StatusObj={
            0:{
                text:"失败",
                color:"E74C3C"
            },
            1:{
                text:"成功",
                color:"62CB31"
            }
        };
        let columns=[{
            title:"操作",
            key:"action",
            fixed:"left",
            width:130,
            render:(text,record)=>{
                return (<span>
                    {record['auditStatus']==0?
                        <Button onClick={()=>this.showModal(record)}>审核</Button>:
                        <Button disabled>已审核</Button>
                    }

                </span>)
            }
        },{
            title:'序号',
            dataIndex : "$index",
            width:50
        },{
            title:'任务名称',
            dataIndex: 'taskName'
        },{
            title: '用户名称',
            dataIndex: 'nickName',
        },{
            title: '登录账号（手机号)',
            dataIndex: 'phone',
        },{
            title: '审核状态',
            dataIndex: 'status',
            width: 100,
            render:(text,record) => {
                return this.getStatus(record)
            }
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            render:(value) => timeTran(value)
        }];
        this.setColumns(columns)
    }
}
export default Config