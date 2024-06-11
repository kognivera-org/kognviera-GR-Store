import React, { Component } from 'react';
import commonUtil from '../../../utils/commonUtil';
import os from 'os';

class InstanceCheck extends Component {

    state = {}

    componentDidMount = async () => {
        // get labels if not already fetched
        const response = await commonUtil.triggerPostRequest('/api/labels', 'post', { pageNames: 'editEvent', debug: true });
        this.setState({
            headers: response.headers
        });
    }

    render() {
        let hd = this.state.headers ? this.state.headers['gr-hostname'] : 'Loading...';
        return (
            <div className="container">
                <div className="main" style={{ fontSize: '1.2em' }}>
                    <h1>
                        Liverpool Mesa de Regalos - In-Store App Instance Check
                    </h1>
                    <i>Instance info:</i> <b>{hd}</b>
                </div>
            </div >
        );
    }
}
export default InstanceCheck;