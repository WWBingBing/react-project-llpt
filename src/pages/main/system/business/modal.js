import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,message,Select} from 'antd';
import store from '@src/store/store'
import {post} from "@src/js/fetch/http";
import {getFilterValue } from "@src/js/until"
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;




class modal extends Component{
    constructor(){
        super();
        this.state={
            optionData:[],
            adminData:[{
                text:"是",
                value:"true"
            },{
                text:"否",
                value:"false"
            }]
        }
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
            name: "email",
            label: "邮箱",
            cmp: Input,
            config: {
                placeholder: "请输入邮箱"
            },
            initialValue:data["email"],
            rules: [{
                required: true, message: '请输入邮箱',
            }]
        },{
            name: "qq",
            label: "QQ号",
            cmp: Input,
            config: {
                placeholder: "请输入QQ号"
            },
            initialValue:data["qq"],
            rules: [{
                required: true, message: '请输入QQ号',
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
                Object.assign(formData,{id});
                formData.admin = formData.isAdmin == "true" ?true:false;
                this.props.save(formData,this.props.form);
            }
        })
    };
    componentDidMount(){
        post('role/getRoleList',{
            "pageNum":1,
            "pageSize":100,
            "archive":0
        }).then((res)=>{
            if(res.status==0){
                let {data:{list}}=res;
                this.setState({
                    optionData:list
                })
            }
        })
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        let {visible,title,detail}=this.props,{optionData,adminData}=this.state;
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
                    <FormItem
                        label="管理员"
                    >
                        {getFieldDecorator("isAdmin",{
                            initialValue: detail.isAdmin+"",
                            rules: [{
                                required: true,message: '请选择角色'
                            }]
                        })(<Select>
                            {
                                adminData.map((data,index)=>{
                                    return (
                                        <Option key={index} value={data.value}>{data.text}</Option>
                                    )
                                })
                            }
                        </Select>)}
                    </FormItem>
                    <FormItem
                        label="角色名称"
                    >
                        {getFieldDecorator("roleId",{
                            initialValue: detail.roleId,
                            rules: [{
                                required: true,message: '请选择角色'
                            }]
                        })(<Select>
                            {
                                optionData.map((data,index)=>{
                                    return (
                                        <Option key={index} value={data.roleId}>{data.roleName}</Option>
                                    )
                                })
                            }
                        </Select>)}
                    </FormItem>
                    <FormItem>
                        <Button  htmlType='submit' type='primary'>提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const BusModal=Form.create()(modal);


const modalToProps = ({ modalStatus }) => ({
    visible:modalStatus.visible,
    title:modalStatus.title,
    id:modalStatus.id,
    operation:modalStatus.operation,
    detail:modalStatus.detail
});


export default connect(modalToProps)(BusModal)

