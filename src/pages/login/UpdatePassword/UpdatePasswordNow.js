import React, { Component } from 'react'
import commonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';

export default class UpdatePasswordNow extends Component {

    constructor() {
        super();
        this.state = {
            tooltip: ''
        }
    }

    handleRoute = (routePath) => {
        if (this.props.location.query.to) {
            if (routePath === routeconfig.maindashboard) {
                this.props.router.push(this.props.location.query.to)
            } else {
                let routingUrl = `${commonUtil.generateRedirect(routePath)}?to=${this.props.location.query.to}`
                this.props.router.push(routingUrl);
            }
        } else {
            this.props.router.push(commonUtil.generateRedirect(routePath));
        }
    }

    handleShowTooltip = (e) => {
        const tooltip = <div className="tooltip fade bottom in"
            style={{ top: 225 + 'px', left: 100 + 'px', display: 'block' }}>
            <div className="tooltip-arrow" style={{ left: 50 + '%' }}></div>
            <div className="tooltip-inner">{e.target.getAttribute('data-original-title')}</div>
        </div>
        this.setState({ tooltip })
    }

    handleHideTooltip = (e) => {
        this.setState({ tooltip: '' })
    }

    componentDidUpdate = () => {
        commonUtil.errorScrollUp();
    }

    render() {
        let user = undefined;
        if (typeof window != 'undefined') {
            let userObj = window.localStorage.getItem("user");
            user = userObj ? JSON.parse(userObj) : undefined;
        }

        return (
            <div className="container loginContent">
                <div className="row">
                    <div className="col-xs-4 col-xs-offset-4">
                        <form id="loginForm">
                            <h1>ACTUALIZAR CONTRASEÑA</h1>
                            <div className="alertError"><i className="icon-tache2"></i>
                                <p>Tu contraseña expira en {user && user.daysLeftForPwdExpiry} días, asigna una nueva contraseña.</p><a className="icon-tache2"></a>
                            </div>
                            <button className="btnPrimary size-Full mt-20" onClick={(e) => this.handleRoute(routeconfig.updatepassword)}>Actualizar</button>
                            <a className="whiteTooltip"
                                onMouseOver={this.handleShowTooltip}
                                onMouseOut={this.handleHideTooltip}
                                data-toggle="tooltip" data-placement="bottom"
                                data-original-title="Para recuperar tu contraseña, comunícate al centro de atención telefónica Liverpool CAU (030)"
                                onClick={(e) => this.handleRoute(routeconfig.maindashboard)}>
                                Omitir por ahora
                                </a>
                            {this.state.tooltip}
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
/* eslint-enable */
