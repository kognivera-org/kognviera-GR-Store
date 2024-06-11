import React, { Component } from 'react';
import Link from 'lib/ZUILib/Link';
import routeconfig from 'config/routeconfig';
import CommonUtil from '../../../../utils/commonUtil';

class Reportes extends Component {
    render() {
        return (
            <div className="col-xs-5">
                <div className="main">
                    <div className="wrapReminders">
                        <div className="row vertical-align">
                            <div className="col-xs-6">
                                <p className="title">REPORTES</p>
                            </div>
                            <div className="col-xs-6 alignRight">
                                <Link uiname="HomeViewReports" to={CommonUtil.generateRedirect(routeconfig.reportsummary)} className="actionTag addAction">Generar reporte</Link>
                            </div>
                        </div>
                        <div className="row"></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Reportes;