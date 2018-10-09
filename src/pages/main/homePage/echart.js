import React,{Component} from 'react'
import {post} from "@src/js/fetch/http";
import { Row, Col ,Icon} from 'antd';
import { Chart, Axis, Geom, Tooltip, Legend,Label} from 'bizcharts'

import DataSet from '@antv/data-set';
import moment from 'moment'
import DateLine from "./dataLine"

class Echart extends Component{
    constructor(){
        super();
        this.state={
            chart1:{},
            chart2:{},
            chart3:{},
            chart4:{},
            dateTaskLine:[],
            dateProLine:[],
            coinLine:[],
            counts:[{
                key:"regNum",
                text:"注册数",
                color:"62cb31",
                value:0
            },{
                key:"actNum",
                text:"注册激活数",
                color:"ffb606",
                value:0
            }/*,{
                key:"signNum",
                text:"签到数",
                color:"3498db",
                value:0
            }*/,{
                key:"taskNum",
                text:"任务完成数",
                color:"3498db",
                value:0
            },{
                key:"productNum",
                text:"产品兑换数",
                color:"e74c3c",
                value:0
            }]
        }
    }
    loadCount(){
        post("statis/todayCount").then((res)=>{
            if(res.status==0){
                let {data}=res,{counts}=this.state;
                let fields=counts.map((count)=>{
                        count["value"]=data[count["key"]];
                        return count
                });
                this.setState({
                    counts:fields
                })
            }
        })
    }
    loadChart1(){
        post('statis/weekUserInfo').then((res)=>{
           if(res.status==0){
               let {data}=res,chartData=[],regNumData={},certifyNumDAta={},fields=[];
               data.forEach((child)=>{
                   regNumData[child['regDate']]=child["regNum"];
                   certifyNumDAta[child['regDate']]=child["certifyNum"];
                   fields.push(child['regDate']);
               });
               chartData=[{ name:'注册数',...regNumData},{name:'认证数',...certifyNumDAta}];
               let ds = new DataSet();
               let dv = ds.createView().source(chartData);
               dv.transform({
                   type: 'fold',
                   fields: fields,
                   key: '日期',
                   value: '人数',
               });
               this.setState({
                   chart1:dv
               });
           }
        });
    }
    loadChart2(taskTime){
        post("statis/taskCount",{
            dateStr:taskTime
        }).then((res)=>{
            if(res.status==0){
                let {data}=res,chartData=[],fields=[];
                data.forEach((field)=>{
                    chartData.push({
                        name:field.taskName,
                        count:field.count
                    });
                    fields.push(field.taskName)
                });
                let ds = new DataSet();
                let dv = ds.createView().source(chartData);
                dv.transform({
                    type: 'fold',
                    fields: fields
                });
                this.setState({
                    chart2:dv
                });
            }
        })
    }
    loadChart3(proTime){
        post("statis/goodsCount",{
            dateStr:proTime
        }).then((res)=>{
            if(res.status==0){
                let {data}=res,chartData=[],fields=[];
                data.forEach((field)=>{
                    chartData.push({
                        name:field.productName,
                        count:field.productAmt
                    });
                    fields.push(field.productName)
                });
                let ds = new DataSet();
                let dv = ds.createView().source(chartData);
                dv.transform({
                    type: 'fold',
                    fields: fields
                });
                this.setState({
                    chart3:dv
                });
            }
        })
    }
    loadChart4(){
        post("statis/coinSort").then((res)=>{
            if(res.status==0){
                let {data}=res,chartData=[],fields=[];
                data.forEach((field)=>{
                    chartData.push({
                        name:field.nickName,
                        count:field.coin
                    });
                    fields.push(field.nickName)
                });
                let ds = new DataSet();
                let dv = ds.createView().source(chartData);
                dv.transform({
                    type: 'fold',
                    fields: fields
                });
                this.setState({
                    chart4:dv
                });
            }
        })
    }
    loadTaskDate(){
        post("statis/taskDays").then((res)=>{
            if(res.status==0){
                let {data}=res;
                this.setState({
                    dateTaskLine:data
                })
            }
        })
    }
    loadProDate(){
        post("statis/goodsDays").then((res)=>{
            if(res.status==0){
                let {data}=res;
                this.setState({
                    dateProLine:data
                })
            }
        })
    }
    loadTaskDate1(time){
        this.loadChart2(time)
    }
    loadProDate1(time){
        this.loadChart3(time)
    }

    componentDidMount(){
        let time=moment(new Date()).format('YYYY-MM-DD');
        this.loadCount();
        this.loadTaskDate();
        this.loadProDate();
        // this.loadChart1();
        this.loadChart2(time);
        this.loadChart3(time);
        this.loadChart4();
    }
    render(){
        let {counts,chart1,chart2,chart3,chart4,dateTaskLine,dateProLine,coinLine}=this.state;
        return(
            <div className="homeChart">
                <Row type="flex" justify="space-between">
                    {counts.map((child,index)=>{
                            return (
                                <Col span={4} key={index} style={{color:`#${child.color}`}}>
                                    <p>{child.value}</p>
                                    <span>{child.text}</span>
                                </Col>
                            )
                        })}
                </Row>
                <Row gutter={16} className="midEc">
                    {/*<Col span={12}>
                        {
                            chart1.isDataView&&<div>
                                <p>近7日注册数/实名认证数</p>
                                <Chart height={400} data={chart1} forceFit>
                                    <Axis name="日期"/>
                                    <Axis name="人数" />
                                    <Legend/>
                                    <Tooltip crosshairs={{type : "y"}}/>
                                    <Geom
                                        type='interval'
                                        adjust={[{type: 'dodge',marginRatio: 1/32}]}
                                        position="日期*人数"
                                        color={'name'}
                                    />
                                </Chart>
                            </div>
                        }
                    </Col>*/}
                    <Col span={12}>
                        {
                            chart2.isDataView&&<div>
                                <p>任务完成数</p>
                                <Chart  height={320} data={chart2} forceFit>
                                    <Axis name="name"/>
                                    <Axis name="count" />
                                    <Tooltip crosshairs={{type : "y"}}/>
                                    <Geom
                                        type='interval'
                                        position="name*count"
                                        color={'name'}
                                    />
                                </Chart>
                                <DateLine DateList={dateTaskLine} loadDate={(time)=>this.loadTaskDate1(time)}/>
                            </div>
                        }
                    </Col>
                    <Col span={12}>
                        {
                            chart3.isDataView&&<div>
                                <p>商品兑换数</p>
                                <Chart  height={320} data={chart3} forceFit>
                                    <Axis name="name"/>
                                    <Axis name="count" />
                                    <Tooltip crosshairs={{type : "y"}}/>
                                    <Geom
                                        type='interval'
                                        position="name*count"
                                        color={'name'}
                                    />
                                </Chart>
                                <DateLine DateList={dateProLine} loadDate={(time)=>this.loadProDate1(time)}/>
                            </div>
                        }
                    </Col>
                </Row>
                <Row >
                    <Col className="midE">
                        {
                            chart4.isDataView&&<div>
                                <p>积分排名</p>
                                <Chart  height={320} data={chart4} forceFit>
                                    <Axis name="name"/>
                                    <Axis name="count" />
                                    <Tooltip crosshairs={{type : "y"}}/>
                                    <Geom
                                        type='interval'
                                        position="name*count"
                                        color={'name'}
                                    />
                                </Chart>
                            </div>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}


export default Echart