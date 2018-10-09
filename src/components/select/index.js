import React, { Component } from 'react'
import { Icon, Input, Button ,Select} from 'antd';
const Option = Select.Option;


export default class MSelect extends Component{
    static defaultProps = {
        valueField : "value",
        displayField : "text",
        allowClear : true,
        dataSource  : [],
    };
    constructor(){
        super();
        this.state={
            dataSource : []
        }
    }
    componentWillMount(){
        let {valueField,displayField,dataSource} = this.props;
        let dataSources=(dataSource.map((row)=>{
            return {
                [valueField] : row[valueField],
                [displayField] : row[displayField]
            };
        }));
        this.setState({
            dataSource:dataSources
        });




    }
    renderOption(item){
        let {valueField,displayField} = this.props;
        return (
            <Option key={item[valueField]+''}>
                {item[displayField]}
            </Option>
        );
    }
    render(){
        return (
            <Select {...this.props} allowClear={this.props.allowClear } onChange={this.props.onChange}>
                {this.state.dataSource.map((item)=>this.renderOption(item))}
            </Select>
        )
    }
}