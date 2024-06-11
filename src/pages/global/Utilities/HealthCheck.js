import React, { Component } from 'react';

class HealthCheck extends Component {

    constructor(props) {
        super(props);
        console.log('constructor called');
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate called');
    }

    componentWillMount() {
        console.log('componentWillMount called');
    }

    componentDidMount() {
        console.log('componentDidMount called');
    }

    componentWillUpdate() {
        console.log('componentWillUpdate called');
    }

    componentDidUpdate() {
        console.log('componentDidUpdate called');
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps called');
    }

    render() {
        console.log('render called');
        return (
            <div className="container">
                <div className="main">
                    <h1>
                        Liverpool Mesa de Regalos - In-Store App Health Check
                    </h1>
                    <h3>
                        <b> This instance  is up and running.</b>
                    </h3>
                </div>
            </div>
        );
    }
}
export default HealthCheck;