
import React, { Component } from 'react';
// import { getLabels } from '../../global/Labels/actions'
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';
import { getLabels } from '../../../global/Labels/actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router';
import VerificationPanel from './VerificationPanel';
import PrintDownload from '../../../global/PrintDownload';

const pageName = 'ReturnRefundConfirmation';
@connect(
  store => ({
    eventDetailsInfo: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : null,
    submitTransferenceDetails: store.accountSummary.submitTransference,
    labels: store.labels.labels
  }),
  { getLabels })

class ReturnRefundConfirmation extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    this.submitData = {};
    this.submitTransferenceData = null;
  }
  downloadOrPrintPDF = async (param) => {
    if (param && param === 'download') {
      commonUtil.downloadPrint('download', `${pageName}`, '.toPrintVerification')
    } else if (param && param === 'print') {
      // commonUtil.downloadPrint('print', `${pageName}`, '.toPrintVerification')
      window.print()
    }
  }

  // downloadToPDF = (param) => {
  //     const fileName = 'Contract';
  //     if (param && param === 'download') {
  //         this.setState({ loadingText: 'Descargando' })
  //         commonUtil.downloadPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', () => {
  //             this.setState({ loadingText: null })
  //         })
  //     } else if (param && param === 'print') {
  //         window.print();
  //     } else if (param && param === 'mail') {
  //         this.setState({ pdfLoadingLabel: this.loadingTranslations.email });
  //         commonUtil.mailPdf('.downloadPrintPage', 'accountStatement.pdf', this.accountStatementSendMail, 'false');
  //     }
  // }

  goAccountStatementClick = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.statementaccountsummary, { eventId: this.eventId }));
  }
  goAdministratorClick = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.eventId }));
  }
  render() {
    const { eventDetailsInfo } = this.props;
    // let emailId = '';
    // // let = '';
    // if (!_.isEmpty(eventDetailsInfo)) {
    //   const userObj = _.find(this.props.eventDetailsInfo.celebrityInfo, { iscoOwner: 'false' });
    //   if (userObj) {
    //     emailId = userObj.email;
    //     fullName = userObj.firstName + ' ' + userObj.lastName;
    //   }
    // }

    this.submitData = this.props.submitTransferenceDetails.transactionStatusObject;

    if (this.submitData.monederoAccountInfo) {
      if (this.submitData.monederoAccountInfo.walletType) {
        this.accountId = this.submitData.monederoAccountInfo.accountId;
        this.submitTransferenceData = {
          walletNumber: this.submitData.monederoAccountInfo.number,
          walletType: this.submitData.monederoAccountInfo.walletType,
          walletOrEmployeeCardAmount: this.submitData.monederoAccountInfo.transferAmount,
          //commissionFee: this.submitData.monederoAccountInfo.commissionFee,
          walletCommissionAmount: this.submitData.monederoAccountInfo.commission,
          totalAmount: this.submitData.monederoAccountInfo.totalAmount,
          bonusAmount: this.submitData.monederoAccountInfo.bonusAmount,
          commissionValue: this.submitData.monederoAccountInfo.commissionPercentage,
          userName: this.submitData.monederoAccountInfo.userName,
        };
      }
    }
    if (this.submitData.bankOrCardInfo) {
      if (this.submitData.bankOrCardInfo.paymentType) {
        this.accountId = this.submitData.bankOrCardInfo.accountId;
        this.submitTransferenceData = {
          cardNumber: this.submitData.bankOrCardInfo.number,
          paymentType: this.submitData.bankOrCardInfo.paymentType,
          cardOrBankAmount: this.submitData.bankOrCardInfo.transferAmount,
          commissionAmount: this.submitData.bankOrCardInfo.commission,
          totalAmount: this.submitData.bankOrCardInfo.totalAmount,
          bonusAmount: this.submitData.bankOrCardInfo.bonusAmount,
          commissionValue: this.submitData.bankOrCardInfo.commissionPercentage,
          userName: this.submitData.bankOrCardInfo.userName,
        };
      }
    }
    this.submitTransferenceData.transferDate = this.submitData.currTime;

    return (
      <div className="exclude-for-print-download">
        <div className="successfulDevolutionContent ">
          <div className="col-xs-12">
            <div className="wrapTransference toPrintVerification">
              <div className="row">
                <div className="col-xs-6">
                  {/* <h2 className="titleSection nmv mt-20">{fullName}</h2> */}
                  <h2 className="subtitleSection nmv">{commonUtil.getLabel(this.props.labels, 'refundpage.success.message')}</h2>
                  {/* <h2 className="subtitleSection nmv">¡{returnMadeSuccessful && returnMadeSuccessful['monederosuccess.message']}</h2> */}
                </div>
              </div>
              {/* <div className="row">
                                <div className="col-xs-8">
                                    <div className="alertSuccess mtb-20"><i className="icon-check"></i>
                                        <p>Se ha generado el monedero con terminación 1234 a nombre de María Eugenia Hernández (key)</p><a className="icon-tache2"></a>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <p>Puedes consultar tu monedero en la sección <strong>Mis monederos</strong> de tu cuenta Liverpool, o haciendo <a className="primaryLink">click aqui</a></p>
                                </div>
                            </div> */}
              <div className="row">
                <div className="col-xs-12">
                  <p className="mt-20 nmv subtitleSection">Confirmación de devolución de productos</p>
                  <p className="subtitleModule">Fecha de operación <strong>{commonUtil.formatDate(this.submitData.currTime, 'monthName')}</strong></p>
                  {/* <p className="subtitleModule">Fecha de operación <strong>18 mayo de 2017</strong></p> */}
                </div>
              </div>
              {this.submitTransferenceData.paymentType !== 'Virtual-Account' ?
                <div className="row mb-10">
                  <VerificationPanel submitTransferenceData={this.submitTransferenceData} loadFrom="ReturnRefundConfirmation" />
                </div> :
                <div className="row mb-10">
                  <div className="col-xs-8">
                    <div className="table-header">
                      <p className="table-title nmv">Devolución {this.submitTransferenceData.paymentType === 'Virtual-Account' ? 'por Reinversiòn' : 'a monedero electrónico'}</p>
                    </div>
                    <div className="table-body">
                      <div className="row p-5 nmh">
                        <div className="col-xs-4 body-left">
                          <label className="label-table nmv">Nombre</label>
                          {/* <p className="nmv mb-10 info-body">{fullName}</p> */}
                          <p className="nmv mb-10 info-body">{this.submitTransferenceData.userName}</p>
                        </div>
                        <div className="col-xs-8">
                          <div className="row nmh borde-abajo mb-10">
                            <div className="col-xs-12 row-detail">
                              <div className="text-left">
                                <label className="label-detail">Monto del depósito</label>
                              </div>
                              <div className="text-right"><strong>$ {this.submitTransferenceData.totalAmount}</strong></div>
                            </div>
                          </div>
                          <div className="row nmh">
                            <div className="col-xs-12 row-detail">
                              <div className="text-left">
                                <label>Total a recibir</label>
                              </div>
                              <div className="text-right"><strong>$ {this.submitTransferenceData.totalAmount}</strong></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              <div className="row">
                <div className="col-xs-8">
                  {/* <p>Las transferencias a cuentas de otros bancos toman hasta 48 horas en reflejarse en tu cuenta, Montos y comisiones de acuerdo a tu contrato en Mesa de regalos Liverpool.</p> */}
                  <hr />
                </div>
              </div>
              <div className="row exclude-for-print-download">
                <div className="col-xs-8 right">
                  {/* <Link onClick={() => commonUtil.downloadPdf('.toPrintVerification', 'Devolución.pdf')} href="javascript:void(0)"><i className="iclassName icon-descarga icono-grande-inline mr-15" /></Link>
                                    <Link onClick={() => commonUtil.printPage('.toPrintVerification')} href="javascript:void(0)"><i className="iclassName icon-imprimir icono-grande-inline" /></Link> */}
                  <PrintDownload footer='Devolución' elem='.toPrintVerification' fileName='Devolución.pdf' usePageHeader='false' printFunc={() => commonUtil.printPage('.toPrintVerification')} />
                </div>
              </div>
              <div className="row"
                dangerouslySetInnerHTML={{
                  __html:
                    commonUtil.getLabel(this.props.labels, 'refundpage.confirm.successinfo',
                      { 0: (this.submitData && this.submitData.emailAddress) || '' })
                }} />
              <div className="row padding10Top exclude-for-print-download">
                <div className="col-xs-12 row-detail">
                  <button onClick={this.goAccountStatementClick} className="btnSecondary btn-custom">Ir a estado de cuenta</button>
                  <button onClick={this.goAdministratorClick} className="btnPrimary btn-custom">Ir home del evento</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ReturnRefundConfirmation;