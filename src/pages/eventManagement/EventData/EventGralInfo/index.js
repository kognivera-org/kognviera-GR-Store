import React, { Component } from 'react'
import { connect } from 'react-redux'
import ManagementMenu from '../../Navigation/ManagementMenu'
import Datetime from 'lib/datetime/DateTime'
import EventGralInfoPrintModal from './EventGralInfoPrintModal'
import CalendarModal from '../modal/CalendarModal'
import Form from '../../../../lib/ZUILib/Form'
import TextInput from 'lib/ZUILib/TextInput'
import { getLabels } from '../../../global/Labels/actions'
import { getEditEventInfo, editEventName, setEventDate, deleteAdministrator, getEventCategoryDetails } from './actions'
import { flushCreateEventData } from '../../../createevent/actions'
import { flushChangeOfEventData } from '../../../changeOfEvent/actions'
import EventDateModal from './EventDateModal'
import ChangeTypeModal from './ChangeTypeModal'
import Link from 'lib/ZUILib/Link'
import Button from '../../../../lib/ZUILib/Button'
import CommonUtil from '../../../../utils/commonUtil'
import routeconfig from '../../../../config/routeconfig'
import Image from 'lib/ZUILib/Image'
import appconfig from '../../../../config/appconfig'
import { clearSaveEditEvent, clearCoownerCreated } from '../EditEventInfo/actions'
import PrintDownload from '../../../global/PrintDownload'

const { strategy } = require('../../../changeOfEvent/SelectedCelebrated/strategy')

const noEditableLabelEvents = [appconfig.eventTypes.Baptism, appconfig.eventTypes.Bar_Mitzvah, appconfig.eventTypes.Bat_Mitzvah, appconfig.eventTypes.Confirmaciòn, appconfig.eventTypes.First_Communion, appconfig.eventTypes.Other_Religious_Ceremonies, appconfig.eventTypes.XV_Anòs]
@connect(
  store => ({
    labels: store.labels.labels,
    editEvent: store.eventdashboard.eventData,
    editNameEvent: store.geteventdata,
    eventDateSet: store.geteventdata,
    deleteEventCoOwnner: store.geteventdata,
    eventCategories: store.geteventdata.eventCategories,
    dashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,
    creationDate: store.eventdashboard.eventData && store.eventdashboard.eventData.eventDetailsInfo && store.eventdashboard.eventData.eventDetailsInfo.additionalInfo && store.eventdashboard.eventData.eventDetailsInfo.additionalInfo.creationDate,
  }),
  {
    getLabels,
    flushCreateEventData,
    flushChangeOfEventData,
    getEditEventInfo,
    editEventName,
    setEventDate,
    deleteAdministrator,
    getEventCategoryDetails,
    clearSaveEditEvent,
    clearCoownerCreated,
  },
)


class EventGralInfo extends Component {
  state = {
    values: {},
    errors: {},
    disableDownload: false,
  }
  constructor(props) {
    super(props)
    this.state = {
      showNameEdit: false,
      showCalendar: false,
    }
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  componentDidMount() {
    this.props.clearSaveEditEvent()
    this.props.clearCoownerCreated()
    if (this.props.eventCategories) { this.props.getEventCategoryDetails() }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.eventDateSet && nextProps.eventDateSet.setEventDateSuccess) {
      this.EventDateModal.handleClose()
    }
    if (!this.props.deleteEventCoOwnner && nextProps.deleteEventCoOwnner) {
    }
  }

  getParams = () => {
    const channel = 'INSTORE'
    const brand = 'lp'
    const params = {
      channel, //
      brand,
      eventId: this.props.params.eventId,
    }
    return params
  }

  handleShow = () => {
    this.setState({
      showNameEdit: !this.state.showNameEdit,
    })
  }
  handleClose = () => {
    this.setState({
      showNameEdit: !this.state.showNameEdit,
    })
  }

