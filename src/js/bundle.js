import React, { Component } from 'react'

//按需加载路由
export default class Bundle extends Component {
  state = {
    mod: null
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    props.load().then((mod)=>{
        this.setState({
          mod: mod.default ? mod.default : mod
        })
    })
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}

