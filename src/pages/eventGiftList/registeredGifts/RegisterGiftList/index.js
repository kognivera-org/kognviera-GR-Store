/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import _ from 'lodash';
import Link from '../../../../lib/ZUILib/Link';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab';
import CheckBox from '../../../../lib/ZUILib/CheckBox';
import SelectionTabMore from '../../../../components/SelectionTabMore';
import Favourite from '../../../../components/Favourite';
import commonUtil from '../../../../utils/commonUtil';
import BrandFilter from '../../component/BrandFilter';
import routeconfig from '../../../../config/routeconfig';
import appconfig from '../../../../config/appconfig';
import Button from '../../../../lib/ZUILib/Button';
import TableHeader from './TableHeader';
import Image from '../../../../../src/lib/ZUILib/Image';
import PrintDownload from '../../../../pages/global/PrintDownload';

class RegisteredGiftsList extends Component {
  constructor(props) {
    super(props);
    this.idx = 0;
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  values = []
  selectAll = false
  resetGiftList = false
  state = {
    selectionDropdown: false,
    showchangeShippingAdress: false,
    showchangeGiftMode: false,
    showEliminar: false,
    showAgregarRegalos: false,
    searchText: '',
    closeIcon: false,
    cancelledStatus: this.props.cancelStatus || 'cancel',
    addressId: '',
    search: true,
    deliveryMode: '',
    giftItemIds: [],
    flagAdd: false,
    flagMode: false,
    brandChange: false,
    disableDownload: false,
    SingleAddressEventTypes: [
      appconfig.eventTypes.Baptism,
      appconfig.eventTypes.Bar_Mitzvah,
      appconfig.eventTypes.Bat_Mitzvah,
      appconfig.eventTypes.First_Communion,
      appconfig.eventTypes.Confirmaciòn,
      appconfig.eventTypes.Other_Religious_Ceremonies,
      appconfig.eventTypes.XV_Anòs,
      appconfig.eventTypes.Fiesta_infantil,
    ],
  }

  componentWillReceiveProps(nextProps) {
    const { addressId, deliveryMode, giftItemIds, flagAdd, flagMode } = this.state;
    if (this.props.brand !== nextProps.brand) {
      this.resetGiftList = true;
    } else {
      this.resetGiftList = false;
    }
    if (!_.isEmpty(giftItemIds) && !flagAdd && this.pointSrvcChangeAddress) {
      nextProps.changeDeliveryAdressIndex(addressId, giftItemIds);
      this.setState({ flagAdd: true });
    }
    if (!_.isEmpty(giftItemIds) && !flagMode && this.pointSrvcChangeDMode) {
      nextProps.changeDeliveryMode(deliveryMode, giftItemIds);
      this.setState({ flagMode: true });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  downloadNPrint = (param) => {
    if (param === 'print') {
      window.print();
    } else {
      this.setState({ disableDownload: true });
      commonUtil.downloadPdf('.toDownload',
        'registeredgifts.pdf', 'false', 'Regalos registrados', () => {
          this.setState({ disableDownload: false });
        });
    }
  }

  openAddItemModal = () => {
    this.props.onAddItemSku();
    this.setState({
      showAgregarRegalos: false,
    });
  }

  closeSearch = () => {
    this.inputSearch.value = '';
    this.setState({
      search: true,
    });
    this.props.searchGifts('', 'closeSearch');
  }

  deleteGifts = () => {
    const giftItemIds = this.values;
    this.selectAll = false;
    this.props.deleteGifts(giftItemIds);
    this.setState({
      showchangeShippingAdress: false,
      showchangeGiftMode: false,
      showEliminar: false,
    });
    this.values = [];
    if (this.selectedValue === 'Físicos' || this.selectedValue === 'Electrónicos' ||
      this.selectedValue === 'Disponibles' || this.selectedValue === 'No disponibles') {
      this.getMyselection('default', '');
      this.selectAll = false;
    }
  }

  selectCheckboxes = (e) => {
    if (e.checked) {
      this.values.push(e.id);
    } else {
      this.values = _.remove(this.values, n => n !== e.id);
      this.selectAll = false;
    }
    const isChecked = this.values.length > 0;
    this.setState({
      showchangeShippingAdress: isChecked,
      showchangeGiftMode: isChecked,
      showEliminar: isChecked,
    });
  }

  openAgregarRegalos = () => {
    this.setState({
      showAgregarRegalos: !this.state.showAgregarRegalos,
    });
  }

  brandValue = 'LP'

  handleBrandSelection = (brandTitle) => {
    this.brandValue = brandTitle;
    this.inputSearch.value = '';
    this.values = [];
    this.selectAll = '';
    this.setState({
      showchangeShippingAdress: false,
      showchangeGiftMode: false,
      showEliminar: false,
      brandChange: !this.state.brandChange,
    });
    this.props.onFilterByBrand(brandTitle);
  }

  totalLength = ''

  selectAllCheckbox = (e, categoryInfo) => {
    let isChecked = false;
    if (e.checked) {
      isChecked = true;
      this.getMyselection('Ninguno', categoryInfo);
      const allgiftItems = [];
      categoryInfo.forEach((cat) => {
        cat.itemInfo.forEach((item) => {
          allgiftItems.push(item.giftItemId);
        });
      });
      this.values = allgiftItems;
      this.totalLength = this.values.length;
    } else {
      this.getMyselection('default', categoryInfo);
      this.values = [];
    }
    this.selectAll = e.checked;
    this.setState({
      showchangeShippingAdress: isChecked,
      showchangeGiftMode: isChecked,
      showEliminar: isChecked,
    });
  }

  openCloseSelectionDropdown = () => {
    this.setState({
      selectionDropdown: !this.state.selectionDropdown,
    });
  }

  pointSrvcChangeAddress = false;
  pointSrvcChangeDMode = false;

  changeDeliveryAdress = (e, categoryInfo) => {
    const categoryIds = [];
    let bulkActions = true;
    let ind = '';
    const giftItemIds = this.values;
    const addressId = e.target.value;
    categoryInfo.forEach((cat) => {
      cat.itemInfo.forEach((item) => {
        if (item.deliveryMode === 'electronic') {
          categoryIds.push(item.giftItemId);
        }
      });
    });
    const shudPointSrvcChangeAddress = giftItemIds.some(v => categoryIds.includes(v));
    if (shudPointSrvcChangeAddress) {
      for (let i = 0; i < categoryIds.length; i++) {
        ind = giftItemIds.indexOf(categoryIds[i]);
        if (ind > -1) {
          this.props.addressChangePopUp();
          giftItemIds.splice(ind, 1);
        }
      }
      this.pointSrvcChangeAddress = true;
    } else {
      this.props.changeDeliveryAdressIndex(addressId, giftItemIds);
      this.pointSrvcChangeAddress = false;
    }
    if (this.selectedValue === 'Físicos' || this.selectedValue === 'Electrónicos') {
      this.getMyselection('default', '');
    }
    if (this.values.length === 0 || this.values.length !== this.totalLength) {
      this.selectAll = false;
    }
    if (this.values.length === 0) {
      bulkActions = false;
    }
    this.setState({
      addressId,
      giftItemIds,
      flagAdd: false,
      showchangeShippingAdress: bulkActions,
      showchangeGiftMode: bulkActions,
      showEliminar: bulkActions,
    });
  }

  changeDeliveryMode = (e, categoryInfo) => {
    let bulkActions = true;
    const categoryIds = [];
    let ind = '';
    const giftItemIds = this.values;
    const deliveryMode = e.target.value;
    categoryInfo.forEach((cat) => { // dont pass the giftemIds of Gift Certificate
      if (cat.categoryName === 'Gift Certificate' ||
        cat.categoryName === 'Certificado Electrónico') {
        cat.itemInfo.forEach((item) => {
          categoryIds.push(item.giftItemId);
        });
      }
    });
    const shudPointSrvcChangeDMode = giftItemIds.some(v => categoryIds.includes(v));
    if (shudPointSrvcChangeDMode) {
      for (let i = 0; i < categoryIds.length; i++) {
        ind = giftItemIds.indexOf(categoryIds[i]);
        if (ind > -1) {
          this.props.deliveryModeChangePopup();
          giftItemIds.splice(ind, 1);
        }
      }
      this.pointSrvcChangeDMode = true;
    } else {
      this.props.changeDeliveryMode(deliveryMode, giftItemIds);
      this.pointSrvcChangeDMode = false;
    }
    if (this.selectedValue === 'Físicos' || this.selectedValue === 'Electrónicos') {
      this.getMyselection('default', '');
    }
    if (this.values.length === 0 || this.values.length !== this.totalLength) {
      this.selectAll = false;
    }
    if (this.values.length === 0) {
      bulkActions = false;
    }
    this.setState({
      deliveryMode,
      giftItemIds,
      flagMode: false,
      showchangeShippingAdress: bulkActions,
      showchangeGiftMode: bulkActions,
      showEliminar: bulkActions,
    });
  }

  checkEnter = (e) => {
    if (e.key === 'Enter' || !this.inputSearch.value) {
      this.searchValues();
    } else {
      this.setState({
        search: true,
      });
    }
  }

  searchValues = () => {
    if ((this.state.search && this.inputSearch.value) || !this.state.search) {
      if (!this.state.search) {
        this.inputSearch.value = '';
      }
      this.props.searchGifts(this.inputSearch.value, 'search');
      this.setState({
        searchText: '',
        closeIcon: true,
        search: !this.state.search,
      });
    }
  }

  selectQuantity = (val, updateValue, data) => {
    const giftItemId = data.giftItemId;
    const skuId = data.skuId;
    const quantity = val.value ? val.value : val.target.value;
    this.props.saveQuantity(giftItemId, skuId, quantity, val, updateValue);
  }

  setFavouriteGift = (gi, si, fav) => {
    this.props.setFavouriteGift(gi, si, fav);
  }

  singleDeliveryAddressChange = (e, item) => {
    const addressId = e.target.value;
    const giftItemIds = [];
    giftItemIds.push(item.giftItemId);
    this.props.changeDeliveryAdressIndex(addressId, giftItemIds);
  }

  singleDeliveryModeChange = (e, item) => {
    const deliveryMode = e.target.value;
    const giftItemIds = [];
    giftItemIds.push(item.giftItemId);
    this.props.changeDeliveryMode(deliveryMode, giftItemIds);
  }

  selectedValue = 'default';

  getMyselection = (title, categoryInfo) => {
    const disponsibleIDs = [];
    const nonDisponsibleIDs = [];
    const fiscosIds = [];
    const electronicIds = [];
    const mySelection = title;
    if (mySelection === 'Ninguno') {
      this.selectedValue = 'default';
      const allgiftItems = [];
      categoryInfo.forEach((cat) => {
        cat.itemInfo.forEach((item) => {
          allgiftItems.push(item.giftItemId);
        });
      });
      this.values = [];
      this.selectAll = false;
      this.setState({
        showchangeShippingAdress: false,
        showchangeGiftMode: false,
        showEliminar: false,
      });
    }

    if (mySelection === 'Disponibilidad') {
      this.selectedValue = 'Disponibles';
      this.values = [];
      categoryInfo.forEach((cat) => {
        cat.itemInfo.forEach((item) => {
          if (item.availability === 'true') {
            disponsibleIDs.push(item.giftItemId);
          }
        });
      });
      this.values = disponsibleIDs;
      this.setState({
        showchangeShippingAdress: true,
        showchangeGiftMode: true,
        showEliminar: true,
      });
    }
    if (mySelection === 'No disponible') {
      this.selectedValue = 'No disponibles';
      this.values = [];
      categoryInfo.forEach((cat) => {
        cat.itemInfo.forEach((item) => {
          if (item.availability === 'false') {
            nonDisponsibleIDs.push(item.giftItemId);
          }
        });
      });
      this.values = nonDisponsibleIDs;
      this.setState({
        showchangeShippingAdress: true,
        showchangeGiftMode: true,
        showEliminar: true,
      });
    }
    if (mySelection === 'physical') {
      this.selectedValue = 'Físicos';
      this.values = [];
      categoryInfo.forEach((cat) => {
        cat.itemInfo.forEach((item) => {
          if (item.deliveryMode === 'physical') {
            fiscosIds.push(item.giftItemId);
          }
        });
      });
      this.values = fiscosIds;
      this.setState({
        showchangeShippingAdress: true,
        showchangeGiftMode: true,
        showEliminar: true,
      });
    }
    if (mySelection === 'electronic') {
      this.selectedValue = 'Electrónicos';
      this.values = [];
      categoryInfo.forEach((cat) => {
        cat.itemInfo.forEach((item) => {
          if (item.deliveryMode === 'electronic') {
            electronicIds.push(item.giftItemId);
          }
        });
      });
      this.values = electronicIds;
      this.setState({
        showchangeShippingAdress: true,
        showchangeGiftMode: true,
        showEliminar: true,
      });
    }
    if (mySelection === 'default') {
      if (!this.selectedValue === 'Físicos' || !this.selectedValue === 'Electrónicos') {
        this.values = [];
        this.selectAll = !this.selectAll;
      }
      this.selectedValue = 'Seleccionar Todos';
    }
    if (this.selectedValue !== 'default') {
      this.selectAll = true;
    }
    this.setState({
      selectionDropdown: false,
    });
  }

  pageBreak = () => {
    this.idx = 0;
    return <span className="pageBreak" />;
  }

  preDeterminedLists = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.PredeterminedLists, {
      eventId: this.props.eventId, brand: this.props.brand,
    }));
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        showAgregarRegalos: false,
        selectionDropdown: false,
      });
    }
  }

  allgiftItems = []

  render() {
    const { categoryInfo } = this.props;
    let giftItemsList = [];
    const registeredGiftInfo = this.props.registeredGiftList && this.props.registeredGiftList.data
      && this.props.registeredGiftList.data.registeredGiftList;
    const deliveryAddressInfo = registeredGiftInfo.deliveryAddressInfo;

    const optionChangeGiftMode = {
      id: 'changeGiftMode',
      disable: false,
      defaultValue: 'Cambiar modo de regalos',
      options: [{
        id: '1',
        value: 'physical',
        labelResourceId: 'Físicos',
        disabled: false,
      }, {
        id: '2',
        value: 'electronic',
        labelResourceId: 'Electrónicos',
        disabled: false,
      }],
    };

    const optionGiftMode = {
      id: 'giftMode',
      disable: false,
      options: [{
        id: '1',
        value: 'physical',
        labelResourceId: 'Físicos',
        disabled: false,
      }, {
        id: '2',
        value: 'electronic',
        labelResourceId: 'Electrónicos',
        disabled: false,
      }],
    };

    const optionQuantity = {
      id: 'quantity',
      disable: false,
      optionText: 'labelResourceId',
      optionValue: 'value',
      options: [{
        id: '1',
        value: '1',
        labelResourceId: '1',
        disabled: false,
      }, {
        id: '2',
        value: '2',
        labelResourceId: '2',
        disabled: false,
      }, {
        id: '3',
        value: '3',
        labelResourceId: '3',
        disabled: false,
      }, {
        id: '4',
        value: '4',
        labelResourceId: '4',
        disabled: false,
      }, {
        id: '5',
        value: '5',
        labelResourceId: '5',
        disabled: false,
      }, {
        id: 'more',
        value: 'more',
        labelResourceId: 'more',
        disabled: false,
      }],
    };

    this.idx = 1;
    const createGiftItems = (cat, key) => {
      // eslint-disable-next-line no-plusplus
      this.idx++;
      const isGC = cat.categoryName === 'Gift Certificate' ||
        cat.categoryName === 'Certificado Electrónico';
      return (
        <div className="row" key={key}>
          {this.idx % 16 === 0 && this.pageBreak()}
          <div className="col-xs-12">
            <p className="categoryTitle">
              Categoría:
              <span>{isGC ? 'Certificado Electrónico' : cat.categoryName}</span>
            </p>
            {
              isGC ?
                <p className="messageGiftCard">
                  {commonUtil.getLabel(this.props.labels,
                    'storeEventManagement.giftReceived.certificateEliminationDesclaimer')
                  }
                </p> : null
            }
          </div>
          <div className="col-xs-12">
            <table className="cTable">
              <TableHeader cat={cat} sortByPrice={this.props.sortByPrice} />
              <tbody>
                {cat.itemInfo.map((item, index) => {
                  // eslint-disable-next-line no-plusplus
                  this.idx++;
                  return (
                    <React.Fragment key={`row${index}`}>
                      <tr>
                        <td>
                          <CheckBox
                            uiname="RegistradosBulkAction"
                            name="checkbox"
                            id={item.giftItemId}
                            checked={this.values.indexOf(item.giftItemId) !== -1}
                            getSelectedValue={this.selectCheckboxes}
                          />
                        </td>
                        <td>
                          <Favourite
                            uiname="RegistradosMarkFavorite"
                            key={item.giftItemId + this.brandValue + index}
                            id={item.giftItemId + this.brandValue + index}
                            onchange={this.setFavouriteGift}
                            checked={item.isFavourite}
                            giftItemId={item.giftItemId}
                            skuId={item.skuId}
                          />
                        </td>
                        <td className="imgProduct">
                          {
                            item.imageURL ?
                              <Image alt="Liverpool" src={item.imageURL} /> :
                              <Image src={appconfig.defaultImage} />
                          }
                        </td>
                        <td className="detailsTable">
                          <p>{item.desc}</p>
                          <p>SKU: <span>{item.skuId}</span></p>
                        </td>
                        <td>
                          {
                            item.listPrice ?
                              <p className="oldPriceLabel">
                                {commonUtil.getCurrency(item.listPrice)}
                              </p> : null
                          }
                          {
                            // eslint-disable-next-line no-nested-ternary
                            item.salePrice ?
                              item.salePrice === '-1' ?
                                <p>-</p> :
                                <p className="priceLabel">
                                  {commonUtil.getCurrency(item.salePrice)}
                                </p> : null
                          }
                        </td>
                        <td className="priceAndQuant quantityInnerEG">
                          { isGC ?
                            <p>{item.quantity}</p> :
                            <SelectionTabMore
                              textType="number"
                              uiname="RegistradosChangeQuantity"
                              data={item}
                              htmlId={`quantity_${index}`}
                              optionCaption="Select Quantity"
                              selectMoreOptions={{ ...optionQuantity, defaultValue: item.quantity }}
                              onChange={this.selectQuantity}
                            />}
                        </td>
                        <td>
                          {
                          item.availability === 'true' ?
                            <p className="availableLabel available">
                              {commonUtil.getLabel(this.props.labels,
                                'regalosregistrados.inventory.displonsible.label')}
                            </p> :
                            item.availability === 'false' &&
                              <p className="availableLabel notAvailable tooltip-container">
                                {commonUtil.getLabel(this.props.labels,
                                  'regalosregistrados.inventory.nodisplonsible.label')}
                                <span className="tooltip-box">
                                  {commonUtil.getLabel(this.props.labels,
                                    'regalosregistrados.inventory.nodisplonsible.tooltip')}
                                </span>
                              </p>
                          }
                        </td>
                        <td className="selectAddress">
                          <div>
                            {!isGC ?
                              <div>{item.deliveryMode === 'physical' ? // fisico
                                <div>
                                  {
                                  !this.state.SingleAddressEventTypes.includes(this.props.event &&
                                    this.props.event.eventType) ?
                                      <SelectionTab
                                        id={`deliveryAddressId ${item.giftItemId}`}
                                        options={registeredGiftInfo.deliveryAddressInfo}
                                        uiname="RegistradosChangeDeliveryAddress"
                                        classname="noBorder cSelect"
                                        optionText={'deliveryOwnerName'}
                                        optionValue={'deliveryAddressId'}
                                        value={item.addressId}
                                        optionCaption={item.addressId === '' ?
                                          'Seleccione Dirección' : null}
                                        required="false"
                                        downArrowClass="icon-flecha_gruesa_abajo"
                                        onChange={e => this.singleDeliveryAddressChange(e, item)}
                                      /> :
                                      <React.Fragment>
                                        {
                                          registeredGiftInfo &&
                                          registeredGiftInfo.deliveryAddressInfo &&
                                          registeredGiftInfo.deliveryAddressInfo.map(
                                            (add, indx) =>
                                              <span key={indx}>{ add.deliveryOwnerName }</span>)
                                        }
                                      </React.Fragment>
                                  }
                                </div>
                          : '-'}</div> :
                          '-'
                        }
                            <span>{registeredGiftInfo.disp}</span>
                          </div>
                        </td>
                        <td className="selectAddress width-100">
                          <div>
                            {isGC ?
                              <span>{item.deliveryMode === 'physical' ?
                                'Físicos' : 'Electrónicos'}</span> :
                              <SelectionTab
                                uiname="RegistradosChangeMode"
                                id={optionGiftMode.id}
                                options={optionGiftMode.options}
                                optionCaption="Seleccione el modo de entrega"
                                optionText={'labelResourceId'}
                                optionValue={'value'}
                                value={item.deliveryMode}
                                required="false"
                                downArrowClass="icon-flecha_gruesa_abajo"
                                onChange={e => this.singleDeliveryModeChange(e, item)}
                              />
                            }
                          </div>
                        </td>
                      </tr>
                      {this.idx % 16 === 0 &&
                        ((key === (this.props.categoryInfo.length - 1) &&
                          index !== (cat.itemInfo.length - 1)) ||
                          key !== (this.props.categoryInfo.length - 1)) &&
                          this.pageBreak()}</React.Fragment>);
                },
                )}
              </tbody>
            </table>
          </div>
        </div >
      );
    };

    if (categoryInfo && categoryInfo.length > 0) {
      categoryInfo.map((cat, index) => giftItemsList.push(createGiftItems(cat, index)));
    }

    if (this.props.loading) {
      if (this.resetGiftList) {
        giftItemsList = [];
      }
      giftItemsList.push('Cargando página..');
    } else if (!this.props.loading && this.props.fail) {
      giftItemsList.push('Intente nuevamente más tarde');
    } else if (!this.props.loading && !this.props.fail &&
        registeredGiftInfo.searchKeyword === '' && categoryInfo && categoryInfo.length === 0) {
      giftItemsList.push('Tu busqueda arrojo 0 resultados');
    } else if (!this.props.loading && !this.props.fail && registeredGiftInfo.searchKeyword !== ''
      && categoryInfo && categoryInfo.length === 0) {
      giftItemsList.push(`Tu busqueda ${registeredGiftInfo.searchKeyword} arrojo 0 resultados`);
    }

    const searchClass = this.state.search ? 'icon-zoom' : 'iClass icon-tache2';
    const eventType = this.props.event && this.props.event.eventType;
    return (
      <div className="row" id="printex">
        <div className="info display-hidden">
          <div className="col-xs-8">
            <h3>
              <p>MIS REGALOS</p>
            </h3>
            <p>
              <b>
                los productos visibles dentro de esta sección son exclusivos de tiendas liverpool.
              </b>
            </p>
          </div>
          <div className="col-xs-4 text-right event">
            <p>Fecha del evento: {this.props.event && this.props.event.eventDate}</p>
            <p>Tipo de evento: {this.props.event && this.props.event.eventType}</p>
            <p>Número de evento: {this.props.eventId}</p>
          </div>
          <div className="col-xs-12">
            <p className="resultsTitle">
              Regalos registrados /<strong> {this.props.totalCount}</strong>
            </p>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="non-printable exclude-for-print-download">
            <h2 className="mainTitle">
              REGALOS REGISTRADOS / <span>{this.props.totalCount}</span>
            </h2>
            <p className="subTitle">
              Los productos visibles dentro de esta
               sección muestran la totalidad de los regalos registrados
            </p>
            <p className="listTitle">
              Los regalos registrados también tienen lista de regalo en:
            </p>
            <div className="row">
              <div className="listWrapper">
                <BrandFilter
                  uiname="RegistradosSwitchBrands"
                  onBrandSelection={this.handleBrandSelection}
                />
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                <div className="input-group searchBtn">
                  <input
                    className="form-control"
                    ref={(el) => { this.inputSearch = el; }}
                    type="text" placeholder="Busca por producto o categoría"
                    onChange={this.setSearchKey} onKeyUp={this.checkEnter}
                  />
                  <span className="input-group-btn" >
                    <Button
                      uiname="RegistradosSearchProduct"
                      className="btn btn-default buttonSearch"
                      type="button"
                      onClick={this.searchValues}
                    >
                      <i className={searchClass} />
                    </Button>
                  </span>
                </div>
              </div>
              <div className="col-xs-3">
                <div className={this.state.showAgregarRegalos ? 'btn-group open' : 'btn-group'}>
                  <Button
                    uiname="RegistradosAddGiftPredeterminedList"
                    className="btn btn-default dropdown-toggle btnDropdown"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    onClick={this.openAgregarRegalos}
                  >
                    Agregar regalos
                    <span className="icon-flecha_gruesa_abajo" />
                  </Button>
                  {
                    this.state.showAgregarRegalos &&
                      <ul ref={this.setWrapperRef} className="dropdown-menu">
                        <li>
                          <a onClick={() => this.openAddItemModal()}>
                            Agregar regalo por SKU
                          </a>
                        </li>
                        {this.brandValue === 'LP' &&
                          this.props.event && this.props.event.predeterminedListExists &&
                          <li>
                            <a onClick={e => this.preDeterminedLists(e, eventType)}>
                              Listas predeterminadas
                            </a>
                          </li>
                        }
                      </ul>
                  }
                </div>
              </div>
              {
              registeredGiftInfo &&
                registeredGiftInfo.suggestionLink &&
                registeredGiftInfo.suggestionLink !== '' &&
                <div className="col-xs-3">
                  <p className="downloadList">
                    <Link
                      uiname="RegistradosDownloadSuggestionList"
                      target="_blank"
                      href={registeredGiftInfo.suggestionLink}
                      download
                    >
                      Descargar lista de sugerencias
                    </Link>
                  </p>
                </div>
              }
            </div>
            <div className="row filtersWrapper">
              <div className="col-xs-12">
                <p>Configuración de regalos</p>
              </div>
              <div className="col-xs-2">
                <div
                  className={this.state.selectionDropdown ?
                    'selectAll btn-group open' : 'selectAll btn-group'}
                >
                  <div className="labelListDown" type="button">
                    <CheckBox
                      uiname="RegistradosBulkAction"
                      displayName={this.selectedValue === 'default' ?
                        'Seleccionar todos' : this.selectedValue}
                      id="boxSquareAll"
                      getSelectedValue={e => this.selectAllCheckbox(e, categoryInfo)}
                      checked={this.selectAll}
                    />
                  </div>
                  <Button
                    uiname="RegistradosBulkAction"
                    className="btn btn-default dropdown-toggle"
                    type="button"
                    onClick={this.openCloseSelectionDropdown}
                  >
                    <i className="icon-caret_down" />
                  </Button>
                  {
                  this.state.selectionDropdown ?
                    <ul
                      ref={this.setWrapperRef}
                      onClick={e => this.getMyselection(e.target.title, categoryInfo)}
                      className="dropdown-menu"
                      id="test"
                    >
                      <li><a href="javascript:void(0)" title="Ninguno">Ninguno</a></li>
                      <li><a href="javascript:void(0)" title="physical">Físicos</a></li>
                      <li><a href="javascript:void(0)" title="electronic">Electrónicos</a></li>
                      <li><a href="javascript:void(0)" title="Disponibilidad">Disponibles</a></li>
                      <li><a href="javascript:void(0)" title="No disponible">No Disponibles</a></li>
                    </ul> : null
                  }
                </div>
              </div>
              <div className="col-xs-3">
                {this.state.showchangeShippingAdress && <div className="cSelect filters">
                  <SelectionTab
                    id={'deliveryAddressId'}
                    options={deliveryAddressInfo}
                    optionCaption="Cambiar dirección"
                    optionText={'deliveryOwnerName'}
                    optionValue={'deliveryAddressId'}
                    required="false"
                    onChange={e => this.changeDeliveryAdress(e, categoryInfo)}
                  />
                  <i className="icon-flecha_gruesa_abajo" />
                </div>}
              </div>
              <div className="col-xs-3">
                {this.state.showchangeGiftMode && <div className="cSelect filters">
                  <SelectionTab
                    id={optionChangeGiftMode.id}
                    options={optionChangeGiftMode.options}
                    optionCaption={optionChangeGiftMode.defaultValue}
                    optionText={'labelResourceId'}
                    optionValue={'value'}
                    required="false"
                    // value={this.state.deliveryMode}
                    onChange={e => this.changeDeliveryMode(e, categoryInfo)}
                  />
                  <i className="icon-flecha_gruesa_abajo" />
                </div>}
              </div>
              <div className="col-xs-2">
                {this.state.showEliminar &&
                  <Button
                    uiname="RegistradosDeleteGift"
                    className="btnSecondarySpecial size-Medium"
                    id="deleteBtn"
                    onClick={this.deleteGifts}
                  >
                    Eliminar
                  </Button>
                }
              </div>
              <div className="col-xs-2 alignRight">
                <PrintDownload
                  brand={this.props.brand}
                  footer="Regalos registrados"
                  uiname="RegistradosPrintDownload"
                  elem=".toDownload"
                  useDefault
                  fileName="registeredgifts.pdf"
                  usePageHeader="false"
                />
              </div>
            </div>
          </div>
          <div className="regalosRegistradosList toPrint">
            {giftItemsList}
          </div>
        </div>
      </div >
    );
  }
}

export default RegisteredGiftsList;
