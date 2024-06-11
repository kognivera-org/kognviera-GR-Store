
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import DeliveryStatusModal from '../receivedGifts/modal/deliveryStatus'
// import EditMessageModal from './modal/editMessage'
// import EliminateMessageModal from './modal/eliminateMessage'
// import EliminatePurchaseQuestionTicketModal from './modal/eliminatePurchaseQuestionTicker'
import EliminatePurchaseTicketModal from '../receivedGifts/modal/eliminatePurchaseTicket'
import AddTicketModal from '../receivedGifts/modal/newMessage'
// import EventGiftlistFilter from '../component/eventGiftlistFilter'
import EventGiftProductlist from './eventGiftProductlist'
// import AddBallotModal from './AddBallotModal';
// import DeleteBallotModal from './DeleteBallotModal';
// import NewInvitationMessageModal from '../modal/newInvitationMessage'
// import NewMessageModal from './modal/newMessage'
// import ViewMessageModal from './modal/viewMessage'
import EliminatePurchaseQuestionTicketModal from '../receivedGifts/modal/eliminatePurchaseQuestionTicker'
import ViewPurchaseDetailModal from '../receivedGifts/modal/viewPurchaseDetail'
import * as personalPurchase from './action'
import * as receivedGifts from '../receivedGifts/actions'
import TextInput from '../../../lib/ZUILib/TextInput'
import SelectionTab from '../../../lib/ZUILib/SelectionTab'
import BrandFilter from '../component/BrandFilter'
import commonUtil from '../../../utils/commonUtil'
import * as request from '../receivedGifts/requests'
import Button from '../../../lib/ZUILib/Button'
import Link from '../../../lib/ZUILib/Link'
import DownloadPrintHeader from '../../../components/DownloadPrintHeader'
import appconfig from '../../../config/appconfig';
import PrintDownload from '../../../pages/global/PrintDownload'

const pageName = 'personalpurchase'

@connect(
  store => ({
    giftListData: store.personalPurchase.eventData,
    //itemsInfo: store.personalPurchase.itemsInfo,
    event: store.eventdashboard.eventData && store.eventdashboard.eventData.eventDetailsInfo,
    giftListDataLoading: store.personalPurchase.eventDataLoading,
    giftListDataFailed: store.personalPurchase.eventDataFailed,
    eventStatus: store.header.eventDisplayStatus && store.header.eventDisplayStatus.currentStatus,
    // eventStatus: 'Deleted',
    associatePurchaseTicketData: store.regalorecibidos.associatePurchaseTicket,
    associatePurchaseTicketLoading: store.regalorecibidos.associatePurchaseTicketLoading,
    associatePurchaseTicketFailed: store.regalorecibidos.associatePurchaseTicketFailed,
    dissociatePurchaseTicketData: store.regalorecibidos.dissociatePurchaseTicket,
    dissociatePurchaseTicketLoading: store.regalorecibidos.dissociatePurchaseTicketLoading,
    dissociatePurchaseTicketFailed: store.regalorecibidos.dissociatePurchaseTicketFailed,
    dissociatePurchaseTicketByButtonData: store.regalorecibidos.dissociatePurchaseTicketByButton,
    dissociatePurchaseTicketByButtonLoading: store.regalorecibidos.dissociatePurchaseTicketByButtonLoading,
    dissociatePurchaseTicketByButtonFailed: store.regalorecibidos.dissociatePurchaseTicketByButtonFailed,
  }),
  { ...personalPurchase, ...receivedGifts },
)


