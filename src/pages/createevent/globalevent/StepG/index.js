import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getContractDetails } from './actions'
import { createEvent, flushCreateEventData } from '../../actions'
import routeconfig from '../../../../config/routeconfig'
import commonUtil from '../../../../utils/commonUtil'
import { create } from 'domain'
import ContractPagDownloadPDF from './contractPageForDownloadPDF'
import PrintDownload from '../../../global/PrintDownload'
import appconfig from '../../../../config/appconfig'
import Link from '../../../../lib/ZUILib/Link'

@connect(
  store => ({
    contract: store.contract.data,
    updating: store.createevent.updating,
    eventData: store.createevent.eventData,
    printView: store.createevent.printView,
    eventCreated: store.createevent.eventCreated,
    createEventError: store.createevent.createEventError,
    addAddresses: store.addAddress,
  }),
  { getContractDetails, createEvent, flushCreateEventData },
)

class StepG extends Component {
  constructor(props) {
    super(props)
    this.enableNextStepFunc = false
  }
  state = {
    enableNextStep: false,
    error: '',
    disableDownload: false,
  }

  componentDidMount = () => {

    if (this.props.eventData === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root))
    }

    const { eventData } = this.props
    const GRType = eventData && eventData.GRType
    const isEmployee = GRType && GRType.isEmployeeEvent ? GRType.isEmployeeEvent : 'false'
    const eventDate = eventData.eventDate
    const eventType = this.props.eventData && this.props.eventData.GRType ? this.props.eventData.GRType.tipoCelebracion : ''
    this.props.getContractDetails(eventType, isEmployee, '', eventDate)
  }

  populateCelebrityInfo = (info, is_coowner) => {
    const celebrityInfo = {}
    celebrityInfo.title = info.ownerTitle
    celebrityInfo.ownerLabel = info.ownerLabel
    celebrityInfo.profileId = info.profileId
    celebrityInfo.firstName = info.firstName
    celebrityInfo.lastName = info.lastName
    celebrityInfo.motherName = info.maternalName
    celebrityInfo.nickName = info.alias
    celebrityInfo.dateOfBirth = info.dob ? info.dob : info.bdayDate ? info.bdayDate : ''
    celebrityInfo.phone = info.celphone
    celebrityInfo.isMinor = info.isMinor
    celebrityInfo.email = info.emailId && info.emailId.toLowerCase()
    celebrityInfo.is_coowner = is_coowner
    if (info.gender === 'male') {
      celebrityInfo.sex = 'Male'
    } else if (info.gender === 'female') {
      celebrityInfo.sex = 'Female'
    } else {
      celebrityInfo.sex = ''
    }
    return celebrityInfo
  }

  populateAddressesInfoArr = (eventData) => {
    const { addAddresses } = this.props
    const { eventAddresses, deliveryPreferences } = eventData
    const addressInfos = Object.keys(eventAddresses).map((key, index) => {
      const addrInfo = {}
      const address = eventAddresses[key]
      const codeData = {}
      if (address.phoneNumber) {
        const index = address.phoneNumber.indexOf('-')
        codeData.particularPhoneCode = address.phoneNumber.substr(0, index)
        codeData.phoneNumber = address.phoneNumber.substr(index + 1)
      }
      if (address.businessPhoneNumber) {
        const index = address.businessPhoneNumber.indexOf('-')
        codeData.businessPhoneCode = address.businessPhoneNumber.substr(0, index)
        codeData.businessPhoneNumber = address.businessPhoneNumber.substr(index + 1)
      }
      addrInfo.nickname = address.nickName
      addrInfo.firstName = address.firstName
      addrInfo.middleName = address.middleName
      addrInfo.lastName = address.lastName
      addrInfo.maternalName = address.maternalName
      addrInfo.country = address.country
      addrInfo.city = address.city
      addrInfo.stateId = address.stateId
      addrInfo.state = address.state
      addrInfo.delegationMunicipalityId = address.delegationMunicipalityId
      addrInfo.delegationMunicipality = address.delegationMunicipality
      addrInfo.postalCode = address.postalCode
      addrInfo.building = address.building
      addrInfo.neighbourhood = address.neighbourhood
      addrInfo.neighbourhoodId = address.neighbourhoodId
      addrInfo.address1 = address.address1
      addrInfo.address2 = address.address2
      addrInfo.address3 = address.address3
      addrInfo.exteriorNumber = address.exteriorNumber
      addrInfo.interiorNumber = address.interiorNumber
      addrInfo.landmark = address.landmark
      addrInfo.particularPhoneCode = codeData.particularPhoneCode
      addrInfo.phoneNumber = codeData.phoneNumber
      addrInfo.businessPhoneCode = codeData.businessPhoneCode
      addrInfo.businessPhoneNumber = codeData.businessPhoneNumber
      addrInfo.cellular = address.cellular
      addrInfo.otherColony = address.otherColony
      addrInfo.celebrityName = address.celebrityName
      addrInfo.exteriorNumber = address.exteriorNumber
      addrInfo.saveDays = []
      addrInfo.ecommAddressId = address.addressId
      if (addAddresses && addAddresses.data && addAddresses.data.length > 0) {
        const id = address.addressId
        addAddresses.data.map((data) => {
          if ((data.addressId !== 'undefined') && (id !== 'undefined') && data.addressId === id) {
            addrInfo.landmark = data.landmark
            return addrInfo.landmark
          }
          return null
        })
      }
      const preferredDays = deliveryPreferences && deliveryPreferences[address.addressId]
      const days = preferredDays || []
      preferredDays && addrInfo.saveDays.push({ days })
      return addrInfo
    })
    return addressInfos
  }

  populateEmployeeCardArr = (eventData) => {
    const employeeCardData = eventData && eventData.employeeCardData
    const employeeCardArr = employeeCardData && employeeCardData.map((data, index) => {
      const cardInfo = {}
      cardInfo.cardNumber = data.cardNumber
      cardInfo.firstName = data.firstName
      cardInfo.middleName = data.middleName
      cardInfo.lastName = data.lastName
      cardInfo.motherLastName = data.motherLastName
      cardInfo.cardType = 'DILISA'
      return cardInfo
    })
    return employeeCardArr
  }

  populateCelebrityInfoArr = (eventData) => {
    const ownerInfo = eventData && eventData.ownerInfo
    const coownerInfo = eventData && eventData.coownerInfo
    const coowner2Info = eventData && eventData.coowner2Info
    const celebrityInfoArr = []
    celebrityInfoArr.push(this.populateCelebrityInfo(ownerInfo, 'false'))
    if (coownerInfo) {
      celebrityInfoArr.push(this.populateCelebrityInfo(coownerInfo, 'true'))
    }
    if (coowner2Info) {
      celebrityInfoArr.push(this.populateCelebrityInfo(coowner2Info, 'true'))
    }
    return celebrityInfoArr
  }

  handleCreateEvent = () => {
    const { eventData } = this.props
    const celebrityInfo = this.populateCelebrityInfoArr(eventData)
    const addressesInfo = this.populateAddressesInfoArr(eventData)
    const GRType = eventData && eventData.GRType
    const isEmployeeEvent = GRType && GRType.isEmployeeEvent
    let user = null
    let storeId = ''
    if (typeof window !== 'undefined') {
      const userObj = window.localStorage.getItem('user')
      user = userObj ? JSON.parse(userObj) : undefined
      storeId = window.localStorage.getItem('storeId')
    }
    const createEventObj = {}
    createEventObj.channel = 'INSTORE'
    createEventObj.eventType = GRType.tipoCelebracion
    createEventObj.eventCategory = GRType.tipoMesa
    createEventObj.preferredStoreId = storeId || ''
    createEventObj.eventDate = eventData.eventDate
    createEventObj.eventName = eventData.eventName
    createEventObj.isEmployee = isEmployeeEvent || 'false'
    createEventObj.celebrityInfo = celebrityInfo
    createEventObj.addressesInfo = addressesInfo

    const dilisiaCardInfo = isEmployeeEvent && this.populateEmployeeCardArr(eventData)
    if (dilisiaCardInfo) {
      createEventObj.dilisiaCardInfo = dilisiaCardInfo
    }
    this.props.createEvent(createEventObj)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updating) {
      this.setState({
        enableNextStep: false,
      })
      this.enableNextStep = false
    }
    if (nextProps.eventData && nextProps.eventData.event && nextProps.eventCreated) {
      this.props.flushCreateEventData()
      this.handleConfirmContract(nextProps.eventData.event)
    }
    if (!this.props.createEventError && nextProps.createEventError) {
      this.setState({
        error: nextProps.createEventError,
        enableNextStep: true,
      })
      this.enableNextStep = true
    }
  }

  handleReturnContract = () => {
    if (this.props.eventData.GRType.isEmployeeEvent === 'true') {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepi));
    } else {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepe));
    }
  }

  handleConfirmContract = (eventId) => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.globalsteph, { eventId }))
  }

  downloadToPDF = (param) => {
    const fileName = 'Contract'
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      commonUtil.downloadPdf('.toPrint', 'contract.pdf', 'false', `Contrato - Evento de ${this.props.eventData && this.props.eventData.GRType && this.props.eventData.GRType.tipoCelebracion}`, () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      window.print()
    }
    this.setState({ enableNextStep: true })
    this.enableNextStep = true
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
    const { error } = this.state
    const { eventData } = this.props
    let contractInfo = null
    let currentDate = new Date()
    currentDate = `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`
    let contractData = null
    contractInfo = this.props.contract.contractDetailsInfo

    for (const key in contractInfo) {
      contractData = contractInfo.contractdata
    }
    return (
      <React.Fragment>
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
              <div className="col-xs-12">
                <h1 className="titleSection">Contrato - Evento de {this.props.eventData && this.props.eventData.GRType && this.props.eventData.GRType.tipoCelebracion}</h1>
              </div>
              <div className="col-xs-4" />
            </div>
            <div className="row">
              <div className="col-xs-12">
                <div className="innerWrap contractWrapper">
                  <div className="pdfContent">
                    <p className="col-xs-12 mainText">Contrato para la mesa de regalos de Liverpool</p>
                    <p className="informativeText" dangerouslySetInnerHTML={{ __html: contractData }} />
                  </div>
                  <div className="row exclude-for-print-download">
                    <div className="col-md-10 termsConditions" />
                    <div className="col-md-2 buttonsPdf">
                      <PrintDownload
                        elem=".toPrint" footer={`Contrato - Evento de ${this.props.eventData && this.props.eventData.GRType && this.props.eventData.GRType.tipoCelebracion}`} useDefault fileName="contract.pdf" usePageHeader="false" callBefore={() => {
                          this.setState({ enableNextStep: true })
                          this.enableNextStep = true
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row bottomNavigation exclude-for-print-download">
              <div className="col-xs-12">
                <button className="btnSecondaryAction size-Large" onClick={this.handleReturnContract} ><i className="iconLeft icon-flecha_light_izq" />Regresar</button>
                <button className={`btnPrimary size-Large${!this.enableNextStep ? ' btnPrimaryDisable' : ''}`} disabled={!this.enableNextStep} onClick={this.handleCreateEvent}>Finalizar Registro <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
              </div>
            </div>
          </div>
          <div className="display-hidden">
            <ContractPagDownloadPDF eventData={eventData} contractData={contractData} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default StepG

