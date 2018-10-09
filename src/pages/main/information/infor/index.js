import React, { Component }from 'react'

import Config from "./config"


class Infor extends Component {

    pageConfig= new Config();

    render() {
        return (
            <div>
                {this.pageConfig.render()}
            </div>
        )
    }

}

export default Infor