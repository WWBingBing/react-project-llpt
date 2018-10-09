import React, { Component }from 'react'
import {Card, Button,Input,Spin,Message} from 'antd'
import {post} from "@src/js/fetch/http";

class CreateTask extends Component {
    constructor(){
        super();
        this.state={
            lists:[],
            searchMes:"",
            taskShortName:"",
            spinning:false
        }
    }
    getSearch(){
        let {searchMes}=this.state;
        this.setState({
            spinning:true
        })
        post('task/search?keywords='+searchMes).then((res)=>{
            let {status,data}=res;
            if(status==0){
                this.setState({
                    lists:data,
                    spinning:false
                })
            }
        })
    }
    createName(){
        let {taskShortName,searchMes}=this.state;
        Message.config({
            top: 130,
            duration: 1,
        });

        if(!(/^[A-Za-z]+$/.test(taskShortName))){
            Message.warning('简称必须为群英文字母');
            return false
        }
        post("task/create?keywords="+searchMes+"&taskShortName="+taskShortName).then((res)=>{
            let {status}=res;
            if(status==0){
                this.setState({
                    createName:''
                });
                Message.success('创建成功');
            }
        })
    }
    render() {
        let {lists,searchMes,taskShortName,spinning}=this.state;
        return (
            <Card>
                <div className="create-task-card">
                    <div className="left">
                        <Input placeholder="请输入关键字" style={{width:180}} value={searchMes} onChange={(e)=>this.setState({searchMes:e.target.value})}/>
                        {
                            lists.length>0 && <Input placeholder="请输入任务简称(字母)" style={{width:180}} value={taskShortName} onChange={(e)=>this.setState({taskShortName:e.target.value})}/>
                        }
                        <div >
                            <Button style={{marginRight:20}} type="primary" onClick={()=>this.getSearch()}>搜索</Button>
                            {
                                lists.length>0 && <Button type="primary" onClick={()=>this.createName()}>生成</Button>
                            }
                        </div>
                    </div>
                    <div className="right">
                        <Spin spinning={spinning}>
                            <ul>
                                <li>游戏列表</li>
                                {lists.length>0?lists.map((list,index)=>{
                                    return(
                                        <li key={index}>{list}</li>
                                    )
                                }):<li style={{color:"#ccc"}}>空</li>}
                            </ul>
                        </Spin>
                    </div>
                </div>
            </Card>
        )
    }

}

export default CreateTask