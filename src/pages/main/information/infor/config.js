import React from 'react'
import {Card, Button, Modal, Popconfirm,Select,message} from 'antd'

import Page from '@src/class/page'

import Circle from "@src/components/circle"
import InfoModal from './infoModal'
import store from '@src/store/store'
import InfoSearch from './search'
import {timeTran} from "@src/js/until"
const Option = Select.Option;

class Config  extends Page{
    searchList(data){
        let selectType=data.title?`?title=${data.title}`:"";
        store.dispatch({
            type:"SET_TABLE_DATA",
            selectType
        });
        this.loadData();
    }
    getOperationPanel(){
        return <Card>
            <InfoSearch  searchList={(data)=>this.searchList(data)}/>
            <Button  style={{verticalAlign: "bottom"}} type="primary" onClick={()=>this.showModal("add")}>添加资讯</Button>
        </Card>
    }
    showModal(type,value={}){
        let param={
            type:'SET_MODAL_STARUS',
            visible:true,
            operation:type,
            title:type=="edit"?"修改资讯":"添加资讯",
            imageUrl:value.imageUrl,
            detail:value
        };
        param= type=="edit"? Object.assign(param,{id:value.id}):param;
        if(type=="edit"){
            if(value.status){
                store.dispatch(param)
            }else{
                message.config({
                    top: 130,
                    duration: 1,
                });
                message.warning('该资讯已被下架,不能修改');
            }
        }else {
            store.dispatch(param)
        }
    };
    getModals(){
        return <InfoModal save={(data,reset)=>this.operation.save(data,reset)}/>
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
                url:"info/list"
            },
            save:{
                url:"info/save",
                type:'SET_MODAL_STARUS'
            },
            stop:{
                url:'info/status?infoId='
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
                </span>)
            }
        },{
            title : "资讯排序",
            dataIndex : "sortNum",
            width:80
        },{
            title:'资讯类型',
            dataIndex: 'type',
            width: 80,
            render:(value) => {
                let showValue = value == 0 ? '资讯' : 'H5';
                return ( <span>{showValue} </span>)
            }
        },{
            title:'资讯标题',
            dataIndex: 'title'
        },{
            title:'资讯状态',
            dataIndex: 'status',
            width: 80,
            render:(value) => {
                let showValue = value == true ? '有效' : '无效';
                let colorStyle= value == true ? "62CB31" :   "E74C3C";
                return (<span  style={{color: colorStyle}} >  <Circle colorStyle={colorStyle}/> <font color={colorStyle}> {showValue} </font> </span>)
            }
        }];
        this.setColumns(columns)
    }

}
export default Config