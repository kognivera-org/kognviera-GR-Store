import React, { Component } from 'react';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import Monedero from './Monedero';
import UserCardBankCreate from './UserCardBankCreate';
import TarjetaLiverpool from './TarjetaLiverpool';
import RefundReinvestment from './RefundReinvestment';
import commonUtil from '../../../../utils/commonUtil';
import LeavingConfirmationModal from './LeavingConfirmationModal';

export default class DepositFormRefund extends Component {
  constructor(props) {
    super(props);
    this.allTransferOptions = [
      { code: 0, label: 'Monedero' },
      { code: 1, label: 'Tarjeta Liverpool' },
      { code: 2, label: 'Cuenta bancaria o tarjeta Liverpool' },
      { code: 3, label: 'Cuenta bancaria o tarjeta Liverpool Premium Card' },
      { code: 4, label: 'Combinado' },
      { code: 5, label: 'Monedero Mesa de regalos' },
      { code: 6, label: 'Devolución con Reinversión' },
    ];
    this.state = {
      transferenceMethods: [],
      selectedTransferenceMethodsCode: '',
      availableCardsInfo: null,
      isMonedero: false,
      isBankCard: false,
      isEmployee: false,
      isReinvest: false,
      isContinueButtonDisable: true,
      formErrors: {},
      walletLengthError: false,
    };
  }

  componentWillMount() {
    const transferenceMethods = [];
    if (this.props.transference && this.props.transference.transferenceOptions
      && this.props.transference.transferenceOptions.transferenceMethods) {
      this.props.transference.transferenceOptions.transferenceMethods.forEach((option) => {
        if (option.code === '1') {
          if (this.props.transference.employeeCardInfo.length > 0) {
            transferenceMethods.push({ name: option.name, code: option.code });
          }
        } else {
          transferenceMethods.push({ name: option.name, code: option.code });
        }
      });
      this.setState({
        transferenceMethods,
        availableCardsInfo: this.props.transference.transferenceOptions.availableCardsInfo,
        selectedTransferenceMethodsCode: transferenceMethods.length === 1 ? transferenceMethods[0].code : '',
      });
      if (transferenceMethods.length === 1) {
        this.loadComponentByCode(transferenceMethods[0].code);
      }
    }
  }

  handleRadioSelected = (e) => {
    this.setState({ selectedTransferenceMethodsCode: e.target.value });
    this.loadComponentByCode(e.target.value);
  }

  loadComponentByCode = (code) => {
    if (code === '0') {
      this.setState({ isMonedero: true, isBankCard: false, isEmployee: false, isReinvest: false, isContinueButtonDisable: true });
    } else if (code === '1') {
      this.setState({ isMonedero: false, isBankCard: false, isEmployee: true, isReinvest: false, isContinueButtonDisable: true });
    } else if (code === '2' || code === '3') {
      this.setState({ isMonedero: false, isBankCard: true, isEmployee: false, isReinvest: false, isContinueButtonDisable: true });
    } else if (code === '6') {  // type : refund
      this.setState({ isMonedero: false, isBankCard: false, isEmployee: false, isReinvest: true, isContinueButtonDisable: false });
    }
  }

  disableContinueButton = (isDisable) => {
    this.setState({ isContinueButtonDisable: isDisable });
  }
  walletLengthError = (isWalletLengthErro) => {
    this.setState({ walletLengthError: isWalletLengthErro });
  }
  
  onNextStepClick = () => {
    let submitTransferenceObj = null;
    if (this.state.isMonedero) {
      if ((this.monedero.state.walletNumber_mltpc && this.monedero.state.walletNumber_mltpc.length > 0 && this.monedero.state.walletNumber_mltpc && this.monedero.state.walletNumber_mltpc.length < 16) ||
        (this.monedero.state.walletNumber_mmdr && this.monedero.state.walletNumber_mmdr.length > 0 && this.monedero.state.walletNumber_mmdr && this.monedero.state.walletNumber_mmdr.length < 13)) {
        this.setState({ walletLengthError: true });
      } else {
        this.setState({ walletLengthError: false });
        submitTransferenceObj = this.monedero.getMyFormData();
        this.props.submitTransferenceData(submitTransferenceObj);
      }
      this.props.wallet("transference")
      this.props.nextPage(2);  
    } else if (this.state.isBankCard) {
      submitTransferenceObj = this.userCard.getFormData();
      this.props.submitTransferenceData(submitTransferenceObj);
      this.props.wallet("transference")
      this.props.nextPage(2); 
    } else if (this.state.isEmployee) {
      submitTransferenceObj = this.employeeCard.getFormData();
      this.props.submitTransferenceData(submitTransferenceObj);
      this.props.wallet("transference")
      this.props.nextPage(2); 
    } else if (this.state.isReinvest) {
      submitTransferenceObj = this.refundReinvestment.getFormData();
      this.props.submitTransferenceData(submitTransferenceObj);
      this.props.wallet("reinvest")
      this.props.nextPage(2); 
    }
  }

