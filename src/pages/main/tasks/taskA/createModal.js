import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,Upload,Icon ,Message ,Spin} from 'antd';
import {post} from "@src/js/fetch/http";
import {SectionToChinese} from '@src/js/until'
import store from '@src/store/store'






class CModal extends Component{
    constructor(){
        super();
        this.state={
            stepList:[""],
            auditLable:"",
            auditImageList:[],
            loading:false,
            spinning:false,
        }
    }
    handleCancel=()=>{
        let params={
            type:"SET_MODAL_STARUS",
            visibleOther:false,
        };
        store.dispatch(params)
    }
    addList(){
        let {stepList}=this.state;
        stepList.push("");
        this.setState({
            stepList:[...stepList]
        })
    }
    delList(index){
        let {stepList}=this.state;
        stepList.splice(index,1);
        this.setState({
            stepList:[...stepList]
        })
    }
    setValue(e,index){
        let {stepList}=this.state;
        stepList[index]=e.target.value;
        this.setState({
            stepList:[...stepList]
        })
    }
    setLable(e){
        this.setState({
            auditLable:e.target.value
        })
    }
    //图片上传
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    setUrl=(imageUrl)=>{
        let {auditImageList}=this.state;
        auditImageList.push({
            uid: Math.random(),
            status: 'done',
            url: imageUrl,
        });
        this.setState({
            auditImageList
        })
    }
    beforeUpload=(file)=> {
        this.getBase64(file, imageUrl => this.setUrl(imageUrl));
        return false;
    };
    handleChange=(info)=> {
        let {file,fileList}=info;
        if (file.status === 'removed') {
            this.setState({
                auditImageList:[...fileList]
            })
        }
    };
    submitBtn(){
        Message.config({
            top: 150,
            duration: 1,
        });
        let params={},{detail}=this.props,{stepList,auditLable,auditImageList}=this.state;
        params['taskId']=detail['id'];
        if(!stepList.every(list=>list)){
            Message.warning("步骤不能为空");
            return false
        }
        params['taskStepdeList']=stepList;
        auditImageList=auditImageList.map(({url})=>{
            return url
        })
        params = !!detail['auditType'] ? Object.assign(params,{auditImageList,auditLable}):params;
        this.setState({
            loading:true
        });
        post("taskAudit/templateMod",params).then((res)=>{
            let {status}=res;
            Message.config({
                top: 150,
                duration: 1,
            });
            if(status==0){
                Message.success("操作成功");
                this.handleCancel()
            }else {
                Message.warning("操作失败");
                this.setState({
                    loading:false
                })
            }
        })
    }
    render(){
        let {visibleOther,detail}=this.props,{stepList,auditLable,auditImageList,loading,spinning}=this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return(<Modal
            visible={visibleOther}
            title={detail['name']}
            footer={null}
            onCancel={this.handleCancel}
        >
            <Spin spinning={spinning}>
                {stepList.map((item,index)=>{
                    return (<div key={index} style={{display:'flex',alignItems:"center",marginBottom:12}}>
                        <div style={{width:80}}>{`第${SectionToChinese(index+1)}步`}</div>
                        <Input style={{flex:1}} value={item} onChange={(e)=>this.setValue(e,index)}/>
                        {
                            index>0?<div className="createModalIconDel" onClick={()=>this.delList(index)}>
                                <Icon type={'minus'}  style={{fontSize:16}}/>
                            </div>:<div className="createModalIconDel" onClick={()=>this.addList()}>
                                <Icon type={'plus'} />
                            </div>
                        }
                    </div>)
                })}
                {
                    !!detail['auditType'] && <div style={{display:'flex',alignItems:"center",marginBottom:12}}>
                        <div style={{width:80}}>审核描述</div>
                        <Input style={{flex:1}} value={auditLable} onChange={(e)=>this.setLable(e)}/>
                    </div>
                }
                {
                    !!detail['auditType'] && <div style={{display:'flex',marginBottom:12}}>
                        <div style={{width:80}}>图片</div>
                        <Upload
                            className="uploadImgCreate"
                            listType="picture-card"
                            fileList={auditImageList}
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}>
                            {uploadButton}
                        </Upload>
                    </div>
                }
            </Spin>
            <Button loading={loading} type="primary" onClick={()=>this.submitBtn()}>提交</Button>
        </Modal>)
    }
    loadData(){
        let {detail}=this.props,imgList=[];
        this.setState({
            spinning:true
        });
        post("taskAudit/templateDetail?taskShortName="+detail['shortName']).then((res)=>{
            let {status,data}=res;
            this.setState({
                spinning:false
            });
            if(status==0&&data){
                if(data['auditType']){
                    imgList =data["auditImageList"].map((url)=>{
                        return{
                            uid: Math.random(),
                            status: 'done',
                            url: url,
                        }
                    })
                }
               this.setState({
                   stepList:data['taskStepdeList'],
                   auditLable:data['auditLable'],
                   auditImageList:imgList,
               })
            }
        })
    }
    componentDidMount(){
        this.loadData()
    }
}
const CModalF=Form.create()(CModal);

class CreateModal extends Component{
    render(){
        let {visibleOther}=this.props;
        return (
            <div>
                {visibleOther && <CModalF {...this.props}/>}
            </div>
        )
    }
}


const modalToProps = ({ modalStatus }) => ({
    visibleOther:modalStatus.visibleOther,
    detail:modalStatus.detail
});
export default connect(modalToProps)(CreateModal)
