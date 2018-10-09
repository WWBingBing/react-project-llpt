import React,{Component} from 'react'
import {Form, Select,Input,Button} from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;

class RoleSearch extends Component{
    handleOk=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            this.props.searchList(formData)
        })
    };
    render(){
        const {getFieldDecorator} = this.props.form;
        return(
            <Form
                onSubmit={this.handleOk}
                className="searchP"
            >
                <FormItem className="searchForm">
                    {getFieldDecorator('archive', {
                        initialValue: 'all'
                    })(
                        <Select
                            style={{width:120}}
                        >
                            <Option value="all">全部</Option>
                            <Option value="0">未审核</Option>
                            <Option value="1">审核未通过</Option>
                            <Option value="2">审核已通过</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="searchForm">
                    {getFieldDecorator('phone', {
                        initialValue: ''
                    })(
                        <Input style={{width:150,}} placeholder="请输入手机号" />
                    )}
                </FormItem>
                <FormItem className="searchForm">
                    {getFieldDecorator('taskName', {
                        initialValue: ''
                    })(
                        <Input style={{width:150,}} placeholder="请输入任务名称" />
                    )}
                </FormItem>
                <FormItem  className="searchForm">
                    <Button  htmlType='submit' type="primary" icon="search">查询</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(RoleSearch)