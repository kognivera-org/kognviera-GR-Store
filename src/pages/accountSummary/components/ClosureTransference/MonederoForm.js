
import React, { Component } from 'react';
import Monedero from './Monedero';
import { calculateCommision } from '../../requests';
import commonUtil from '../../../../utils/commonUtil';

class MonederoForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isContinueButtonDisable: true,
      walletLengthError: false,
    };
  }
  walletLengthError = (isWalletLengthErro) => {
    this.setState({ walletLengthError: isWalletLengthErro });
  }
  onNextStepClick = () => {
    const submitTransferenceObj = this.monedero.getFormData();
    calculateCommision({ eventId: this.props.submitTransferenceData.eventId, walletType: submitTransferenceObj.walletType, amount: this.props.submitTransferenceData.walletOrEmployeeCardAmount, accountId: submitTransferenceObj.walletOrEmployeeIdentifierId }, (res) => {
      if (res.data) {
        const transactionInfo = res.data.transactionInfo;
        if (transactionInfo.commissionToWallet) {
          const submitTransferenceData = {
            ...submitTransferenceObj,
            totalAmount_View: (+transactionInfo.totalAmountToWallet + +this.props.submitTransferenceData.bonusAmount),
            commissionValue: transactionInfo.commissionFeeToWallet,
            walletCommissionAmount: transactionInfo.commissionToWallet,
            paymentMode: 'MonederoForm',
          };
          if ((this.monedero.state.walletNumber_mltpc && this.monedero.state.walletNumber_mltpc.length > 0 && this.monedero.state.walletNumber_mltpc && this.monedero.state.walletNumber_mltpc.length < 16) ||
            (this.monedero.state.walletNumber_mmdr && this.monedero.state.walletNumber_mmdr.length > 0 && this.monedero.state.walletNumber_mmdr && this.monedero.state.walletNumber_mmdr.length < 16)) {
            this.setState({ walletLengthError: true });
          } else {
            this.setState({ walletLengthError: false });
            this.props.submitTransferenceDataFunction(submitTransferenceData);
          }
        }
      }
    });
  }
  onBackClick = () => {
    if (+this.props.submitTransferenceData.cardOrBankAmount > 0) {
      this.props.prev();
    } else {
      this.props.goToPanel(0);
    }
  }
  disableContinueButton = (isDisable) => {
    this.setState({ isContinueButtonDisable: isDisable });
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  render() {
    const walletOrEmployeeCardAmount = this.props.submitTransferenceData && this.props.submitTransferenceData.walletOrEmployeeCardAmount;
    return (
      <div className="panel checkout-step non-printable">
        <div id="headingTwo" role="tab"><span className="checkout-step-number inactive">3</span>
          <h4 className="titleModule inactiveTitle">Datos de depósito a monedero</h4>
        </div>
        {this.state.walletLengthError ?
          <div className="alertError"><i className="icon-tache2" />
            <p>{commonUtil.getLabel(this.props.labels, 'eventClosure.walletInvalid.message')}</p><a className="icon-tache2" onClick={() => { this.setState({ walletLengthError: null }); }} />
          </div> : null}
        <div className="panel-collapse collapse" id="collapseTwo" aria-expanded="true" style={{}}>
          <div className="checkout-step-body">
            <div className="col-xs-12 alignRight">
              <div className="requiredFields">* Campos obligatorios</div>
            </div>
            <div>
              <div className="row show-grid-row">
                <div className="col-xs-4">
                  <p className="messageText">Cantidad de depósito</p>
                  <p className="quantityAndGuest">${walletOrEmployeeCardAmount}</p>
                </div>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-12">
                  <hr />
                </div>
              </div>
            </div>
            <Monedero ref={monedero => (this.monedero = monedero)} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} eventDetailsInfo={this.props.eventDetailsInfo} transferenceMethodTypeClosure />
            <div className="row show-grid-row">
              <div className="col-xs-2">
                <button className="btnSecondaryAction size-Full" onClick={this.onBackClick}><i className="icon-flecha_light_izq" /> Regresar</button>
              </div>
              <div className="col-xs-offset-10">
                <button onClick={this.onNextStepClick} className={'nextStep collapsed btnPrimary size-Full' + (this.state.isContinueButtonDisable ? ' btnPrimaryDisable' : '')} disabled={this.state.isContinueButtonDisable}>Siguiente paso <i className="icon-flecha_lightsvg_derecha" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MonederoForm;
