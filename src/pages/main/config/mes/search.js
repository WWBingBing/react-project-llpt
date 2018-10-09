import React,{Component} from 'react'
import {Form,Input,Button,Select} from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;

class MesSearch extends Component{
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
                    {getFieldDecorator('title', {
                        initialValue: ''
                    })(
                        <Input style={{width:150}} placeholder="请输入标题" />
                    )}
                </FormItem>
                <FormItem className="searchForm">
                    {getFieldDecorator("valid", {
                        initialValue: ""
                    })(<Select
                        style={{ width: 150}}
                    >
                        <Option value="">全部</Option>
                        <Option value="0">无效</Option>
                        <Option value="1">有效</Option>
                        <Option value="2">已发送</Option>
                    </Select>)}
                </FormItem>
                <FormItem  className="searchForm">
                    <Button  htmlType='submit' type="primary" icon="search">查询</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(MesSearch)