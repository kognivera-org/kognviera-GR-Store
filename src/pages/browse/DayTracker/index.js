
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { loadActivityLogs } from '../MainDashboard/actions';
import { log } from 'util';

@connect(
  store => ({
    activityLogs: store.activityLog.activityLogs,
  }),
  { loadActivityLogs })

class DayTracker extends Component {

  componentWillMount = () => {
    const userObj = (typeof window != 'undefined') && window.localStorage.getItem('user')
    const userFromSession = userObj && JSON.parse(userObj);
    const filterParam = this.props.location.query.filterParam;
    // Get Activity log.
    // Commenting for Phase 2
    // userFromSession && this.props.loadActivityLogs(userFromSession.storeAssociateId, "true", filterParam);
  }

  handleFilterSearchLog = (e) => {
    e.preventDefault();
    const userObj = (typeof window != 'undefined') && window.localStorage.getItem('user')
    const userFromSession = userObj && JSON.parse(userObj);
    let filterParam = e.target.logSearchId.value.trim();
    filterParam = filterParam ? filterParam : undefined;
    // Commenting for Phase 2
    // userFromSession && this.props.loadActivityLogs(userFromSession.storeAssociateId, "true", filterParam)
  }

  renderActivityLogs = (eventActivityLogInfo) => {
    let counter = 1;

    const activityLogs = eventActivityLogInfo.map((eventInfo) =>
      <tr key={counter++}>
        <td>
          {eventInfo.nameOfActivity}
        </td>
        <td>
          {eventInfo.eventType}
        </td>
        <td>
          {eventInfo.nameOfCelebratedPerson}
        </td>
        <td>
          {eventInfo.eventID}
        </td>
        <td>
          {eventInfo.timeOfActivity}
        </td>
      </tr>
    );
    return (<tbody>{activityLogs}</tbody>);
  }
  render() {
    const { activityLogs } = this.props;
    let eventActivityLogInfo = activityLogs && activityLogs.eventActivityLogInfo;
    return (
      <React.Fragment>
        <div className="container">
          <div className="main">
            <div className="col-xs-12">
              <h1>Historial del día</h1>
            </div>

            <div className="row">
              <div className="col-xs-4 searchRegister">
                <form name="logSearch" onSubmit={this.handleFilterSearchLog} ref="logSearch">
                  <div className="input-group">
                    <input className="form-control" name="logSearchId" id="logSearchId" type="text" placeholder="Buscar registro" />
                    <span className="input-group-btn">
                      <span className="btn btn-default buttonSearch" type="button"
                        onClick={() => this.refs.logSearch.dispatchEvent(new Event('submit'))}>
                        <i className="icon-zoom" /></span>
                    </span>
                  </div>
                </form>
              </div>
              {
                eventActivityLogInfo &&
                <div className="col-xs-2 col-xs-offset-6 resultsRegister">
                  <p><span>{eventActivityLogInfo.length}</span>&nbsp;resultados</p>
                </div>
              }
            </div>
            <table className="table table-striped dayTrackerTable">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Festejados</th>
                  <th>Tipo de mesa</th>
                  <th>Número de evento</th>
                  <th>Hora</th>
                </tr>
              </thead>
              {
                eventActivityLogInfo && this.renderActivityLogs(eventActivityLogInfo)
              }
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default DayTracker;
