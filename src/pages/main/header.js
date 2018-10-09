import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Icon, Modal,Button,Form,Input } from 'antd';
import store from '@src/store/store'
import {getFilterValue} from "@src/js/until"
import Tab from "./tab"

const FormItem = Form.Item;

class HeaderForm extends Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
            confirmLoading:false,

        }
    }
    compareToFirstPassword=(rule, value, callback)=>{
        let  {form} = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('您输入的两个密码不一致');
        } else {
            callback();
        }
    };
    getForm(){
        let fields =[{
            name: "oldPassword",
            label: "旧密码",
            cmp: Input,
            config: {
                placeholder: "请输入旧密码",
                maxLength : "16",
                type:'password'
            },
            rules: [{
                required: true, message: '请输入旧密码',
            },{
                pattern: /^[\S\s]{6,16}$/, message: '密码长度必须6~16字符',whitespace: true
            }]
        },{
            name: "newPassword",
            label: "新密码",
            cmp: Input,
            config: {
                placeholder: "请输入新密码",
                maxLength : "16",
                type:'password'
            },
            rules: [{
                required: true, message: '请输入新密码',
            },{
                pattern: /^\S{6,16}$/, message: '密码长度必须6~16字符',whitespace: true
            }]
        },{
            name: "newPasswordS",
            label: "确认密码",
            cmp: Input,
            config: {
                placeholder: "请重新输入新密码",
                maxLength : "16",
                type:'password'
            },
            rules: [{
                required: true, message: '请输入新密码'
            },{
                validator:this.compareToFirstPassword
            }]
        }];
        const {getFieldDecorator} = this.props.form;
        return fields.map((field, index) => {
            return <FormItem label={field.label} key={index}>
                {getFieldDecorator(field.name, getFilterValue(field))(
                    React.createElement(field.cmp, field.config)
                )}
            </FormItem>
        })
    }
    toggle=()=>{
        let {collapse}=this.props;
        store.dispatch({
            type: 'SET_MENU_EXPAND',
            collapse:!collapse,
            openKeys:[]
        });
    };
    logout=()=>{
        let { history }= this.props;
        history.replace('/login');
        //重置状态
        store.dispatch({
            type:"DEL_TAB_RELATION",
            currentKey:"10",
            panes:[{ title: '首页', openKeys:'10' ,  key: '10', path:"/main/homePage", closable: false}]
        });
        sessionStorage.clear();
    };
    handleOk=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                this.setState({
                    confirmLoading:true
                });
            }
        });



    };
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    };
    getModal=()=>{
        return (
            <Modal
                title="重置密码"
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Form onSubmit={this.handleOk}>
                    {this.getForm()}
                    <FormItem>
                        <Button loading={this.state.confirmLoading} htmlType='submit' type='primary'>提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    };
    reset=()=>{
        this.setState({
            visible:true
        })
    };
    render(){
        let {collapse}=this.props;
        return(
            <div className={`header ${collapse?"clickDiv":""}`}>
                <Icon
                    className="trigger"
                    type={collapse ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div className="logout-reset">
                    <Icon
                        className="trigger"
                        type="logout"
                        onClick={this.logout}
                    />
                    {
                        false&&<Icon
                            className="trigger"
                            type="exception"
                            onClick={this.reset}
                        />
                    }
                </div>
                <Tab {...this.props}/>
                {this.getModal()}
            </div>
        )
    }
}

const Header=Form.create()(HeaderForm);
const stateToProps = ({ menuExpand,tableData }) => ({
    collapse: menuExpand.collapse,
    openKeys: menuExpand.openKeys,
    loading:tableData.tableData
});
export default connect(stateToProps)(Header)