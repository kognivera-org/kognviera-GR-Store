import React, { Component } from 'react'
import TrackDeliverModal from '../modals/TrackDeliverModal'
import RadioButton from '../../../../../lib/ZUILib/RadioButton'
import HomeDeliveryAddressOpeningGiftModal from './homeDeliveryOptionModal'
import StoreSubmitModal from './storeDeliveryModal'
import { addAddress } from '../../../../createevent/address/actions'
import { connect } from 'react-redux'
import * as dashBoardActions from '../../actions'
import commonUtil from '../../../../../utils/commonUtil'
import Link from 'lib/ZUILib/Link'
import routeconfig from '../../../../../config/routeconfig'
import appconfig from '../../../../../config/appconfig'

@connect(
  store => ({
    labels: store.labels.labels,

    eventdetail: store.eventdashboard.eventData,
    setOpeningOrClosingGiftDetailsForEventFailed: store.eventdashboard.setOpeningOrClosingGiftDetailsForEventFailed,
    setOpeningOrClosingGiftDetailsForEventErrorMessage: store.eventdashboard.setOpeningOrClosingGiftDetailsForEventErrorMessage,
    closingGiftPriceRange: store.eventdashboard.closingGiftPriceRangeInfo,
    closingGiftPriceRangeInfoLoading: store.eventdashboard.closingGiftPriceRangeInfoLoading,
    eventStatus: store.header && store.header.eventDisplayStatus && store.header.eventDisplayStatus.currentStatus,
  }),
  { ...dashBoardActions },
)

class GiftForOpening extends Component {
  closingCategories = [appconfig.eventTypes.Aniversario, appconfig.eventTypes.Cumpleaños, appconfig.eventTypes.Despedida, appconfig.eventTypes.Fiesta_infantil, appconfig.eventTypes.Fiesta_Reunión, appconfig.eventTypes.Open_House, appconfig.eventTypes.Others, appconfig.eventTypes.Mascotas]
  isGetOpeningOrClosingGiftCalled = false
  isClosingGiftPriceRangeInfoCalled = false
  isSetOpeningAndClosingGift = false;
  state = {
    errorForOpeningAndClosingGifts: '',
    selectedDeliveryType: '',
    showHomeDeliveryModal: false,
    showStoreConfirmModal: false,
    showAccordion: false,
  }
  openingClosingType = this.closingCategories.indexOf(this.props.eventType) > -1 ? 'closing' : 'opening';
  handleOpenTrackDeliveryModal = () => {
    this.props.handleOpenTrackDeliveryModal(this.props.openingOrClosingGiftDetailsForEvent)
  }
  collapseToggle = () => {
    this.setState({
      showAccordion: !this.state.showAccordion,
    })
  }
  componentDidMount() {
    this.props.getEventDeliveryAddressesForGiftOpening(this.props.eventId)
  }

  componentWillReceiveProps(nextProps) {
    const eventIdParam = this.props.eventId
    if (nextProps.eventType) {
      this.openingClosingType = this.closingCategories.indexOf(nextProps.eventType) > -1 ? 'closing' : 'opening'
      if (this.openingClosingType === 'closing' && !this.isClosingGiftPriceRangeInfoCalled) {
        this.props.executeClosingGiftPriceRangeInfo(nextProps.eventId)
        this.isClosingGiftPriceRangeInfoCalled = true
      }
      if (!this.isGetOpeningOrClosingGiftCalled && ((this.openingClosingType === 'closing' && !nextProps.closingGiftPriceRangeInfoLoading && nextProps.closingGiftPriceRange && nextProps.closingGiftPriceRange.closingGiftPriceRangeInfo) || this.openingClosingType === 'opening')) {
        this.isGetOpeningOrClosingGiftCalled = true
        this.props.getOpeningOrClosingGiftDetailsForEvent(this.props.eventId, this.openingClosingType)
      }
    }
    if (nextProps.setOpeningOrClosingGiftDetailsForEventFailed) {
      this.setState({
        showStoreConfirmModal: true,
        errorForOpeningAndClosingGifts: nextProps.setOpeningOrClosingGiftDetailsForEventErrorMessage.errorMessage,
      })
    }
  }

  handleHomeModalClose = () => {
    this.setState({
      selectedDeliveryType: '',
      showHomeDeliveryModal: false,
    })
  }