  handleDateShow = () => {
    this.EventDateModal.handleShow()
  }
  handleRedirect = (param) => {
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.editeventinfo, { eventId: this.props.params.eventId, celebrityIndex: param }))
  }
  gotoAddEventInfo = () => {
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.addeventinfo, { eventId: this.props.params.eventId }))
  }
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    const editEvent = this.props.editEvent
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    const formId = e.target.id

    if (isValidForm) {
      const values = formValues[formId]
      const emails = {}
      editEvent.eventDetailsInfo.celebrityInfo.forEach((cele) => {
        if (cele.iscoOwner === 'false') {
          emails.ownerEmail = cele.email
        } else {
          emails.coOwnerEmail = cele.email
        }
      })
      values.eventDate = editEvent.eventDetailsInfo.eventDate
      values.profileId = this.props.dashboardUserId || '12345678'
      this.props.editEventName(values, emails)
      this.handleClose()
    }
  }

  handleChangeOfEvent = () => {
    this.props.flushCreateEventData()
    this.props.flushChangeOfEventData()
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.selecteventtype))

    this.ChangeTypeModal.handleClose()
  }

  handleSetEventDate = (eventDate) => {
    let params = this.getParams()
    params = {
      ...params,
      selectedEventDate: eventDate,
      profileId: this.props.dashboardUserId || '12345678',
    }
    this.props.setEventDate(params)
  }

  getAdminLabel = (celebrity, eventType) => {
    const { editEvent } = this.props
    const categoryType = editEvent && editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.eventCategory
    let selectedEventConfiguration
    if (categoryType === appconfig.eventCategory.CELEBRATION) {
      selectedEventConfiguration = strategy.strategies.Celebraciones.types[eventType]
    } else {
      selectedEventConfiguration = strategy.strategies.Todo_tipo_de_eventos.types[eventType]
    }

    if (selectedEventConfiguration.titlesEnabled) {
      return <p className="nameAdmin">{celebrity.title} {celebrity.hasPermission && <span>(Administrador)</span>}</p>
    }
    return <p className="nameAdmin">{celebrity.celebrityLabel} {celebrity.hasPermission && <span>(Administrador)</span>}</p>

  }

  getCelebrityInfo = () => {
    const { editEvent, editNameEvent } = this.props
    if (editEvent
      && editEvent.eventDetailsInfo
      && editEvent.eventDetailsInfo.celebrityInfo
      && editEvent.eventDetailsInfo.celebrityInfo.length > 0) {

      return editEvent.eventDetailsInfo.celebrityInfo.map((item, index) => (
        <div className="col-xs-4">
          {this.getAdminLabel(item, editEvent.eventDetailsInfo.eventType)}
          <div className="eventInfoWrap"><span>Nombre</span>
            <p className="detailInfo">{item.firstName}</p>
          </div>
          <div className="eventInfoWrap"><span>Apellido Paterno</span>
            <p className="detailInfo">{item.lastName}</p>
          </div>
          <div className="eventInfoWrap"><span>Apellido Materno</span>
            <p className="detailInfo">{item.motherName}</p>
          </div>
          <div className="eventInfoWrap"><span>Alias</span>
            <p className="detailInfo">{item.nickName}</p>
          </div>
          <div className="eventInfoWrap"><span>Celular</span>
            <p className="detailInfo">{item.phone}</p>
          </div>
          <div className="eventInfoWrap"><span>Correo Electrónico</span>
            {!(editEvent.eventDetailsInfo.isMigratedEvent && item.email.includes('@ta22t.dzewes')) && <p className="detailInfo">{item.email}</p>}
          </div>
          <div className="eventInfoWrap">
            <Button uiname="EventDataEditEventOwner" className="btnPrimaryAction size-Medium" onClick={e => this.handleRedirect(index)}>Editar</Button>
          </div>
          <div className="eventInfoWrap">
            {item.displayEliminarButton === 'true' &&
              <Button uiname="EventDataDeleteEventOwner" className="btnSecondarySpecial size-Medium" onClick={e => this.handleDelete(item.repositoryId)}>Eliminar</Button>
            }
          </div>
        </div>
      ))
    }
  }

  changeTypeModal = () => {
    this.ChangeTypeModal.handleShow()
  }
  getEventInfo = (err) => {
    const { editEvent, editNameEvent, eventCategories } = this.props
    const eventDate = editEvent && editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.eventDate
    const eventType = editEvent && editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.eventType
    if (editEvent && editEvent.status && editEvent.status.status === 'success') {
      if (editEvent.eventDetailsInfo) {
        return (
          <div className="col-xs-8">
            <Form id="nameEditForm" onSubmit={this.handleSubmit}>
              <div className="eventInfoWrap nameEventWrap"><span>Nombre del evento</span>
                <p className="nameEvent">
                  {editEvent.eventDetailsInfo.eventName}
                  <Link uiname="EventDataChangeEventName" onClick={this.handleShow}>
                    <i className="icon-editar editName" />
                  </Link>
                </p>
              </div>
              {(!this.state.showNameEdit) // editNameEvent && editNameEvent.eventNameData && editNameEvent.eventNameData.status && editNameEvent.eventNameData.status.status && editNameEvent.eventNameData.status.status === "success") ||
                ? '' :
                <div className="formBlock nameInputEventt">
                  <div className="materialStyle">
                    <TextInput
                      value=""
                      htmlId="editNameEvent"
                      name="editNameEvent"
                      formId="nameEditForm"
                      type="text"
                      label="Nombre del evento"
                      required="required"
                      star="*"
                      validators={[{
                        type: 'required',
                        errorMessage: 'El nombre del evento es obligatorio',
                      }]}
                      errors={err}
                    />
                    <input type="hidden" name="eventId" value={this.props.params.eventId} />
                  </div>
                  <div className="buttonsInput">
                    <button className="btnSecondaryAction size-Medium" id="cancelBtn" onClick={this.handleClose}>Cancelar</button>
                    <button className="btnPrimaryAction size-Medium" id="saveBtn" type="submit">Guardar</button>
                  </div>
                </div>
              }
            </Form >
            <div className="eventInfoWrap"><span>Fecha del evento </span>
              <EventDateModal
                onRef={ref => (this.EventDateModal = ref)}
                eventDate={eventDate}
                creationDate={this.props.creationDate}
                eventType={editEvent.eventDetailsInfo.eventType}
                setEventdate={this.handleSetEventDate}
              />
              <p className="detailInfo"><Link uiname="EventDataChangeEventDate" data-toggle="modal" onClick={this.handleDateShow}>{editEvent.eventDetailsInfo.eventDate}</Link></p>
            </div>
            <div className="eventInfoWrap"><span>Número de evento</span>
              <p className="detailInfo"> {editEvent.eventDetailsInfo.eventId}</p>
            </div>
            <div className="eventInfoWrap"><span>Tipo de evento</span>
              <p className="detailInfo"> <Link uiname="EventDataChangeEventType" onClick={this.changeTypeModal}> {editEvent.eventDetailsInfo.eventType}</Link></p>
            </div>
          </div >
        )
      }
    }

  }

  downloadToPDF = (param) => {
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      CommonUtil.downloadPdf('.toDownload', 'eventData.pdf', 'true', '', () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      window.print()
    }
  }

  handleDelete = (ownerId) => {
    let params = this.getParams()
    params = {
      ...params,
      ownerId,
      profileId: this.props.dashboardUserId || '12345678',
    }
    this.props.deleteAdministrator(params)
  }
  componentDidUpdate = () => {
    CommonUtil.errorScrollUp()
  }

  render() {
    const { labels, error, editEvent, editNameEvent } = this.props
    const eventManagement = labels ? labels.eventManagement : null
    const { errors } = this.state
    const eventImgInfo = editEvent.eventDetailsInfo ? editEvent.eventDetailsInfo.imageURL : undefined

    return (
      <div>
        <ChangeTypeModal labels={labels} onRef={ref => (this.ChangeTypeModal = ref)} onAccept={this.handleChangeOfEvent} />
        {/* <EventGralInfoPrintModal onRef={ref => (this.EventGralInfoPrintModal = ref)} /> */}
        <div className="container fill wrapPanel">
          <div className="row fill">
            <div className="col-xs-2 fill">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10 fill">
              <div className="modal fade" id="storeModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                      <h4>SELECCIONA UNA TIENDA</h4>
                      <p>Selecciona la tienda de la que deseas se imprima el documento</p>
                      <p className="requiredLabel">*campos obligatorios</p>
                      <div className="cSelect required">
                        <select>
                          <option disabled selected>Selecciona una tienda</option>
                          <option>Tienda 1</option>
                          <option>Tienda 2</option>
                          <option>Tienda 3</option>
                        </select><i className="icon-flecha_light_abajo" />
                      </div>
                      <button className="btnPrimary size-Full">Imprimir</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dynamicFrame">
                <div className="row">
                  <div className="col-xs-1 alignLeft"><Image className="eventImg" src={eventImgInfo} alt="Liverpool" /></div>
                  <div className="col-xs-6 col-xs-offset-5 alignRight">
                    <EventGralInfoPrintModal onRef={ref => (this.EventGralInfoPrintModal = ref)} />
                    <PrintDownload elem=".toDownload" uiname="EventDataPrintDownload" fileName="eventData.pdf" usePageHeader="true" />
                  </div>
                </div>
                <div className="toPrint">
                  <div className="row show-grid-row vertical-align">
                    {this.getEventInfo(errors)}
                  </div>
                  <hr />
                  {this.props.deleteEventCoOwnner && this.props.deleteEventCoOwnner.error && this.props.deleteEventCoOwnner.error.status &&
                    <div className="row show-grid-row vertical-align">
                      <div className="col-md-12">
                        <div className="alertError" id="emailsDif"><i className="icon-tache2" />
                          <p>{this.props.deleteEventCoOwnner && this.props.deleteEventCoOwnner.error && this.props.deleteEventCoOwnner.error.status && this.props.deleteEventCoOwnner.error.status.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" />
                        </div>
                      </div>
                    </div>
                  }
                  <div className="row show-grid-row vertical-align">

                    <div className="col-xs-6">
                      <h2 className="titleInfo">Festejados y Administradores</h2>
                    </div>
                    {editEvent && editEvent.eventDetailsInfo
                      && editEvent.eventDetailsInfo.canAddOwner === 'true' &&
                      <div className="col-xs-4 col-xs-offset-2">
                        <Button uiname="EventDataAddEventOwner" onClick={e => this.gotoAddEventInfo()} className="btnPrimary size-Full"><i className="icon-agregar" /> Agregar administrador</Button>
                      </div>
                    }
                  </div>
                  <div className="row show-grid-row vertical-align">
                    {this.getCelebrityInfo()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}
export default EventGralInfo
