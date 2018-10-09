import React,{Component} from "react"
import { Button, Tree, Tooltip, Icon } from 'antd'
import {post} from "@src/js/fetch/http";
const TreeNode = Tree.TreeNode;



class Power extends Component {
    constructor(props){
        super(props);
        this.state={
            checkedKeys:[],
            selectKeys:[]
        }
    }
    renderTreeNodes(data){
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.title} key={item.key} dataRef={item}/>;
        });
    }
    onCheck=(checkedKeys,e)=>{
        let selectKeys=[];
        this.setState({ checkedKeys },()=>{
            if(e.halfCheckedKeys.length){
                selectKeys.push(...e.halfCheckedKeys);
            }
            selectKeys.push(...this.state.checkedKeys);
            this.setState({selectKeys});

        });
    };
    render(){
        let {roles}=this.props;
        return(
            <Tree
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                checkable={true}
                checkStrictly={false}
            >
                {roles.length?this.renderTreeNodes(roles):null}
            </Tree>
        )
    }
}

export default Power