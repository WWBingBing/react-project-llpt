import React,{Component} from "react"
import { Modal,Table} from 'antd';
import {post} from "@src/js/fetch/http";
import store from '@src/store/store'
import { connect } from 'react-redux'
let statusType={
    "1":{
        text:"进行中",
        icon:require("@src/static/loading.png"),
        color:"#54B3F5"
    },
    '7':{
        text:"之前已注册",
        icon:require("@src/static/error.png"),
        color:"#FF5A58"
    },
    "9":{
        text:"错误",
        icon:require("@src/static/error.png"),
        color:"#FF5A58"
    },
    "100":{
        text:"成功",
        icon:require("@src/static/finish.png"),
        color:"#76DB7E"
    }
};

class TaskStatus extends Component{
    constructor(){
        super();
        this.state={
            dataSource:[],
            current:1,
            total:10,
            loading:false
        }
    }
    handleCancel=()=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            visibleTask:false
        });
    };
    column(){
      let columns=[{
          title:'序号',
          dataIndex: '$index',
          width:80
      },{
          title:'任务名称',
          dataIndex: 'taskName'
      },{
          title:'头像',
          dataIndex: 'imgIco',
          render:(value)=>{
              return <img style={{width:50,height:50}} src={value}/>
          }
      },{
          title: '金币数',
          dataIndex: 'coinAward',
      },{
          title: '完成状态',
          dataIndex: 'status',
          render:(value)=>{
              return (<div style={{display:"flex"}}>
                  <img style={{marginRight:5}} src={statusType[`${value}`].icon}/>
                  <span style={{"color":statusType[`${value}`].color}}>{statusType[`${value}`].text}</span>
              </div>)
          }
      }];
      return columns
    }
    getTable(){
        let {dataSource,current,loading,total}=this.state;
        let pagination={
            pageSize : 10,
            current : current,
            total : total,
            showTotal:total => `共 ${total} 条数据`,
            onChange : (page)=>{
                this.loadData(page);
            }
        };
        dataSource.forEach((item,index)=>{
            item["$index"] =( current -1 ) * 10 + index + 1;
        });
        return (
            <Table
                rowKey={(data)=>data.id}
                columns={this.column()}
                dataSource={dataSource}
                pagination={pagination}
                loading={loading}
            />
        )
    }
    render(){
        let { visibleTask }=this.props;
        return(
            <Modal
                title={"任务状态"}
                visible={visibleTask}
                onCancel={this.handleCancel}
                footer={null}
            >
                {this.getTable()}
            </Modal>
        )
    }
    loadData(current=1){
        let {id} = this.props,params={pageNum:current,pageSize:10};
        this.setState({
            loading:true
        });
        post('task/userTaskList?userId='+id,params).then((res)=>{
            let {status,data}=res;
            if(status==0){
                this.setState({
                    dataSource:data['list'],
                    current:data['pageNum'],
                    total:data['total'],
                    loading:false
                })
            }
        })
    }
    componentDidMount(){
        this.loadData();
    }
}
const modalToProps = ({ modalStatus }) => ({
    visibleTask:modalStatus.visibleTask,
    id:modalStatus.id
});
export default connect(modalToProps)(TaskStatus)

