import React, {Component} from "react"
import { connect } from 'react-redux'

import {Card, Button, Table ,Message} from 'antd'

import MTable from "../components/table/index"

import store from '@src/store/store'


import {post} from "@src/js/fetch/http"


export default class Page{
    loadData(data={"pageNum": 1},bool=false,methods="POST"){
        if(methods=="POST"){
            let {tableData:{searchData}}=store.getState();
            let storeParam={
                type:'SET_TABLE_DATA',
                loading:true,
                postMethods:"POST"
            },{tableData:{selectType}}=store.getState();
            bool?storeParam:Object.assign(storeParam,{dataSource:[]});
            Object.assign(searchData,data,{"pageSize" : 10});
            store.dispatch(storeParam,searchData);
            post(this.operationParams.table.url+selectType,searchData).then((res)=>{
                let {status, data:{list,total}}=res;
                if(status==0){
                    store.dispatch({
                        type:'SET_TABLE_DATA',
                        loading:false,
                        dataSource:list,
                        total:total,
                        current:data["pageNum"]
                    });
                }
            })
        }else if(methods=="GET"){
            let storeParam={
                type:'SET_TABLE_DATA',
                loading:true,
                postMethods:"GET"
            },{tableData:{selectType}}=store.getState();
            bool?storeParam:Object.assign(storeParam,{dataSource:[],"pageSize" : 10,"pageNum": 1})
            store.dispatch(Object.assign(storeParam));
            post(this.operationParams.table.url+"?size=10&page="+data.pageNum+selectType,{},"GET").then((res)=>{
                let {status, data:{list,total,pageNum}}=res;
                if(status==0){
                    store.dispatch({
                        type:'SET_TABLE_DATA',
                        loading:false,
                        dataSource:list,
                        total:total,
                        current:pageNum
                    });
                }
            })
        }
    }
    setColumns(data){
        store.dispatch({
            type:'SET_TABLE_DATA',
            columns:data
        })
    }
    getModals(){
        return null
    }
    getOperationPanel(){
        return null
    }
    operation={
        save:(data,reset,methods="POST")=> {
            let {tableData:{current}}=store.getState(),
                {modalStatus:{operation}}=store.getState();
            let pageNum= operation=="edit" ? {"pageNum":current}:{"pageNum": 1};
            post(this.operationParams.save.url,data).then((res)=>{
                store.dispatch({
                    type:this.operationParams.save.type,
                    visible:false,
                    imageUrl:'',
                    detail:{}
                });
                if(!res.status){
                    reset.resetFields();
                    this.loadData(pageNum,false,methods);
                }else{
                    Message.config({
                        top: 130,
                        duration: 1,
                    });
                    Message.warning(res.message+"!  "+res.details)
                }
            })
        },
        stop:(data)=>{
            let {tableData:{current}}=store.getState();
            let id=data[this.operationParams.id],status=data[this.operationParams.status]?0:1;
            post(this.operationParams.stop.url+id+"&status="+status).then((res)=>{
                if(res.status==0){
                    this.loadData({"pageNum":current},true)
                }else{
                    Message.config({
                        top: 130,
                        duration: 1,
                    });
                    Message.warning(res.details)
                }
            })
        },
        stopBody:(data,bool=true,methods="POST")=>{
            let {tableData:{current}}=store.getState(),param={};
            let keyId=this.operationParams.id,keyStatus=this.operationParams.status;
            param[keyId]=data[keyId];
            param[keyStatus]=Number(!data[keyStatus]);
            post(this.operationParams.stop.url,param).then((res)=>{
                if(res.status==0){
                    this.loadData({"pageNum":current},bool,methods)
                }else{
                    Message.config({
                        top: 130,
                        duration: 1,
                    });
                    Message.warning(res.details)
                }
            })
        },
        check:(data)=>{//审核
            let {tableData:{current}}=store.getState();
            post(this.operationParams.check.url,data).then((res)=>{
                if(res.status==0){
                    let params={
                        type:"SET_MODAL_STARUS",
                        visibleOther:false,
                        refuseVisible:false,
                    };
                    store.dispatch(params);
                    this.loadData({"pageNum":current},true)
                }else{
                    Message.config({
                        top: 130,
                        duration: 1,
                    });
                    Message.warning(res.details)
                }
            })
        }
    };
    operationParams={};
    render(){
        return(
            <div>
                {this.getModals()}
                {this.getOperationPanel()}
                <Card>
                    <MTable rowkey={this.operationParams.id} loadData={this.loadData.bind(this)}/>
                </Card>
            </div>
        )
    }
}


