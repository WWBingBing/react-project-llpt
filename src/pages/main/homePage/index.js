import React, { Component }from 'react'
import {post} from "@src/js/fetch/http";
import { Spin } from 'antd';

import Message from './userMes'

import Echart from './echart'

import './index.scss'

class HomePage extends Component {
    constructor(props){
        super(props);
        this.state={
            isAdmin:false,
            loading:false
        }
    }
    componentDidMount(){
        this.setState({
            loading:false
        });
        post("user/info").then((res)=>{
            let {data:{isAdmin}}=res;
                    this.setState({
                        isAdmin,
                        loading:true
                    })
        });
    }
    render() {
        return (
            <div>
                {this.state.loading
                    ?(<div>{this.state.isAdmin?<Echart/>:<Message/>}</div>)
                    :<Spin/>}
            </div>
        )

    }

}

export default HomePage