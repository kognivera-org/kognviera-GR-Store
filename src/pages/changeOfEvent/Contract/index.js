
import React, { Component } from 'react'
import { getLabels } from '../../global/Labels/actions'
import { getContractDetails } from '../../createevent/globalevent/StepG/actions'
import { updateEventType } from '../actions'
import { connect } from 'react-redux'
import EventChangeConfirmation from './EventChangeConfirmation'
import commonUtil from '../../../utils/commonUtil'
import routeconfig from '../../../config/routeconfig'
import ContractPagDownloadPDF from './contractPageForDownloadPDF'
import PrintDownload from '../../global/PrintDownload'
import appconfig from '../../../config/appconfig'
import Link from '../../../lib/ZUILib/Link'
import { flushChangeOfEventData } from '../actions'

@connect(
  store => ({
    labels: store.labels.labels,
    contract: store.contract.data,
    eventData: store.createevent.eventData,
    eventType: store.createevent.eventData && store.createevent.eventData.GRType.tipoCelebracion,
    eventCategory: store.createevent.eventData && store.createevent.eventData.GRType.tipoMesa,
    eventId: store.eventdashboard.eventData.eventDetailsInfo && store.eventdashboard.eventData.eventDetailsInfo.eventId,
    changeOfEvent: store.changeOfEvent,
    eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
    eventTypeUpdated: store.changeOfEvent.eventTypeUpdated,
    eventTypeUpdatedError: store.changeOfEvent.eventTypeUpdatedError,
    UpdatingEventType: store.changeOfEvent.UpdatingEventType,
  }),
  { getLabels, getContractDetails, updateEventType, flushChangeOfEventData },
)

class EventContract extends Component {
  state = {
    enableNextStep: false,
    error: '',
    disableDownload: false,
  }

  downloadToPDF = (param) => {
    const fileName = 'Contract'
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      commonUtil.downloadPdf('.toPrint', 'contract.pdf', 'false', `Contrato de ${this.props.eventType}`, () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      commonUtil.printPage('.toPrint')
    }
    this.setState({ enableNextStep: true })
  }