  redirectPageCancelButton = () => {
    this.LeavingConfirmationModal.handleShow();
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {
    const monederoComponent = (this.state.isMonedero && <Monedero ref={monedero => (this.monedero = monedero)} transferenceData={this.props.transference} walletLengthError={this.walletLengthError} disableContinueButton={this.disableContinueButton} eventDetailsInfo={this.props.eventDetailsInfo} labels={this.props.labels} type={this.props.type} />);
    const cardBankComponent = (this.state.isBankCard && <UserCardBankCreate ref={userCard => (this.userCard = userCard)} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} type={this.props.type} />);
    const employeeComponent = (this.state.isEmployee && <TarjetaLiverpool ref={employeeCard => (this.employeeCard = employeeCard)} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} type={this.props.type} />);
    // type : refund
    const refundComponent = (this.state.isReinvest && <RefundReinvestment ref={refundReinvestment => (this.refundReinvestment = refundReinvestment)} refundAmount={this.props.transference.transferenceOptions.transferableAmount} />);

    return (
      <div className="panel checkout-step non-printable">
        {this.state.walletLengthError ?
          <div className="alertError"><i className="icon-tache2" />
            <p>{commonUtil.getLabel(this.props.labels, 'eventTransferences.ewalletInvalid.message')}</p><a className="icon-tache2" onClick={() => { this.setState({ walletLengthError: null }); }} />
          </div> : null}
        <div className="panel-collapse collapse in">
          <div className="checkout-step-body">
          <div style={{fontSize: "19px", paddingBottom: "6%"}} className="titleSection non-printable">{this.props.type === 'refund' ? 'Seleccionar destino de la devolución' : null}</div>
            <div className="col-xs-12">
              <div className="articleName">Selecciona forma de depósito</div>
              {
                /* eslint-disable */
                <div>
                  {this.state.transferenceMethods.map((option, index) => (
                    <div key={index}>
                      <RadioButton checked={this.state.selectedTransferenceMethodsCode === option.code} displayName={option.name} id={'radio_transferenceMethods_' + option.code} value={option.code} name="transferenceMethods" radioCssClass={'radio'} onChangeFunction={this.handleRadioSelected} />
                      <div>
                        {/* {option.code === '0' ? monederoComponent :
                          option.code === '2' ? cardBankComponent : null} */}
                        {option.code === '0' ? monederoComponent :
                          option.code === '1' ? employeeComponent :
                            option.code === '2' || option.code === '3' ? cardBankComponent :
                              option.code === '6' ? refundComponent : null}
                      </div>
                    </div>
                  ))}
                </div>
                /* eslint-enable */}

            </div>
            <div className="row show-grid-row">
              <div className="col-xs-2">
                <button onClick={this.redirectPageCancelButton} className="btnSecondaryAction size-Full">Cancelar</button>
              </div>
              <div className="col-xs-offset-10">
                <button onClick={this.onNextStepClick} className={'nextStep collapsed btnPrimary size-Full' + (this.state.isContinueButtonDisable ? ' btnPrimaryDisable' : '')} disabled={this.state.isContinueButtonDisable}>Siguiente<i className="icon-flecha_lightsvg_derecha" /></button>
              </div>
            </div>
          </div>
        </div>
        <LeavingConfirmationModal onRef={ref => (this.LeavingConfirmationModal = ref)} router={this.props.router} labels={this.props.labels} eventId={this.props.eventId} />
      </div>
    );
  }
}
