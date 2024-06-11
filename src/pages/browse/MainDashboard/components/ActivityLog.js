import React, { Component } from 'react';
import { connect } from 'react-redux'
import { loadActivityLogs } from '../actions';
import { log } from 'util';
import Link from 'lib/ZUILib/Link';
import commonUtils from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';

@connect(
  state => ({
    activityLogs: state.activityLog.activityLogs,
  }), { loadActivityLogs }
)

class ActivityLog extends Component {

  renderActivityLogs = (eventActivityLogInfo) => {

    const activityLogs = eventActivityLogInfo && eventActivityLogInfo.map((eventInfo, index) =>
      <tr key={index}>
        <td>
          {eventInfo.nameOfActivity}
        </td>
        {/* <td>
          {eventInfo.eventType}
        </td>
        <td>
          {eventInfo.nameOfCelebratedPerson}
        </td> */}
        <td>
          {eventInfo.eventID}
        </td>
        <td>
          {eventInfo.timeOfActivity}
        </td>
      </tr>
    );
    return activityLogs;
  }

  render() {
    const { activityLogs } = this.props;
    let eventActivityLogInfo = activityLogs ? activityLogs.eventActivityLogInfo : null;
    return (
      <div className="col-xs-7">
        <div className="main">
          <div className="wrapHistorial">
            <div className="row vertical-align">
              <div className="col-xs-6">
                <p className="title">MI HISTORIAL DEL DÍA</p>
              </div>
              <div className="col-xs-6 alignRight">
                <Link uiname="HomeViewCompleteHistory" className="addAction" to={commonUtils.generateRedirect(routeconfig.daytracker)}>Ver historial completo</Link>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th>Actividad</th>
                      <th>Numero de evento</th>
                      <th>Hora</th>
                    </tr>
                    {
                      eventActivityLogInfo && this.renderActivityLogs(eventActivityLogInfo)
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ActivityLog;
