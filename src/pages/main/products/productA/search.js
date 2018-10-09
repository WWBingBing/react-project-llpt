import React,{Component} from 'react'
import {Form,Input,Button,Select} from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;

class ProSearch extends Component{
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
                    {getFieldDecorator('name', {
                        initialValue: ''
                    })(
                        <Input style={{width:150,}} placeholder="请输入产品名称" />
                    )}
                </FormItem>
                <FormItem className="searchForm">
                    {getFieldDecorator('status', {
                        initialValue: 'all'
                    })(
                        <Select
                            style={{width:120}}
                        >
                            <Option value="all">全部</Option>
                            <Option value="true">已发布</Option>
                            <Option value="false">未发布</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem  className="searchForm">
                    <Button  htmlType='submit' type="primary" icon="search">查询</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(ProSearch)