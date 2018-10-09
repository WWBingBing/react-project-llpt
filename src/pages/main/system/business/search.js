import React,{Component} from 'react'
import {Form,Input,Button,Select,DatePicker} from 'antd'
import {post} from '@src/js/fetch/http'
import moment from 'moment'
const FormItem = Form.Item;
const Option = Select.Option;

class BusSearch extends Component{
    constructor(){
        super();
        this.state={
            taskList:[{
                "":"全部任务"
            }],
            startDay: null,
            endDay: null
        }
    }
    handleOk=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            this.props.searchList(formData)
        })
    };
    componentDidMount(){
        let {taskList}=this.state;
        post("task/all").then((res)=>{
            let {status,data} = res,newData=[];
            if(status==0){
                data=data.map((value)=>{
                    return{
                        [value.id]:value.name
                    }
                });
                newData.push(...taskList,...data)
                this.setState({
                    taskList:newData
                })
            }
        })
    }

    //日期选择框函数
    disabledStartDate=(startValue)=> {
        const endValue = this.state.startDay;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    handleStartOpenChange = (open) => {
        console.log('aa')
        if (!open) {
            this.state.startDay=null;
        }
    }
    handleEndOpenChange= (open) => {
        if (!open) {
            this.state.endDay=null;
        }
    }
    disabledEndDate=(endValue)=> {
        const startValue = this.state.endDay;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }
    onStartChange=(value)=> {
        this.onChange('startDay', value);
    };
    onEndChange=(value)=> {
        this.onChange('endDay', value);
    };

    render(){
        const {getFieldDecorator} = this.props.form,
            {taskList}=this.state;
        const now = moment(Date.now())
        return(
            <Form layout='inline'
                onSubmit={this.handleOk}
                className="searchP"
            >
                <FormItem className="searchForm">
                    {getFieldDecorator('phone', {
                        initialValue: ''
                    })(
                        <Input style={{width:150,}} placeholder="请输入登录账号" />
                    )}
                </FormItem>
                <FormItem className="searchForm">
                        {getFieldDecorator("taskId", {
                            initialValue: ""
                        })(<Select
                            style={{width:150}}
                        >
                            {
                                taskList.map((child,index)=>{
                                    let id=Object.keys(child)[0],
                                        text=child[id];
                                    return(
                                        <Option key={index} value={id}>{text}</Option>
                                    )
                                })
                            }
                        </Select>)}
                </FormItem>
                <FormItem  className="searchForm">
                    {getFieldDecorator('startDay')(
                        <DatePicker
                            disabledDate={this.disabledStartDate}
                            format="YYYY-MM-DD"
                            onChange={this.onStartChange}
                            showToday={false}
                            placeholder="注册开始日期"/>
                    )}
                </FormItem>
                <FormItem className="searchForm">
                    {getFieldDecorator('endDay')(
                        <DatePicker
                            disabledDate={this.disabledEndDate}
                            format="YYYY-MM-DD"
                            onChange={this.onEndChange}
                            showToday={false}
                            placeholder="注册结束日期"/>
                    )}
                </FormItem>
                <FormItem  className="searchForm">
                    <Button  htmlType='submit' type="primary" icon="search">查询</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(BusSearch)