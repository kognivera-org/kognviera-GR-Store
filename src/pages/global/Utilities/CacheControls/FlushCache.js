import React, { Component } from 'react'
import { flushcache } from './requests'

export default class FlushCache extends React.Component {

    state = {}

    flushEverything = () => {
        flushcache(undefined, (response) => {
            this.setState({
                response
            });
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
                                Error occured while flushing cache.
                        </div>
                        }
                        {
                            this.state.response && this.state.response.data &&
                            <div className="error">
                                Cache flushed successfully.
                        </div>
                        }
                        <button type="button" onClick={this.flushEverything}>FLUSH COHERENCE CACHE</button>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}