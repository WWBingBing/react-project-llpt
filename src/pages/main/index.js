import React, { Component }from 'react'

import { Layout } from 'antd';

import Header from './header'
import Side from "./side"
import Contents from './content'
import { connect } from 'react-redux'

import './index.scss'

class App extends Component {
    constructor(props, content) {
        super(props, content);

    }
    render() {
        let { collapse }= this.props;
        return (
                <Layout className={`ant-body-page ${collapse?"ant-body-page-left":""}`}>
                    <Side {...this.props}/>
                    <Layout>
                        <Header {...this.props}/>
                        <Contents  {...this.props}/>
                    </Layout>
                </Layout>
        )
    }
}


// export default App

const stateToProps = ({ menuExpand }) => ({
    collapse: menuExpand.collapse
});

export default connect(stateToProps)(App)