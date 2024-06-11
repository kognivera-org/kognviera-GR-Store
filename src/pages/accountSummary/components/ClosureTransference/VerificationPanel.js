import React, { Component } from 'react';
import commonUtil from '../../../../utils/commonUtil';

export default class ClosureVerificationPanel extends Component {
  render() {
    const { submitTransferenceData } = this.props;
    const verificationForWallet = (
      <div className="row mb-10" style={{display: "flex", justifyContent: "center"}}>
        <div className="col-xs-10">
          <div className="table-header">
            <p className="table-title nmv">Depósito a {submitTransferenceData.walletType}</p>
          </div>
          <div className="table-body">
            <div className="row p-5 nmh">
              <div className="col-xs-5 body-left">
                <label className="label-table nmv">Nombre </label>
                {<p className="nmv mb-10 info-body">{submitTransferenceData.accountHolderName ? submitTransferenceData.accountHolderName : submitTransferenceData.walletUserName}</p>}
                <label className="label-table nmv">Número de {submitTransferenceData.walletType}</label>
                <p className="nmv mb-10 info-body">{
                  submitTransferenceData.walletNumber
                    ? commonUtil.mask(submitTransferenceData.walletNumber)
                    : commonUtil.mask(submitTransferenceData.accountNumberx)}</p>
              </div>
              <div className="col-xs-7">
                <div className="row nmh borde-abajo mb-10">
                  <div className="col-xs-12 row-detail">
                    <div className="text-left">
                      <label className="label-detail">Monto del depósito</label>
                    </div>
                    <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.walletOrEmployeeCardAmount)}</strong></div>
                  </div>
                </div>

                {+submitTransferenceData.bonusAmount !== 0 ?
                  <div className="row nmh borde-abajo mb-10">
                    <div className="col-xs-12 row-detail">
                      <div className="text-left">
                        <label className="label-detail">Bono total</label>
                      </div>
                      <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.bonusAmount)}</strong></div>
                    </div>
                    <div className="col-xs-12">
                      <p>{submitTransferenceData.bonusPercentage} % {commonUtil.getLabel(this.props.labels, 'eventClosure.tarjetaLiverpool.bonusStatement')}</p>
                    </div>
                  </div> : null}

                {+submitTransferenceData.walletCommissionAmount !== 0 ?
                  <div className="row nmh borde-abajo mb-10">
                    <div className="col-xs-12 row-detail">
                      <div className="text-left">
                        <label className="label-detail">-{submitTransferenceData.commissionValue}% Monto del depósito a {submitTransferenceData.walletType}</label>
                      </div>
                      <div className="text-right"><strong>-{commonUtil.getCurrency(submitTransferenceData.walletCommissionAmount)}</strong></div>
                    </div>
                  </div> : null}
                <div className="row nmh">
                  <div className="col-xs-12 row-detail">
                    <div className="text-left">
                      <label>{this.props.loadFrom === 'closureConfirmation' ? 'Total a recibido' : 'Total a recibir'}</label>
                    </div>
                    <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.totalAmount_View)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );

    const verificationForCombinadoCard = (
      <div className="row mb-10">
        <div className="col-xs-6">
          <div className="table-header">
            <p className="table-title nmv">Depósito a {submitTransferenceData.paymentType}</p>
          </div>
          <div className="table-body">
            <div className="row p-5 nmh">
              <div className="col-xs-5 body-left">
                <label className="label-table nmv">Nombre</label>
                <p className="nmv mb-10 info-body">{submitTransferenceData.cardBankUserName}</p>
                <label className="label-table nmv">Tipo de cuenta / tarjeta</label>
                <p className="nmv mb-10 info-body">{submitTransferenceData.paymentType}</p>
                <label className="label-table nmv">Cuenta CLABE</label>
                <p className="nmv mb-10 info-body">{
                  submitTransferenceData.number ?
                    commonUtil.mask(submitTransferenceData.number) :
                    commonUtil.mask(submitTransferenceData.cardNumber)}</p>
              </div>
              <div className="col-xs-7">
                <div className="row nmh borde-abajo mb-10">
                  <div className="col-xs-12 row-detail">
                    <div className="text-left">
                      <label className="label-detail">Monto del depósito</label>
                    </div>
                    <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.cardOrBankAmount)}</strong></div>
                  </div>
                </div>
                {+submitTransferenceData.commissionAmount !== 0 ?
                  <div className="row nmh borde-abajo mb-10">
                    <div className="col-xs-12 row-detail">
                      <div className="text-left">
                        <label className="label-detail">-{submitTransferenceData.commissionValue_CardBank}% comisión por depósito a {submitTransferenceData.walletType}</label>
                      </div>
                      <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.commissionAmount)}</strong></div>
                    </div>
                  </div> : null}
                <div className="row nmh">
                  <div className="col-xs-12 row-detail">
                    <div className="text-left">
                      <label> {this.props.loadFrom === 'closureConfirmation' ? 'Total a recibido' : 'Total a recibir'}</label>
                    </div>
                    <div className="text-right"><strong>{commonUtil.getCurrency(submitTransferenceData.totalAmount_CardBank_View)}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    return (
      // && this.props.submitTransferenceData.isClosingGiftEligible && this.props.submitTransferenceData.isClosingGiftEligible.toString() === 'true'
      <div>
        {this.props.submitTransferenceData && this.props.submitTransferenceData.cardOrBankAmount > 0 ? verificationForCombinadoCard : null}
        {this.props.submitTransferenceData && this.props.submitTransferenceData.walletType !== 'undefined' ? verificationForWallet : null}
      </div>
    );
  }
}
