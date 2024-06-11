import React, { Component } from 'react'
import { deletecache } from './requests'

export default class DeleteCache extends React.Component {

    state = {}

    componentWillMount = () => {

    }

    componentDidMount = () => {

        const query = this.props.location.query;
        const key = query && query.key;
        key ? deletecache(key, response => {
            this.setState({
                response
            });
        }) : this.setState({
            response: {
                status: {
                    error: 'Key parameter not added.'
                }
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="main">
                        {
                            this.state.response && this.state.response.error &&
                            <div className="error">
                                {
                                    this.state.response.error.status
                                    &&
                                    this.state.response.error.status.errorMessage}
                            </div>
                        }
                        {
                            this.state.response && this.state.response.data &&
                            <div className="error">
                                Cache entry deleted successfully.
                            </div>
                        }
                    </div>
                </div>
            </React.Fragment >
        )
    }
}