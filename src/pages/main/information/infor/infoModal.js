import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,Upload,Icon,Select} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState ,ContentState,convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import store from '@src/store/store'
import {post} from "@src/js/fetch/http"
const FormItem = Form.Item;
const Option = Select.Option

class modals extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            editorState:EditorState.createEmpty(),
            imageUrl:''
        }
    }
    setUrl=(url)=>{
        this.setState({
            imageUrl:url
        })

    };
    //图片上传
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    beforeUpload=(file)=> {
        this.getBase64(file, imageUrl => this.setUrl(imageUrl));
        return false;
    };
    handleChange=(info)=> {
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl => this.setUrl(imageUrl));
        }
    };
    uploadImageCallBack=(file)=>{
            let reader = new FileReader(file);
            return new Promise((resolve, reject)=>{
                reader.onload = function (e) {
                    resolve(e.target.result)
                };
                reader.readAsDataURL(file);
            }).then((url)=>{
                return post("system/image/getUrl",{imageBase64:url}).then((res)=>{
                    let {data}=res;
                    return {data: {link: data}}
                })
            })
    };
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    handleCancel=()=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            visible:false,
            detail:{},
            imageUrl:''
        });
        this.setState({
            editorState:EditorState.createEmpty(),
            imageUrl:''
        })
        this.props.form.resetFields();
    };
    handleOk=(e)=>{
        let {editorState,imageUrl}=this.state,{id,operation}=this.props;
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if(!err){
                formData.infoData=draftToHtml(convertToRaw(editorState.getCurrentContent()));
                formData.infoTitle=formData.title;
                formData.type=formData.type;
                formData.sortNum=formData.sortNum;
                formData.imageBase64=imageUrl;
                delete formData.imageUrl;
                operation=="edit"?Object.assign(formData,{infoId:id}):Object.assign(formData,{infoId:0});
                this.props.save(formData,this.props.form);
                this.setState({
                    editorState:EditorState.createEmpty(),
                    imageUrl:''
                })
            }
        })
    };
    render(){
        let {visible,title,type,sortNum,detail}=this.props,
            {getFieldDecorator} = this.props.form,
            {editorState,imageUrl} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return(
            <Modal
                title={title}
                visible={visible}
                type={type}
                sortNum={sortNum}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Form  onSubmit={this.handleOk}>
                    <FormItem label="资讯标题">
                        {getFieldDecorator('title', {
                            initialValue:detail["title"],
                            rules: [{
                                required: true,message: '资讯标题不能为空'
                            }]
                        })(
                            <Input placeholder="请输入资讯标题" />
                        )}
                    </FormItem>
                    <FormItem label="资讯排序"  style={{ width: 120 }}>
                        {getFieldDecorator('sortNum', {
                            initialValue:detail['sortNum'],
                            width:120,
                            rules: [{
                                required: true,message: '资讯排序不能为空'
                            }]
                        })(
                            <Input placeholder="请输入资讯排序" />
                        )}
                    </FormItem>
                    <FormItem label='资讯类型'>
                        {getFieldDecorator('type', {
                            initialValue: "0",
                            rules: [{
                                required: true,message: '请选择资讯类型'
                            }]
                        })(
                            <Select style={{ width: 120 }}>
                                <Option value="0">资讯</Option>
                                <Option value="1">h5</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="资讯内容">
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={this.onEditorStateChange}
                            editorClassName="demo-editor"
                            localization={{ locale: 'zh' }}
                            toolbar={{
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true },
                                image: {
                                    uploadCallback: this.uploadImageCallBack,
                                    previewImage: true
                                },
                            }}
                        />
                    </FormItem>
                    <FormItem label="上传封面图片">
                        {getFieldDecorator('imageUrl', {
                            initialValue:imageUrl,
                            rules:[{required: true, message:'封面图片不能为空'}],
                        })(
                            <Upload
                                showUploadList={false}
                                className="uploadImg"
                                listType="picture-card"
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}>
                                {
                                    imageUrl ?
                                        <img src={imageUrl} style={{width:200,height:100}}/> :
                                        uploadButton
                                }
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button  htmlType='submit' type='primary'>提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
    componentDidMount(){
        store.subscribe(()=>{
            setTimeout(()=>{
                let {detail,imageUrl}=this.props;
                if(detail.id){
                    const blocksFromHTML = htmlToDraft(detail['data']);
                    const state = ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap
                    );
                     this.setState({
                         editorState:EditorState.createWithContent(state),
                         imageUrl:imageUrl,
                         type:detail.type,
                         sortNum:detail.sortNum
                     })
                }
            })


        })
    }
}

const TaskModal=Form.create()(modals);


const modalToProps = ({ modalStatus }) => ({
    visible:modalStatus.visible,
    title:modalStatus.title,
    type:modalStatus.type,
    sortNum:modalStatus.sortNum,
    id:modalStatus.id,
    operation:modalStatus.operation,
    imageUrl:modalStatus.imageUrl,
    detail:modalStatus.detail
});
export default connect(modalToProps)(TaskModal)