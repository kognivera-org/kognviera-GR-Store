
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import TemporaryClosingModal from './temporaryClosingModal';
import ValeSystemDownModal from './valeSystemDownModal';
import InTransitModal from '../InTransitModal';
import Link from '../../../../lib/ZUILib/Link';
import Image from '../../../../lib/ZUILib/Image';
import commonUtil from '../../../../utils/commonUtil';
import appconfig from '../../../../config/appconfig';
import { getEventAccountStatementDetails } from '../../actions';
import { sendMail, initiateEventCloseProcess, getTransferenceOptions } from '../../requests';
import { getDisplayEventStatusDropdown } from '../../../global/Header/components/EventHeader/actions';
import { getLabels } from '../../../global/Labels/actions';
import Button from '../../../../lib/ZUILib/Button';
import routeconfig from '../../../../config/routeconfig';
import ActivatePhysicalMonederoModal from '../../../eventManagement/EventDashboard/components/Withdrawals/ActivatePhysicalMonederoModal';
import PrintDownload from '../../../global/PrintDownload';


@connect(
  store => ({
    labels: store.labels.labels,
    accountStatement: store.accountSummary.data,
    eventDetailsInfo: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : null,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
    eventStatus: store.header.eventDisplayStatus,
  }),
  { getLabels, getEventAccountStatementDetails, getDisplayEventStatusDropdown },
)

