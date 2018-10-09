import React,{Component} from "react"
import TaskStatus from './taskStatus'
import { connect } from 'react-redux'


class Modals extends Component{
    render(){
        let {visibleTask}=this.props;
        return <div>
            {visibleTask && <TaskStatus/>}
        </div>
    }
}

const modalToProps = ({ modalStatus }) => ({
    visibleTask:modalStatus.visibleTask,
});
export default connect(modalToProps)(Modals)