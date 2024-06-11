import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import routeconfig from 'config/routeconfig';
import { getDisplayEventStatusDropdown, changeEmployeeEvent } from './actions';
import SelectionTab from 'lib/ZUILib/SelectionTab';
import SuspendEventModal from './components/SuspendEventModal';
import DeleteEventModal from './components/DeleteEventModal';
import EmployeeEventChange from './components/EmployeeEventChange';
import ChangeEventStatusModal from './components/ChangeEventStatusModal';
import { changeEventStatus } from './actions';
import ActiveEventModal from './components/ActiveEventModal';
import ConfirmModal from '../../../../global/ConfirmModal';
import commonUtil from '../../../../../utils/commonUtil';
import appconfig from '../../../../../config/appconfig';
import CheckBox from '../../../../../lib/ZUILib/CheckBox';
import Image from 'lib/ZUILib/Image';
import Link from '../../../../../lib/ZUILib/Link';

@connect(
  store => ({
    labels: store.labels.labels,
    event: store.eventdashboard && store.eventdashboard.eventData,
    eventDisplayStatus: store.header && store.header.eventDisplayStatus,
    changeStatus: store.header && store.header.changeStatusSuccess,
    changeStatusError: store.header && store.header.error,
    changeEventStatusLoading: store.header && store.header.loading,
    dashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,

  }),
  {
    getDisplayEventStatusDropdown,
    changeEventStatus, changeEmployeeEvent
  }
)

class EventHeader extends Component {
  constructor(props) {
    super(props);
    this.employeeCheckboxChecked;
  }
  state = {
    values: {},
    errors: {},
    selectedStatus: '',
  }

  getParams = () => {
    let params = {
      // channel: 'INSTORE',
      // brand: 'LP',
      eventId: this.props.params.eventId
    }
    return params;
  }
  componentWillMount = () => {
    let params = this.getParams();
    if (params.eventId) {
      this.props.getDisplayEventStatusDropdown(params);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.changeStatus && nextProps.changeStatus) {
      this.SuspendEventModal.handleClose();
      this.DeleteEventModal.handleClose();
      this.ActiveEventModal.handleClose();
      this.EmployeeEventChange.handleClose();
      this.ChangeEventStatusModal.handleClose();

      let params = this.getParams();
      params && params.eventId && this.props.getDisplayEventStatusDropdown(params)
    }
  }

  handleChangeOfEmployee = (e) => {

    this.employeeCheckboxChecked = e.target.checked
    this.EmployeeEventChange.handleShow();
  }

  onChangeEventStatus = (e) => {

    const statusobj = appconfig.eventStatusCodes;
    if (e.target.value === statusobj.suspended) {
      this.SuspendEventModal.handleShow();
    } else if (e.target.value === statusobj.deleted) {
      this.DeleteEventModal.handleShow();
    } else if (e.target.value === statusobj.active) {
      this.ActiveEventModal.handleShow();
    } else {
      this.ChangeEventStatusModal.handleShow(e.target.value);
    }
  }

  changeEmployeeEventStatus = () => {
    const isChecked = this.employeeCheckboxChecked ? "true" : "false"
    const eventId = this.props.event.eventDetailsInfo.eventId
    this.props.changeEmployeeEvent(eventId, isChecked, this.props.dashboardUserId || '12345678')
    this.EmployeeEventChange.handleClose();
  }
  handleAccept = (params) => {
    let defaultParams = this.getParams();
    // {
    //     "channel": "INSTORE",
    //     "brand": "LP",
    //     "eventId": "300000660"
    // };
    params.selectedEventStatus =
      defaultParams = {
        ...defaultParams,
        ...params
      }
    this.props.changeEventStatus(defaultParams, this.props.dashboardUserId || '12345678');
  }

  handleCancelSetCurrentStaus = () => {
    let e = document.getElementById('eventStatus');
    e.selectedIndex = '0';
  }

