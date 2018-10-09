import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,DatePicker,InputNumber,message } from 'antd';
import store from '@src/store/store'
import Power from './role'
import {post} from "@src/js/fetch/http"

const FormItem = Form.Item;
const { TextArea } = Input;

class modal extends Component{
    constructor(props){
        super(props);
        this.state={
            roles:[]
        }
    }
    handleCancel=()=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            visible:false,
            detail:{}
        });
        this.powerNode.setState({
            selectKeys:[],
            checkedKeys:[]
        });
        this.props.form.resetFields();
    };
    handleOk=(e)=>{
        let {id,operation}=this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                let {selectKeys}=this.powerNode.state;
                let selectArr=JSON.parse(JSON.stringify(selectKeys)).concat(["10"]);
                if(selectArr.length){
                    formData.menus=selectArr.join();
                    formData.name=formData.roleName;
                    operation=="edit"?Object.assign(formData,{id}):formData;
                    this.props.save(formData,this.props.form);
                    this.powerNode.setState({
                        selectKeys:[],
                        checkedKeys:[]
                    });
                }else{
                    message.config({
                        top:150,
                        duration:1
                    });
                    message.warning('请选择角色权限');
                }
            }
        });
    };
    componentWillMount(){
        post("role/getAllmenus").then((res)=>{
            let {data}=res;
            this.setState({
                roles:data.splice(1)
            })
        })
    }
    componentDidMount(){
        store.subscribe(()=>{
            setTimeout(()=>{
                let {detail}=this.props,
                    {setFieldsValue}=this.props.form,
                    setField=["roleName","roleDesc"],
                    setValue={};
                if(detail.roleId){
                    setField.forEach((child)=>{
                        setValue[child]=detail[child]
                    });
                    post('role/getRoleDetail',{roleId:detail.roleId}).then((res)=>{
                        let {status ,data}=res,selectKeys=[],checkedKeys=[];
                        if(status==0){
                            data.menus.filter((value)=>value.key!=10).forEach((menu)=>{
                                this.state.roles.forEach((allMenu)=>{
                                    if(menu.key==allMenu.key){
                                        if(menu.children.length==allMenu.children.length){
                                            checkedKeys.push(menu.key+'');
                                        }
                                        selectKeys.push(menu.key+'');
                                        menu.children.forEach((child)=>{
                                            checkedKeys.push(child.key+'');
                                            selectKeys.push(child.key+'');
                                        })
                                    }
                                })
                            });
                            this.powerNode.setState({
                                selectKeys,
                                checkedKeys
                            });
                            setFieldsValue({...setValue})
                        }
                    });
                }
            })
        })
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        let {visible,title}=this.props;
        return(
            <Modal
                title={title}
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Form  onSubmit={this.handleOk}>
                    <FormItem
                        label="角色名称"
                    >
                        {getFieldDecorator('roleName', {
                            rules: [{
                                required: true,message: '角色名称不能为空'
                            }]
                        })(
                            <Input placeholder="请输入角色名称" />
                        )}
                    </FormItem>
                    <FormItem
                        label="备注"
                        className="textAreaForm"
                    >
                        {getFieldDecorator('roleDesc', {
                            rules: [{
                                required: true,message: '备注信息不能为空'
                            }]
                        })(
                            <TextArea  rows={3} placeholder="请输入备注信息"/>
                        )}
                    </FormItem>
                    <FormItem
                        label="权限选择"
                    >
                        <Power roles={this.state.roles} ref={node=>this.powerNode=node}/>
                    </FormItem>
                    <FormItem>
                        <Button htmlType='submit' type='primary'>提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const RoleModal=Form.create()(modal);


const modalToProps = ({ modalStatus }) => ({
    visible:modalStatus.visible,
    title:modalStatus.title,
    id:modalStatus.id,
    operation:modalStatus.operation,
    detail:modalStatus.detail
});


export default connect(modalToProps)(RoleModal)