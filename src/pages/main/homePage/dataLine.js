import React,{Component} from "react"
import { Tabs,Tooltip  } from 'antd';
const TabPane = Tabs.TabPane;


class DateLine extends Component{
    constructor(){
        super();
    }
    tabContent=(pane)=>{
        return (
            <Tooltip title={pane.value}>
                <span>{pane.valueStr}</span>
            </Tooltip>
        )
    };
    TabClick=(index)=>{
        let {DateList}=this.props;
        this.props.loadDate(DateList[index]);
    };
    render(){
        let {DateList}=this.props;
        DateList=DateList.map((value)=>{
            return {
                valueStr:value.substr(5,10),
                value:value
            }
        });
        return (
            <Tabs
                onTabClick={this.TabClick}
                className="dateLine"
            >
                {DateList.map((pane,index) => {
                    return(
                        <TabPane tab={this.tabContent(pane)} key={index} closable={false}></TabPane>
                    )
                })}
            </Tabs>
        )
    }
}

export default DateLine