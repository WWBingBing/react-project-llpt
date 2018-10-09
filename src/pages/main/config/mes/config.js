import React from 'react'
import {Card, Button,Form,Input,Popconfirm,Message} from 'antd'

import Page from '@src/class/page'
import store from '@src/store/store'
import {timeTran} from "@src/js/until"
import Circle from "@src/components/circle"
import {post} from "@src/js/fetch/http";
import MesSearch from './search'
import MesModal from './modal'
const FormItem = Form.Item;

class Config  extends Page{
    searchList(data){
        let selectType="";
        if(data.title && !(data.valid=="")){
            selectType=`&title=${data.title}&valid=${data.valid}`
        }else{
            if(data.title){
                selectType=`&title=${data.title}`
            }
            if(!(data.valid=="")){
                selectType=`&valid=${data.valid}`
            }
        }
        store.dispatch({
            type:"SET_TABLE_DATA",
            selectType
        });
        this.loadData({"pageNum":1},false,"GET")
    }
    getOperationPanel(){
        return <Card>
                <MesSearch searchList={(data)=>this.searchList(data)}/>
            <Button  style={{verticalAlign: "bottom"}}  type="primary" onClick={()=>this.showModal("add")}>添加消息</Button>
        </Card>
    }
    getModals(){
        return <MesModal save={(data,reset)=>this.operation.save(data,reset,"GET")}/>
    }
    constructor(){
        super();
        this.init();
    }
    init(){
        this.getColumns();
        this.initOperationParams();
        this.loadData({"pageNum":1},false,"GET")
    }
    initOperationParams(){
        this.operationParams={
            id:"id",
            status:"valid",
            table:{
                url:"msg/list"
            },
            save:{
                url:"msg/save",
                type:'SET_MODAL_STARUS'
            },
            stop:{
                url:'msg/save'
            }
        }
    }
    confirm(data){
        this.operation.stopBody(data,true,"GET")
    }
    showModal(type,value={}){
        let param={
            type:'SET_MODAL_STARUS',
            visible:true,
            operation:type,
            title:type=="edit"?"修改消息":"添加消息",
            detail:value
        };
        param= type=="edit"? Object.assign(param,{id:value.id}):param;
        if(type=="edit"){
            if(value.valid){
                store.dispatch(param)
            }else{
                Message.config({
                    top: 130,
                    duration: 1,
                });
                Message.warning('该消息已被下架,不能修改');
            }
        }else {
            store.dispatch(param)
        }
    }
    getColumns(){
        let StatusObj={
            0:{
                text:"失效",
                color:"E74C3C"
            },
            1:{
                text:"有效",
                color:"62CB31"
            },
            2:{
                text:"已发送",
                color:"d9d9d9"
            }
        };
        let columns=[{
            title:"操作",
            key:"action",
            fixed:"left",
            width:130,
            render:(text,record)=>{
                let context = record.valid ==0 ? '上架' : '下架';
                let popConfig={
                    placement:"right",
                    title:`您是否确认${context}该消息`,
                    onConfirm:this.confirm.bind(this,record),
                    okText:"是",
                    cancelText:"否"
                };
                return (<span>
                    <Popconfirm {...popConfig}>
                        <Button type={record.valid == 0 ? 'danger' : ''} style={{marginLeft: '5px'}}>{context}</Button>
                     </Popconfirm>
                    <Button style={{marginLeft: '5px'}} onClick={()=>this.showModal("edit",record)}>修改</Button>
                </span>)
            }
        },{
            title:'序号',
            dataIndex: '$index',
            width:50
        },{
            title:'标题',
            dataIndex: 'title'
        },{
            title: '内容',
            dataIndex: 'content',
        }, {
            title:'计划推送时间',
            dataIndex: 'startTime'
        },{
            title: '消息状态',
            dataIndex: 'valid',
            width: 80,
            render:(value) => {
                let showValue = StatusObj[value].text;
                let colorStyle= StatusObj[value].color;
                return (<span  style={{color: colorStyle}} >  <Circle colorStyle={colorStyle}/> <font color={colorStyle}> {showValue} </font> </span>)
            }
        }];
        this.setColumns(columns)
    }
}
export default Config