  handleShowConfirmOnBackModal = (type) => {
    const currentRoute = this.props.currentRoute;
    const showWarning = currentRoute ? currentRoute.showWarning : null;
    const navUrl = commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.props.params.eventId });
    const currentLocation = this.props.router.getCurrentLocation()
    if (showWarning && (type === 'back' && navUrl === currentLocation.pathname) || type !== 'back') {
      this.ConfirmModal.handleShow(type)
    } else if (type === 'back') {
      (browserHistory && browserHistory.goBack())
    } else {
      this.props.push(commonUtil.generateRedirect(routeconfig.maindashboard));
    }
  }
  handleConfirmOnBack = (type) => {
    this.props.flushCreateEventData();
    this.props.flushChangeOfEventData();
    if (this.ConfirmModal) {
      this.ConfirmModal.handleClose();
    }
    if (type === 'back') {
      browserHistory && browserHistory.goBack();
    } else {
      this.props.push(commonUtil.generateRedirect(routeconfig.maindashboard));
    }
  }

  render() {
    const { error } = this.props;
    const { errors } = this.state;
    const isEmployee = this.props.event && this.props.event.eventDetailsInfo && this.props.event.eventDetailsInfo.employee
    if (this.props.eventDisplayStatus && this.props.eventDisplayStatus.currentStatus) {
      var arrStatusOptions = [];
      let currentStatus = {
        option: this.props.eventDisplayStatus.currentStatus,
        value: this.props.eventDisplayStatus.currentStatus,
        disabled: false,
        selected: true,
      }
      arrStatusOptions.push(currentStatus);
      if (this.props.eventDisplayStatus.eventStatus) {
        let mapToOptions = this.props.eventDisplayStatus.eventStatus;
        Object.keys(mapToOptions).map(function (key, index) {
          const option = {
            option: mapToOptions[key],
            value: mapToOptions[key],
            disabled: false,
            selected: false,
          };
          arrStatusOptions.push(option);
        })
      }
    }

    const { event } = this.props;
    const eventDetails = event && event.eventDetailsInfo;
    return (
      <React.Fragment>
        <div className="nav-wrap">
          <div className="container">
            <div className="row nav-style vertical-align">
              <div className="col-xs-1">
                <a className="icon-flecha_gruesa_izq backAction"
                  href="javascript:void(0)"
                  onClick={e => this.handleShowConfirmOnBackModal('back')} />
              </div>
              <div className="col-xs-1 wrapLiverpoolLogo">
                <Link className="icon-logo_liver liverpoolAction" onClick={e => this.handleShowConfirmOnBackModal('home')}
                // } 
                />
              </div>
              {
                eventDetails &&
                <React.Fragment>
                  <div className="col-xs-1">
                    <Image className="picEvent" src={eventDetails && eventDetails.imageURL} alt="Liverpool" />
                  </div>
                  <div className="col-xs-5 titleEvent">
                    <h2 className="nameEvent">{eventDetails && eventDetails.eventName}</h2>
                    <p className="noEvent">
                      {eventDetails && eventDetails.eventType}
                      &nbsp;/ No. de evento: {eventDetails && eventDetails.eventId}
                    </p>
                  </div>
                  <div className="col-xs-2 wrapSearch">
                    <p className="textLabel">ESTATUS DEL EVENTO</p>

                    <SelectionTab
                      id={'eventStatus'}
                      uiname="EventDashboardChangeStatus"
                      options={arrStatusOptions}
                      value={this.props.eventDisplayStatus && this.props.eventDisplayStatus.currentStatus}
                      //optionCaption={' '}
                      optionText={'option'}
                      optionValue={'value'}
                      errors={errors}
                      required="false"
                      // disable={arrStatusOptions && !this.props.enableEventStatus ? arrStatusOptions.length < 0 : true}
                      disable={arrStatusOptions && arrStatusOptions.length > 0 && this.props.currentRoute.headerActions ? false : true}
                      validators={([
                        {
                          type: 'required',
                          errorMessage: 'Seleccione una opción'
                        }
                      ])}
                      onChange={(e) => this.onChangeEventStatus(e)}
                    />
                  </div>
                  <div className="col-xs-2">
                    {/* <input id="checkbox1" name="EventDashboardChangeEmployeeEvent" type="checkbox" onChange={this.handleChangeOfEmployee} checked={isEmployee} disabled={this.props.enableEventStatus} /> */}
                    <CheckBox uiname="EventDashboardChangeEmployeeEvent" id="checkbox1" displayName="Evento de empleado" type="checkbox" onChange={this.handleChangeOfEmployee} checked={isEmployee} disabled={this.props.currentRoute.headerActions ? false : true} />
                  </div>
                </React.Fragment>
              }
            </div>
          </div>
        </div>
        <SuspendEventModal onRef={ref => (this.SuspendEventModal = ref)}
          onSuspendAccept={this.handleAccept} setCurrentStatus={this.handleCancelSetCurrentStaus} changeEventStatusLoading={this.props.changeEventStatusLoading} />
        <DeleteEventModal onRef={ref => (this.DeleteEventModal = ref)}
          onDeleteAccept={this.handleAccept} setCurrentStatus={this.handleCancelSetCurrentStaus}
          errorMsg={this.props.changeStatusError && this.props.changeStatusError.errorMessage} changeEventStatusLoading={this.props.changeEventStatusLoading} />
        <ActiveEventModal onRef={ref => (this.ActiveEventModal = ref)}
          onActivateAccept={this.handleAccept} setCurrentStatus={this.handleCancelSetCurrentStaus} changeEventStatusLoading={this.props.changeEventStatusLoading} />
        <ChangeEventStatusModal onRef={ref => (this.ChangeEventStatusModal = ref)}
          onOtherEventsAccept={this.handleAccept} setCurrentStatus={this.handleCancelSetCurrentStaus}
          errorMsg={this.props.changeStatusError && this.props.changeStatusError.errorMessage} changeEventStatusLoading={this.props.changeEventStatusLoading} />
        <EmployeeEventChange onRef={ref => (this.EmployeeEventChange = ref)}
          handleAccept={this.changeEmployeeEventStatus} setCurrentStatus={this.handleCancelSetCurrentStaus} />
        <ConfirmModal onRef={ref => (this.ConfirmModal = ref)} handleConfirmOnBack={this.handleConfirmOnBack}
          displayMessage='¿estas seguro que deseas salir de esta seccion , los cambios no guardados no seran registrados?' />
      </React.Fragment>
    );
  }
}
export default EventHeader;