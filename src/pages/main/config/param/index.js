import React, { Component }from 'react'
import {Card,Table,Form} from 'antd'
import {post} from "@src/js/fetch/http";
import EditInput from "@src/components/editInput"
const FormItem = Form.Item;

class ParamTable extends Component {
    constructor(){
        super();
        this.state={
            dataSource:[],
            loading:false,
            status:{}
        }
    }
    submit(id,value,param){
        let {status}=this.state;
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                if(value&&!!status[param+id]){
                    console.log({id,[param]:formData[param+id]})
                    post("system/config/save",{id,[param]:formData[param+id]}).then((res)=>{
                        let {status}=res;
                        if(status==0){
                            this.loadData()
                        }
                    });
                }
                this.setState(Object.assign(status,{[param+id]:!status[param+id]}));
            }
        })
    };
    mTable(){
        const { getFieldDecorator } =this.props.form;
        let {dataSource,loading,status}=this.state;
        let columns=[{
            title:'序号',
            dataIndex: '$index',
            width:70,
        },{
            title:'参数名称',
            dataIndex: 'type',
            width:200,
        },{
            title:'参数描述',
            dataIndex: 'remark',
            width:200,
        },{
            title:"参数值",
            dataIndex: 'value',
            width:300,
            render:(text, record)=>{
                let config={
                    id:record.id,
                    value:record.value,
                    getFieldDecorator,
                    paramConfig:"value",
                    status
                };
                return (
                        <FormItem >
                            <EditInput
                                {...config}
                                submit={(id,value,param)=>this.submit(id,value,param)}
                            />
                            {/*<Row>
                                <Col span={18}>
                                    {getFieldDecorator('id'+id, {
                                        rules: [{required: true, message: '参数值不能为空'}],
                                        initialValue: value
                                    })(
                                        <TextArea disabled={!status[id]} maxLength={500} autosize={{ minRows: 2, maxRows: 6 }}/>
                                    )}
                                </Col>
                                <Col span={6}>
                                    <Button onClick={()=>this.submit(record)} type="primary">{!status[id]?"修改":'确认'}</Button>
                                </Col>
                            </Row>*/}
                        </FormItem>
                )
            }
        }];
        dataSource.forEach((item,index)=>{
            item["$index"] =index + 1;
        });
        return(
            <Form className="formTable">
                <Table rowKey={data=>data.id} pagination={false} loading={loading} bordered dataSource={dataSource} columns={columns}/>
            </Form>
        )
    }
    loadData(){
        this.setState({
            loading:true
        });
        post("system/config/list").then((res)=>{
            let {data}=res;
            this.setState({
                dataSource:data,
                loading:false
            });
        })
    }
    render() {
        return (
            <Card>
                {this.mTable()}
            </Card>
        )
    }
    componentDidMount(){
        this.loadData()
    }

}


const Param = Form.create()(ParamTable);
export default Param