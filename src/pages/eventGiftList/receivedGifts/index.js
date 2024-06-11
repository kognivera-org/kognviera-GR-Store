
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DeliveryStatusModal from './modal/deliveryStatus'
import EditMessageModal from './modal/editMessage'
import EliminateMessageModal from './modal/eliminateMessage'
import EliminatePurchaseQuestionTicketModal from './modal/eliminatePurchaseQuestionTicker'
import EliminatePurchaseTicketModal from './modal/eliminatePurchaseTicket'
import EventGiftlistFilter from '../component/eventGiftlistFilter'
import EventGiftProductlist from '../component/eventGiftProductlist'
import NewInvitationMessageModal from './modal/newInvitationMessage'
import AddTicketModal from './modal/newMessage'
import ViewMessageModal from './modal/viewMessage'
import ViewPurchaseDetailModal from './modal/viewPurchaseDetail'
import * as regalorecibidos from './actions';
import { updateBonusInfo } from '../personalPurchase/action';
import * as request from './requests';
import MessagesInfo from './MessagesInfo';
import commonUtil from '../../../utils/commonUtil';
import { updateBonusInfoReq } from '../personalPurchase/giftDetail/requests'
import appconfig from '../../../config/appconfig'

@connect(
  store => ({
    //itemsInfo: store.regalorecibidos.itemsInfo,
    eventStatus: store.header.eventDisplayStatus && store.header.eventDisplayStatus.currentStatus,
    event: store.eventdashboard.eventData && store.eventdashboard.eventData.eventDetailsInfo,
    // eventStatus: 'Deleted',
    giftListData: store.regalorecibidos.eventData,
    giftListDataLoading: store.regalorecibidos.eventDataLoading,
    giftListDataFailed: store.regalorecibidos.eventDataFailed,
    associatePurchaseTicketData: store.regalorecibidos.associatePurchaseTicket,
    associatePurchaseTicketLoading: store.regalorecibidos.associatePurchaseTicketLoading,
    associatePurchaseTicketFailed: store.regalorecibidos.associatePurchaseTicketFailed,
    dissociatePurchaseTicketData: store.regalorecibidos.dissociatePurchaseTicket,
    dissociatePurchaseTicketLoading: store.regalorecibidos.dissociatePurchaseTicketLoading,
    dissociatePurchaseTicketFailed: store.regalorecibidos.dissociatePurchaseTicketFailed,
    deleteMessageData: store.regalorecibidos.deleteMessageData,
    deleteMessageDataLoading: store.regalorecibidos.deleteMessageDataLoading,
    deleteMessageDataFailed: store.regalorecibidos.deleteMessageDataFailed,
    dissociatePurchaseTicketByButtonData: store.regalorecibidos.dissociatePurchaseTicketByButton,
    dissociatePurchaseTicketByButtonLoading: store.regalorecibidos.dissociatePurchaseTicketByButtonLoading,
    dissociatePurchaseTicketByButtonFailed: store.regalorecibidos.dissociatePurchaseTicketByButtonFailed,
  }),
  { ...regalorecibidos, updateBonusInfo },
)

class ReceivedGifts extends Component {
  constructor(props) {
    super(props);
    this.currentPage = 1;
    this.itemsInfo = []
    this.brand = commonUtil.getBrand();
    this.addMessageItem = '';
    this.prevParams = {}
  }
  state = {
    associateTicketSuccessMsg: '',
    msgData: {},
    filteringParameters: [],
    priceOrder: '',
    searchKeyword: '',
    categoryList: [],
    messageInfo: undefined,
    openEventTypes: [
      appconfig.eventTypes.Aniversario,
      appconfig.eventTypes.Cumpleaños,
      appconfig.eventTypes.Despedida,
      appconfig.eventTypes.Fiesta_infantil,
      appconfig.eventTypes.Fiesta_Reunión,
      appconfig.eventTypes.Open_House,
      appconfig.eventTypes.Others,
      appconfig.eventTypes.Mascotas,
    ]
  }


