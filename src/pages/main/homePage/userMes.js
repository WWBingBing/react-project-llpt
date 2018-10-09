import React,{Component} from "react"


const message={
    "companName":"今随借",
    "userType":"商户",
    "phoneNo":"13122223333",
    "lastLoignTime":"2018-04-19 19:36:49",
    "userName":"H5测试"
};
class Message extends Component{
    render(){
        return(
            <ul className="user-message">
                {Object.keys(message).map((key,i)=>{
                    return (
                        <li key={i}>
                            <span>{key}</span>:
                            <span>{message[key]}</span>
                        </li>
                    )
                })}
            </ul>
        )
    }
}


export default Message;