class PersonalPurchase extends Component {
  constructor(props) {
    super(props)
    this.yAxis = '';
    this.tmpFilter = {}
    this.currentPage = 1
    this.itemsInfo = []
    // this.state = { searchResultflag: false };
    this.state = {
      filteringParameters: [],
      sortingType: '',
      searchKeyword: '',
      openAssociate: '',
      ballotOpen: false,
      categoryList: [],
      search: true,
      toggleQuant: false,
      associateTicketSuccessMsg: '',
      disableDownload: false,
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
    this.eventId = this.props.params.eventId
    this.brand = commonUtil.getBrand();
    this.resetBonusFilter = false
  }
  searchFlag = 'true';
  sortType = '';
  getParams = () => {
    const eventId = this.props.params.eventId
    const channel = 'INSTORE'
    const brand = this.brand
    const params = {
      eventId,
      channel,
      brand,
      // priceOrder: this.state.sortingType,
      priceOrder: this.sortType,
      searchKeyword: this.state.searchKeyword,
      filteringParameters: this.state.filteringParameters,
    }
    if (!params.priceOrder) {
      delete params.priceOrder
    }
    if (!params.searchKeyword) {
      delete params.searchKeyword
    }
    if (Object.keys(params.filteringParameters).length === 0) {
      params.filteringParameters = null;
      delete params.filteringParameters;
    }
    return params;
  }
  infiniteScrollCondition = (props) => {
    // const scrollTop = window.scrollY;
    // const viewportHeight = window.innerHeight;
    // div id whose content will increase on load
    // const productListHeight = document.querySelector('.toPrint').clientHeight;
    const totalRecords = this.props.giftListData && this.props.giftListData.itemsCount ? this.props.giftListData.itemsCount : 0
    return ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
      && this.itemsInfo && this.itemsInfo.length < totalRecords
      && !props.giftListDataLoading)
  }

