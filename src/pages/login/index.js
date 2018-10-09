import React, { Component }from 'react'
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';

import {getFilterValue} from "@src/js/until"

import { loginPost,post } from "@src/js/fetch/http"

import store from '@src/store/store'
import './index.scss'

const FormItem = Form.Item;


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            loading:false
        }
    }
    getForm(){
        let fields =[{
            name: "username",
            label: "用户名",
            cmp: Input,
            config: {
                placeholder: "请输入用户名",
                maxLength : "11",
                prefix:<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}}/>
            },
            rules: [{
                required: true, message: '请输入用户名',
            },{
                pattern:/^1[3|4|5|7|8|9]\d{9}$/, message: '手机号不正确'
            }]
        },{
            name: "password",
            label: "密码",
            cmp: Input,
            config: {
                placeholder: "请输入密码",
                maxLength : "16",
                type:"password",
                prefix:<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
            },
            rules: [{
                required: true, message: '请输入密码',
            },{
                pattern: /^[\S\s]{6,16}$/, message: '密码长度必须6~16字符',whitespace: true
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
    error(errorMes){
        message.config({
            top: 150
        });
        message.error(errorMes);
    };
    setLoginStatus(data){
        data.Authorization=data.token_type+" "+data.access_token;
        sessionStorage.setItem("info",JSON.stringify(data));
        sessionStorage.setItem("backstage-line",true);
        store.dispatch({
            type: 'SET_LOGGED_USER',
            logged: true
        });
    };
    setMenus(id){
        let {history}=this.props;
        post("role/getRoleDetail",{
            "roleId": id
        }).then((res)=>{
            let {data:{menus}}=res;
            sessionStorage.setItem("menus",JSON.stringify(menus));
            store.dispatch({
                type:"SET_LOGGED_USER",
                menus:menus
            });
            this.setState({
                loading:false
            });
            history.replace('/main/homePage')
        })
    }
    getRoleId(){
        post("user/info").then((res)=>{
            let {data:{roleId}}=res;
            this.setMenus(roleId);
        })
    }
    handleOk=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                this.setState({
                    loading:true
                });
                let url=`user/login?username=${formData.username}&password=${formData.password}`;
                loginPost(url).then((res)=>{
                    if(res.status==0){
                        let { data }=res;
                        this.setLoginStatus(data);
                        this.getRoleId();
                    }else{
                        this.setState({
                            loading:false
                        });
                        let error=res.message+res.details;
                        this.error(error)
                    }

                })
            }
        });
    };
    render() {
        return (
            <div className="login-page">
                <div className="loginForm">
                    <h1>薪动后台系统</h1>
                    <Form
                        className="login-form"
                        onSubmit={this.handleOk}
                    >
                        {this.getForm()}
                        <FormItem>
                            <Button
                                loading={this.state.loading}
                                style={{
                                    width:"260px",
                                    backgroundColor:"#40a9ff",
                                    marginTop:"10px",
                                    color:"#fff",
                                    border:0
                                }}
                                htmlType='submit'
                                type='primary'>立即登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }

}

export default Form.create()(Login)