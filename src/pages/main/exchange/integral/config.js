import React from 'react'
import {Card, Button, Modal, Popconfirm,message,Select,Input} from 'antd'
import store from '@src/store/store'
import Page from '@src/class/page'
import IntSearch from './search'
import {timeTran} from "@src/js/until"

class Config  extends Page{
    searchList(data){
        let selectType = data.phone?`&phone=${data.phone}`:""
        store.dispatch({
            type:"SET_TABLE_DATA",
            selectType
        });
        this.loadData({"pageNum":1},false,"GET")
    }
    getOperationPanel(){
        return <Card>
            <IntSearch searchList={(data)=>this.searchList(data)}/>
        </Card>
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
            table:{
                url:"coin/loanExchangeCoinQry"
            }
        }
    }
    getColumns(){
        let columns=[{
            title:'序号',
            dataIndex : "$index",
            width:50
        },{
            title:'操作人',
            dataIndex: 'operatorName'
        },{
            title: '兑换平台',
            dataIndex: 'exchangePlatform',
        }, {
            title: '贷款人',
            dataIndex: 'userName',
        },{
            title:'手机号码',
            dataIndex: 'phone',
        }, {
            title: '兑换金额',
            dataIndex: 'amount',
        }, {
            title: '兑换积分',
            dataIndex: 'coinExchange'
        }, {
            title: '剩余积分',
            dataIndex: 'coinBalance'
        }, {
            title: '流水号',
            dataIndex: 'orderNo',
        }, {
            title: '兑换时间',
            dataIndex: 'modifyTime',
            render:(value) => timeTran(value)
        }];
        this.setColumns(columns)
    }
}
export default Config