class StatementAccountSummary extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    this.eventOwnerId = '';
    this._startTime = '';
    this._endTime = '';
    this._currentTime = '';
    this.isValeSystemDown = false;
    this.pageName = 'statementaccountsummary';
    this.downloadPrintType = '';
    this.state = {
      statementPrintDownload: null,
      emailSendStatus: null,
      pdfLoadingLabel: null,
      accountStatementError: null,
      disableDownload: false,
    };
    this.loadingTranslations = {
      email: 'Enviando Correo',
      pdf: 'Descargando archivo',
    };
  }

  componentWillMount() {
    this.props.getEventAccountStatementDetails(this.eventId);
  }
  onActivateWallet = () => {
    this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.closuretransference, { eventId: this.eventId }), state: { eventOwnerId: this.eventOwnerId, activateWallet: true } });
  }
  onCerrarMesaClick = () => {
    if (this.isValeSystemDown) {
      this.valeSystemDownModal.handleShow();
    } else {
      getTransferenceOptions({ eventId: this.eventId, eventOwnerId: this.eventOwnerId, type: 'closure', activatePhysicalWallet: 'false' }, (res) => {
        if (res.data) {
          const transferenceData = res.data;
          if ((transferenceData.transferenceOptions && +transferenceData.transferenceOptions.bonusAmount <= 0 && +transferenceData.transferenceOptions.transferableAmount <= 0) || transferenceData.transferenceOptions && +transferenceData.transferenceOptions.transferableAmount <= 0 ) {
            if (transferenceData.isClosingGiftEligible && transferenceData.isClosingGiftEligible.toString() === 'true') {
              this.temporaryClosingModal.handleShow();
            } else {
              this.temporaryClosingModal.handleShow();
            }
          } else if (transferenceData && transferenceData.isEmployee && transferenceData.isEmployee.toString() === 'true') {
            if (!_.isEmpty(transferenceData.employeeCardInfo)) {
              this.temporaryClosingModal.handleShow();
            } else {
              this.activatePhysicalMonederoModal.handleShow();
            }
          } else {
            this.temporaryClosingModal.handleShow();
          }
        } else if (res.error && res.error.status && res.error.status.errorMessage) {
          if (res.error.status.errorMessage.indexOf('no purchased items') > -1) {
            initiateEventCloseProcess({ eventId: this.eventId }, (initiateEventCloseProcessRes) => {
              if (initiateEventCloseProcessRes.data) {
                this.props.getEventAccountStatementDetails(this.eventId);
                this.props.getDisplayEventStatusDropdown({ eventId: this.eventId });
              }
            });
          } else {
            this.setState({ accountStatementError: res.error.status && res.error.status.errorMessage });
          }
        }
      });
    }
  }
  onTemporaryClosingModalAcceptor = () => {
    this.temporaryClosingModal.handleClose();
    // redirect to closure
    if (this.props.eventDetailsInfo) {
      this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.closuretransference, { eventId: this.eventId }), state: { eventOwnerId: this.eventOwnerId } });
    }
  }

  onRetirosAnticipadosClick = () => {
    if (this.isValeSystemDown) {
      this.valeSystemDownModal.handleShow();
    } else {
      // redirect to Retiros Anticipados
      if (this.props.eventDetailsInfo) {
        this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.partialtransference, { eventId: this.eventId }), state: { eventOwnerId: this.eventOwnerId } });
      }
    }
  }

  handleInTransitModal = () => {
    this.inTransitModal.handleShow();
  }

  handleStatementAccountSummaryModal = () => {
    if (this.props.accountStatement.eventAccountStatementInfo.enableEventClosure.toString() === 'true') {
      this.StatementAccountSummaryModal.handleShow();
    }
  }
  openPartialPage = () => {
    if (this.props.accountStatement.eventAccountStatementInfo.enablePartialTransfer.toString() === 'true') {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.physicalgiftsdetail, { eventId: this.eventId }));
    }
  }
  downloadToPDF = (param) => {
    if (!this.props.eventDetailsInfo) {
      this.setState({ emailSendStatus: { isSent: false }, pdfLoadingLabel: null });
    } else {
      const fileName = 'Contract';
      if (param && param === 'download') {
        this.setState({ disableDownload: true });
        commonUtil.downloadPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', () => {
          this.setState({ disableDownload: false });
        });
      } else if (param && param === 'print') {
        window.print();
      } else if (param && param === 'mail') {
        this.setState({ pdfLoadingLabel: this.loadingTranslations.email });
        commonUtil.mailPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', this.accountStatementSendMail);
      }
    }
  }

  accountStatementSendMail = (fileName, data) => {
    const emailId = this.props.dashboardUser && this.props.dashboardUser.dashboardUserEmail;
    sendMail(data, fileName, this.eventId, emailId, (res) => {
      if (res.data) {
        this.setState({ emailSendStatus: { isSent: true }, pdfLoadingLabel: null });
      } else {
        this.setState({ emailSendStatus: { isSent: false }, pdfLoadingLabel: null });
      }
    });
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  render() {
    const { eventDetailsInfo, accountStatement, labels, eventStatus } = this.props;
    let bonusMessage = commonUtil.getLabel(this.props.labels, 'accountStatement.bonusDetail.message1');
    if (!_.isEmpty(accountStatement)) {
      this._startTime = commonUtil.formatDate(accountStatement.eventAccountStatementInfo.transferenceAllowedStartTime, 'hour12');
      this._endTime = commonUtil.formatDate(accountStatement.eventAccountStatementInfo.transferenceAllowedEndTime, 'hour12');
      this.isValeSystemDown = !accountStatement.accountSystemAvailable;
      bonusMessage = bonusMessage.replace('{bonus}', accountStatement.eventAccountStatementInfo.bonusPercentage).replace('{amount}',
        commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.amountInfo.totalBonusAmount));
    }

    const dashboardUserValid = commonUtil.isDashboardUserValid(this.props.dashboardUser);
    const disableClosure = !(dashboardUserValid && accountStatement && accountStatement.eventAccountStatementInfo && accountStatement.eventAccountStatementInfo.enableEventClosure);
    const disableParTransfer = !(dashboardUserValid && accountStatement && accountStatement.eventAccountStatementInfo && accountStatement.eventAccountStatementInfo.enablePartialTransfer);
    const isBonusContainerVisible = commonUtil.isBonusAvailable(eventDetailsInfo);

    this.eventOwnerId = dashboardUserValid && this.props.dashboardUser.dashboardUserId;

    return (
      <div>
        {!_.isEmpty(accountStatement) && !_.isEmpty(eventDetailsInfo) && !_.isEmpty(eventStatus) ?
          <div>
            <div className="container wrapStatement">
              <div className="row show-grid-row lineBot">
                <div className="col-xs-6">
                  <h2 className="mainTitle">ESTADO DE CUENTA</h2>
                </div>
                <div className="col-xs-6 iconAction">
                  <div className="account-iconWrap">
                    <Link disabled={this.state.disableDownload} uiname="AccountStatementEmail" className="icon-correo" onClick={e => this.downloadToPDF('mail')} />
                    {/* <Link disabled={this.state.disableDownload} uiname="AccountStatementDownload" className="icon-descarga" onClick={e => this.downloadToPDF('download')} />
                    <Link disabled={this.state.disableDownload} uiname="AccountStatementPrint" className="icon-imprimir" onClick={e => this.downloadToPDF('print')} /> */}
                    <PrintDownload footer='ESTADO DE CUENTA' elem='.downloadPrintPage' useDefault={true} uiname="AccountStatementDownload" fileName='accountStatement.pdf' usePageHeader='false' />
                    {this.state.pdfLoadingLabel ?
                      <span>{this.state.pdfLoadingLabel}<Image src={appconfig.loadingImage} />
                      </span> : null}
                  </div>
                </div>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-12">
                  <p>{commonUtil.getLabel(labels, 'accountStatement.statement.message')}</p>
                </div>
                <div className="col-xs-8">
                  <div className="row show-grid-row vertical-align">
                    <div className="col-xs-6">
                      {eventStatus.currentStatus === appconfig.eventStatusCodes.closed ?
                        <div className="eventBlock">
                          <p><strong>¡{commonUtil.getLabel(labels, 'eventClosure.success.message')}!</strong><br />
                            {commonUtil.getLabel(labels, 'eventClosure.closed.message')}.</p>
                        </div> :
                        <React.Fragment>
                          {accountStatement.eventAccountStatementInfo.eventMessage === commonUtil.getLabel(labels, 'accountStatement.endDate.message2') ?
                            <div className="borderLabel">
                              <div className="image">
                                {eventDetailsInfo.eventType
                                  ? <Image asset svg src={'/images/gift_' + eventDetailsInfo.eventType.replace(/\//g, '') + '.svg'} alt={eventDetailsInfo.eventType} />
                                  : null}
                              </div>
                              <div className="congratzText">
                                <p className="tabsText">{accountStatement.eventAccountStatementInfo.eventMessage}</p>
                              </div>
                            </div> :
                            <div className="borderLabel">
                              <div className="congratzText">
                                <p className="tabsText">{accountStatement.eventAccountStatementInfo.eventMessage}</p>
                              </div>
                            </div>}
                        </React.Fragment>
                      }
                    </div>
                    <div className="col-xs-6">
                      {eventStatus.currentStatus === appconfig.eventStatusCodes.closed ?
                        null :
                        <div>
                          <Button
                            uiname="AccountStatementCerrarMessa"
                            className={accountStatement.eventAccountStatementInfo.enableEventClosure.toString() === 'true' ? 'btnPrimary size-Full' : 'btnPrimary btnPrimaryDisable size-Full'}
                             disabled={disableClosure} 
                            onClick={this.onCerrarMesaClick}
                          >Cerrar mesa</Button>
                          {accountStatement.eventAccountStatementInfo.amountInfo.inTransitAmount ?
                            <p><small className="descriptiveTextSecond">{commonUtil.getLabel(labels, 'accountStatement.intransit.message1')}</small></p>
                            : null}
                          {accountStatement.eventAccountStatementInfo.employeeClosureMessage ?
                            <p><small className="descriptiveTextSecond">{accountStatement.eventAccountStatementInfo.employeeClosureMessage}</small></p>
                            : null}
                          {accountStatement.eventAccountStatementInfo.eventMessage === commonUtil.getLabel(labels, 'accountStatement.endDate.message2') ?
                            null : <p><small className="descriptiveTextSecond">{commonUtil.getLabel(labels, 'accountStatement.closure.message')}</small></p>
                          }
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                {this.state.emailSendStatus ?
                  <React.Fragment>
                    {this.state.emailSendStatus.isSent ?
                      <div className="alertSuccess" > <i className="icon-check" />
                        <p>{commonUtil.getLabel(labels, 'accountStatement.emailsent.message')}</p>
                        <a className="icon-tache2 closeAlert" onClick={() => this.setState({ emailSendStatus: null })} />
                      </div> :
                      <div className="alertError" > <i className="icon-tache2" />
                        <p>{commonUtil.getLabel(labels, 'accountStatement.emailfailed.message')}</p>
                        <a className="icon-tache2 closeAlert" onClick={() => this.setState({ emailSendStatus: null })} />
                      </div>}
                  </React.Fragment> : null}
                {this.state.accountStatementError ?
                  <div className="alertError" > <i className="icon-tache2" />
                    <p>{this.state.accountStatementError}</p>
                    <a className="icon-tache2 closeAlert" onClick={() => this.setState({ accountStatementError: null })} />
                  </div> : null}
              </div>
              <div className="row show-grid-row vertical-align">
                <div className="rowInfo lineBotHead">
                  <div className="col-xs-5">
                    <p className="mainTextSecond">{commonUtil.getLabel(labels, 'accountStatement.totalPurchase.message')}: </p>
                  </div>
                  <div className="col-xs-5">
                    <div className="row show-grid-row">
                      <div className="col-xs-2">
                        <p><span className="totalGift">{accountStatement.eventAccountStatementInfo.itemsInfo.totalPurchasedItemsCount}</span></p>
                      </div>
                      <div className="col-xs-5" />
                      <div className="col-xs-5" />
                    </div>
                  </div>
                  <div className="col-xs-2">
                    <p className="total">{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.amountInfo.totalPurchasedAmount)}</p>
                  </div>
                </div>
              </div>
              <div className="row show-grid-row vertical-align">
                <div className="rowInfo">
                  <div className="col-xs-5">
                    <p className="descriptiveTextSecond">Regalos físicos:</p>
                    <Link to={'/physicalgiftsdetail/' + this.eventId} uiname="AccountStatementVertDetalle" className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
                  </div>
                  <div className="col-xs-5">
                    <div className="row show-grid-row">
                      <div className="col-xs-2">
                        <span>{accountStatement.eventAccountStatementInfo.itemsInfo.physicalItemInfo.totalPurchasedItems}
                        </span>
                      </div>
                      <div className="col-xs-5" />
                      <div className="col-xs-5" />
                    </div>
                  </div>
                  <div className="col-xs-2">
                    <span className="quantityAndGuest">{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.itemsInfo.physicalItemInfo.totalPurchasedAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="row show-grid-row vertical-align">
                <div className="rowInfo">
                  <div className="col-xs-5">
                    <p className="descriptiveTextSecond">Compras personales:</p>
                    <Link to={'/personalpurchasesdetail/' + this.eventId} uiname="AccountStatementVertDetalle" className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
                  </div>
                  <div className="col-xs-5">
                    <div className="row show-grid-row">
                      <div className="col-xs-2">
                        <span>{accountStatement.eventAccountStatementInfo.itemsInfo.personalItemInfo.totalPurchasedItems}</span>
                      </div>
                      <div className="col-xs-5" />
                      <div className="col-xs-5" />
                    </div>
                  </div>
                  <div className="col-xs-2">
                    <span className="quantityAndGuest">{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.itemsInfo.personalItemInfo.totalPurchasedAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="row show-grid-row vertical-align">
                <div className="rowInfo">
                  <div className="col-xs-5">
                    <p className="descriptiveTextSecond">Regalos electrónicos:</p>
                    <Link to={'/electronicgiftsdetail/' + this.eventId} uiname="AccountStatementVertDetalle" className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
                  </div>
                  <div className="col-xs-5">
                    <div className="row show-grid-row">

                      <div className="col-xs-2">
                        <span>{accountStatement.eventAccountStatementInfo.itemsInfo.electronicItemInfo.totalPurchasedItems}</span>
                      </div>
                      {accountStatement.eventAccountStatementInfo.itemsInfo.electronicItemInfo.amountTransferred ?
                        <div>
                          <div className="col-xs-5">
                            <p className="descriptiveTextSecond">Retiros anticipados:</p>
                            <Link to={'/statementpartialtransference/' + this.eventId} uiname="AccountStatementVertDetalle" className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
                          </div>
                          <div className="col-xs-5">
                            <span>-{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.itemsInfo.electronicItemInfo.amountTransferred)}</span>
                          </div>
                        </div>
                        : null}
                    </div>
                  </div>
                  <div className="col-xs-2">
                    <span className="quantityAndGuest">{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.itemsInfo.electronicItemInfo.totalPurchasedAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="row show-grid-row">
                {isBonusContainerVisible ? <div className="col-xs-6 p-l-0">
                  <div className="innerBlock">
                    <div className="row show-grid-row">
                      <div className="col-xs-12">
                        <p className="titleModule">Aproximado de bono a monedero:</p>
                        <p className="quantityAndGuest">{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.amountInfo.totalBonusAmount)}</p>
                        {this.props.eventDetailsInfo.employee ?
                          <p className="liverpoolCategory m-l-0">{bonusMessage}</p>
                          : <p className="liverpoolCategory m-l-0">{accountStatement.eventAccountStatementInfo.bonusPercentage} % {commonUtil.getLabel(labels, 'accountStatement.bonus.message')} </p>}
                        <Link to={'/bonusdetail/' + this.eventId} uiname="AccountStatementVertDetalle" className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
                      </div>
                    </div>
                  </div>
                </div> : null}
                <div className={isBonusContainerVisible ? 'col-xs-6 p-r-0' : 'col-xs-6 col-xs-offset-6 p-r-0'}>
                  <div className="innerBlock">
                    <div className="row show-grid-row">
                      <div className="col-xs-12">
                        <div className="row">
                          <div className="col-xs-9">
                            <p className="titleModule">Disponible para retiro</p>
                            <p className="quantityAndGuest">{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.amountInfo.transferableAmount)}</p>
                          </div>
                          {accountStatement.eventAccountStatementInfo.amountInfo.inTransitAmount ?
                            <div className="col-xs-3"><a href="javascript:void(0);" className="onTransit" onClick={this.handleInTransitModal}>
                              <p>En tránsito</p>
                              <p>{commonUtil.getCurrency(accountStatement.eventAccountStatementInfo.amountInfo.inTransitAmount)}</p></a></div>
                            : null}
                        </div>
                        <p className="liverpoolCategory m-l-0">{accountStatement.eventAccountStatementInfo.transferenceMessage}</p>
                        <div className="alignCenter">
                          {eventStatus.currentStatus === appconfig.eventStatusCodes.closed ? null :
                            <React.Fragment>
                              <Button
                                uiname="AccountStatementRetiroAnticipado"
                                className={accountStatement.eventAccountStatementInfo.enablePartialTransfer.toString() === 'true' ? 'btnPrimarySpecial size-ExtraLarge' : 'btnPrimarySpecial btnPrimarySpecialDisable size-ExtraLarge'}
                                disabled={disableParTransfer}
                                onClick={this.onRetirosAnticipadosClick}
                              >Retiros anticipados</Button>
                            </React.Fragment>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div >
            <ActivatePhysicalMonederoModal onRef={activatePhysicalMonederoModal => (this.activatePhysicalMonederoModal = activatePhysicalMonederoModal)} onActivateWallet={this.onActivateWallet} router={this.props.router} eventId={this.eventId} />
            <InTransitModal onRef={ref => (this.inTransitModal = ref)} eventId={this.eventId} />
            <ValeSystemDownModal onRef={ref => (this.valeSystemDownModal = ref)} isValeSystemDown={this.isValeSystemDown} startTime={this._startTime} EndTime={this._endTime} />
            <TemporaryClosingModal onRef={ref => (this.temporaryClosingModal = ref)} temporaryModal={this.onTemporaryClosingModalAcceptor} eventId={this.eventId} />
          </div> : null}
      </div>
    );
  }
}
export default StatementAccountSummary;
