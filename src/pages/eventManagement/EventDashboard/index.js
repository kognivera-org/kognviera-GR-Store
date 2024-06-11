import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ManagementMenu from '../Navigation/ManagementMenu';
import EventData from './components/EventData';
import FailedTransactions from './components/FailedTransactions';
import AccountStatus from './components/AccountStatus';
import GiftAndShopping from './components/GiftAndShopping';
import GiftForOpening from './components/GiftForOpening';
import Notes from './components/Notes';
import PlasticCard from './components/PlasticCard';
import Withdrawals from './components/Withdrawals';
import SelectViewModal from './components/modals/SelectViewModal';
import * as dashBoardActions from './actions';
import { getEventAccountStatementDetails } from '../../accountSummary/actions';
import CommonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';
import FraudManagement from './components/FraudManagement';
import { getDisplayEventStatusDropdown } from '../../global/Header/components/EventHeader/actions';
import ConfirmModal from '../../global/ConfirmModal';
import { updateFraudEventStatus } from '../EventDashboard/request';
import appconfig from '../../../config/appconfig'
import DeliveryStatusModal from '../../../pages/eventGiftList/receivedGifts/modal/deliveryStatus'


@connect(
  store => ({
    eventdetail: store.eventdashboard.eventData,
    eventDetailLoading: store.eventdashboard.eventDataLoading,
    eventDataFailed: store.eventdashboard.eventDataFailed,
    giftPurchaseData: store.eventdashboard.giftPurchaseData,
    giftPurchaseDataLoading: store.eventdashboard.giftPurchaseDataLoading,
    giftPurchaseFailed: store.eventdashboard.giftPurchaseFailed,
    eventAccountStatementData: store.accountSummary.data,
    eventAccountStatementDataLoading: store.accountSummary.loading,
    eventAccountStatementFailed: store.accountSummary.error,
    accountTransferData: store.eventdashboard.accountTransferData,
    accountTransferDataLoading: store.eventdashboard.accountTransferDataLoading,
    accountTransferFailed: store.eventdashboard.accountTransferFailed,
    // closingGiftPriceRange: store.eventdashboard.closingGiftPriceRangeInfo,
    // closingGiftPriceRangeInfoLoading: store.eventdashboard.closingGiftPriceRangeInfoLoading,
    getNotesLoading: store.eventdashboard.getNotesLoading,
    notes: store.eventdashboard.notes,
    getNotesFailed: store.eventdashboard.getNotesFailed,
    openingOrClosingGiftDetailsForEventLoading: store.eventdashboard.openingOrClosingGiftDetailsForEventLoading,
    openingOrClosingGiftDetailsForEventFailed: store.eventdashboard.openingOrClosingGiftDetailsForEventFailed,
    openingOrClosingGiftDetailsForEvent: store.eventdashboard.openingOrClosingGiftDetailsForEvent,
    eventDeliveryAddress: store.eventdashboard.eventDeliveryAddress,
    eventDeliveryAddressFailed: store.eventdashboard.eventDeliveryAddressFailed,
    eventDeliveryAddressLoading: store.eventdashboard.eventDeliveryAddressLoading,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
    failedTransactionLoading: store.eventdashboard.failedTransactionLoading,
    failedTransaction: store.eventdashboard.failedTransaction,
    failedTransactionFailed: store.eventdashboard.failedTransactionFailed,
    checkEventForFraudData: store.eventdashboard.checkEventForFraud,
    updateEventStatusData: store.eventdashboard.updateEventStatus,
    //eventDisplayStatus: store.header && store.header.eventDisplayStatus,
  }),
  { ...dashBoardActions, getDisplayEventStatusDropdown, getEventAccountStatementDetails },
)
class EventDashboard extends Component {
  state = {
    showSelectViewModal: false,
    actionType: ''
  }

