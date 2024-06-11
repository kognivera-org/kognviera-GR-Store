import React, { Component } from 'react';
import UserCardBankCreate from './UserCardBankCreate';
import { calculateCommision } from '../../requests';
import commonUtil from '../../../../utils/commonUtil';

class UserCardBankForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isContinueButtonDisable: true,
      walletLengthError: false,
    };
  }

  disableContinueButton = (isDisable) => {
    this.setState({ isContinueButtonDisable: isDisable });
  }
  walletLengthError = (isWalletLengthErro) => {
    this.setState({ walletLengthError: isWalletLengthErro });
  }

  onNextStepClick = () => {
    const submitTransferenceObj = this.userCard.getFormData();
    let accountType = '';
    if (submitTransferenceObj.cardOrBankIdentifierId) {
      accountType = '2';
    } else {
      accountType = submitTransferenceObj.paymentType;
    }
    calculateCommision({ eventId: this.props.submitTransferenceData.eventId, accountType, accountId: submitTransferenceObj.cardOrBankIdentifierId, amount: this.props.submitTransferenceData.cardOrBankAmount }, (res) => {
      if (res.data) {
        const transactionInfo = res.data.transactionInfo;
        if (transactionInfo.commissionToCard) {
          const submitTransferenceData = {
            ...submitTransferenceObj,
            totalAmount_CardBank_View: transactionInfo.totalAmountToCard,
            commissionValue_CardBank: transactionInfo.commissionFeeToCardOrBank,
            commissionAmount: transactionInfo.commissionToCard,
            paymentMode: 'UserCardBankForm',
          };
          if (this.userCard.state.accountNumber && this.userCard.state.accountNumber.length > 0 && this.userCard.state.accountNumber.length < 16) {
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
    this.props.prev();
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {
    const cardOrBankAmount = this.props.submitTransferenceData && this.props.submitTransferenceData.cardOrBankAmount;
    return (
      <div className="panel checkout-step non-printable">
        <div id="headingTwo" role="tab"><span className="checkout-step-number inactive">2</span>
          <h4 className="titleModule inactiveTitle">Datos de depósito a cuenta bancaria</h4>
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
            <div className="row show-grid-row">
              <div className="col-xs-4">
                <p className="messageText">Cantidad de depósito</p>
                <p className="quantityAndGuest">${cardOrBankAmount}</p>
              </div>
            </div>
            <div className="row show-grid-row">
              <div className="col-xs-12">
                <hr />
              </div>
            </div>
            <UserCardBankCreate ref={userCard => (this.userCard = userCard)} transferenceData={this.props.transferenceData} disableContinueButton={this.disableContinueButton} />
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

export default UserCardBankForm;