  infiniteScrollCondition = props => {
    const totalRecords = this.props.giftListData && this.props.giftListData.itemsCount ? this.props.giftListData.itemsCount : 0
    return ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
      && this.itemsInfo && this.itemsInfo.length < totalRecords
      && !props.giftListDataLoading)
  }

  onScroll = (e) => {
    e.preventDefault(); //try
    if (this.infiniteScrollCondition(this.props)) {
      this.currentPage++;
      let params = this.getParams();
      params = {
        ...params,
        "filteringParameters": this.state.filteringParameters,
        "searchKeyword": this.state.searchkeyword,
        "priceOrder": this.sortType,
        "currentPage": this.currentPage
      }
      this.props.getReceivedGiftList(params)
    }
    return;
  }

  showAllItems = async () => {
    let params = this.getParams();
    params = {
      ...params,
      "filteringParameters": this.state.filteringParameters,
      "searchKeyword": this.state.searchkeyword,
      "priceOrder": this.sortType,
      "isShowAll": "true"
    }
    await this.props.getReceivedGiftList(params)
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  componentDidMount() {
    let params = this.getParams();
    this.currentPage = 1;
    this.props.getReceivedGiftList(params);
    window.addEventListener('scroll', this.onScroll, false);
  }
  getParams = () => {
    let eventId = this.props.params.eventId;
    let channel = 'INSTORE';
    let brand = this.brand;
    let params = {
      'eventId': eventId,
      'brand': brand,
    };

    return params;
  }
  handleFilterByBrand = (brandTitle) => {
    this.brand = brandTitle;
    this.sortType = ''
    let params = this.getParams();
    _.merge(params, { 'brand': brandTitle })
    this.currentPage = 1;
    this.setState({ categoryList: [] });
    this.props.getReceivedGiftList(params);
  }
  handleViewPurchaseDetail = (product, boletaNumber) => {
    this.ViewPurchaseDetailModal.handleShow(product, this.props.params.eventId, boletaNumber, this.brand, true, 'default');
  }
  handleTrackOrder = (product) => {
    let params = this.getParams();
    params = {
      ...params,
      itemId: product.purchaseItemId,
      pedidoNo: product.pedidoNo ? product.pedidoNo : '0',
    }
    this.DeliveryStatusModal.handleShow(params);
  }
  handleSortByprice = (sortType) => {
    let params = this.getParams();
    params = {
      ...params,
      "priceOrder": sortType
    }
    this.currentPage = 1;
    this.prevParams = params
    this.props.getReceivedGiftList(params);
    this.sortType = sortType
    this.setState({
      priceOrder: sortType
    });
  }
  handleSearch = (searchkeyword) => {
    let params = this.getParams();
    if (searchkeyword !== '') {
      params = {
        ...params,
        "searchKeyword": searchkeyword
      }
    }
    this.prevParams = params
    this.currentPage = 1;
    this.props.getReceivedGiftList(params);
    this.setState({
      searchKeyword: searchkeyword
    });
  }
  handleAssociateTicket = (action) => {
    if (action === 'add') {
      this.AddTicketModal.handleShow();
    } else {
      this.EliminatePurchaseTicketModal.handleShow();
    }

  }
  handleAddTicket = (params) => {
    let defaultParams = this.getParams();
    defaultParams = {
      ...defaultParams,
      ...params,
      personalPurchase: 'false',
    }
    this.props.associatePurchaseTicket(defaultParams)
  }
  handleRemoveTicket = (params) => {
    let defaultParams = this.getParams();
    defaultParams = {
      ...defaultParams,
      ...params,
      personalPurchase: 'false',
    }
    this.props.dissociatePurchaseTicket(defaultParams)
  }
  handleRemoveTicketForPurchaseDetail = (params) => {
    let defaultParams = this.getParams();
    defaultParams = {
      ...defaultParams,
      ...params
    }
    this.props.disassociatePurchasedTicketByButton(defaultParams)
  }
  componentWillReceiveProps(nextProps) {

    if (this.props.giftListDataLoading && !nextProps.giftListDataLoading && nextProps.giftListData && nextProps.giftListData.itemsInfo) {
      this.itemsInfo = nextProps.giftListData && nextProps.giftListData.currentPage === '1' ? nextProps.giftListData.itemsInfo : [...this.itemsInfo, ...nextProps.giftListData.itemsInfo]
    }
    if (this.props.associatePurchaseTicketLoading && !nextProps.associatePurchaseTicketLoading) {

      if (nextProps.associatePurchaseTicketData.successMessage != undefined) {
        let params = this.getParams();
        this.currentPage = 1;
        this.props.getReceivedGiftList(params);
        this.setState({
          associateTicketSuccessMsg: nextProps.associatePurchaseTicketData.successMessage
        })
        this.AddTicketModal.handleClose();
      } else if (nextProps.associatePurchaseTicketData.errorMessage != undefined) {
        this.AddTicketModal.handleError(nextProps.associatePurchaseTicketData.errorMessage);
      }
    }
    if (this.props.dissociatePurchaseTicketLoading && !nextProps.dissociatePurchaseTicketLoading) {
      if (nextProps.dissociatePurchaseTicketData.successMessage != undefined) {
        let params = this.getParams();
        this.currentPage = 1;
        this.props.getReceivedGiftList(params);
        this.setState({
          associateTicketSuccessMsg: nextProps.dissociatePurchaseTicketData.successMessage
        })
        this.EliminatePurchaseTicketModal.handleClose();
      } else if (nextProps.dissociatePurchaseTicketData.errorMessage != undefined) {
        this.EliminatePurchaseTicketModal.handleError(nextProps.dissociatePurchaseTicketData.errorMessage);
      }
    }
    if (this.props.dissociatePurchaseTicketByButtonLoading && !nextProps.dissociatePurchaseTicketByButtonLoading) {
      if (nextProps.dissociatePurchaseTicketByButtonData.successMessage != undefined) {
        let params = this.getParams();
        this.currentPage = 1;
        this.props.getReceivedGiftList(params);
        this.setState({
          associateTicketSuccessMsg: nextProps.dissociatePurchaseTicketByButtonData.successMessage
        })
        this.ViewPurchaseDetailModal.handleClose();
      } else if (nextProps.dissociatePurchaseTicketByButtonData.errorMessage != undefined) {
        this.ViewPurchaseDetailModal.handleError(nextProps.dissociatePurchaseTicketByButtonData.errorMessage);
      }
    }
    if (this.state.categoryList.length == 0 && nextProps.giftListData.categoryList) {
      this.setState({
        categoryList: [...nextProps.giftListData.categoryList]
      });
    }
    if (nextProps.eventStatus) {
      this.setState({ eventStatus: nextProps.eventStatus })
    }

  }
  handleOpenMessageModal = (e, product) => {
    let params = this.getParams();
    params = {
      ...params,
      itemId: product.purchaseItemId
    }
    if (e.target.title == "Sin Mensaje") {
      this.NewInvitationMessageModal.handleShow(product.purchaseItemId);
    } else {
      this.ViewMessageModal.handleShow(params, product.purchaseItemId);
    }
  }
  handleClearMessage = () => {
    this.setState({
      associateTicketSuccessMsg: ''
    })
  }
  handleMessageAction = (action, data, itemId) => {
    this.ViewMessageModal.handleClose();
    this.setState({
      msgData: data
    })
    if (action === 'edit') {
      this.EditMessageModal.handleShow(data, itemId);
    } else {
      this.EliminateMessageModal.handleShow(itemId);
    }
  }
  handleShowDeletePurchaseTicket = () => {
    this.EliminatePurchaseQuestionTicketModal.handleShow()
  }
  handleAddMessage = (pParams, itemId) => {
    let params = this.getParams();
    params = {
      ...params,
      ...pParams,
      itemId: itemId,
    }
    this.addMessageItem = itemId;
    request.addMessage(params, this.callBackOnAddMessage, 'new');
  }
  handleDeleteMessage = (itemId) => {
    let params = this.getParams();
    params = {
      ...params,
      itemId: itemId,
    }
    this.addMessageItem = itemId
    request.deleteMessage(params, this.callBackOnAddMessage, 'none');
  }
  handleFilter = (filteringParameters) => {
    let params = this.getParams();
    // this.filteringParameters = filteringParameters
    if (filteringParameters) {
      params = {
        ...params,
        filteringParameters,
        priceOrder: this.state.priceOrder,
        searchKeyword: this.state.searchKeyword
      }
    }
    this.prevParams = params
    this.currentPage = 1;
    this.props.getReceivedGiftList(params);

    this.setState({
      filteringParameters
    });
  }
  handleUpdateBonusInfo = (pParams) => {
    let params = this.getParams();
    params = {
      ...params,
      ...pParams
    }
    this.props.updateBonusInfo(params);
    // request.updateBonusInfoReq(params, this.callbackMethodBonus);
  }
  // callbackMethodBonus = (response) => {
  //   console.log('callbackMethodBonus', reponse)
  //   if (response.data && response.data.status === 'success') {
  //     let params = this.getParams();
  //     this.props.getReceivedGiftList(params);
  //   }
  // }
  handleSavePurchaserName = (pParams, callbackMethod) => {
    let params = this.getParams();
    params = {
      ...params,
      ...pParams
    }
    request.savePurchaserName(params, callbackMethod);
  }
  handleAddAgainItem = (pParams, callbackMethod) => {
    let params = this.getParams();
    params = {
      ...params,
      ...pParams
    }
    request.addAgainGiftItem(params, callbackMethod);
  }
  handleRemoveTicketFromViewPurchaseDetail = () => {
    this.ViewPurchaseDetailModal.removePurchaseTicket();
  }

  downloadMessages = (e) => {
    request.downloadReceivedGiftsMessages(this.getParams(), (res) => {

      const messageInfo = res && res.data && res.data.messagesInfo;
      messageInfo && this.setState({
        messageInfo
      });
      commonUtil.downloadPdf(".receivedGiftsMessages", "ReceivedGiftsMessages.pdf", 'false', 'Mensajes');
      //commonUtil.generatePdf(".receivedGiftsMessages", "receivedGiftsMessages.pdf");

    });
  }
  callBackOnAddMessage = (response, action) => {
    if (response && response.data && response.data.status.status === 'success') {
      this.NewInvitationMessageModal.handleClose();
      this.EditMessageModal.handleClose();
      let messageActionItem = {
        'action': action,
        itemId: this.addMessageItem
      }
      if (action === 'new') {
        this.props.addMessageItem(messageActionItem)
      } else {
        this.props.deleteMessageItem(messageActionItem)
      }
    }
    this.addMessageItem = ''
  }
  savePurchaseName = () => {
    let params = this.getParams();
    params = {
      ...params,
      ...this.prevParams
    }
    this.props.getReceivedGiftList(params);
  }
  render() {
    const eventStatus = this.state.eventStatus;
    return (
      <div className="container">
        <EventGiftlistFilter
          mainTitle="REGALOS RECIBIDOS"
          subTitle="Los productos visibles dentro de esta sección muestra los regalos recibidos"
          listTitle="Los festejados tambien tienen mesa de regalos en:"
          totalItems={this.props.giftListData.totalRecords}
          onSearch={this.handleSearch}
          openAssociateTicket={this.handleAssociateTicket}
          successMessage={this.state.associateTicketSuccessMsg}
          onClearMessage={this.handleClearMessage}
          categoryList={this.state.categoryList}
          onApplyFilter={this.handleFilter}
          onFilterByBrand={this.handleFilterByBrand}
          downloadMessages={this.downloadMessages}
          event={this.props.event}
          eventId={this.props.params.eventId}
          openEventTypes={this.state.openEventTypes}
          brand={this.brand}
          showAllItems={this.showAllItems}
        />
        <EventGiftProductlist
          data={this.props.giftListData}
          itemsInfo={this.itemsInfo}
          totalItems={this.props.giftListData.totalRecords}
          loading={this.props.giftListDataLoading}
          fail={this.props.giftListDataFailed}
          onViewPurchaseDetail={this.handleViewPurchaseDetail}
          onTrackOrder={this.handleTrackOrder}
          onSortByPrice={this.handleSortByprice}
          openMessageModal={this.handleOpenMessageModal}
          onUpdateBonusInfo={this.handleUpdateBonusInfo}
          eventId={this.props.params.eventId}
          brand={this.brand}
          event={this.props.event}
          openEventTypes={this.state.openEventTypes}
          sortType={this.sortType}
        />
        <EliminateMessageModal
          onRef={ref => (this.EliminateMessageModal = ref)}
          onDeleteMessage={this.handleDeleteMessage}
        />
        <NewInvitationMessageModal
          onRef={ref => (this.NewInvitationMessageModal = ref)}
          onAddMessage={this.handleAddMessage}
        />
        <EditMessageModal
          onRef={ref => (this.EditMessageModal = ref)}
          onAddMessage={this.handleAddMessage}
        />
        <ViewMessageModal
          onRef={ref => (this.ViewMessageModal = ref)}
          onMessageAction={this.handleMessageAction}
        />
        <EliminatePurchaseTicketModal
          onRef={ref => (this.EliminatePurchaseTicketModal = ref)}
          onRemoveTicket={this.handleRemoveTicket}
          brand={this.brand}
          caller='RegaloRecibidos'
          event={this.props.event}
        />

        <AddTicketModal
          onRef={ref => (this.AddTicketModal = ref)}
          onAddTicket={this.handleAddTicket}
          brand={this.brand}
          caller='RegaloRecibidos'
          event={this.props.event}
        />
        <DeliveryStatusModal
          onRef={ref => (this.DeliveryStatusModal = ref)}
        />

        <ViewPurchaseDetailModal
          onRef={ref => (this.ViewPurchaseDetailModal = ref)}
          onSavePurchaserName={this.handleSavePurchaserName}
          onShowDeletePurchaseTicket={this.handleShowDeletePurchaseTicket}
          onRemoveTicket={this.handleRemoveTicketForPurchaseDetail}
          onAddAgainItem={this.handleAddAgainItem}
          savePurchaseName={this.savePurchaseName}
        />

        <EliminatePurchaseQuestionTicketModal
          onRef={ref => (this.EliminatePurchaseQuestionTicketModal = ref)}
          onRemoveTicket={this.handleRemoveTicketFromViewPurchaseDetail} />
        <div className="non-printable exclude-for-print-download">
          <MessagesInfo message={this.state.messageInfo} />
        </div >
      </div >
    );
  }
}
export default ReceivedGifts;