  componentWillMount() {
    const eventId = !this.isEmpty(this.props.params) && this.props.params.eventId;
    let params = this.getParams();
    this.props.checkEventForFraud(params);
  }
  componentDidMount() {
    let user = null
    const eventId = !this.isEmpty(this.props.params) && this.props.params.eventId;
    if (typeof window !== 'undefined') {
      user = window.localStorage.getItem('user')
      if (user && user !== 'null' && user !== 'undefined') {
        user = JSON.parse(user)
      }
      if (window.location.hash === "#nuevo") {
        this.setState({
          successMessage: `El evento fue creado con éxito. La identificación del evento es ${eventId}`
        })
      }
    }
    // const eventId = !this.isEmpty(this.props.params) && this.props.params.eventId;
    const userId = user && user.storeAssociateId
    const brandId = user && user.brandId
    const channelId = 'INSTORE'
    const queryValues = Object.assign({
      channel: channelId,
      profileId: userId,
      brand: brandId,
    }, this.props.location.query)

    this.props.executeGiftAndPurchaseData(eventId);
    this.props.getEventAccountStatementDetails(eventId);
    this.props.executeAccountPartialTransferDetails(eventId);
    // this.props.executeClosingGiftPriceRangeInfo(eventId);
    this.props.getNotes(eventId);
    this.props.getFailedTransferences(eventId);
  }
  closeSuccessMessage = () => {
    this.setState({
      successMessage: ''
    })
  }
  getParams = () => {
    let params = {
      //channel: 'INSTORE',
      //brand: 'LP',
      eventId: this.props.params.eventId
    }
    return params;
  }
  handleFraudEvent = (actionType) => {
    this.ConfirmModal.handleShow();
    this.setState({ actionType: actionType })
  }

  handleRedirect = (page) => {
    this.props.router.push(page)
  }

  handleAccept = () => {
    let params = this.getParams();
    params = {
      ...params,
      actionType: this.state.actionType
    }
    updateFraudEventStatus(params, (response) => {
      if (response
        && response.data
        && response.data.status
        && response.data.status.status
        && response.data.status.status.toLowerCase() === 'success') {
        this.props.checkEventForFraud(params);
        this.props.executeEventDetail(params.eventId, this.props.dashboardUser.id || '12345678');
        this.props.getDisplayEventStatusDropdown(this.getParams());
        this.ConfirmModal.handleClose();
      }
    })

  }

  collapseToggle = (panel) => {
    // const pan = document.querySelector('#' + panel);
    // pan.classList.toggle("in");
    // var panel = pan;
    // if (pan.style.maxHeight) {
    //   pan.style.maxHeight = null;
    // } else {
    //   pan.style.maxHeight = pan.scrollHeight + "px";
    // }
  }

  isEmpty = obj => Object.keys(obj).length === 0

  handleOpenTrackDeliveryModal = (data) => {
    console.log('handleOpenTrackDeliveryModal', data);
    let params = this.getParams();
    // let itemId = [];
    // itemId = data.openingGiftDetailsForEventInfo && data.openingGiftDetailsForEventInfo.skuInfo && data.openingGiftDetailsForEventInfo.skuInfo.map(sku => sku.skuId)
    params = {
      ...params,
      // itemId,
      pedidoNo: data.openingGiftDetailsForEventInfo && data.openingGiftDetailsForEventInfo.pedidoNumber ? data.openingGiftDetailsForEventInfo.pedidoNumber : '0',
    }
    this.DeliveryStatusModal.handleShow(params);
  }

