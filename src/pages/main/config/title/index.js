import React, { Component }from 'react'
import {Card,Table,Form,Button,Input} from 'antd'
import {post} from "@src/js/fetch/http";
const FormItem = Form.Item;
const { TextArea } = Input;
class TitleTable extends Component {
    constructor(){
        super();
        this.state={
            dataSource:[],
            loading:false,
            editTable:false,
            addTable:false
        }
    }
    mTable(){
        const { getFieldDecorator } =this.props.form;
        let {dataSource,loading}=this.state;
        let columns=[{
            title:'序号',
            dataIndex: '$index',
            width:70,
        },{
            title:'标题',
            dataIndex: 'item',
            render:(text,record)=>{
                let {item,$index,textDisabled}=record;
                return(
                    <FormItem>
                        {getFieldDecorator("item"+$index, {
                            rules: [{
                                required: true, message: '请输入标题'
                            },{
                                min: 3, message: '标题长度最小为3'
                            }],
                            initialValue: item
                        })(
                            <TextArea maxLength={100} disabled={textDisabled} autosize={{ minRows: 1, maxRows: 4 }}/>
                        )}
                    </FormItem>
                )
            }
        },{
            title:'标题值',
            dataIndex: 'value',
            render:(text,record)=>{
                let {value,$index,textDisabled}=record;
                return(
                    <FormItem>
                        {getFieldDecorator("value"+$index, {
                            rules: [{
                                required: true, message: '请输入标题值',
                            },{
                                min: 3, message: '标题值长度最小为3'
                            }],
                            initialValue: value
                        })(
                            <TextArea maxLength={100} disabled={textDisabled} autosize={{ minRows: 1, maxRows: 4 }}/>
                        )}
                    </FormItem>
                )
            }
        },{
            title:"标题备注",
            dataIndex: 'remark',
            render:(text,record)=>{
                let {remark,$index,textDisabled}=record;
                return(
                    <FormItem>
                        {getFieldDecorator("remark"+$index, {
                            rules: [{
                                required: true, message: '请输入标题备注',
                            },{
                                min: 3, message: '标题备注长度最小为3',
                            }],
                            initialValue: remark
                        })(
                            <TextArea maxLength={100} disabled={textDisabled} autosize={{ minRows: 1, maxRows: 4 }}/>
                        )}
                    </FormItem>
                )
            }
        },{
            title:"操作",
            key:"action",
            width:80,
            render:(text,record)=>{
                let {btnDisabled,textDisabled} = record;
                return(
                    <Button disabled={btnDisabled}  onClick={()=>this.editTitle(record)} style={{marginTop:0}}>{textDisabled?"编辑":"确认"}</Button>
                )
            }
        }];
        dataSource.forEach((item,index)=>{
            item["$index"] =index + 1;
        });
        return(
            <Form className="formTable">
                <Table rowKey={data=>data['$index']} pagination={false} loading={loading} bordered dataSource={dataSource} columns={columns}/>
            </Form>
        )
    }
    btnTitle(){
        let {editTable,addTable}=this.state;
        return(
            <div>
                <Button
                    style={{"marginTop":12,"marginRight":12}}
                    key="1"
                    type="primary"
                    onClick={()=>this.addTable("add")}
                    disabled={editTable}
                >{addTable?"取消":"添加"}</Button>
                {addTable?<Button
                    style={{"marginTop":12}}
                    key="2"
                    type="primary"
                    onClick={()=>this.addTable("sub")}
                >确认</Button>:null}
            </div>
        )
    }
    loadData(){
        this.setState({
            loading:true
        });
        post("system/title/list").then((res)=>{
            let {data}=res;
            data.forEach((item)=>{
                item['btnDisabled']=false;
                item['textDisabled']=true;
            });
            this.setState({
                dataSource:data,
                loading:false
            });
        })
    }
    editTitle(record){
        let {dataSource,editTable}=this.state,{id,$index}=record,params={};
        this.props.form.validateFieldsAndScroll((err,formData) => {
            if(!err){
                dataSource.forEach((item)=>{
                    if(!editTable){
                        //编辑
                        item.btnDisabled = item.id==record.id ? false:true;
                        item.textDisabled=item.id==record.id ? false:true;
                    }else{
                        //确认
                        item.btnDisabled = false;
                        item.textDisabled=true;
                    }
                });
                this.setState({
                    dataSource,
                    editTable:!editTable,
                });
                if(editTable){
                    params={
                        id,
                        item:formData["item"+$index],
                        value:formData["value"+$index],
                        remark:formData["remark"+$index],
                    };
                    this.addPost(params)
                }
            }
        });
    }
    addTable(param){
        let {dataSource,addTable}=this.state,params={};
        if(param=="add"){
            //添加标题
            if(!addTable){
                dataSource.forEach((item)=>{
                    item['btnDisabled']=true;
                    item['textDisabled']=true;
                });
                dataSource.push({
                    btnDisabled:true,
                    textDisabled:false
                });
            }else {
                dataSource.pop();
            }
            this.setState({
                dataSource,
                addTable:!addTable
            });
        }else if(param=="sub"){
            //确认添加标题
            let indexTitle=dataSource.length;
            this.props.form.validateFieldsAndScroll((err,formData) => {
                if(!err){
                    this.setState({
                        addTable:!addTable
                    });
                    params={
                        id:0,
                        item:formData["item"+indexTitle],
                        value:formData["value"+indexTitle],
                        remark:formData["remark"+indexTitle],
                    };
                    this.addPost(params)
                }
            });
        }
    }

    addPost(param){
        //添加接口
        post("system/title/save",param).then((res)=>{
            let {status}=res;
            if(status==0){
                this.loadData()
            }
        })
    }
    render() {
        return (
            <Card>
                {this.mTable()}
                {this.btnTitle()}
            </Card>
        )
    }
    componentDidMount(){
        this.loadData();

    }

}




const Title = Form.create()(TitleTable);
export default Title