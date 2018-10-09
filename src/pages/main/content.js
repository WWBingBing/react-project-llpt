import React, { Component }from 'react'

import {Route,Redirect} from "react-router-dom"

import { Layout } from 'antd';

import Bundle from '@src/js/bundle'

import  {Menus} from '@src/js/menu'

const {Content } = Layout;

class Contents extends Component{
    getRoute(){
        let {match}=this.props,routers=[];
        Menus().forEach((menu,i)=>{
            if(menu.children&&menu.children.length){
                menu.children.forEach((child,j)=>{
                    routers.push(
                        <Route key={i+"_"+j} path={`${match.path}/${menu.path}/${child.component}`}
                               render={(props)=>(
                                   <Bundle load={() => import(`./${menu.path}/${child.component}/index.js`)}>
                                       {(Cmp) => <Cmp {...props}/>}
                                   </Bundle>
                               )}
                        />
                    )
                });
            }else{
                routers.push(
                    <Route key={i} path={`${match.path}/${menu.path}`}
                           render={(props)=>(
                               <Bundle load={() => import(`./${menu.path}/index.js`)}>
                                   {(Cmp) => <Cmp {...props}/>}
                               </Bundle>
                           )}
                    />
                )
            }
        });
        return routers;
    }
    render(){
        return(
            <Content style={{padding:"20px"}}>
                {this.getRoute()}
            </Content>
        )
    }
}


export default Contents