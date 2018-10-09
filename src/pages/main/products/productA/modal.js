import React,{Component} from "react"
import { connect } from 'react-redux'
import { Modal,Button,Form,Input,DatePicker,InputNumber,message,Upload,Icon } from 'antd';
import store from '@src/store/store'
import Select from '@src/components/select'
import {getFilterValue ,timeTran} from "@src/js/until"
import moment from 'moment'
const FormItem = Form.Item;
const { TextArea } = Input;

class modal extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            imageUrl:'',
            showKind:false
        }
    }
    handleCancel=()=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            visible:false,
            detail:{},
            imageUrl:''
        });
        this.props.form.resetFields();
    };
    handleOk=(e)=>{
        let {id,operation,imageUrl}=this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, formData) => {
            if (!err) {
                formData.extraInfo=formData.extraInfo=="true"?true:false;
                formData.virtualFlag=formData.virtualFlag=="true"?true:false;
                if(imageUrl.indexOf("base64,")!=-1){
                    formData.imgIco=imageUrl;
                }else{
                    delete formData.imgIco;
                }
                formData.type=Number(formData.type);
                operation=="edit"?Object.assign(formData,{id}):Object.assign(formData,{id:0});
                this.props.save(formData,this.props.form);
            }
        });
    };
    setUrl=(url)=>{
        store.dispatch({
            type:'SET_MODAL_STARUS',
            imageUrl:url
        })
    };
    //图片上传
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    beforeUpload=(file)=> {
        this.getBase64(file, imageUrl => this.setUrl(imageUrl));
        return false;
    };
    handleChange=(info)=> {
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, imageUrl => this.setUrl(imageUrl));
        }
    };
    getForm(data){
        const {getFieldDecorator} = this.props.form,{showKind}=this.state;
        let field=[{
            name: "name",
            label: "产品名称",
            cmp: Input,
            config: {
                placeholder: "请输入产品名称"
            },
            initialValue:data["name"],
            rules: [{
                required: true, message: '请输入产品名称',
            }]
        },{
            name: "source",
            label: "产品来源渠道",
            cmp: Select,
            config: {
                dataSource:[{
                    text:"LIANLIAN",
                    value:"LIANLIAN"
                }]
            },
            initialValue:"LIANLIAN",
            rules: [{
                required: true, message: '产品来源渠道',
            }]
        },{
            name: "type",
            label: "产品种类",
            cmp: Select,
            config: {
                dataSource:[{
                    text:"普通商品",
                    value:"1"
                },{
                    text:"影视卡",
                    value:"2",
                },{
                    text:"手机充值",
                    value:"3",
                },{
                    text:"加油卡",
                    value:"4",
                }],
                onChange:(type)=>this.handleProvinceChange(type)
            },
            initialValue:data["type"]?data["type"]+"":"1",
            rules: [{
                required: true, message: '请选择产品种类',
            }]
        },{
            name: "code",
            label: "商品编码",
            cmp: Input,
            config: {
                placeholder: "请输入商品编码"
            },
            initialValue:data["code"],
            rules: [{
                required: true, message: '请输入商品编码',
            }]
        },{
            name: "virtualFlag",
            label: "是否为虚拟商品",
            cmp: Select,
            config: {
                dataSource:[{
                    text:"是",
                    value:"true"
                },{
                    text:"否",
                    value:"false"
                }]
            },
            initialValue:data["virtualFlag"]!=undefined?data["virtualFlag"]+"":"true",
            rules: [{
                required: true, message: '请选择是否为虚拟商品',
            }]
        },{
            name: "extraInfo",
            label: "是否有额外信息",
            cmp: Select,
            config: {
                dataSource:[{
                    text:"是",
                    value:"true"
                },{
                    text:"否",
                    value:"false"
                }]
            },
            initialValue:data["extraInfo"]!=undefined?data["extraInfo"]+"":'true',//默认额外信息
            rules: [{
                required: true, message: '请选择是否有额外信息',
            }]
        },{
            name: "remark",
            label: "备注",
            cmp: TextArea,
            config: {
                placeholder: "请输入备注信息",
                row:3
            },
            initialValue:data["remark"],
            rules: [{
                required: true, message: '请输入备注信息',
            }]
        },{
            name: "amount",
            label: "库存数量",
            cmp: InputNumber,
            config: {
                placeholder: "请输入库存数量"
            },
            initialValue:data["amount"],
            rules: [{
                required: true, message: '请输入库存数量',
            }]
        },{
            name: "value",
            label: "原始价值",
            cmp: InputNumber,
            config: {
                placeholder: "请输入原始价值"
            },
            initialValue:data["value"],
            rules: [{
                required: true, message: '请输入原始价值',
            }]
        },{
            name: "unit",
            label: "原始价值单位",
            cmp: Input,
            config: {
                placeholder: "请输入原始价值单位"
            },
            initialValue:data["unit"],
            rules: [{
                required: true, message: '请输入原始价值单位',
            }]
        },{
            name: "coin",
            label: "金币价值",
            cmp: InputNumber,
            config: {
                placeholder: "请输入金币价值"
            },
            initialValue:data["coin"],
            rules: [{
                required: true, message: '请输入金币价值',
            }]
        },{
            name: "purchasePrice",
            label: "平均采购价格",
            cmp: InputNumber,
            config: {
                placeholder: "平均采购价格"
            },
            initialValue:data["purchasePrice"],
            rules: [{
                required: true, message: '平均采购价格',
            }]
        }];
        if(showKind){
            field.splice(3,0,{
                name: "category",
                label: "影视种类",
                cmp: Select,
                config:{
                    dataSource:[{
                        text:"腾讯视频会员卡",
                        value:"1"
                    },{
                        text:"优酷视频会员卡",
                        value:"2"
                    },{
                        text:"爱奇艺视频会员卡",
                        value:"3"
                    }]
                },
                initialValue:data["category"]?data["category"]+"":"1",
                rules:[]
            })
        }
        return field.map((field, index) => {
            return <FormItem label={field.label} key={index}>
                {getFieldDecorator(field.name,getFilterValue(field))(
                    React.createElement(field.cmp, field.config)
                )}
            </FormItem>
        })
    }
    handleProvinceChange(type){
        this.setState({
            showKind:type==2
        })
    }
    render(){
        let {visible,title,detail,imageUrl}=this.props,{getFieldDecorator} = this.props.form;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return(
            <Modal
                title={title}
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
            >
                <Form
                    onSubmit={this.handleOk}
                >
                    {this.getForm(detail)}
                    <FormItem label="上传商品图片">
                        {getFieldDecorator('imgIco', {
                            initialValue:detail["imgIco"],
                            rules:[{required: true, message:'商品图片不能为空'}],
                        })(
                            <Upload
                                showUploadList={false}
                                className="uploadImg"
                                listType="picture-card"
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}>
                                {
                                    imageUrl ?
                                        <img src={imageUrl} style={{width:200,height:100}}/> :
                                        uploadButton
                                }
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button  htmlType='submit' type='primary'>提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
    componentDidMount() {
        store.subscribe(() => {
            setTimeout(()=>{
                let {detail}=this.props;
                this.setState({
                    showKind:detail.type==2
                })
            })
        })
    }
}

const ProModal=Form.create()(modal);


const modalToProps = ({ modalStatus }) => ({
    visible:modalStatus.visible,
    title:modalStatus.title,
    id:modalStatus.id,
    operation:modalStatus.operation,
    imageUrl:modalStatus.imageUrl,
    detail:modalStatus.detail
});


export default connect(modalToProps)(ProModal)

