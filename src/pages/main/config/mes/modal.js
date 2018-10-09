import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,message,Select,DatePicker} from 'antd';
import store from '@src/store/store'
import {post} from "@src/js/fetch/http";
import {getFilterValue , timeTranAll} from "@src/js/until"
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class modal extends Component{
    constructor(){
        super();
    }
    handleCancel=()=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            visible:false,
            detail:{}
        });
        this.props.form.resetFields();
    };
    getForm(data){
        const {getFieldDecorator} = this.props.form;
        let field=[{
            name: "title",
            label: "标题",
            cmp: Input,
            config: {
                placeholder: "请输入标题"
            },
            initialValue:data["title"],
            rules: [{
                required: true, message: '请输入标题',
            }]
        },{
            name: "content",
            label: "内容",
            cmp: TextArea,
            config: {
                placeholder: "请输入内容"
            },
            initialValue:data["content"],
            rules: [{
                required: true, message: '请输入内容',
            }]
        },{
            name: "startTime",
            label: "计划推送时间",
            cmp: DatePicker,
            config: {
                placeholder: "请选择推送时间",
                format:"YYYY-MM-DD HH:mm:ss",
                showTime:true,
                locale
            },
            initialValue:moment(data["startTime"]),
            rules: [{
                required: true, message: '请选择推送时间',
            }]
        }];
        return field.map((field, index) => {
            return <FormItem label={field.label} key={index}>
                {getFieldDecorator(field.name,getFilterValue(field))(
                    React.createElement(field.cmp, field.config)
                )}
            </FormItem>
        })
    }
    handleOk=(e)=>{
        let {id,operation}=this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                formData.startTime=timeTranAll(formData.startTime);
                operation=="add"?formData:Object.assign(formData,{id});
                this.props.save(formData,this.props.form);
            }
        })
    };
    render(){
        const {getFieldDecorator} = this.props.form;
        let {visible,title,detail}=this.props;
        return(
            <Modal
                title={title}
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Form
                    onSubmit={this.handleOk}
                >
                    {this.getForm(detail)}
                    <FormItem>
                        <Button  htmlType='submit' type='primary'>提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const MesModal=Form.create()(modal);


const modalToProps = ({ modalStatus }) => ({
    visible:modalStatus.visible,
    title:modalStatus.title,
    id:modalStatus.id,
    operation:modalStatus.operation,
    detail:modalStatus.detail
});


export default connect(modalToProps)(MesModal)