  handleStoreModalClose = (status) => {
    if (this.props.setOpeningOrClosingGiftDetailsForEventFailed) {
      this.props.resetSetOpeningAndClosing()
    }
    if (status.preventDefault) {
      status.preventDefault()
    }
    const { loading, openingOrClosingGiftDetailsForEventFailed, openingOrClosingGiftDetailsForEvent } = this.props
    let deliveryMethod = ''
    if (!status.preventDefault && status) {
      this.submitOption()
    }
    if (!status && !loading && !openingOrClosingGiftDetailsForEventFailed && openingOrClosingGiftDetailsForEvent) {
      if (openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo &&
        openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo.addressItem && openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo.addressItem.addressId) {
        deliveryMethod = 'home'
      }
      if (openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo &&
        openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo.storeName && openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo.disableStore === 'true') {
        deliveryMethod = 'store'
      }
    }

    this.setState({
      showStoreConfirmModal: false,
      selectedDeliveryType: deliveryMethod,
    })
  }
  getAddressForHtml = (address) => {
    let addressDataHtml = ' '
    addressDataHtml += `${address.firstName} ${address.lastName}`
    if (address.address1) {
      addressDataHtml += ` ,${address.address1}`
    }
    if (address.exteriorNumber) {
      addressDataHtml += `, Ext. ${address.exteriorNumber}`
    }
    if (address.interiorNumber) {
      addressDataHtml += `, Int. ${address.interiorNumber}`
    }
    if (address.building) {
      addressDataHtml += `, ${address.building}`
    }
    if (address.city) {
      addressDataHtml += `, ${address.city}`
    }
    if (address.colony) {
      addressDataHtml += `, ${address.colony}`
    }
    if (address.delegationMunicipality) {
      addressDataHtml += `, ${address.delegationMunicipality}`
    }
    if (address.postalCode) {
      addressDataHtml += `, ${address.postalCode}`
    }
    if (address.state) {
      addressDataHtml += `, ${address.state}`
    }
    if (address.address2) {
      addressDataHtml += `, ${address.address2}`
    }
    if (address.phoneNumber) {
      addressDataHtml += ', ' + (address.particularPhoneCode ? address.particularPhoneCode : '') + address.phoneNumber;
    }
    if (address.cellular) {
      addressDataHtml += ', ' + address.cellular;
    }
  }
  submitOption = (address) => {
    let addressId = ''
    if (address) {
      addressId = address.addressId
    }
    const eventId = this.props.eventId
    const storeSelected = this.state.selectedDeliveryType === 'store' && true
    this.props.setOpeningOrClosingGiftDetailsForEvent(eventId, addressId, storeSelected, this.openingClosingType)
    this.handleHomeModalClose()
  }
  selectedOption = (e) => {
    e.target.value === 'home' && this.props.getEventDeliveryAddressesForGiftOpening(this.props.eventId)
    this.setState({
      errorForOpeningAndClosingGifts: '',
      selectedDeliveryType: e.target.value,
      showStoreConfirmModal: e.target.value === 'store' && true,
      showHomeDeliveryModal: e.target.value === 'home' && true,
    })
  }