  handleRoute = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.celebratedcardinfo))
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventDetailsInfo === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.UpdatingEventType) {
      this.setState({
        enableNextStep: false,
      })
    }
    if (nextProps.eventTypeUpdated) {
      this.props.flushChangeOfEventData()
      this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: `${this.props.eventId}` }))
    }
    if (!this.props.eventTypeUpdatedError && nextProps.eventTypeUpdatedError) {
      this.setState({
        error: nextProps.eventTypeUpdatedError,
        enableNextStep: true,
      })
    }
  }

  componentDidMount = () => {
    if (this.props.eventDetailsInfo) {
      const isEmployee = this.props.eventDetailsInfo && this.props.eventDetailsInfo.employee
      this.props.getLabels()
      // console.log('isEmployee', isEmployee.toString())
      this.props.getContractDetails(this.props.eventType, isEmployee.toString(), '')
    }
  }

  deletedCoOwnerIds = () => {
    const deletedCelebrityInfo = this.props.changeOfEvent.deletedCelebrityInfo
    const deletedOwners = []
    for (let i = 0; i < deletedCelebrityInfo.length; i++) {
      const ownerId = deletedCelebrityInfo[i].ownerId
      deletedOwners.push(ownerId)
    }
    return deletedOwners
  }

  deletedAddressIds = () => {
    const deletedAddressInfo = this.props.changeOfEvent.deletedAddressInfo
    const deletedAddresses = []
    for (let i = 0; i < deletedAddressInfo.length; i++) {
      const addressId = deletedAddressInfo[i].addressId
      deletedAddresses.push(addressId)
    }
    return deletedAddresses
  }

  deletedPlasticCards = () => {
    const deletedPlasticCardsInfo = this.props.changeOfEvent.deletedPlasticCardsInfo
    const deletedPlasticCards = []
    for (let i = 0; i < deletedPlasticCardsInfo.length; i++) {
      const plasticCardId = deletedPlasticCardsInfo[i].plasticCardNumber
      deletedPlasticCards.push(plasticCardId)
    }
    return deletedPlasticCards
  }

  addedCoowner = () => {
    const addedCoowner = this.props.changeOfEvent.addedCoowner
    const addedCoownerInfos = Object.keys(addedCoowner).map((key, index) => {
      const coOwnerInfo = {}
      const addedCoownerInfo = addedCoowner[key]
      coOwnerInfo.nickname = addedCoownerInfo.alias
      coOwnerInfo.firstName = addedCoownerInfo.firstName
      coOwnerInfo.dateOfBirth = addedCoownerInfo.birthday
      coOwnerInfo.lastName = addedCoownerInfo.lastName
      coOwnerInfo.motherName = addedCoownerInfo.motherName
      coOwnerInfo.ownerLabel = addedCoownerInfo.celebrityLabel
      coOwnerInfo.title = addedCoownerInfo.title
      coOwnerInfo.phone = addedCoownerInfo.phone
      return coOwnerInfo
    })
    return addedCoownerInfos
  }

  updatedInfo = () => {
    const celebrityInfo = this.props.changeOfEvent.celebrityInfo
    const updatedCelebrity = []
    const updatedCelebratedInfo = celebrityInfo.filter((celeb, id) => {
      if (celeb.repositoryId !== undefined) { return celeb }
    })
    for (let i = 0; i < updatedCelebratedInfo.length; i++) {
      let formValues = {}
      formValues = Object.assign({
        ownerId: updatedCelebratedInfo[i].repositoryId,
        title: updatedCelebratedInfo[i].title,
        ownerLabel: updatedCelebratedInfo[i].celebrityLabel,
      })
      updatedCelebrity.push(formValues)
    }
    return updatedCelebrity
  }
  updateForPrint = () => {
    // this.props.setPrintView()
    window.print()
    this.setState({ enableNextStep: true })
  }

  handleEventChange = () => {
    const createEventObj = {}
    const addedCelebrityInfo = {}
    const deletedInformation = {}
    const updatedInfo = this.updatedInfo()
    addedCelebrityInfo.addedOwners = this.addedCoowner()
    addedCelebrityInfo.addressMapping = this.props.changeOfEvent.AddressInfo
    deletedInformation.deletedCoOwnerIds = this.deletedCoOwnerIds()
    deletedInformation.deletedAddressIds = this.deletedAddressIds()
    deletedInformation.deletedPlasticCards = this.deletedPlasticCards()
    createEventObj.existingEventId = this.props.eventId
    createEventObj.selectedEventCategory = this.props.eventCategory
    createEventObj.selectedEventType = this.props.eventType
    createEventObj.newEventName = this.props.eventData.eventName || this.props.eventDetailsInfo.eventName
    createEventObj.addedInfo = addedCelebrityInfo
    createEventObj.deletedInfo = deletedInformation
    createEventObj.updatedInfo = updatedInfo
    this.props.updateEventType(createEventObj)
    this.EventChangeConfirmation.handleClose()
  }

  confirmEventChange = () => {
    this.EventChangeConfirmation.handleShow()
  }

  closeError = () => {
    this.setState({
      error: '',
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }

  render() {
    const { labels, contract, eventId, eventData, changeOfEvent, eventDetailsInfo } = this.props
    const { error } = this.state
    const contractHtml = contract
      && contract.contractDetailsInfo
      && contract.contractDetailsInfo.contractdata
    const eventManagement = labels ? labels.eventManagement : null
    return (
      <div className="container eventCreationContent">
        <div className="main">
          <div className="row">
            {error && error.errorMessage &&
              <div className="col-xs-12">
                <div className="alertError" id="emailsDif"><i className="icon-tache2" />
                  <p>{error.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeError} />
                </div>
              </div>}
            <div className="col-xs-4" />
            <div className="col-xs-4">
              <h1 className="titleSection">Contrato de {this.props.eventType}</h1>
            </div>
            <div className="col-xs-4" />
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="innerWrap contractWrapper">
                <div className="pdfContent">
                  <p className="mainText">Contrato para la mesa de regalos de Liverpool</p>
                  <p className="informativeText" dangerouslySetInnerHTML={{ __html: contractHtml }} />
                </div>
                <div className="row exclude-for-print-download">
                  <div className="col-md-10 termsConditions" />
                  <div className="col-md-2 buttonsPdf">
                    {/* <Link className="download" disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('download')} download><i className="icon-descarga" /></Link>
                    <Link className="print" disabled={this.state.disableDownload} onClick={() => this.updateForPrint()}><i className="icon-imprimir" /></Link> */}
                    <PrintDownload elem=".toPrint" footer={`Contrato de ${this.props.eventType}`} useDefault fileName="contract.pdf" usePageHeader="false" callBefore={() => this.setState({ enableNextStep: true })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row bottomNavigation exclude-for-print-download">
            <div className="col-xs-6">
              <button className="btnSecondaryAction size-ExtraLarge" onClick={this.handleRoute}><i className="iconLeft icon-flecha_light_izq" />Regresar</button>
            </div>
            <div className="col-xs-6 right">
              <button className={`btnPrimary size-ExtraLarge${!this.state.enableNextStep ? ' btnPrimaryDisable' : ''}`} disabled={!this.state.enableNextStep} onClick={this.confirmEventChange}>Finalizar cambio de tipo de evento <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
            </div>
          </div>
        </div>
        <div className="display-hidden">
          <ContractPagDownloadPDF eventData={eventData} changeOfEvent={changeOfEvent} eventDetailsInfo={eventDetailsInfo} eventId={eventId} contractData={contractHtml} />
        </div>
        <EventChangeConfirmation
          onRef={ref => (this.EventChangeConfirmation = ref)}
          handleAccept={this.handleEventChange} labels={this.props.labels}
        />
      </div>

    )
  }
}
export default EventContract
