import React, { Component } from 'react'
import { connect } from 'react-redux'
import routeconfig from '../../../../config/routeconfig';
import { preferredDeliveryDayDetails } from './actions'
import { updatePreferredDeliveryDays, flushDeliveryPreference } from '../../actions'
import { getLabels } from '../../../global/Labels/actions'
import commonUtil from '../../../../utils/commonUtil'

@connect(
  store => ({
    eventData: store.createevent.eventData,
    preferredDeliveryDays: store.delivery.data.preferredDeliveryDayDetails,
    deliveryPreferences: store.createevent.eventData && store.createevent.eventData.deliveryPreferences,
    labels: store.labels.labels,
  }), { preferredDeliveryDayDetails, flushDeliveryPreference, updatePreferredDeliveryDays, getLabels },
)
class StepF extends Component {

  constructor(props) {
    super(props);
    this.checked = false
  }

  state = {
    displayDeliveryAddresses: false,
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventData === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
    }
  }

  componentDidMount = () => {
    if (this.props.deliveryPreferences) {
      this.assignDeliveryDays()
      this.preferredDaysForAddress = this.props.deliveryPreferences
      // this.setState({ displayDeliveryAddresses: true })
    }
  }

  updatePreferredDaysForAddress = (e) => {
    const checked = e.currentTarget.checked
    const name = e.currentTarget.name
    const value = e.currentTarget.value
    const obj = Object.assign({}, this.preferredDaysForAddress)
    let selectedDays = obj[name]
    if (!selectedDays) {
      selectedDays = []
    }
    if (checked) {
      selectedDays.push(value)
    } else if (selectedDays.length > 0) {
      selectedDays = selectedDays.filter((item, index) => item != value)
    }
    obj[name] = selectedDays
    this.preferredDaysForAddress = obj
  }

  assignDeliveryDays = (e) => {
    const { eventData } = this.props
    const deliveryInfo = eventData ? eventData.eventAddresses : null
    const postalCodes = []
    if (deliveryInfo) {
      Object.keys(deliveryInfo).map((key, index) => {
        const item = deliveryInfo[key]
        item.postalCode && postalCodes.indexOf(item.postalCode) === -1 && postalCodes.push(item.postalCode)
      })
    }
    // postalCodes = ['15000', '12000'];
    const checked = e ? e.currentTarget.checked : true
    postalCodes && postalCodes.length > 0 && this.props.preferredDeliveryDayDetails(postalCodes, checked)
    if (checked) {
      this.checked = true
    } else {
      this.checked = false
    }
    this.setState({ displayDeliveryAddresses: checked })
  }

  handleDeliveryPreferences = () => {
    if (this.checked) {
      this.props.updatePreferredDeliveryDays(this.preferredDaysForAddress)
    } else {
      this.props.flushDeliveryPreference()
    }
    this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepg));
  }

  handleRoute = (routePath) => {
    if (this.props.eventData.GRType.isEmployeeEvent === 'true') {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepi));
    } else {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepe));
    }
  }

  render() {
    let errorMessage = ''
    const { labels, eventData, preferredDeliveryDays } = this.props
    const { displayDeliveryAddresses } = this.state
    const EventCreation = labels ? labels.EventCreation : null
    const deliveryInfo = displayDeliveryAddresses && eventData ? eventData.eventAddresses : null
    const updatePreferredDays = this.updatePreferredDaysForAddress
    // let deliveryInfo = null;
    let deliverytData = null
    let delieveryDaysInfo
    // deliveryInfo = this.props.delivery.addresses; //array
    // let postalCodes = [];
    if (deliveryInfo) {
      deliverytData = Object.keys(deliveryInfo).map((key, index) => {
        const item = deliveryInfo[key]
        const addrPostalCode = item.postalCode
        let preferredDays = null
        if (preferredDeliveryDays && preferredDeliveryDays.deliveryDayAndAddressInfo
          && preferredDeliveryDays.deliveryDayAndAddressInfo.length > 0) {
          preferredDays = preferredDeliveryDays.deliveryDayAndAddressInfo.filter((preferredDay, index) => preferredDay.postalCode === addrPostalCode)
        }
        delieveryDaysInfo = preferredDays && preferredDays.length > 0
          && preferredDays[0].delieveryDaysInfo && preferredDays[0].delieveryDaysInfo.length > 0
          ?
          preferredDays[0].delieveryDaysInfo : null

        if (!delieveryDaysInfo) {
          errorMessage = preferredDays && preferredDays.length > 0
            && preferredDays[0].message
        }
        // item.postalCode && postalCodes.push(item.postalCode);
        return (
          <div key={`${key}_${index}`} className="col-xs-4 selectDays">
            <h4>{item.nickName}</h4>
            <h2 className="subtitleModule">{item.firstName}{item.middleName ? ' ' + item.middleName : ''} {item.lastName}{item.maternalName ? ' ' + item.maternalName : ''}</h2>
            <p className="descriptiveText">{item.address1}, Ext. {item.exteriorNumber}{item.interiorNumber ? ', Int. ' + item.interiorNumber : ''}{item.building ? ', ' + item.building : ''} {item.city}, {item.neighbourhood}<br />{item.delegationMunicipality}, C.P.{item.postalCode}, {item.country}, {item.state}</p>
            <p className="informativeTextSecond">Dias disponibles para entregas</p>
            {delieveryDaysInfo && delieveryDaysInfo.length > 0 ? delieveryDaysInfo.map((delieveryDayInfo, index1) => <div className="checkbox">
              <input id={`checkbox_${index}${index1}`} defaultChecked={this.props.deliveryPreferences && this.props.deliveryPreferences[item.addressId] && this.props.deliveryPreferences[item.addressId].indexOf(delieveryDayInfo.deliveryDay) > -1} type="checkbox" name={key} value={delieveryDayInfo.deliveryDay} onClick={updatePreferredDays} />
              <label htmlFor={`checkbox_${index}${index1}`}>{delieveryDayInfo.deliveryDay}</label>
            </div>) : <p className="informativeTextSecond">{errorMessage}</p>}
            {/* {errorMessage} */}
          </div>
        )
      })
    }

    return (
      <div className="container eventCreationContent">
        <div className="main">
          <div className="row">
            {/* {errorMessage &&
              < div className="col-xs-12">
                <div className="alertError" id="registeredInformation"><i className="icon-tache2" />
                  <p>{errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" />
                </div>
              </div>
            } */}
            <div className="col-xs-12 centerMe">
              <h2 className="subtitleSection">Preferencias de entrega de regalos</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <div className="eventCreationChoose">
                <p className="mainText">{commonUtil.getLabel(labels, 'eventCreation.stage3.preferredDay')}</p>
                {deliverytData && !delieveryDaysInfo &&
                  <div>{commonUtil.getLabel(labels, 'eventCreation.stage3.noPreferredDay')}</div>}
                {/* {errorMessage &&
                < div className="col-xs-12">
                  <div className="alertError" id="registeredInformation"><i className="icon-tache2" />
                    <p>{errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" />
                  </div>
                </div>
              } */}
                <div className="checkbox">
                  <input id="checkbox1" type="checkbox" defaultChecked={!!this.props.deliveryPreferences} onClick={e => this.assignDeliveryDays(e)} />
                  <label htmlFor="checkbox1">¿Deseas asignar dias de entrega?</label>
                </div>
                {deliverytData}
              </div>
            </div>
          </div>

          <div className="row registerFooter">
            <div className="col-xs-6">
              <button className="btnSecondaryAction size-ExtraLarge" onClick={this.handleRoute}><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
            </div>
            <div className="col-xs-6 button_right text-right">
              {/* <button className="btnPrimary size-ExtraLarge" onClick={this.handleDeliveryPreferences}>Siguiente paso <i className="iconRight icon-flecha_lightsvg_derecha" /></button> */}
              <button className="btnNextStep size-Large" onClick={this.handleDeliveryPreferences}><i className="iconRight icon-flecha_lightsvg_derecha" />SiguientePaso</button>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default StepF
