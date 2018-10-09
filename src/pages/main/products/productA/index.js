import React, { Component }from 'react'

import Config from "./config"

class ProductA extends Component {
    pageConfig= new Config();
    render() {
        return (
            <div>
                {this.pageConfig.render()}
            </div>
        )
    }

}

export default ProductA