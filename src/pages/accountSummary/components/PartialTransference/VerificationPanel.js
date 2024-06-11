import React, { Component } from 'react';
import { Link } from 'react-router';
import commonUtil from '../../../../utils/commonUtil';

const pageName = 'partialtransference';

export default class VerificationPanel extends Component {
  downloadOrPrintPDF = (param) => {
    if (param && param === 'download') {
      commonUtil.downloadPrint('download', `${pageName}`, '.toPrintVerification');
    } else if (param && param === 'print') {
      commonUtil.downloadPrint('print', `${pageName}`, '.toPrintVerification');
    }
  }

  render() {
    const { submitTransferenceData } = this.props;
    const verificationForWallet = (
      <div className="col-xs-12">
        {
          this.props.loadFrom === 'verificationForm' && submitTransferenceData.type === 'partial' ? <p>Verifica que la información sea correcta.</p>: null
        }  
        {this.props.loadFrom === 'verificationForm' ? <div className="col-xs-12 alignRight">
          <p>Fecha de operación <strong>{commonUtil.formatDate(submitTransferenceData.transferDate, 'monthName')}</strong></p>
        </div> : null}
        <div className="wrapInfo">
          <div className="row mb-10 show-grid-row boxCenter">
            <div className="col-xs-10">
              <div className="table-header">
                <p className="table-title nmv">Depósito a {submitTransferenceData.walletType}</p>
              </div>
              <div className="table-body" style={{ height: 'auto' }}>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-6 body-left">
                      <label className="label-table nmv">Nombre</label>
                      <p className="nmv mb-10 info-body">{submitTransferenceData.walletHolderName ? submitTransferenceData.walletHolderName : submitTransferenceData.userName}</p>
                      {submitTransferenceData.walletNumber || submitTransferenceData.accountNumber ?
                        <div>
                          <label className="label-table nmv">Número de {submitTransferenceData.walletType}</label>
                          <p className="nmv mb-10 info-body">{
                            submitTransferenceData.walletNumber ?
                              commonUtil.mask(submitTransferenceData.walletNumber) :
                              commonUtil.mask(submitTransferenceData.accountNumber)}</p>
                        </div> : null}
                    </div>
                    <div className="col-xs-6">
                      <div className="row borde-abajo mb-10">
                        <div className="col-xs-12 row-detail">
                          <div className="text-left">
                            <label className="label-detail">Monto del depósito</label>
                          </div>
                          <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.walletOrEmployeeCardAmount)}</strong></div>
                        </div>
                        {submitTransferenceData && +submitTransferenceData.walletCommissionAmount !== 0 ?
                          <div className="col-xs-12 row-detail">
                            <div className="text-left">
                              <label className="label-detail">-{submitTransferenceData.commissionValue}% comisión por depósito a {submitTransferenceData.walletType}</label>
                            </div>
                            <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.walletCommissionAmount)}</strong></div>
                          </div> : null}
                      </div>
                      <div className="row mb-10">
                        <div className="col-xs-12 row-detail">
                          <div className="text-left">
                            <label className="label-detail">{this.props.loadFrom === 'partialconfirmation' ? 'Total a recibido' : 'Total a recibir'}</label>
                          </div>
                          <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.totalAmount)}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    const verificationForCard = (
      <div className="col-xs-8">
        <div className="col-xs-12 alignRight">
          <p>Fecha de operación <span>{commonUtil.formatDate(submitTransferenceData.transferDate, 'monthName')}</span></p>
        </div>
        <div className="wrapInfo">
          <div className="row mb-10 show-grid-row">
            <div className="col-xs-12">
              <div className="table-header">
                <p className="table-title nmv">Depósito a la cuenta</p>
              </div>
              <div className="table-body" style={{ height: 'auto' }}>
                <div className="row p-5 nmh show-grid-row">
                  <div className="col-xs-4 body-left">
                    <label className="label-table nmv">Nombre</label>
                    <p className="nmv mb-10 info-body">{submitTransferenceData.accountName ? submitTransferenceData.accountName : submitTransferenceData.userName}</p>
                    <label className="label-table nmv">Tipo de cuenta / tarjeta</label>
                    <p className="nmv mb-10 info-body">{submitTransferenceData.paymentType}</p>
                    <label className="label-table nmv">Número de {submitTransferenceData.paymentType}</label>
                    <p className="nmv mb-10 info-body">{
                      submitTransferenceData.number ?
                        commonUtil.mask(submitTransferenceData.number) :
                        commonUtil.mask(submitTransferenceData.cardNumber)}</p>
                  </div>
                  <div className="col-xs-8">
                    <div className="row nmh borde-abajo mb-10 show-grid-row">
                      <div className="col-xs-12 row-detail">
                        <div className="text-left">
                          <label className="label-detail">Monto del depósito</label>
                        </div>
                        <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.cardOrBankAmount)}</strong></div>
                      </div>
                      {submitTransferenceData && +submitTransferenceData.commissionAmount !== 0 ?
                        <div className="col-xs-12 row-detail">
                          <div className="text-left">
                            <label className="label-detail">-{submitTransferenceData.commissionValue}% Monto del depósito a cuenta bancaria</label>
                          </div>
                          <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.commissionAmount)}</strong></div>
                        </div> : null}
                    </div>
                    <div className="row nmh mb-10 show-grid-row">
                      <div className="col-xs-12 row-detail">
                        <div className="text-left">
                          <label className="label-detail"> {this.props.loadFrom === 'partialconfirmation' ? 'Total a recibido' : 'Total a recibir'}</label>
                        </div>
                        <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.totalAmount)}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    const verificationForRefund = (
      // <div className="checkout-step-body">
      //   <div className="col-xs-12 alignRight mb-20">
      //     <div className="requiredFields">* Campos obligatorios</div>
      //   </div>
      // <div className="row show-grid-row toPrintVerification">
      <div className="col-xs-8" >
        <div className="col-xs-12 alignRight">
          <p className="dateOperation">Fecha de operación <span>{commonUtil.formatDate(this.props.returnDate, 'monthName')}</span></p>
        </div>
        <div className="wrapInfo">
          <div className="row mb-10 show-grid-row">
            <div className="col-xs-12">
              <div className="table-header">
                <p className="table-title nmv">Devolución con Reinversión</p>
              </div>
              <div className="table-body">
                <div className="row p-5 nmh show-grid-row">
                  <div className="col-xs-4 body-left">
                    <label className="label-table nmv">Nombre</label>
                    <p className="nmv mb-10 info-body">{submitTransferenceData.userName}</p>
                  </div>
                  <div className="col-xs-8">
                    <div className="row nmh borde-abajo mb-10 show-grid-row">
                      <div className="col-xs-12 row-detail">
                        <div className="text-left">
                          <label className="label-detail">Monto del depósito</label>
                        </div>
                        <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.totalAmount)}</strong></div>
                      </div>
                    </div>
                    <div className="row nmh mb-10 show-grid-row">
                      <div className="col-xs-12 row-detail">
                        <div className="text-left">
                          <label className="label-detail"> {this.props.loadFrom === 'partialconfirmation' ? 'Total a recibido' : 'Total a recibir'}</label>
                        </div>
                        <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.totalAmount)}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* <div className="col-xs-8 alignRight iconAction exclude-for-print-download">
            <p className="iconAction">
              <Link onClick={() => this.downloadOrPrintPDF('download')} href="javascript:void(0)"><i className="icon-descarga" /></Link>
              <Link onClick={() => this.downloadOrPrintPDF('print')} href="javascript:void(0)"><i className="icon-imprimir" /></Link>
            </p>
          </div> */}
      </div>
      // </div>
    );

    return (
      <div>
        {this.props.submitTransferenceData && this.props.submitTransferenceData.walletType && this.props.submitTransferenceData.walletType !== 'undefined' ? verificationForWallet : null}
        {this.props.submitTransferenceData && this.props.submitTransferenceData.paymentType === 'Virtual-Account' ? verificationForRefund :
          this.props.submitTransferenceData && this.props.submitTransferenceData.paymentType ? verificationForCard : null}
      </div>
    );
  }
}
