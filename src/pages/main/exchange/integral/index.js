
import React, { Component }from 'react'
import Config from "./config";


class Integral extends Component {
    constructor(props){
        super(props);
        this.pageConfig= new Config()
    }
    render() {
        return (
            <div>
                {this.pageConfig.render()}
            </div>
        )
    }

}

export default Integral