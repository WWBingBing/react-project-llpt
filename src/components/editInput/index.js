import React, { Component }from 'react'
import {Input, Button,Row,Col} from 'antd'
const { TextArea } = Input;


export default class EditInput extends Component{
    render(){
        let {id,value,getFieldDecorator,status,paramConfig}=this.props;
        return(
            <Row>
                <Col span={18}>
                    {getFieldDecorator(paramConfig+id, {
                        rules: [{required: true, message: '参数值不能为空'}],
                        initialValue: value
                    })(
                        <TextArea disabled={!status[paramConfig+id]} maxLength={500} autosize={{ minRows: 2, maxRows: 6 }}/>
                    )}
                </Col>
                <Col span={6}>
                    <Button onClick={()=>this.props.submit(id,value,paramConfig)} type="primary">{!status[paramConfig+id]?"修改":'确认'}</Button>
                </Col>
            </Row>
        )
    }
}