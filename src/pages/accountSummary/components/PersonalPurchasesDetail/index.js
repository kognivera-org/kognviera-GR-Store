
import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import Pagination from '../../../../lib/Pagination'
import MultiSelectDropdown from '../../../../lib/MultiSelectDropdown'
import Image from '../../../../lib/ZUILib/Image'
import Link from '../../../../lib/ZUILib/Link'
import { UIBrands } from '../../../../utils/clientConstant'
import commonUtil from '../../../../utils/commonUtil'
import { getLabels } from '../../../global/Labels/actions'
import { getPurchasedItemSummaryInfo, getPurchasedItemsDetails } from '../../actions'
import { sendMail } from '../../requests'
import appconfig from '../../../../config/appconfig'
import PrintDownload from '../../../global/PrintDownload'

@connect(
  store => ({
    purchasedItemSummaryData: store.accountSummary.purchasedItemSummaryInfo,
    purchasedItemsDetailsData: store.accountSummary.purchasedItemsDetails,
    eventDetailsInfo: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : null,
    labels: store.labels.labels,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
  }),
  { getPurchasedItemSummaryInfo, getPurchasedItemsDetails, getLabels },
)

class PersonalPurchasesDetail extends Component {
  constructor(props) {
    super(props)
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : ''
    this.pageType = 'personal'
    this.pageName = 'personalpurchasesdetail'
    this.isViewAll = false
    this.state = {
      currentPage: 1,
      filteringParameters: [],
      sortingParameters: [],
      statementPrintDownload: null,
      emailSendStatus: null,
      pdfLoadingLabel: null,
      disableDownload: false,
    }
    this.loadingTranslations = {
      email: 'Enviando Correo',
      pdf: 'Descargando archivo',
    }
  }
  UNSAFE_componentWillMount() {
    this.props.getPurchasedItemSummaryInfo(this.eventId, this.pageType)
    this.props.getPurchasedItemsDetails(this.eventId, this.pageType, this.state.filteringParameters, this.state.sortingParameters, this.state.currentPage, this.isViewAll)
  }

