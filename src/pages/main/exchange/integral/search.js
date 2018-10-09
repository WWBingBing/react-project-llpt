import React,{Component} from 'react'
import {Form,Input,Button,Select} from 'antd'

const FormItem = Form.Item;
const Option = Select.Option;

class IntSearch extends Component{
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
                    {getFieldDecorator('phone', {
                        initialValue: ''
                    })(
                        <Input style={{width:150}} placeholder="请输入手机号" />
                    )}
                </FormItem>
                <FormItem  className="searchForm">
                    <Button  htmlType='submit' type="primary" icon="search">查询</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(IntSearch)