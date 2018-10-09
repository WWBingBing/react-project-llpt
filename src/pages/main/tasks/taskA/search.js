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
                layout='inline'
                className="searchP"
            >
                <FormItem  label='任务类型' className="searchForm">
                    {getFieldDecorator('taskType', {
                        initialValue: ''
                    })(
                        <Select
                            style={{width:100}}
                        >
                            <Option value="">全部</Option>
                            <Option value="task_day">推荐任务</Option>
                            <Option value="task_fast">快速任务</Option>
                            <Option value="task_super">高额任务</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label='人工审核' className="searchForm">
                    {getFieldDecorator('auditType', {
                        initialValue: ''
                    })(
                        <Select
                            style={{width:100}}
                        >
                            <Option value="">全部</Option>
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem  label='客户端类型' className="searchForm">
                    {getFieldDecorator('clientType', {
                        initialValue: ''
                    })(
                        <Select
                            style={{width:100}}
                        >
                            <Option value="">全部</Option>
                            <Option value="ios">IOS</Option>
                            <Option value="android">Android</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem  label='上架状态' className="searchForm">
                    {getFieldDecorator('status', {
                        initialValue: ''
                    })(
                        <Select
                            style={{width:100}}
                        >
                            <Option value="">全部</Option>
                            <Option value="0">下架</Option>
                            <Option value="1">上架</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem   className="searchForm">
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