  downloadToPDF = (param) => {
    const fileName = 'Contract'
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      commonUtil.downloadPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      window.print()
    } else if (param && param === 'mail') {
      this.setState({ pdfLoadingLabel: this.loadingTranslations.email })
      // commonUtil.mailPdf('.downloadPrintPage', 'accountStatement.pdf', this.accountStatementSendMail, 'false');
      commonUtil.mailPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', this.accountStatementSendMail)
    }
  }
  accountStatementSendMail = (fileName, data) => {
    const emailId = this.props.dashboardUser && this.props.dashboardUser.dashboardUserEmail
    sendMail(data, fileName, this.eventId, emailId, (res) => {
      if (res.data) {
        this.setState({ emailSendStatus: { isSent: true }, pdfLoadingLabel: null })
      } else {
        this.setState({ emailSendStatus: { isSent: false }, pdfLoadingLabel: null })
      }
    })
  }
  onFilterSortingChange = (e) => {
    /*eslint-disable*/
    const filteringParameters = this.state.filteringParameters;
    let fpType = '', isRemove = false;
    if (e.target.id === 'showEveryThingDropdown') {
      fpType = 'date';
      if (e.target.value === 'showAll') {
        isRemove = true;
      }
    } else if (e.target.id === 'applyForBonusDropdown') {
      fpType = 'bonusApplicable';
      if (e.target.value === 'allBonus') {
        isRemove = true;
      }
    }
    this.updateFilterParams(fpType, e.target.value, isRemove);
    /*eslint-enable*/
  }

  onBrandChange = (e) => {
    let isRemove = false
    let value = ''
    if (e.length > 0) {
      for (let i = 0; i < e.length; i++) {
        if (!e[i].isAllSelector) {
          value += `${e[i].value},`
        }
      }
      value = value.substr(0, value.length - 1)
      this.brand = value
    } else {
      isRemove = true
    }
    if (e.length && e[0].isAllSelector && e[0].isChecked) {
      isRemove = true
    }
    this.updateFilterParams('store', value, isRemove)
  }

  updateFilterParams(fpType, value, isRemove) {
    const filteringParameters = this.state.filteringParameters
    if (isRemove) {
      for (let i = 0; i < filteringParameters.length; i++) {
        if (filteringParameters[i].type === fpType) {
          filteringParameters.splice(i, 1)
        }
      }
    } else {
      const type = _.find(filteringParameters, { type: fpType })
      if (type) {
        type.value = value
      } else {
        filteringParameters.push({ type: fpType, value })
      }
    }
    this.setState({ filteringParameters })
    this.props.getPurchasedItemsDetails(this.eventId, this.pageType, filteringParameters, this.state.sortingParameters, this.state.currentPage, this.isViewAll)
  }

  onViewAllClick = () => {
    this.isViewAll = true
    this.props.getPurchasedItemsDetails(this.eventId, this.pageType, this.state.filteringParameters, this.state.sortingParameters, this.state.currentPage, this.isViewAll)
  }

  onPageChange = (value) => {
    this.setState({
      currentPage: value,
    })
    this.props.getPurchasedItemsDetails(this.eventId, this.pageType, this.state.filteringParameters, this.state.sortingParameters, value, this.isViewAll)
  }

  onSortChange = (type, value) => {
    /*eslint-disable*/
    const sortingParameters = this.state.sortingParameters;
    const compareVal = value === 'ascending' ? 'descending' : (value === 'increasing' ? 'decreasing' : (value === 'ascending' ? 'descending' : 'ascending'));
    const patchSort = [];
    if (sortingParameters.length && sortingParameters[0].type === type) {
      if (sortingParameters[0].value === value) {
        patchSort.push({ type: type, value: compareVal });
      } else {
        patchSort.push({ type: type, value: value });
      }
    } else {
      patchSort.push({ type: type, value: compareVal });
    }
    this.setState({ sortingParameters: patchSort });
    this.props.getPurchasedItemsDetails(this.eventId, this.pageType, this.state.filteringParameters, patchSort, this.state.currentPage, this.isViewAll)
    /*eslint-enable*/
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }

  render() {
    const { purchasedItemSummaryData, purchasedItemsDetailsData, labels, eventDetailsInfo } = this.props
    const isBonusContainerVisible = commonUtil.isBonusAvailable(eventDetailsInfo)
    const MonthofPurchaseOptions = {
      id: 'showEveryThingDropdown',
      options: [{
        option: commonUtil.getLabel(labels, 'accountStatement.personal.dropdownLabel1'),
        value: 'showAll',
        disabled: false,
        selected: false,
      }, {
        option: 'Último mes',
        value: '1',
        disabled: false,
        selected: false,
      },
      {
        option: 'Últimos 3 meses',
        value: '3',
        disabled: false,
        selected: false,
      },
      {
        option: 'Últimos 6 meses',
        value: '6',
        disabled: false,
        selected: false,
      },
      ],
    }
    const allStores = {
      id: 'allStoresCheckbox',
      disable: false,
      title: commonUtil.getLabel(labels, 'accountStatement.personal.dropdownLabel2'),
      options: [{
        id: 'allStores',
        value: 'allStores',
        label: commonUtil.getLabel(labels, 'accountStatement.personal.dropdownLabel2'),
        disabled: false,
        isChecked: false,
        isAllSelector: true,
      }],
    }
    UIBrands.forEach((val, index) => {
      allStores.options.push({
        id: (`${allStores.id}_chkbox_${index}`),
        value: val.id,
        label: val.label,
        disabled: false,
        isChecked: false,
      })
    })

    const applyForBonusOptions = {
      id: 'applyForBonusDropdown',
      options: [{
        option: commonUtil.getLabel(labels, 'accountStatement.personal.dropdownLabel3'),
        value: 'allBonus',
        disabled: false,
        selected: false,
      }, {
        option: 'Aplica para bonificación',
        value: 'yes',
        disabled: false,
        selected: false,
      },
      {
        option: 'No aplica para bonificación',
        value: 'no',
        disabled: false,
        selected: false,
      },
      ],
    }
    const sortUpIcon = (<span className="iClass icon-flecha_filtros_arriba pointer" />)
    const sortDownIcon = (<span className="iClass icon-flecha_filtros_abajo pointer" />)
    const personalPurchaseGiftRow = function (data, index) {
      return (
        <div key={index} className="row ph-15">
          <div className={isBonusContainerVisible ? 'custom-grid-6-product border-bottom-p' : 'custom-grid-5-product border-bottom-p'}>
            <div className="mensaje centeredh">
              <p>{data.date}</p>
            </div>
            <div className="grid-two-elements-detail">
              <div className="col-xs-12">
                <Image className="img-detail-80" src={data && data.image} altimg={appconfig.defaultImage} />
              </div>
              <div>
                <p className="detailTitle">{data.productName} </p>
                <p className="detailSKU">SKU:{data.skuId}</p>
                <p className="detailSKU">
                  <span className="greytext tooltip-container">
                    {data.message ? data.message : data.bonusStatus}
                    {data.tooltipMessage ? <span className="tooltip-box">{data.tooltipMessage}</span> : null}
                  </span>
                </p>
              </div>
            </div>
            <div className="price">
              <p className={data.bonusEligibility === 'true' ? 'detailPrice' : 'detailPrice greytext'}>{commonUtil.getCurrency(data.amount)}</p>
            </div>
            <div className="quantity">
              <p className="detailQuantity">{data.quantity}</p>
            </div>
            <div className="tienda centeredh">
              <p>{data.brand}</p>
            </div>
            {isBonusContainerVisible ? <React.Fragment>
              {data.bonusEligibility ?
                <React.Fragment>
                  {data.bonusEligibility.toString() === 'true' ?
                    <div className="bono centeredh bonusApplicableStatus"><span className="selected iClass icon-check icono-select green" /></div>
                    : <div className="bono centeredh bonusApplicableStatus"><span className="selected iClass icon-tache2 icono-select grey" /><div className="icon-info">{data.bonusStatus}</div></div>}
                </React.Fragment> : null
              }
            </React.Fragment> : null
            }
          </div>
        </div>
      )
    }

    return (
      <div id="option1" >
        <div className="container purchasedItemDetails">
          {!_.isEmpty(purchasedItemSummaryData) &&
            !_.isEmpty(purchasedItemSummaryData.itemSummary) &&
            !_.isEmpty(eventDetailsInfo)
            ?
              <React.Fragment>
                <div className="row">
                  <div className="col-xs-12">
                    <h2 className="mainTitle">{commonUtil.getLabel(labels, 'accountStatement.personal.label1')}</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="white-box">
                    <div className={isBonusContainerVisible ? 'col-xs-3 right-border text-right ph60' : 'col-xs-9 right-border text-right ph60'}><span className="titleInfoDetail">{commonUtil.getLabel(labels, 'accountStatement.personal.label2')}</span><span className="qtyDetail">{purchasedItemSummaryData.itemSummary.totalPurchasedItemsCount}</span></div>
                    <div className={isBonusContainerVisible ? 'col-xs-3 right-border text-right ph60' : 'col-xs-3 text-right ph60'}> <span className="titleInfoDetail">{commonUtil.getLabel(labels, 'accountStatement.personal.label4')}</span> <span className="qtyDetail">{commonUtil.getCurrency(purchasedItemSummaryData.itemSummary.totalPurchasedAmount)}</span></div>
                    {isBonusContainerVisible ? <React.Fragment>
                    <div className="col-xs-3 right-border text-right ph60"><span className="titleInfoDetail">{commonUtil.getLabel(labels, 'accountStatement.personal.label5')}</span><span className="qtyDetail">{commonUtil.getCurrency(purchasedItemSummaryData.itemSummary.totalAmountEligibleForBonus)}</span>
                      <p className="messageDetail">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label6')} {commonUtil.getCurrency(purchasedItemSummaryData.itemSummary.totalAmountNotEligibleForBonus)}</p>
                    </div>
                    <div className="col-xs-3 text-right ph60">
                      <i className="iClass icon-ayuda tooltip-container" >
                        <span className="tooltip-box">{commonUtil.getLabel(labels, 'accountStatement.personal.tooltipMessage')}</span>
                      </i>&nbsp;&nbsp; <span className="text">{commonUtil.getLabel(labels, 'accountStatement.personal.label7')}</span>
                      <span className="qtyDetail">{commonUtil.getCurrency(purchasedItemSummaryData.itemSummary.totalBonusAmount)}</span>
                    </div>
                  </React.Fragment> : null
                  }
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <p>{commonUtil.getLabel(labels, 'storeAccountStatement.itemsDetailPage.message')}</p>
                  </div>
                </div>
                {this.state.emailSendStatus ?
                  <React.Fragment>
                    {this.state.emailSendStatus.isSent ?
                    <div className="alertSuccess" > <i className="icon-check" />
                      <p>{commonUtil.getLabel(labels, 'accountStatement.emailsent.message')}</p>
                      <a className="icon-tache2 closeAlert" onClick={() => this.setState({ emailSendStatus: null })} />
                    </div> :
                    <div className="alertError"> <i className="icon-tache2" />
                      <p>{commonUtil.getLabel(labels, 'accountStatement.emailfailed.message')}</p>
                      <a className="icon-tache2 closeAlert" onClick={() => this.setState({ emailSendStatus: null })} />
                    </div>}
                  </React.Fragment> : null}
                <div className="row ph-15">
                  <div className="grid-five-elements">
                    <div>
                    <div className="cSelect filters">
                      <SelectionTab
                        id={MonthofPurchaseOptions.id}
                        options={MonthofPurchaseOptions.options}
                        optionText={'option'}
                        optionValue={'value'}
                        disable={MonthofPurchaseOptions.options.length < 0}
                        onChange={this.onFilterSortingChange}
                      />
                      <i className="icon-caret_down" />
                    </div>
                  </div>
                    <div id="selectTienda">
                    <div className="cSelect filters">
                      <MultiSelectDropdown id={allStores.id} data={allStores} onSelectChange={this.onBrandChange} />
                    </div>
                  </div>
                    <div>
                    {isBonusContainerVisible ?
                      <div className="cSelect filters">
                        <SelectionTab
                          id={applyForBonusOptions.id}
                          options={applyForBonusOptions.options}
                          optionText={'option'}
                          optionValue={'value'}
                          disable={applyForBonusOptions.options.length < 0}
                          onChange={this.onFilterSortingChange}
                        /> <i className="icon-caret_down" />
                      </div>
                      : null
                    }
                  </div>
                    <div />
                    <div className="text-right">
                    <div className="right m-30">
                      <div className="account-iconWrap">
                        <Link disabled={this.state.disableDownload} uiname="AccountStatementEmail" className="icon-correo" onClick={e => this.downloadToPDF('mail')} />
                        {/* <Link disabled={this.state.disableDownload} uiname="AccountStatementDownload" className="icon-descarga" onClick={e => this.downloadToPDF('download')} />
                        <Link disabled={this.state.disableDownload} uiname="AccountStatementPrint" className="icon-imprimir" onClick={e => this.downloadToPDF('print')} /> */}
                        <PrintDownload brand={this.brand || ''} footer="ESTADO DE CUENTA" elem=".downloadPrintPage" useDefault uiname="AccountStatementDownload" fileName="accountStatement.pdf" usePageHeader="false" />
                        {this.state.pdfLoadingLabel ?
                          <span>{this.state.pdfLoadingLabel}<Image src={appconfig.loadingImage} />
                          </span> : null}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </React.Fragment>
            : null}
          {!_.isEmpty(purchasedItemsDetailsData) &&
            !_.isEmpty(purchasedItemsDetailsData.itemDetails) &&
            !_.isEmpty(eventDetailsInfo) ?
              <React.Fragment>
                <div className="row ph-15">
                  <div className="col-xs-12 bv nph">
                    <div className={isBonusContainerVisible ? 'custom-grid-6 nmv' : 'custom-grid-5 nmv'}>
                    <div className="centeredh"><span onClick={() => this.onSortChange('date', 'ascending')}>{commonUtil.getLabel(labels, 'accountStatement.personal.columnLabel1')}{this.state.sortingParameters.length && this.state.sortingParameters[0].type === 'date' && this.state.sortingParameters[0].value === 'descending' ? sortDownIcon : sortUpIcon}</span></div>
                    <div className="centeredh"><span>{commonUtil.getLabel(labels, 'accountStatement.personal.columnLabel2')}</span></div>
                    <div className="centeredh"><span onClick={() => this.onSortChange('amount', 'ascending')}>{commonUtil.getLabel(labels, 'accountStatement.personal.columnLabel3')}{this.state.sortingParameters.length && this.state.sortingParameters[0].type === 'amount' && this.state.sortingParameters[0].value === 'descending' ? sortDownIcon : sortUpIcon}</span></div>
                    <div className="centeredh"><span>{commonUtil.getLabel(labels, 'accountStatement.personal.columnLabel4')}</span></div>
                    <div className="centeredh"><span onClick={() => this.onSortChange('store', 'ascending')}>{commonUtil.getLabel(labels, 'accountStatement.personal.columnLabel5')}{this.state.sortingParameters.length && this.state.sortingParameters[0].type === 'store' && this.state.sortingParameters[0].value === 'descending' ? sortDownIcon : sortUpIcon}</span></div>
                    {isBonusContainerVisible ? <div className="centeredh"><span onClick={() => this.onSortChange('bonusApplicable', 'ascending')}>{commonUtil.getLabel(labels, 'accountStatement.personal.columnLabel6')}{this.state.sortingParameters.length && this.state.sortingParameters[0].type === 'bonusApplicable' && this.state.sortingParameters[0].value === 'descending' ? sortDownIcon : sortUpIcon}</span></div> : null}
                  </div>
                  </div>
                </div>
                <div className="container-results">
                  {purchasedItemsDetailsData.itemDetails.map(personalPurchaseGiftRow)}
                </div>
                {purchasedItemsDetailsData && purchasedItemsDetailsData.paginationInfo && +purchasedItemsDetailsData.paginationInfo.totalNoOfRecords > +purchasedItemsDetailsData.paginationInfo.recordsPerPage ?
                  <div className="row">
                    {!this.state.isViewAll ?
                    <div>
                      <div className="col-xs-2">
                        <a href="javascript:void(0);" className="black-link" onClick={this.onViewAllClick}>Ver todo</a>
                      </div>
                      <div className="col-xs-2 col-xs-offset-5">
                        <span>{purchasedItemsDetailsData.paginationInfo.totalNoOfRecords} artículos</span>
                      </div>
                      <div className="col-xs-3 text-right">
                        <Pagination paginationInfo={purchasedItemsDetailsData.paginationInfo} onPageChange={this.onPageChange} />
                      </div>
                    </div> : null}
                  </div>
                : <div className="col-xs-12 text-right">
                  <span>{purchasedItemsDetailsData.paginationInfo.totalNoOfRecords} artículos</span>
                </div>}
              </React.Fragment>
            : <React.Fragment>
              {!_.isEmpty(purchasedItemsDetailsData)
                && (purchasedItemsDetailsData.status) ?
                  <p className="error"> {purchasedItemsDetailsData.status.errorMessage}</p> : null}
            </React.Fragment>}
        </div>

      </div>
    )
  }
}
export default PersonalPurchasesDetail
