import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,DatePicker,InputNumber,Upload,Icon  } from 'antd';

import moment from 'moment'

import {getFilterValue ,timeTran} from "@src/js/until"

import store from '@src/store/store'
import Select from '@src/components/select'

const FormItem = Form.Item;
const typeData=[{
        text:"推荐任务",
        value:"task_day"
    },{
        text:"快速任务",
        value:"task_fast"
    },{
        text:"高额任务",
        value:"task_super"
    }];
class modals extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            startValue: null,
            endValue: null
        }
    }
    handleCancel=()=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            visible:false,
            detail:{},
            imageUrl:''
        });
        this.props.form.resetFields();
    };
    //日期选择框函数
    disabledStartDate=(startValue)=> {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate=(endValue)=> {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }
    onStartChange=(value)=> {
        this.onChange('startValue', value);
    };
    onEndChange=(value)=> {
        this.onChange('endValue', value);
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
    setUrl=(url)=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            imageUrl:url
        })
    };
    getForm(data){
        const {getFieldDecorator} = this.props.form;
        let field=[{
            name: "name",
            label: "任务名称",
            cmp: Input,
            config: {
                placeholder: "请输入任务名称"
            },
            initialValue:data["name"],
            rules: [{
                required: true, message: '请输入任务名称',
            }]
        },{
            name: "shortName",
            label: "简称",
            cmp: Input,
            config: {
                placeholder: "请输入简称"
            },
            initialValue:data["shortName"],
            rules: [{
                required: true, message: '请输入简称',
            }]
        },{
            name: "des",
            label: "任务描述",
            cmp: Input,
            config: {
                placeholder: "请输入任务描述"
            },
            initialValue:data["des"],
            rules: [{
                required: true, message: '请输入任务描述',
            }]
        },{
            name: "type",
            label: "任务类型",
            cmp: Select,
            config: {
                placeholder: "请选择任务类型",
                dataSource:typeData
            },
            initialValue:data["type"]?data["type"]+"":"task_day",
            rules: [{
                required: true, message: '请选择任务类型',
            }]
        },{
            name: "clientType",
            label: "客户端类型",
            cmp: Select,
            config: {
                placeholder: "请选择客户端类型",
                dataSource:[{
                    text:"全部",value:"all"
                },{
                    text:"android",value:'android'
                },{
                    text:"ios",value:'ios'
                }]
            },
            initialValue:data["clientType"]?data["clientType"]+"":"all",
            rules: [{
                required: true, message: '请选择客户端类型',
            }]
        },{
            name: "auditType",
            label: "是否人工审核",
            cmp: Select,
            config: {
                dataSource:[{
                    text:"否",value:'0'
                },{
                    text:"是",value:'1'
                }]
            },
            initialValue:data["auditType"]?data["auditType"]+"":"0",
            rules: [{
                required: true, message: '请选择审核类型',
            }]
        },{
            name: "url",
            label: "任务H5",
            cmp: Input,
            config: {
                placeholder: "请输入任务H5"
            },
            initialValue:data["url"]
        },{
            name: "appId",
            label: "appId",
            cmp: Input,
            config: {
                placeholder: "请输入appId"
            },
            initialValue:data["appId"]
        },{
            name: "coininit",
            label: "原价格",
            cmp: InputNumber,
            config: {
                placeholder: "请输入原价格",
                max:9999999
            },
            initialValue:data["coininit"],
            rules: [{
                required: true, message: '请输入原价格',
            }]
        },{
            name: "coinAward",
            label: "金币奖励数",
            cmp: InputNumber,
            config: {
                placeholder: "请输入金币奖励数",
                max:10000
            },
            initialValue:data["coinAward"],
            rules: [{
                required: true, message: '请输入金币奖励数',
            }]
        },{
            name: "dayMax",
            label: "每天放量数",
            cmp: InputNumber,
            config: {
                placeholder: "请输入每天放量数",
                max:9999999
            },
            initialValue:data["dayMax"],
            rules: [{
                required: true, message: '每天放量数',
            }]
        },{
            name: "startTime",
            label: "开始日期",
            cmp: DatePicker,
            config: {
                placeholder: "请选择开始时间",
                disabledDate:this.disabledStartDate,
                format:"YYYY-MM-DD",
                onChange:this.onStartChange,
                showToday:false,
            },
            initialValue:moment(moment(data["startTime"]).format('YYYY-MM-DD')),
            rules: [{
                required: true, message: '开始时间不能为空',
            }]
        },{
            name: "endTime",
            label: "结束日期",
            cmp: DatePicker,
            config: {
                placeholder: "请选择结束时间",
                disabledDate:this.disabledEndDate,
                format:"YYYY-MM-DD",
                onChange:this.onEndChange,
                showToday:false,
            },
            initialValue:moment(moment(data["endTime"]).format('YYYY-MM-DD')),
            rules: [{
                required: true, message: '结束时间不能为空',
            }]
        }];
        return field.map((field, index) => {
            return <FormItem label={field.label} key={index}>
                {getFieldDecorator(field.name, getFilterValue(field))(
                    React.createElement(field.cmp, field.config)
                )}
            </FormItem>
        })
    }
    handleOk=(e)=>{
        let {id,operation,imageUrl}=this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                formData.endTimeStr=timeTran(formData.endTime);
                formData.startTimeStr=timeTran(formData.startTime);
                formData.clientType = formData.clientType!="all" ? formData.clientType:"";
                if(imageUrl){
                    if(imageUrl.indexOf("base64,")!=-1){
                        formData.imgIco=imageUrl;
                    }else{
                        delete formData.imgIco;
                    }
                }
                operation=="edit"?Object.assign(formData,{id}):Object.assign(formData,{id:0});
                this.props.save(formData,this.props.form);
            }
        });
    };
    render(){
        let {visible,title,imageUrl,detail}=this.props,{getFieldDecorator} = this.props.form;
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
                onCancel={this.handleCancel}
                footer={null}
            >
                <Form  onSubmit={this.handleOk}>
                    {this.getForm(detail)}
                    <FormItem label="上传任务图片">
                        {getFieldDecorator('imgIco', {
                            initialValue:detail["imgIco"]
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
}

const TaskModal=Form.create()(modals);


const modalToProps = ({ modalStatus }) => ({
    visible:modalStatus.visible,
    title:modalStatus.title,
    id:modalStatus.id,
    operation:modalStatus.operation,
    imageUrl:modalStatus.imageUrl,
    detail:modalStatus.detail
});
export default connect(modalToProps)(TaskModal)