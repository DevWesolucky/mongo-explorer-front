import React, { Component } from 'react'

interface IProps {
    failureList: Array<string>,
}

export default class FailureList extends Component<IProps> {
    state = {}

    render() {
        return (
            <div style={{ color: "orange", marginBottom: 20 }}>
                {this.props.failureList.map((item, index) => (<li key={index}>{item}</li>))}
            </div>
        )
    }
}
