import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Input,Spin ,Message} from 'antd';
import {post} from "@src/js/fetch/http";
import store from '@src/store/store'
const { TextArea } = Input;





class CModal extends Component{
    constructor(){
        super();
        this.state={
            refuseVisible:false,
            scaleVisible:false,
            spinning:false,
            scaleImg:"",
            modalWidth:0,
            reson:"",
            fields:[{
                label:"任务名称：",
                key:"name",
                value:"",
            },{
                label:"用户名：",
                key:"userName",
                value:"",
            },{
                label:"手机号码：",
                key:"phone",
                value:"",
            },{
                label:"任务教程：",
                key:"auditImageList",
                type:"array",
                value:[],
            },{
                label:"审核截图：",
                key:"userAuditImageList",
                type:"array",
                value:[],
            }]
        }
    }
    handleCancel=()=>{
        let params={
            type:"SET_MODAL_STARUS",
            visibleOther:false,
        };
        store.dispatch(params)
    }
    refuseCancel=()=>{
        this.setState({
            refuseVisible:false
        })
    }
    scaleCancel=()=>{
        this.setState({
            scaleVisible:false
        })
    }
    scaleClickImg=(imgUrl)=>{
        let img = new Image();
        img.src=imgUrl;
        let modalWidth = (img.height/652>=1) ? img.width/(img.height/652) : img.width;
        img.onload=()=>{
            this.setState({
                scaleVisible:true,
                scaleImg:imgUrl,
                modalWidth
            })
        };
        img.onerror=()=>{
            Message.config({
                top: 130,
                duration: 1,
            });
            Message.warning('图片加载失败');
        }
    }
    agree(){
        let params={},{detail}=this.props;
        params['auditResult']=1;
        params['id']=detail['id'];
        this.props.check(params)
    }
    refuse(){
        this.setState({
            refuseVisible:true
        })
    }
    setReson=(e)=>{
        this.setState({
            reson:e.target.value
        })
    }
    submitReson(){
        let params={},{detail}=this.props,{reson}=this.state;
        params['auditResult']=0;
        params['id']=detail['id'];
        params['reson']=reson;
        this.props.check(params)
    }
    render(){
        let {visibleOther}=this.props,{fields,refuseVisible,reson,spinning,scaleVisible,scaleImg,modalWidth}=this.state;
        return(
                <Modal
                    visible={visibleOther}
                    title="审核任务"
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Spin spinning={spinning}>
                        {
                            fields.map((field,index)=>{
                                return(
                                    <div className="audit-task-list" key={index}>
                                        <p>{field['label']}</p>
                                        {field['type']=="array"?
                                            <div className="audit-task-list-img">{
                                                field['value'].map((imgUrl,index)=>{
                                                    return(
                                                        <div onClick={()=>this.scaleClickImg(imgUrl)} key={index} style={{cursor:"pointer"}}>
                                                            <img  src={imgUrl}/>
                                                        </div>
                                                    )
                                                })
                                            }</div>:
                                            <p>{field['value']}</p>
                                        }
                                    </div>
                                )
                            })
                        }
                    </Spin>
                    <div className="audit-task-btn">
                        <div>
                            <Button type="primary" onClick={()=>this.agree()}>通过</Button>
                        </div>
                        <div>
                            <Button type="primary" onClick={()=>this.refuse()}>拒绝</Button>
                        </div>
                    </div>
                    <Modal
                        title="拒绝原因"
                        visible={refuseVisible}
                        footer={null}
                        onCancel={this.refuseCancel}
                    >
                <TextArea
                    placeholder="请填写拒绝原因"
                    rows={4}
                    value={reson}
                    onChange={(e)=>this.setReson(e)}
                />
                        <Button type="primary" style={{marginTop:20}} onClick={()=>this.submitReson()}>提交</Button>
                    </Modal>
                    <Modal
                        visible={scaleVisible}
                        footer={null}
                        header={null}
                        onCancel={this.scaleCancel}
                        width={modalWidth}
                    >
                        <img style={{width:modalWidth-48}} src={scaleImg}/>
                    </Modal>
                </Modal>
        )
    }
    loadData(){
        let {detail}=this.props,{fields}=this.state;
        this.setState({
            spinning:true
        })
        post("taskAudit/detail",{
            "taskShortName": detail['shortName'],
            "userId": detail['userId']
        }).then((res)=>{
            let {status,data}=res;
            if(status==0){
                fields=fields.map((field)=>{
                    field['value']=data[field['key']];
                    return field
                });
                this.setState({
                    fields,
                    spinning:false
                })
            }
        })
    }
    componentDidMount(){
        this.loadData()
    }
}

class TaskModal extends Component{
    render(){
        let {visibleOther}=this.props;
        return (
            <div>
                {visibleOther && <CModal {...this.props} check={(params)=>this.props.check(params)}/>}
            </div>
        )
    }
}


const modalToProps = ({ modalStatus }) => ({
    visibleOther:modalStatus.visibleOther,
    detail:modalStatus.detail
});
export default connect(modalToProps)(TaskModal)
