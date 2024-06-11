import React, { Component } from 'react'
import Link from 'lib/ZUILib/Link'
import { connect } from 'react-redux'
import CommonUtil from '../../../../utils/commonUtil'
import routeconfig from '../../../../config/routeconfig'
import SelectViewModal from '../../EventDashboard/components/modals/SelectViewModal'
import * as dashBoardActions from '../../../eventManagement/EventDashboard/actions'
import { setSetDashboardUser } from '../../EventDashboard/request'
import { setSelectedDashboardUser, setSelectedDashboardUserFailure } from '../../EventDashboard/actions'

@connect(
    store => ({
      event: store.eventdashboard && store.eventdashboard.eventData,
      dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
        // isEmployee: true || store.eventdashboard.eventData.eventDetailsInfo.employee,
    }), { ...dashBoardActions, setSelectedDashboardUser, setSelectedDashboardUserFailure },
)

class ManagementMenu extends Component {
  componentWillMount = () => {
        // if (this.props.dashboardUser && this.props.dashboardUser.dashboardEventId != undefined && this.props.dashboardUser.dashboardEventId != '') {
        //     if (this.props.dashboardUser.dashboardEventId != this.props.params.eventId) {
        //         this.props.clearDashboardUser();
        //     }
        // }
  }
  componentDidMount() {
    if (typeof window !== 'undefined' && window.location.hash !== '#nuevo') { (this.props.dashboardUser.dashboardEventId != this.props.params.eventId) && this.SelectViewModal && this.SelectViewModal.handleShow() }

    if (window.location.hash === '#nuevo') {
      this.setDashboardUserForNewEvent(this.props)
    }
  }
  componentWillReceiveProps(nextProps) {
        // TODO: Check later for this logic opening and closing gift
    if (this.props.dashboardUser.dashboardUserName != nextProps.dashboardUser.dashboardUserName) {
      this.SelectViewModal.handleClose()
    }
    if (window.location.hash === '#nuevo' && !nextProps.dashboardUser.dashboardUserName) {
      this.setDashboardUserForNewEvent(nextProps)
    }
  }
  setDashboardUserForNewEvent = (props) => {
    const eventDetailsInfo = props.event && props.event.eventDetailsInfo
    if (eventDetailsInfo && eventDetailsInfo.celebrityInfo && eventDetailsInfo.celebrityInfo.length > 0) {
      const ownerInfoArr = eventDetailsInfo.celebrityInfo.filter(celebInfo => celebInfo.iscoOwner === 'false')
      if (ownerInfoArr && ownerInfoArr.length > 0) {
        const ownerInfo = ownerInfoArr[0]
        const params = { isConsultant: false, ownerId: ownerInfo.repositoryId, eventId: props.params.eventId, profileId: ownerInfo.profileId }
        const userName = `${ownerInfo.firstName + (ownerInfo.motherName ? ` ${ownerInfo.motherName}` : '')} ${ownerInfo.lastName}`
        const userData = { userName, userEmail: ownerInfo.email, userFirstName: ownerInfo.firstName, userLastName: ownerInfo.lastName, userMaternalName: ownerInfo.motherName }
        this.handleSetDashboardUser(params, userData)
      }
    }
  }

  handleSetDashboardUser = (params, userData) => {
        // this.props.setSetDashboardUser(params, userData)
    setSetDashboardUser(params, (response) => {
      if (response && response.data && response.data.status && response.data.status.status
                && response.data.status.status.toLowerCase() === 'success') {

        this.props.setSelectedDashboardUser(params, userData)
        this.SelectViewModal.handleClose()
        this.setState({ showSelectViewModal: false })
      } else {
        this.props.setSelectedDashboardUserFailure(userData)
      }
    })

  }
  handleCUENTADE = () => {
    this.SelectViewModal.handleShow()
  }
  handleRouteToDashboard = () => {
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.maindashboard))
  }
  render() {
    const isEmployee = this.props.event && this.props.event.eventDetailsInfo && this.props.event.eventDetailsInfo.employee
    const isMigratedEvent = this.props.event && this.props.event.eventDetailsInfo && this.props.event.eventDetailsInfo.isMigratedEvent
    const eventId = this.props.params ? (this.props.params.eventId ? this.props.params.eventId : '') : ''
    const selDashboardUser = this.props.dashboardUser && this.props.dashboardUser.dashboardUserName
    return (

      <div className="managementMenu">
        <ul className="nav-management">
          <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.eventdashboard, { eventId })}>HOME DE EVENTO</Link></li>
          <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.eventgralinfo, { eventId })}>DATOS DE EVENTO</Link></li>
          <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.eventaddressinfo, { eventId })}>DIRECCIONES REGISTRADAS</Link></li>
          <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.preferences, { eventId })}>PREFERENCIA DE ENTREGA</Link></li>
          {!isMigratedEvent && <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.eventcontract, { eventId })}>CONTRATO DE MESA DE REGALOS</Link></li>}
          <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.verificationdocuments, { eventId })}>DOCUMENTOS DE VERIFICACION</Link></li>
          {isEmployee && <li><Link className="anchorLoad " activeClassName="selected" to={CommonUtil.generateRedirect(routeconfig.employeecards, { eventId })}>TARJETAS DE EMPLEADO</Link></li>}
          <li><Link className="anchorLoad active" onClick={this.handleCUENTADE}>CUENTA DE: {selDashboardUser}</Link></li>
        </ul>

        <SelectViewModal
          onRef={ref => (this.SelectViewModal = ref)}
          data={this.props.eventdetail}
          loading={this.props.eventDetailLoading}
          routeToDashboard={this.handleRouteToDashboard}
          setOwner={this.handleSetDashboardUser}
          params={this.props.params}
          {...this.props}
                />
      </div>

    )

  }
}

export default ManagementMenu