  render() {
    const displayFraudComp = this.props.checkEventForFraudData && this.props.checkEventForFraudData.isEventDetectedAsFraud;
    const eventId = !this.isEmpty(this.props.params) && this.props.params.eventId;
    const eventdetail = this.props.eventdetail;
    const eventType = eventdetail.eventDetailsInfo && eventdetail.eventDetailsInfo.eventType;
    return (
      <React.Fragment>
        <div className="container main-container">
          <div className="row">
            <div className="col-xs-2">
              <ManagementMenu params={this.props.params} router={this.props.router} />
            </div>
            <div className="col-xs-10">
              {this.state.successMessage && <div className="alertSuccess"><i className="icon-check"></i>
                <p>{this.state.successMessage}</p><a className="icon-tache2" onClick={this.closeSuccessMessage}></a>
              </div>}
              <div className="mainContent" id="dynamicFrame">
                <div className="row">
                  <div className="col-xs-8">
                    <div className="row">
                      {displayFraudComp &&
                        <FraudManagement
                          eventId={eventId}
                          handleFraudEvent={this.handleFraudEvent}
                        />
                      }
                      <EventData
                        eventdetail={this.props.eventdetail}
                        loading={this.props.eventDetailLoading}
                        fail={this.props.eventDataFailed}
                      />
                      <GiftAndShopping
                        eventId={eventId}
                        giftPurchaseData={this.props.giftPurchaseData}
                        loading={this.props.giftPurchaseDataLoading}
                        fail={this.props.giftPurchaseFailed}
                        eventId={eventId}
                        dashboardUser={this.props.dashboardUser}
                      />
                    </div>
                    <div className="row">
                      <PlasticCard
                        collapseToggle={this.collapseToggle}
                        eventId={eventId}
                        eventdetail={this.props.eventdetail} />

                      <GiftForOpening
                        collapseToggle={this.collapseToggle}
                        eventType={eventType}
                        handleOpenTrackDeliveryModal={this.handleOpenTrackDeliveryModal}
                        eventdetail={this.props.eventdetail}
                        eventId={eventId}
                        // closingGiftPriceRange={this.props.closingGiftPriceRange}
                        // closingGiftPriceRangeInfoLoading={this.props.closingGiftPriceRangeInfoLoading}
                        eventDeliveryAddress={this.props.eventDeliveryAddress}
                        eventDeliveryAddressFailed={this.props.eventDeliveryAddressFailed}
                        eventDeliveryAddressLoading={this.props.eventDeliveryAddressLoading}
                        setOpeningOrClosingGiftDetailsForEvent={this.props.setOpeningOrClosingGiftDetailsForEvent}
                        getEventDeliveryAddressesForGiftOpening={this.props.getEventDeliveryAddressesForGiftOpening}
                        loading={this.props.openingOrClosingGiftDetailsForEventLoading}
                        openingOrClosingGiftDetailsForEventFailed={this.props.openingOrClosingGiftDetailsForEventFailed}
                        openingOrClosingGiftDetailsForEvent={this.props.openingOrClosingGiftDetailsForEvent}
                      />
                      <DeliveryStatusModal
                        onRef={ref => (this.DeliveryStatusModal = ref)}
                      />
                    </div>
                    <div className="row">
                      <Notes
                        eventId={eventId}
                        createNote={this.props.createNote}
                        getNotesLoading={this.props.getNotesLoading}
                        notes={this.props.notes}
                        getNotesFailed={this.props.getNotesFailed}
                        deleteNote={this.props.deleteNote}
                      />
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="row">
                      <AccountStatus
                        eventId={eventId}
                        eventdetail={this.props.eventdetail}
                        redirect={this.handleRedirect}
                        eventAccountStatementData={this.props.eventAccountStatementData}
                        loading={this.props.eventAccountStatementDataLoading}
                        fail={this.props.eventAccountStatementFailed}
                      />
                    </div>
                    <div className="row">
                      <Withdrawals
                        collapseToggle={this.collapseToggle}
                        eventAccountStatementData={this.props.eventAccountStatementData}
                        data={this.props.accountTransferData}
                        loading={this.props.accountTransferDataLoading}
                        fail={this.props.accountTransferFailed}
                        dashboardUser={this.props.dashboardUser}
                        eventId={this.props.params.eventId}
                        {...this.props}
                      />
                    </div>
                    <div className="row">
                      <FailedTransactions
                        eventId={eventId}
                        failedTransactionLoading={this.props.failedTransactionLoading}
                        failedTransaction={this.props.failedTransaction}
                        failedTransactionFailed={this.props.failedTransactionFailed}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ConfirmModal onRef={ref => (this.ConfirmModal = ref)} handleConfirmOnBack={this.handleAccept}
            displayMessage='¿estás seguro de cambiar el estatus del evento' />
        </div>
      </React.Fragment>

    )
  }
}
export default EventDashboard