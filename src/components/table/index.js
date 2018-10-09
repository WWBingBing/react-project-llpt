import React, {Component} from "react"

import {Card, Button, Table } from 'antd'

import { connect } from 'react-redux'


class MTable extends Component{
    changePage(page){
        let {loadData,postMethods}=this.props;
        loadData({"pageNum":page},false,postMethods);
    }
    render(){
        let {columns,dataSource,loading,total,current,rowkey} = this.props;
        let pagination={
                pageSize : 10,
                current : current,
                total : total,
                showTotal:total => `共 ${total} 条数据`,
                onChange : (page)=>{
                    this.changePage(page);
                }
            };
        dataSource.forEach((item,index)=>{
            item["$index"] =( current -1 ) * 10 + index + 1;
        });

        return(
            <Table rowKey={data=>data[rowkey]} pagination={pagination} loading={loading} bordered dataSource={dataSource} columns={columns}/>
        )
    }
}

const tableToProps = ({tableData }) => ({
    loading:tableData.loading,
    columns:tableData.columns,
    dataSource:tableData.dataSource,
    total:tableData.total,
    current:tableData.current,
    postMethods:tableData.postMethods
});

export default connect(tableToProps)(MTable)

