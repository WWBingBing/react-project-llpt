import React, { Component } from 'react'
import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import { connect } from 'react-redux'

import Login from "@src/pages/login/index"
import App from "@src/pages/main/index"


class RouteMap extends Component {
    render(){
        const { logged } = this.props;
        return(
            <HashRouter >
                <Switch>
                    <Route exact path={"/"}  render={()=><Redirect to={"/login"}/>}/>
                    <Route exact path={"/login"} component={Login}/>
                    <Route path={"/main"} render={(props)=>{
                        return logged
                            ? <App {...props}/>
                            : <Redirect to="/login"/>
                    }}/>
                    <Redirect to="/login" />
                </Switch>
            </HashRouter>
        )
    }
}



const stateToProps = ({ loginStatus }) => ({
    logged: loginStatus.logged
});

export default connect(stateToProps)(RouteMap)


// export default RouteMap


