
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import VerificationPanel from './VerificationPanel';
import commonUtil from '../../../../utils/commonUtil';
import { saveBankOrCardDetails } from '../../requests';
import { getLabels } from '../../../global/Labels/actions';
import routeconfig from '../../../../config/routeconfig';
import Image from 'lib/ZUILib/Image';
import ClosingGiftPanel from './ClosingGiftPanel';
import appconfig from '../../../../config/appconfig';
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader';
import PrintDownload from '../../../global/PrintDownload';

const pageName = 'closureconfirmation';
@connect(
  store => ({
    labels: store.labels.labels,
    dashboardUserName: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.dashboardUserName,
  }),
  { getLabels })

export default class ClosureConfirmation extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    this.submitData = {};
    this.submitTransferenceData = {};
    this.accountId = '';
    this.state = {
      eWalletCreatedMessage: null,
      savedCardConfirmation: null,
      isGuardarDisabled: false,
      loadingText: null,
    };
    this.eventDetailsInfo = props.location.state.eventDetailsInfo;
  }
  UNSAFE_componentWillMount() {
    this.setState({ eWalletCreatedMessage: this.props.location.state.submitTransferenceDetails.message });
  }
  componentDidMount() {
    if (!this.props.location.state || !this.props.location.state.submitTransferenceDetails) {
      this.goAccountStatementClick();
    }
    // Browser Back Functionality
    window.onpopstate = () => {
      this.props.router.go(-1);
      window.onpopstate = null; // Remove Handler after back is clicked
    };
  }
  saveCard = () => {
    saveBankOrCardDetails({ accountId: this.accountId }, (res) => {
      if (res.data) {
        this.setState({ savedCardConfirmation: res.data.successMessage, isGuardarDisabled: true });
      }
    });
  }
  downloadToPDF = (param) => {
    if (param && param === 'download') {
      this.setState({ loadingText: 'Descargando' })
      commonUtil.downloadPdf('.toPrint', 'Confirmación.pdf', 'false', 'Confirmación', () => {
        this.setState({ loadingText: null })
      })
    } else if (param && param === 'print') {
      window.print();
    }
  }

  goAccountStatementClick = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.statementaccountsummary, { eventId: this.eventId }));
  }
  goAdministratorClick = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.eventId }));
  }

  render() {
    const { labels, dashboardUserName } = this.props;
    if (this.props.location.state && this.props.location.state.submitTransferenceDetails) {
      this.submitData = this.props.location.state.submitTransferenceDetails.transactionStatusObject;
      if (this.submitData.monederoAccountInfo) {
        if (this.submitData.monederoAccountInfo.walletType) {
          this.accountId = this.submitData.monederoAccountInfo.accountId;
          this.submitTransferenceData = {
            walletNumber: this.submitData.monederoAccountInfo.number,
            walletType: this.submitData.monederoAccountInfo.walletType,
            walletOrEmployeeCardAmount: this.submitData.monederoAccountInfo.transferAmount,
            walletCommissionAmount: this.submitData.monederoAccountInfo.commission,
            totalAmount_View: this.submitData.monederoAccountInfo.totalAmount,
            bonusAmount: this.submitData.monederoAccountInfo.bonusAmount,
            bonusPercentage: this.submitData.monederoAccountInfo.bonusPercentage,
            commissionValue: this.submitData.monederoAccountInfo.commissionPercentage,
            walletUserName: this.submitData.monederoAccountInfo.userName,
          };
        }
      }
      if (this.submitData.bankOrCardInfo) {
        if (this.submitData.bankOrCardInfo.paymentType) {
          this.accountId = this.submitData.bankOrCardInfo.accountId;
          this.submitTransferenceData = {
            ...this.submitTransferenceData,
            cardNumber: this.submitData.bankOrCardInfo.number,
            paymentType: this.submitData.bankOrCardInfo.paymentType,
            cardOrBankAmount: this.submitData.bankOrCardInfo.transferAmount,
            commissionAmount: this.submitData.bankOrCardInfo.commission,
            totalAmount_CardBank_View: this.submitData.bankOrCardInfo.totalAmount,
            commissionValue_CardBank: this.submitData.bankOrCardInfo.commissionPercentage,
            cardBankUserName: this.submitData.bankOrCardInfo.userName,
          };
        }
      }
      if (this.submitData.closingGiftDetails) {
        this.submitTransferenceData = {
          ...this.submitTransferenceData,
          closingGiftDetails: this.submitData.closingGiftDetails,
        };
      }
      this.submitTransferenceData.transferDate = this.submitData.currTime;
    }
    return (
      <div className="container toPrint">
        <DownloadPrintHeader />
        {!_.isEmpty(this.submitData) ?
          <div className="main">
            <div className="container-middle">
              <div className="row">
                <div className="col-xs-6">
                  <h2 className="titleSection nmv mt-20">{dashboardUserName}</h2>
                  <h2 className="subtitleSection nmv">{commonUtil.getLabel(labels, 'eventClosure.success.message')}</h2>
                </div>
                <div className="col-xs-6 right"><Image asset src="/images/bag-liverpool.png" alt /></div>
              </div>

              {!_.isEmpty(this.submitData.monederoAccountInfo) || !_.isEmpty(this.submitData.bankOrCardInfo) ?
                <React.Fragment>
                  <hr />
                  <div className="row">
                    <div className="col-xs-12">
                      <p className="mt-20 nmv subtitleSection">{commonUtil.getLabel(labels, 'eventClosure.closureConfirmation.title')}</p>
                      <p className="subtitleModule">Fecha de operación <strong>{commonUtil.formatDate(this.submitData.currTime, 'monthName')}</strong></p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12">
                      {this.state.eWalletCreatedMessage ? <div className="alertSuccess"><i className="icon-check" />
                        <p>{this.state.eWalletCreatedMessage ? this.state.eWalletCreatedMessage : this.state.savedCardConfirmation ? this.state.savedCardConfirmation : null}</p>
                        <a className="icon-tache2" onClick={() => this.setState({ eWalletCreatedMessage: null })} />
                      </div> : null}
                      {!this.submitData && !this.submitData.monederoAccountInfo && !this.submitData.monederoAccountInfo.number ?
                        <div className="alertSuccess"><i className="icon-check" />
                          <p>{commonUtil.getLabel(labels, 'eventTransferences.ewalletsuccess.message1')}{this.submitData.monederoAccountInfo.number} {commonUtil.getLabel(labels, 'eventTransferences.ewalletsuccess.message2')}</p><a className="icon-tache2" />
                        </div> : null}
                      {!this.submitData && !this.submitData.bankOrCardInfo && !this.submitData.bankOrCardInfo.number ?
                        <div className="alertSuccess"><i className="icon-check" />
                          <p>{commonUtil.getLabel(labels, 'eventTransferences.ewalletsuccess.message1')} {this.submitData.bankOrCardInfo.number} {commonUtil.getLabel(labels, 'eventTransferences.ewalletsuccess.message2')} </p><a className="icon-tache2" />
                        </div> : null}
                    </div>
                  </div>
                  <div className="mb-10">
                    <VerificationPanel submitTransferenceData={this.submitTransferenceData} labels={this.props.labels} loadFrom="closureConfirmation" />
                  </div>
                  <div className="row">
                    <div className="col-xs-8">
                      <p>{commonUtil.getLabel(labels, 'eventTransferences.ewalletsuccess.message1')}
                      </p>
                      <hr />
                    </div>
                  </div>
                  <div className="row exclude-for-print-download non-printable">
                    <div className="col-xs-8 right">
                      {/* <Link disabled={this.state.loadingText} onClick={e => this.downloadToPDF('download')} href="javascript:void(0)"><i className="iClass icon-descarga icono-grande-inline mr-15" /></Link>
                      <Link disabled={this.state.loadingText} onClick={e => this.downloadToPDF('print')} href="javascript:void(0)"><i className="iClass icon-imprimir icono-grande-inline" /></Link> */}
                      <PrintDownload footer='Confirmación' elem='.toPrint' fileName='Confirmación.pdf' usePageHeader='false' />
                    </div>
                  </div>
                  <div className="row"
                    dangerouslySetInnerHTML={{
                      __html:
                        commonUtil.getLabel(this.props.labels, 'eventClosure.confirm.successinfo',
                          { 0: (this.submitData && this.submitData.emailAddress) || '' })
                    }} />

                </React.Fragment> : null}

              <div className="row">
                <div className="col-xs-8">
                  <hr />
                </div>
              </div>
              <div>
                {!_.isEmpty(this.submitData.closingGiftDetails) ?
                  <ClosingGiftPanel submitTransferenceData={this.submitTransferenceData} router={this.props.router} eventId={this.eventId} loadFrom="closureConfirmation" labels={this.props.labels} /> :
                  null}
              </div>
              <div className="row">
                <div className="col-xs-8">
                  <hr />
                </div>
              </div>

              {this.state.savedCardConfirmation ?
                <div className="row show-grid-row padding10Bot exclude-for-print-download">
                  <div className="col-xs-10">
                    <div className="alertSuccess"><i className="icon-check" />
                      <p>{commonUtil.getLabel(labels, 'eventClosure.gift.message')}</p>
                      <a className="icon-tache2" onClick={() => this.setState({ savedCardConfirmation: null })} />
                    </div>
                  </div>
                </div> : null}
              {this.submitData && this.submitData && this.submitData.enableSaveButton ?
                <div className="row mb-30 exclude-for-print-download">
                  <div className="col-xs-6">
                    <p>{commonUtil.getLabel(labels, 'eventClosure.closureConfirmation.savemessage')}</p>
                  </div>
                  <div className="col-xs-2">
                    <button className={'btnSecondary btn-custom ' + (this.state.isGuardarDisabled ? 'btnSecondarySpecialDisable' : '')} onClick={this.saveCard} disabled={this.state.isGuardarDisabled ? 'disabled' : ''}>Guardar</button>
                  </div>
                </div> : null}
              <div className="row padding10Top exclude-for-print-download non-printable">
                <div className="col-xs-12 row-detail">
                  <button onClick={this.goAccountStatementClick} className="btnSecondary btn-custom">Ir a estado de cuenta</button>
                  <button onClick={this.goAdministratorClick} className="btnPrimary btn-custom">Ir al administrador</button>
                </div>
              </div>
            </div>
          </div> : null}
      </div>
    );
  }
}
