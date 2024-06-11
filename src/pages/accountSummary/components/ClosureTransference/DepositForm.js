import React, { Component } from 'react';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import Monedero from './Monedero';
import UserCardBankCreate from './UserCardBankCreate';
import TarjetaLiverpool from './TarjetaLiverpool';
import Combinado from './Combinado';
import LeavingConfirmationModal from './LeavingConfirmationModal';
import ClosingGift from './ClosingGift';
import commonUtil from '../../../../utils/commonUtil';

export default class ClosureDepositForm extends Component {
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
    this.wallerErrorMsg = 'Numero de monedero no valido. Favor de ingresar nuevamente.';
    this.state = {
      transferenceMethods: [],
      selectedTransferenceMethodsCode: '',
      availableCardsInfo: null,
      isMonedero: false,
      isBankCard: false,
      isEmployee: false,
      isContinueButtonDisable: true,
      walletLengthError: false,
    };
    this.isClosingGiftEligible = false;
  }

  componentWillMount() {
    const transferenceMethods = [];
    if (this.props.transference && this.props.transference.transferenceOptions
      && this.props.transference.transferenceOptions.transferenceMethods) {
      this.props.transference.transferenceOptions.transferenceMethods.forEach((option) => {
        transferenceMethods.push({ name: option.name, code: option.code });
      });
      this.setState({
        transferenceMethods,
        availableCardsInfo: this.props.transference.transferenceOptions.availableCardsInfo,
        selectedTransferenceMethodsCode: transferenceMethods.length === 1 ? transferenceMethods[0].code : '',
      });
      if (transferenceMethods.length === 1) {
        this.loadComponentByCode(transferenceMethods[0].code);
      }

      if (this.props.transference.isClosingGiftEligible &&
        this.props.transference.isClosingGiftEligible.toString() === 'true') {
        this.isClosingGiftEligible = true;
      }

      if (this.props.transference.transferenceOptions.transferableAmount <= 0 &&
        this.props.transference.transferenceOptions.bonusAmount <= 0 &&
        this.props.transference.isClosingGiftEligible &&
        this.props.transference.isClosingGiftEligible.toString() === 'true') {
        this.disableContinueButton(false);
      }
    }
  }

  handleRadioSelected = (e) => {
    this.setState({ selectedTransferenceMethodsCode: e.target.value });
    this.loadComponentByCode(e.target.value);
    this.props.submitTransferenceDataFunction(null);
  }

  loadComponentByCode = (code) => {
    if (code === '0') {
      this.setState({ isMonedero: true, isBankCard: false, isEmployee: false, isCombinado: false, isContinueButtonDisable: true });
    } else if (code === '1' || code === '5') {
      this.setState({ isMonedero: false, isBankCard: false, isEmployee: true, isCombinado: false, isContinueButtonDisable: true });
    } else if (code === '2' || code === '3') {
      this.setState({ sMonedero: false, isBankCard: true, isEmployee: false, isCombinado: false, isContinueButtonDisable: true });
    } else if (code === '4') {
      this.setState({ isMonedero: false, isBankCard: false, isEmployee: false, isCombinado: true, isContinueButtonDisable: false });
    }
  }

  disableContinueButton = (isDisable) => {
    this.setState({ isContinueButtonDisable: isDisable });
  }
  displayError = (walletErr) => {
    this.setState({ walletLengthError: walletErr });
  }

  onNextStepClick = () => {
    let submitTransferenceObj = null;
    if (this.state.isMonedero) {
      if ((this.monedero.state.walletNumber_mltpc && this.monedero.state.walletNumber_mltpc.length > 0 && this.monedero.state.walletNumber_mltpc && this.monedero.state.walletNumber_mltpc.length < 16) ||
        (this.monedero.state.walletNumber_mmdr && this.monedero.state.walletNumber_mmdr.length > 0 && this.monedero.state.walletNumber_mmdr && this.monedero.state.walletNumber_mmdr.length < 13)) {
        this.setState({ walletLengthError: this.wallerErrorMsg });
      } else {
        this.setState({ walletLengthError: null });
        submitTransferenceObj = this.monedero.getFormData();
        if (this.isClosingGiftEligible) {
          submitTransferenceObj = {
            ...submitTransferenceObj,
            ...this.closingGift.getFormData(),
          };
        }
        this.props.submitTransferenceDataFunction(submitTransferenceObj);
      }
    } else if (this.state.isBankCard) {
      submitTransferenceObj = this.userCard.getFormData();
      this.props.submitTransferenceDataFunction(submitTransferenceObj);
    } else if (this.state.isEmployee) {
      if (this.employeeCard.state.walletNumber && this.employeeCard.state.walletNumber.length > 0 && this.employeeCard.state.walletNumber && this.employeeCard.state.walletNumber.length < 13) {
        this.setState({ walletLengthError: this.wallerErrorMsg });
      } else {
        this.setState({ walletLengthError: null });
        submitTransferenceObj = this.employeeCard.getFormData();
        if (this.isClosingGiftEligible) {
          submitTransferenceObj = {
            ...submitTransferenceObj,
            ...this.closingGift.getFormData(),
          };
        }
        this.props.submitTransferenceDataFunction(submitTransferenceObj);
      }
    } else if (this.state.isCombinado) {
      submitTransferenceObj = this.combinado.getFormData();
      this.props.submitTransferenceDataFunction(submitTransferenceObj);
    } else if (this.isClosingGiftEligible) {
      submitTransferenceObj = {
        ...this.closingGift.getFormData(),
        totalAmount: '0', // Service call field is mandatory
        walletType: 'Closing Gift',
        paymentMode: 'ClosingGift',
      };
      this.props.submitTransferenceDataFunction(submitTransferenceObj);
    }
    this.props.nextPage(2);
  }

  redirectPageCancelButton = () => {
    this.LeavingConfirmationModal.handleShow();
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {
    const monederoComponent = (this.state.isMonedero && <Monedero ref={monedero => (this.monedero = monedero)} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} eventDetailsInfo={this.props.eventDetailsInfo} labels={this.props.labels} />);
    const cardBankComponent = (this.state.isBankCard && <UserCardBankCreate ref={userCard => (this.userCard = userCard)} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} />);
    const employeeComponent = (this.state.isEmployee && <TarjetaLiverpool ref={employeeCard => (this.employeeCard = employeeCard)} userName={this.props.userName} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} eventDetailsInfo={this.props.eventDetailsInfo} labels={this.props.labels} />);
    const combinadoComponent = (this.state.isCombinado && <Combinado ref={combinado => (this.combinado = combinado)} transferenceData={this.props.transference} disableContinueButton={this.disableContinueButton} eventDetailsInfo={this.props.eventDetailsInfo} labels={this.props.labels} />);
    return (
      <div className="panel checkout-step non-printable">
        {this.state.walletLengthError ?
          <div className="alertError"><i className="icon-tache2" />
            <p>{commonUtil.getLabel(this.props.labels, 'eventClosure.walletInvalid.message')}</p><a className="icon-tache2" onClick={() => { this.setState({ walletLengthError: null }); }} />
          </div> : null}
        <div className="panel-collapse collapse in">
          <div className="checkout-step-body">
            <div className="col-xs-12 alignRight" style={{paddingBottom:"3%"}}>
              <div className="requiredFields">* Campos obligatorios</div>
            </div>
            {this.state.transferenceMethods.length ?
              <div className="col-xs-12">
                <div className="articleName">Selecciona forma de depósito</div>
                {/* eslint-disable */
                  <div>
                    {this.state.transferenceMethods.map((option, index) => (
                      <div key={index}>
                        <RadioButton checked={this.state.selectedTransferenceMethodsCode === option.code} key={index} displayName={option.name} id={'radio_transferenceMethods_' + option.code} value={option.code} name="transferenceMethods" radioCssClass={'radio'} onChangeFunction={this.handleRadioSelected} />
                        <div>
                          {option.code === '0' ? monederoComponent :
                            option.code === '1' || option.code === '5' ? employeeComponent :
                              option.code === '2' || option.code === '3' ? cardBankComponent :
                                option.code === '4' && combinadoComponent}
                        </div>
                      </div>
                    ))}
                  </div>
                /* eslint-enable */}
              </div> : null}
            <div className="col-xs-12">
              {this.props.transference.isClosingGiftEligible && this.props.transference.isClosingGiftEligible.toString() === 'true' ?
                <ClosingGift ref={closingGift => (this.closingGift = closingGift)} eventId={this.props.eventId} labels={this.props.labels} /> : null}
            </div>
            <div className="row show-grid-row" style={{paddingTop: "6%"}}>
              <div className="col-xs-2">
                <button onClick={this.redirectPageCancelButton} className="btnSecondaryAction size-Full">Cancelar</button>
              </div>
              <div className="col-xs-offset-10">
                <button onClick={this.onNextStepClick} className={'nextStep collapsed btnPrimary size-Full' + (this.state.isContinueButtonDisable ? ' btnPrimaryDisable' : '')} disabled={this.state.isContinueButtonDisable}>Siguiente<i className="icon-flecha_lightsvg_derecha" /></button>
              </div>
            </div>
          </div>
        </div>
        <LeavingConfirmationModal onRef={ref => (this.LeavingConfirmationModal = ref)} router={this.props.router} eventId={this.props.eventId} labels={this.props.labels} />
      </div>
    );
  }
}
