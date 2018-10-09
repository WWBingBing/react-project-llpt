import React from 'react'
import {Card, Button, Modal, Popconfirm,Select,message} from 'antd'

import Page from '@src/class/page'

import Circle from "@src/components/circle"
import TaskModal from './taskModal'
import CreateModal from './createModal'
import TaskSearch from './search'
import store from '@src/store/store'
import {timeTran} from "@src/js/until"

const Option = Select.Option;
/*const typeObj={
    "1auth_task":"认证查询",
    "2loan_task":"贷款超市",
    "3task_day":"每日任务",
    "other_task":"其他任务",
};*/
const typeObj={
    "task_day":"推荐任务",
    "task_fast":"快速任务",
    "task_super":"高额任务",
};
class Config  extends Page{
    searchList=(data)=>{
        let param={};
        param.pageNum=1;
        Object.assign(param,data);
        this.loadData(param);
    };
    getOperationPanel(){
        return <Card>
            <TaskSearch searchList={(data)=>this.searchList(data)}/>
            <div>
                <Button type="primary"  onClick={()=>this.showModal("add")}>新建任务</Button>
            </div>
        </Card>
    }
    showModal(type,value={}){
        let param={
            type:'SET_MODAL_STARUS',
            visible:true,
            operation:type,
            title:type=="edit"?"修改任务":"新建任务",
            detail:value,
            imageUrl:value.imgIco
        };
        param= type=="edit"? Object.assign(param,{id:value.id}):param;
        if(type=="edit"){
            store.dispatch(param)
            /*if(value.status){
                message.config({
                    top: 130,
                    duration: 1,
                });
                message.warning('该任务已上架,不能修改');
            }else{
                store.dispatch(param)
            }*/
        }else {
            store.dispatch(param)
        }
    };
    createModal(value){
        let param={
            type:'SET_MODAL_STARUS',
            visibleOther:true,
            // id:value.id,
            detail:value
        };
        store.dispatch(param)
        /*if(value.status){
            message.config({
                top: 130,
                duration: 1,
            });
            message.warning('该任务已上架,不能修改');
        }else{
            store.dispatch(param)
        }*/
    }
    getModals(){
        return <div>
            <TaskModal save={(data,reset)=>this.operation.save(data,reset)}/>
            <CreateModal/>
        </div>
    }
    constructor(){
        super();
        this.init();
    }
    init(){
        this.getColumns();
        this.initOperationParams();
        this.loadData();
    }
    confirm(data){
        this.operation.stop(data)
    }
    initOperationParams(){
        this.operationParams={
            id:"id",
            status:"status",
            table:{
                url:"task/list"
            },
            save:{
                url:"task/save",
                type:'SET_MODAL_STARUS'
            },
            stop:{
                url:'task/status?id='
            }
        };
    }
    getColumns(){
        let columns=[{
            title:"操作",
            key:"action",
            fixed:"left",
            width:130,
            render:(text,record)=>{
                let context = record.status == false ? '上架' : '下架';
                let popConfig={
                        placement:"right",
                        title:`您是否确认${context}该任务`,
                        onConfirm:this.confirm.bind(this,record),
                        okText:"是",
                        cancelText:"否"
                    };
                return (<span>
                    <Popconfirm {...popConfig}>
                        <Button type={record.status == true ? '' : 'danger'} style={{marginLeft: '5px'}}>{context}</Button>
                     </Popconfirm>
                    <Button style={{marginLeft: '5px'}} onClick={()=>this.showModal("edit",record)}>修改</Button>
                    <Button type="primary" style={{marginTop: '5px',width:"100%"}} onClick={()=>this.createModal(record)}>任务模板</Button>
                </span>)
            }
        },{
            title : "序号",
            dataIndex : "$index",
            width:50
        },{
            title:'任务名称',
            dataIndex: 'name'
        },{
            title: '简称',
            dataIndex: 'shortName'
        },{
            title: '任务类型',
            dataIndex: 'type',
            width:80,
            render:(value)=> typeObj[value]
        },{
            title: '客户端类型',
            width:80,
            dataIndex: 'clientType',
            render:(value)=> {
                return value?value:"全部"
            }
        },{
            title:'任务状态',
            dataIndex: 'status',
            width: 80,
            render:(value) => {
                let showValue = value == true ? '有效' : '无效';
                let colorStyle= value == true ? "62CB31" :   "E74C3C";
                return (<span  style={{color: colorStyle}} >  <Circle colorStyle={colorStyle}/> <font color={colorStyle}> {showValue} </font> </span>)
            }
        },{
            title: '人工审核',
            dataIndex: 'auditType',
            width: 80,
            render:(value)=>{
                return (
                    value==0?<span>否</span>:<span style={{color:"#E74C3C"}}>是</span>
                )
            }
        },{
            title: 'appId',
            dataIndex: 'appId',
            width:80
        },{
            title: '今日任务完成数',
            dataIndex: 'dayComplete',
        },{
            title: '今天任务剩余数',
            dataIndex: 'daySurplus',
        },{
            title: '任务总完成数',
            dataIndex: 'zoneComplete',
        },{
            title: '原价格',
            dataIndex: 'coininit',
            render:(value)=>{
                return <span>{value?value+"￥":"0￥"}</span>
            }
        },{
            title: '金币奖励数',
            dataIndex: 'coinAward',
        }, {
            title: '每天放量数',
            dataIndex: 'dayMax',
        }, {
            title: '开始时间',
            dataIndex: 'startTime',
            width: 100,
            render:(value) => timeTran(value)
        }, {
            title: '结束时间',
            dataIndex: 'endTime',
            width: 100,
            render:(value) => timeTran(value)
        }, {
            title: '图片',
            dataIndex: 'imgIco',
            render:(value) => {
                return(
                    <span>
                        {value?<img style={{width:100,height:50}} src={value} />:null}
                    </span>
                )
            }
        }];
        this.setColumns(columns)
    }

}
export default Config