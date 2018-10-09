import React from 'react'
import {Card, Button, Modal, Popconfirm,Select,message} from 'antd'
import store from '@src/store/store'

import Page from '@src/class/page'
import ProSearch from './search'
import ProModal from './modal'

import {timeTran} from "@src/js/until"
import Circle from "@src/components/circle"


class Config  extends Page{
    searchList(data){
        let param={};
        if(data.status=="false"){
            param.status=false;
        }else if(data.status=="true"){
            param.status=true;
        }else {
            param={};
            store.dispatch({
                type:"DEL_TABLE_DATA",
                value:"status"
            })
        }
        param.name=data.name;
        param.pageNum=1;
        this.loadData(param);
    }
    getModals(){
        return <ProModal  save={(data,reset)=>this.operation.save(data,reset)}/>
    }
    getOperationPanel(){
        return <Card>
            <ProSearch  searchList={(data)=>this.searchList(data)}/>
            <Button  style={{verticalAlign: "bottom"}}  type="primary" onClick={()=>this.showModal("add")}>添加产品</Button>
        </Card>
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
    confirm(data){
        this.operation.stop(data)
    }
    showModal(type,value={}){
        let param={
            type:'SET_MODAL_STARUS',
            visible:true,
            operation:type,
            title:type=="edit"?"修改产品信息":"新建产品",
            detail:value,
            imageUrl:value.imgIco
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
                message.warning('该任务已被下架,不能修改');
            }
        }else {
            store.dispatch(param)
        }
    }
    initOperationParams(){
        this.operationParams={
            id:"id",
            status:"status",
            table:{
                url:"product/list"
            },
            save:{
                url:"product/save",
                type:'SET_MODAL_STARUS'
            },
            stop:{
                url:'product/status?id='
            }
        }
    }
    getColumns(){
        const typeS={
                "1":"普通商品",
                "2":"影视卡",
                "3":"手机充值",
                "4":"加油卡"
            };
        let columns=[{
            title:"操作",
            key:"action",
            fixed:"left",
            width:130,
            render:(text,record)=>{
                let context = record.status == false ? '上架' : '下架';
                let popConfig={
                    placement:"right",
                    title:`您是否确认${context}该产品`,
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
            title:'序号',
            dataIndex: '$index',
            width:50
        },{
            title:'产品名称',
            dataIndex: 'name'
        }, {
            title: '产品发布状态',
            dataIndex: 'status',
            width:80,
            render:(value)=>{
                let showValue = value == true ? '已发布' : '未发布';
                let colorStyle= value == true ? "62CB31" :   "E74C3C";
                return (<span  style={{color: colorStyle}} >  <Circle colorStyle={colorStyle}/> <font color={colorStyle}> {showValue} </font> </span>)
            }
        },{
            title:"商品类型",
            dataIndex: 'type',
            render:(value)=>{
                return value?typeS[value]:"其他"
            }
        }, {
            title: '是否为虚拟商品',
            dataIndex: 'virtualFlag',
            render:(value)=>{
                return value?"是":"否"
            }
        },{
            title:'是否有额外信息',
            dataIndex: 'extraInfo',
            render:(value)=>{
                return value?"是":"否"
            }
        },{
            title: '备注',
            dataIndex: 'remark',
            render:(value)=>{
                return value?value:"无"
            }
        },{
            title: '库存数量',
            dataIndex: 'amount',
        }, {
            title: '原始价值',
            dataIndex: 'value',
        }, {
            title: '原始价值单位',
            dataIndex: 'unit',
        }, {
            title: '金币价值',
            dataIndex: 'coin',
        },{
            title:'平均采购价格',
            dataIndex: 'purchasePrice'
        },{
            title: '上架时间',
            dataIndex: 'upTime',
            render:(value) => timeTran(value)
        }, {
            title: '下架时间',
            dataIndex: 'downTime',
            render:(value) => timeTran(value)
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            render:(value) => timeTran(value)
        }, {
            title: '更新时间',
            dataIndex: 'modifyTime',
            render:(value) => timeTran(value)
        }, {
            title: '图片',
            dataIndex: 'imgIco',
            render:(value) => {
                return(
                    <span>
                        {value?<img style={{width:100,height:"auto"}} src={value} />:null}
                    </span>
                )
            }
        }];
        this.setColumns(columns)
    }
}
export default Config


