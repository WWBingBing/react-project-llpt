import React from 'react'

class Circle extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let colorStyle = this.props.colorStyle;
        return (
            <i style={{display:'inline-block',width:'12px',height: '12px',borderRadius:'50%',background:"#"+colorStyle,marginRight:"5px"}}></i>
        )
    }
    //#绿 62CB31    红E74C3C
}

export default Circle