  getRespectiveAddress = (addressId) => {
    let printAddress = addressId
    const { eventDeliveryAddress, eventDeliveryAddressFailed, eventDeliveryAddressLoading } = this.props
    if (!eventDeliveryAddressLoading && !eventDeliveryAddressFailed && !commonUtil.isObjectEmpty(eventDeliveryAddress.deliveryAddressInfo)) {
      eventDeliveryAddress.deliveryAddressInfo.addresses.forEach((address) => {
        if (address.addressId === addressId) {
          printAddress = address.firstName + ' ' + address.lastName + ', ' + address.colony + ', ' + address.delegationMunicipality + ', ' + address.city + ', ' + address.postalCode + ', ' + address.state;
        }
      })
    }
    return printAddress
  }
  _alreadyClosingGiftSelectedFalseOrTrue = (openingGiftDetailsForEventInfo) => {
    const alreadySelected = openingGiftDetailsForEventInfo.alreadySelected === 'true'
    const info = openingGiftDetailsForEventInfo
    if (alreadySelected && info.disableStore === 'true' && info.disableHome === 'true' && info.storeName) {
      return (
        <div className="giftDetailOption" style={{ display: 'block' }}>
          <p className="detailOn">{info.storeName}</p>
        </div>
      )
    }
    if (alreadySelected && info.disableHome === 'true' && info.disableStore === 'false') {
      return (
        <RadioButton
          id="radio1"
          uiname="EventDashboardDeliveryOC"
          displayName="Entregada en tienda"
          value="store"
          checked={this.state.selectedDeliveryType === 'store' && true}
          onChangeFunction={this.selectedOption}
        />
      )
    }
    if (alreadySelected && info.disableStore === 'true' && info.disableHome === 'true' && info.pedidoNumber) {
      return (
        <React.Fragment>
          <p className="detailOn"><strong>Entregada a domicilio.</strong><br />
            {this.getRespectiveAddress(info.addressItem.addressId)}
          </p>
          <p className="detailOn"><strong>No. de pedido:</strong> {info.pedidoNumber}</p>
          <Link
            className="linkAction detailOnAction"
            uiname="EventDashboardViewDeliveryOC"
            data-toggle="modal"
            data-target="#trackDeliver"
            onClick={this.handleOpenTrackDeliveryModal}
          >Seguimiento a entrega</Link>
        </React.Fragment>
      )
    }
  }
  _alreadyOpeningGiftSelectedTrue = (openingGiftDetailsForEventInfo) => {
    const info = openingGiftDetailsForEventInfo
    return (
      <React.Fragment>
        <RadioButton
          id="radio1"
          uiname="EventDashboardDeliveryOC"
          displayName="Entregada en tienda"
          value="store"
          disabled={info && info.disableStore === 'true' && true}
          checked={this.state.selectedDeliveryType === 'store' || (info && info.storeName && info.disableStore === 'true' && true)}
          onChangeFunction={this.selectedOption}
        />
        <RadioButton
          id="radio2"
          uiname="EventDashboardDeliveryOC"
          displayName="Entregada a domicilio"
          value="home"
          checked={info.addressItem && info.addressItem.addressId && true}
          disabled={info && info.disableHome === 'true' && true}
          onChangeFunction={this.selectedOption}
        />
        {(info.addressItem && info.addressItem.addressId && !info.pedidoNumber && true) && <div className="giftDetailOption" style={{ display: 'block' }}>
          <a
            className="linkAction detailOnAction openingAndClosingAddressHide"
            href="javascript:void(0)"
            data-toggle="modal"
            onClick={() => this.selectedOption({
              target: {
                value: 'home',
              },
            })}
          >{this.getRespectiveAddress(info.addressItem.addressId)}</a>
        </div>}
        {info.pedidoNumber &&
          <React.Fragment>
            <p className="detailOn">No. de pedido: {info.pedidoNumber}</p>
            <Link
              className="linkAction detailOnAction"
              uiname="EventDashboardViewDeliveryOC"
              data-toggle="modal"
              data-target="#trackDeliver"
              onClick={this.handleOpenTrackDeliveryModal}
            >Seguimiento a entrega</Link>
          </React.Fragment>}
      </React.Fragment>
    )
  }
  renderContent = (openingOrClosingGiftDetailsForEventFailed, openingOrClosingGiftDetailsForEvent, openingClosingType, closingGiftPriceRange) => {
    let currentGiftAmountTotal = ''
    let requiredGiftAmountTotal = ''
    if (openingClosingType === 'closing') {
      currentGiftAmountTotal = closingGiftPriceRange && closingGiftPriceRange.closingGiftPriceRangeInfo && closingGiftPriceRange.closingGiftPriceRangeInfo.currentGiftAmountTotal
      requiredGiftAmountTotal = closingGiftPriceRange && closingGiftPriceRange.closingGiftPriceRangeInfo && closingGiftPriceRange.closingGiftPriceRangeInfo.requiredGiftAmountTotal
    }
    const openingGiftDetailsForEventInfo = openingOrClosingGiftDetailsForEvent.openingGiftDetailsForEventInfo
    const failed = openingOrClosingGiftDetailsForEventFailed
    return (
      !failed && openingOrClosingGiftDetailsForEvent.giftAvailable ?
        <React.Fragment>
          <h3>{openingClosingType === 'opening' ? 'REGALO POR APERTURA' : 'REGALO PARA CIERRE'} <a
            role="button"
            onClick={e => this.collapseToggle()}
            href="javascript:void(0)"
          >
            <i className="iClass icon-flecha_gruesa_abajo" style={{ padding: '0px 10px', color: '#666' }} /></a></h3>
          {this.state.showAccordion &&
            <div className="panel-collapse collapse in" id="collapse2" role="tabpanel" aria-labelledby="headingOne">
              {openingClosingType === 'closing' ? currentGiftAmountTotal < requiredGiftAmountTotal ?
                <React.Fragment>
                  <label htmlFor="radio1" data-option="storeAddress">Acomulado de compras y regalos:</label>
                  <span>
                    <p>{commonUtil.getCurrency(currentGiftAmountTotal)}</p>
                  </span>
                </React.Fragment> :
                <React.Fragment>
                  <label htmlFor="radio1" data-option="storeAddress">Acreedor a regalo por cierre</label>
                  {this.props.eventStatus === appconfig.eventStatusCodes.closed && openingGiftDetailsForEventInfo && this._alreadyClosingGiftSelectedFalseOrTrue(openingGiftDetailsForEventInfo)}
                </React.Fragment> : openingGiftDetailsForEventInfo && this._alreadyOpeningGiftSelectedTrue(openingGiftDetailsForEventInfo)
              }

              <HomeDeliveryAddressOpeningGiftModal
                openingGiftDetailsForEventInfo={openingGiftDetailsForEventInfo}
                getAddressForHtml={this.getAddressForHtml}
                submitOption={this.submitOption}
                showHomeDeliveryModal={this.state.showHomeDeliveryModal}
                handleHomeModalClose={this.handleHomeModalClose}
                eventDeliveryAddress={this.props.eventDeliveryAddress}
                eventDeliveryAddressFailed={this.props.eventDeliveryAddressFailed}
                eventDeliveryAddressLoading={this.props.eventDeliveryAddressLoading}
              />
              <StoreSubmitModal
                labels={this.props.labels}
                errorForOpeningAndClosingGifts={this.state.errorForOpeningAndClosingGifts}
                showStoreModal={this.state.showStoreConfirmModal}
                handleStoreModalClose={this.handleStoreModalClose}
                handleStoreModalShow={this.handleStoreModalShow}
              />
            </div>
          }
        </React.Fragment >

        : (failed || !openingOrClosingGiftDetailsForEvent.giftAvailable) &&
        <React.Fragment>
          <h3>{openingClosingType === 'opening' ? 'REGALO POR APERTURA' : 'REGALO PARA CIERRE'} <a
            role="button"
            onClick={e => this.collapseToggle()}
            href="javascript:void(0)"
          >
            <i className="iClass icon-flecha_gruesa_abajo" style={{ padding: '0px 10px', color: '#666' }} /></a></h3>
          {this.state.showAccordion &&
            <div className="panel-collapse collapse in" id="collapse2" role="tabpanel" aria-labelledby="headingOne">

              <label htmlFor="radio1" data-option="storeAddress">{!commonUtil.isObjectEmpty(openingOrClosingGiftDetailsForEvent) && (openingOrClosingGiftDetailsForEvent.errorMessage || openingOrClosingGiftDetailsForEvent.status.errorMessage)}</label>
            </div>
          }
        </React.Fragment>
    )
  }
  render() {
    const { loading, closingGiftPriceRangeInfoLoading, openingOrClosingGiftDetailsForEventFailed, openingOrClosingGiftDetailsForEvent, eventCategory, closingGiftPriceRange } = this.props
    this.openingClosingType = this.closingCategories.indexOf(this.props.eventType) > -1 ? 'closing' : 'opening'
    return (
      <div className="col-xs-6 marginTop15">
        <div className="boxStyle openingAndClosing" style={{ minHeight: 'auto', height: 'auto' }}>
          {!loading || !closingGiftPriceRangeInfoLoading ?
            this.renderContent(openingOrClosingGiftDetailsForEventFailed, openingOrClosingGiftDetailsForEvent, this.openingClosingType, closingGiftPriceRange) : <p>loading....</p>}
        </div>
      </div>
    )
  }
}

export default GiftForOpening