  onScroll = (e) => {
    e.preventDefault() // try
    if (this.infiniteScrollCondition(this.props)) {
      this.currentPage++
      let params = this.getParams()
      params = {
        ...params,
        // searchKeyword: this.state.searchKeyword,
        // priceOrder: this.sortType,
        currentPage: this.currentPage,
      }
      this.props.getPersonalShoppingGiftList(params)
    }

  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false)
  }

  componentDidMount() {
    const params = this.getParams()
    this.currentPage = 1
    this.props.getPersonalShoppingGiftList(params)
    window.addEventListener('scroll', this.onScroll, false)
  }

  showAllItems = async () => {
    let params = this.getParams()
    params = {
      ...params,
      isShowAll: "true"
    }
    await this.props.getPersonalShoppingGiftList(params)
  }

  handleClearMessage = () => {
    this.setState({
      associateTicketSuccessMsg: ''
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.giftListDataLoading && !nextProps.giftListDataLoading && nextProps.giftListData && nextProps.giftListData.itemsInfo) {
      this.itemsInfo = nextProps.giftListData && nextProps.giftListData.currentPage === '1' ? nextProps.giftListData.itemsInfo : [...this.itemsInfo, ...nextProps.giftListData.itemsInfo]
    }
    if (this.props.associatePurchaseTicketLoading && !nextProps.associatePurchaseTicketLoading) {
      if (nextProps.associatePurchaseTicketData.successMessage != undefined) {
        const params = this.getParams()
        this.currentPage = 1
        this.props.getPersonalShoppingGiftList(params)
        this.setState({
          associateTicketSuccessMsg: nextProps.associatePurchaseTicketData.successMessage,
        })
        this.AddTicketModal.handleClose()
      } else if (nextProps.associatePurchaseTicketData.errorMessage != undefined) {
        this.AddTicketModal.handleError(nextProps.associatePurchaseTicketData.errorMessage)
      }
    }
    if (this.props.dissociatePurchaseTicketLoading && !nextProps.dissociatePurchaseTicketLoading) {
      if (nextProps.dissociatePurchaseTicketData.successMessage != undefined) {
        const params = this.getParams()
        this.currentPage = 1
        this.props.getPersonalShoppingGiftList(params)
        this.setState({
          associateTicketSuccessMsg: nextProps.dissociatePurchaseTicketData.successMessage,
        })
        this.EliminatePurchaseTicketModal.handleClose()
      } else if (nextProps.dissociatePurchaseTicketData.errorMessage != undefined) {
        this.EliminatePurchaseTicketModal.handleError(nextProps.dissociatePurchaseTicketData.errorMessage)
      }
    }
    if (this.props.dissociatePurchaseTicketByButtonLoading && !nextProps.dissociatePurchaseTicketByButtonLoading) {
      if (nextProps.dissociatePurchaseTicketByButtonData.successMessage != undefined) {
        const params = this.getParams()
        this.currentPage = 1
        this.props.getPersonalShoppingGiftList(params)
        this.setState({
          associateTicketSuccessMsg: nextProps.dissociatePurchaseTicketByButtonData.successMessage
        })
        this.ViewPurchaseDetailModal.handleClose();
      } else if (nextProps.dissociatePurchaseTicketByButtonData.errorMessage != undefined) {
        this.ViewPurchaseDetailModal.handleError(nextProps.dissociatePurchaseTicketByButtonData.errorMessage);
      }
    }
    if (nextProps.eventStatus) {
      this.setState({ eventStatus: nextProps.eventStatus })
    }
    if (!this.state.categoryList.length && nextProps.giftListData.categoryList) {
      this.setState({
        categoryList: [...nextProps.giftListData.categoryList],
      })
    }
  }
  sortGiftList = () => {
    console.log('sortGiftList', this.sortType)
    let params = this.getParams()
    this.sortType = (this.sortType === 'Ascending' || this.sortType === '') ? 'Descending' : 'Ascending'
    // this.setState({ sortingType: (this.sortType === 'Ascending') ? 'Descending' : 'Ascending' })
    params = {
      ...params,
      priceOrder: this.sortType,
    }
    this.currentPage = 1
    this.props.getPersonalShoppingGiftList(params)
  }
  handleBrandSelection = (brandTitle) => {
    if (this.brand !== brandTitle) {
      this.tmpFilter = {};
    }
    // this.props.onFilterByBrand(brandTitle);
    // this.sortType = 'Ascending';
    this.sortType = ''
    this.searchGift.value = ''
    this.brand = brandTitle
    const params = this.getParams()
    _.merge(params, { brand: brandTitle })
    this.currentPage = 1;
    this.setState({ categoryList: [] });
    this.props.getPersonalShoppingGiftList(params)
  }
  handleKeyPress = (event) => {
    if (event.key == 'Enter' || !this.searchGift.value) {
      this.onSearchGiftClick()
    } else {
      this.setState({
        search: true
      })
    }
  }
  onSearchGiftClick = () => {
    if ((this.state.search && this.searchGift.value) || !this.state.search) {
      if (!this.state.search) {
        this.searchGift.value = '';
      }
      let params = this.getParams()
      this.setState({ searchKeyword: this.searchGift.value })
      params = {
        ...params,
        searchKeyword: this.searchGift.value,
      }
      this.currentPage = 1
      this.props.getPersonalShoppingGiftList(params)
      this.setState({
        search: !this.state.search
      })
    }
    // if ((this.state.search && this.searchGift.value) || !this.state.search) {
    //   this.setState({
    //     search: !this.state.search
    //   })
    // }
  }
  clearSearch = () => {
    let params = this.getParams()
    // this.searchFlag = 'true'
    this.setState({
      search: true
    })
    this.searchGift.value = ''
    this.setState({ searchKeyword: '' })
    params = {
      ...params,
      searchKeyword: '',
    }
    this.currentPage = 1
    this.props.getPersonalShoppingGiftList(params)
  }
  // sortType = 'Ascending';

  handleFilter = (e) => {
    console.log('onApplyFilter', e.target.name)
    let filterOptions = [];
    this.tmpFilter[e.target.name] = {
      "type": e.target.name,
      "value": e.target.value
    };
    console.log(this.tmpFilter);
    console.log('e.target.value', e.target.value)
    if (e.target.value.toLowerCase() == "value") {
      var prop = e.target.name;
      console.log('prop', prop)
      delete this.tmpFilter[prop];
    }
    Object.keys(this.tmpFilter).map((v, k) => filterOptions.push(this.tmpFilter[v]));
    console.log(this.tmpFilter);
    this.onApplyFilter(filterOptions);
  }
  // handleFilter = (value, type) => {
  //   console.log('value,type', value, type);
  //   if ()
  //     const filterOptions = []
  //   this.tmpFilter[type] = {
  //     type,
  //     value,
  //   }
  //   if (value.toLowerCase() == 'value') {
  //     const prop = type
  //     delete this.tmpFilter[prop]
  //   }
  //   if (type === 'bonusApplicable') {
  //     this.resetBonusFilter = true;
  //   } else {
  //     this.resetBonusFilter = false;
  //   }
  //   Object.keys(this.tmpFilter).map((v, k) => filterOptions.push(this.tmpFilter[v]))
  //   this.onApplyFilter(filterOptions)
  // }
  // handleFilter = (type, value) => {
  //   let fpType = '';
  //   const isRemove = false;

  //   if (type === 'deliveryMode') {
  //     fpType = 'deliveryMode';
  //   } else if (type === 'category') {
  //     fpType = 'category';
  //   } else if (type === 'bonusApplicable') {
  //     fpType = 'bonusApplicable';
  //   }
  //   this.updateFilterParams(fpType, value, isRemove);
  // }
  onApplyFilter = (filteringParameters) => {
    let params = this.getParams()
    console.log('filteringParameters', filteringParameters)
    if (filteringParameters) {
      params = {
        ...params,
        filteringParameters,
        // priceOrder: this.state.sortingType,
        priceOrder: this.sortType,
        searchKeyword: this.state.searchKeyword,
      }
    }
    if (!params.priceOrder) {
      delete params.priceOrder
    }
    if (!params.searchKeyword) {
      delete params.searchKeyword
    }
    if (Object.keys(params.filteringParameters).length === 0) {
      params.filteringParameters = null;
      delete params.filteringParameters;
    }
    this.currentPage = 1
    this.resetBonusFilter = !this.resetBonusFilter;
    this.props.getPersonalShoppingGiftList(params)

    this.setState({
      filteringParameters,
    })
  }

  handleViewPurchaseDetail = (product, boletaNumber) => {
    this.ViewPurchaseDetailModal.handleShow(product, this.props.params.eventId, boletaNumber, this.brand, false)
  }
  categoryOptions = (categoryOptionsInfo) => {

    const lookup = {}
    const items = categoryOptionsInfo
    const result = []
    result.push({
      id: 'value',
      name: 'Categorias (todas)',
      labelResourceId: 'Categorias (todas)',
      disabled: false,
      selected: true,
    })
    if (!items || items.length === 0) {
      return result;
    }
    let i = 0
    for (let item; item = items[i++];) {
      const categoryInfo = item.name
      const categoryInfoId = item.id
      if (!(categoryInfo in lookup)) {
        lookup[categoryInfo] = 1
        result.push({
          id: categoryInfoId,
          name: categoryInfo,
          labelResourceId: categoryInfo,
          disabled: false,
        })
      }
    }
    return result
  }
  // categoryOptions = (categoryOptionsInfo) => {

  //   const lookup = {}
  //   const items = categoryOptionsInfo
  //   const result = []
  //   if (categoryOptionsInfo.length > 0) {
  //     result.push({
  //       id: 'value',
  //       value: 'Categoría',
  //       labelResourceId: 'Categoría',
  //       disabled: false,
  //       selected: true,
  //     })
  //   }

  //   let i = 0
  //   for (let item; item = items[i++];) {
  //     const categoryInfo = item.name
  //     const categoryInfoId = item.id
  //     if (!(categoryInfo in lookup)) {
  //       lookup[categoryInfo] = 1
  //       lookup[categoryInfo] = 1
  //       result.push({
  //         id: categoryInfoId,
  //         value: categoryInfo,
  //         labelResourceId: categoryInfo,
  //         disabled: false,
  //       })
  //     }
  //   }
  //   return result
  // }
  handleBallot = () => {
    this.setState({
      ballotOpen: !this.state.ballotOpen,
    })
  }
  ballotSelected = (event) => {
    console.log('selected bonus--', event.target.title)
  }

  handleTicket = (e) => {
    if (e.target.title === 'add') {
      this.AddTicketModal.handleShow()
    } else {
      this.EliminatePurchaseTicketModal.handleShow()
    }
  }
  handleAddTicket = (params) => {
    const eventId = this.props.params.eventId
    const channel = 'INSTORE'
    const brand = this.brand
    let defaultParams = {
      eventId,
      // channel,
      // brand,
    }
    defaultParams = {
      ...defaultParams,
      ...params,
      personalPurchase: 'true',
    }
    this.props.associatePurchaseTicket(defaultParams)
  }
  handleAddAgainItem = (pParams, callbackMethod) => {
    const eventId = this.props.params.eventId
    const channel = 'INSTORE'
    const brand = this.brand
    let params = {
      eventId,
      brand,
      channel,
      ...pParams
    }
    request.addAgainGiftItem(params, callbackMethod);
  }

  callBackAddAgainGiftItem = (response) => {
    console.log('callBackAddAgainGiftItem', response)
    let params = this.getParams()
    if (response && response.data && response.data.status === 'success') {
      let skuId = this.lastAddedSku;
      let sku = _.find(this.values, { 'id': skuId })
      let quantity = parseInt(sku.quantity) + 1;
      var index = _.pullAllBy(this.values, [sku]);
      this.values.push({ 'id': skuId, 'quantity': quantity })
      this.props.getPersonalShoppingGiftList(params)
      this.setState({
        toggleQuant: !this.state.toggleQuant
      })
    }
  }
  handleRemoveTicketFromViewPurchaseDetail = () => {
    this.ViewPurchaseDetailModal.removePurchaseTicket();
  }
  // scrollDown() {
  //   if (typeof window != 'undefined') {
  //     window.scrollTo(0, this.yAxis)
  //   }
  // }
  handleRemoveTicket = (params) => {
    const eventId = this.props.params.eventId
    const channel = 'INSTORE'
    const brand = this.brand
    let defaultParams = {
      eventId,
      // channel,
      // brand,
    }
    defaultParams = {
      ...defaultParams,
      ...params,
      personalPurchase: 'true',
    }
    this.props.dissociatePurchaseTicket(defaultParams)
  }
  handleTrackOrder = (product) => {
    const allParams = this.getParams()
    const params = {
      eventId: allParams.eventId,
      itemId: product.purchaseItemId,
      pedidoNo: product.pedidoNo ? product.pedidoNo : '0',
      channel: allParams.channel,
      brand: allParams.brand,
    }
    this.DeliveryStatusModal.handleShow(params)
  }
  handleShowDeletePurchaseTicket = () => {
    this.EliminatePurchaseQuestionTicketModal.handleShow()
  }
  handleRemoveTicketForPurchaseDetail = (params) => {
    let defaultParams = {};
    const eventId = this.props.params.eventId
    const channel = 'INSTORE'
    const brand = this.brand
    defaultParams = {
      channel,
      eventId,
      brand,
      ...params
    }
    this.props.disassociatePurchasedTicketByButton(defaultParams)
  }
  downloadToPDF = async (param) => {
    await this.showAllItems()
    setTimeout(() => {
      if (param && param === 'download') {
        this.setState({ disableDownload: true })
        commonUtil.downloadPdf('.toDownload', 'personalPurchase.pdf', 'false', 'COMPRAS PERSONALES', () => {
          this.setState({ disableDownload: false })
        })
      } else if (param && param === 'print') {
        window.print()
      }
    }, 500);
  }
  render() {
    const eventStatus = this.state.eventStatus
    let searchClass = this.state.search ? 'icon-zoom' : 'iClass icon-tache2';
    const CategoryOptions = {
      id: 'categoryOptions',
      disable: false,
      defaultValue: 'Todas las categorías',
      options: this.state.categoryList ? this.categoryOptions(this.state.categoryList) : [],
    }
    const bonusOptions = [{ name: 'Bonificación (todos)', id: 'value' }, { name: 'Aplica para bonificación', id: 1 }, { name: 'No aplica para bonificación', id: 0 }];

    const modeOfDeliveryOptions = [{ name: 'Modo de regalos (todos)', id: 'value' }, { name: 'Físicos', id: 'physical' }, { name: 'Electrónicos', id: 'electronic' }];
    const isBonusContainerVisible = commonUtil.isBonusAvailable(this.props.event);
    return (
      <React.Fragment>
        <DownloadPrintHeader />
        <div className="container wrapPanel">
          <div className="info display-hidden">
            <div className="col-xs-8">
              <h3>
                <p>MIS REGALOS</p>
              </h3>
              <p><b>los productos visibles dentro de esta sección son exclusivos de tiendas liverpool.</b></p>
            </div>
            <div className="col-xs-4 text-right event">
              <p>Fecha del evento: {this.props.event && this.props.event.eventDate}</p>
              <p>Tipo de evento: {this.props.event && this.props.event.eventType}</p>
              <p>Número de evento: {this.props.params.eventId}</p>
            </div>
            <div className="col-xs-12">
              <p className="resultsTitle">COMPRAS PERSONALES /<strong> {this.props.giftListData.itemsCount}</strong></p>
            </div>
          </div>
          <div className="non-printable exclude-for-print-download">
            <div className="row">
              <div className="col-xs-12">
                <h2 className="mainTitle">COMPRAS PERSONALES / <span>{this.props.giftListData.itemsCount}</span></h2>
                <p className="subTitle">Los productos visibles dentro de esta sección son exclusivos de tiendas Liverpool.</p>
                <p className="listTitle">Los festejados tambien tienen mesa de regalos en:</p>
              </div>
            </div>
            <div className="row">
              <div className="listWrapper">
                <BrandFilter
                  uiname="PersonalesSwitchBrands"
                  onBrandSelection={this.handleBrandSelection}
                />
                <hr />
              </div>
            </div>
            {
              this.state.associateTicketSuccessMsg !== '' &&
              <div className="row">
                <div className="success-alert">
                  <div className="green"><i className="icon-check"></i></div>
                  <div className="message">
                    <p>{this.state.associateTicketSuccessMsg}</p>
                  </div>
                  <div className="close-alert">
                    <div className="close-btn"><a className="icon-tache2 btn-white" onClick={this.handleClearMessage}></a></div>
                  </div>
                </div>

              </div>
            }
            <div className="row">
              <div className="col-xs-3">
                <div className="input-group searchBtn">
                  <input className="form-control" type="text" placeholder="Busca por producto o categoría" ref={txt => this.searchGift = txt} onKeyUp={this.handleKeyPress} />
                  <span className="input-group-btn">
                    <Button uiname="PersonalesSearchProduct" className="btn btn-default buttonSearch" type="button" onClick={this.onSearchGiftClick}><i className={searchClass} /></Button>
                    {/* {this.searchFlag === 'true' ?
                    <Button uiname="PersonalesSearchProduct" className="btn btn-default buttonSearch" type="button" onClick={this.onSearchGiftClick} ><i className="icon-zoom" /></Button> : <Button uiname="PersonalesSearchProduct" className="btn btn-default buttonSearch" type="button" onClick={this.clearSearch} ><i className="iClass icon-tache2" aria-hidden="true" /></Button>} */}
                  </span>
                </div>
              </div>
              <div className="col-xs-3">
                <div id="ballotOption" className={this.state.ballotOpen ? 'btn-group open' : 'btn-group'} >
                  <Button uiname="PersonalesAssociateTicketSearch" className="btn btn-default dropdown-toggle btnDropdown listaselect" type="button" onClick={this.handleBallot} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Agregar / eliminar boleta<span className="icon-flecha_gruesa_abajo flecha-abajo" /></Button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link onClick={e => this.handleTicket(e)} data-toggle="modal" title="add">Agregar boleta</Link>
                    </li>
                    <li><Link onClick={e => this.handleTicket(e)} data-toggle="modal" title="delete">Eliminar boleta</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row filtersWrapper">
              <div className="col-xs-3">
                <SelectionTab
                  required="false"
                  disableCaption="false"
                  uiname="PersonalesFilterPurchased"
                  name="deliveryMode"
                  // classame="cSelect filters"
                  id="giftListMode"
                  options={modeOfDeliveryOptions}
                  optionCaption={''}
                  optionText={'name'}
                  optionValue={'id'}
                  onChange={e => this.handleFilter(e)}
                  value={this.tmpFilter && this.tmpFilter.deliveryMode ? this.tmpFilter.deliveryMode.value : 'value'}
                />
              </div>
              {CategoryOptions.options && CategoryOptions.options.length > 0 &&
                <div className="col-xs-3">
                  <SelectionTab
                    required="false"
                    disableCaption='false'
                    uiname="PersonalesFilterPurchased"
                    name="category"
                    // classname="cSelect filters"
                    id="giftListCategoría"
                    options={CategoryOptions.options}
                    optionCaption={''}
                    optionText={'name'}
                    optionValue={'id'}
                    onChange={e => this.handleFilter(e)}
                    value={this.tmpFilter && this.tmpFilter.category ? this.tmpFilter.category.value : 'value'}
                  />
                </div>
              }
              <div className="col-xs-3">
                {isBonusContainerVisible &&
                  <SelectionTab
                    required="false"
                    disableCaption='false'
                    uiname="PersonalesFilterPurchased"
                    name="bonusApplicable"
                    classname="cSelect filters"
                    id="giftListBonificación"
                    options={bonusOptions}
                    optionText={'name'}
                    optionValue={'id'}
                    onChange={e => this.handleFilter(e)}
                    value={this.tmpFilter && this.tmpFilter.bonusApplicable ? this.tmpFilter.bonusApplicable.value : 'value'}
                  />}
              </div>
              <div className="col-xs-3 alignRight">
                <div className="right m-30">
                  {/* <Link className="iClass icon-descarga icono-grande-inline mr-15" disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('download')} />
                  <Link className="iClass icon-imprimir icono-grande-inline" disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('print')} /> */}
                  <PrintDownload brand={this.brand} elem='.toDownload' footer='COMPRAS PERSONALES' fileName='personalPurchase.pdf' usePageHeader='false' callBefore={this.showAllItems} />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="toPrint"> */}
          <div className="row personalpurchaselist">
            <div className="col-xs-12">
              <table className="cTable">
                <thead>
                  <tr>
                    <td></td>
                    <td>Artículo</td>
                    <td>
                      <Link uiname="PersonalesSortPurchased" onClick={this.sortGiftList}>
                        <span>Precio{this.sortType === 'Ascending' || this.sortType === '' ? <i className="iClass icon-flecha_filtros_arriba" aria-hidden="true" /> : <i className="iClass icon-flecha_filtros_abajo" aria-hidden="true" />}</span>
                      </Link>
                    </td>
                    <td>Cantidad</td>
                    <td>Detalle de compra</td>
                    {isBonusContainerVisible && <td>Aplica para bono</td>}
                  </tr>
                </thead>
                <EventGiftProductlist
                  brand={this.brand}
                  data={this.props.giftListData}
                  itemsInfo={this.itemsInfo}
                  loading={this.props.giftListDataLoading}
                  fail={this.props.giftListDataFailed}
                  onViewPurchaseDetail={this.handleViewPurchaseDetail}
                  onTrackOrder={this.handleTrackOrder}
                  eventId={this.eventId}
                  brand={this.brand}
                  resetBonus={this.resetBonusFilter}
                  event={this.props.event}
                  openEventTypes={this.state.openEventTypes}
                />
              </table>
            </div>
            <EliminatePurchaseTicketModal
              brand={this.brand}
              onRef={ref => (this.EliminatePurchaseTicketModal = ref)}
              onRemoveTicket={this.handleRemoveTicket}
              caller='ComprasPersonales'
              event={this.props.event}
            />
            <AddTicketModal
              brand={this.brand}
              onRef={ref => (this.AddTicketModal = ref)}
              onAddTicket={this.handleAddTicket}
              caller='ComprasPersonales'
              event={this.props.event}
            />
            <DeliveryStatusModal
              onRef={ref => (this.DeliveryStatusModal = ref)}
            />
            <ViewPurchaseDetailModal
              onRef={ref => (this.ViewPurchaseDetailModal = ref)}
              onShowDeletePurchaseTicket={this.handleShowDeletePurchaseTicket}
              onRemoveTicket={this.handleRemoveTicketForPurchaseDetail}
              onAddAgainItem={this.handleAddAgainItem}
            />
            <EliminatePurchaseQuestionTicketModal
              onRef={ref => (this.EliminatePurchaseQuestionTicketModal = ref)}
              onRemoveTicket={this.handleRemoveTicketFromViewPurchaseDetail} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default PersonalPurchase
