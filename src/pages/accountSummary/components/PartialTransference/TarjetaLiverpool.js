import React, { Component } from 'react';
import _ from 'lodash';
import TextInput from '../../../../lib/ZUILib/TextInput';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import commonUtil from '../../../../utils/commonUtil';

export default class TarjetaLiverpool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tarjetaWalletAmount: '',
      isEmployeeHasCards: false,
      transferenceData: this.props.transferenceData,
      selectedRadioSavedCardsInfoValue: '',
    };
  }

  checkUpdateAmountField = (e) => {
    if (e) {
      const prevVal = this.state[e.target.name];
      /* eslint-disable */
      const regEx = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
      /* eslint-enable */
      if (regEx.test(e.target.value)) {
        this.state[e.target.name] = e.target.value;
        this.setState({ [e.target.name]: e.target.value });
      } else {
        this.state[e.target.name] = prevVal;
        this.setState({ [e.target.name]: prevVal });
      }
    }
  }
  onTarjetaWalletAmountNumberChange = (e) => {
    /* eslint-disable */
    this.checkUpdateAmountField(e);

    if (this.props.type === 'refund') {
      if (e.target.value > 0 && +e.target.value == +this.state.transferenceData.transferenceOptions.transferableAmount) {
        !_.isEmpty(this.state.selectedRadioSavedCardsInfoValue) ? null : this.props.disableContinueButton(true);
        this.setState({ isEmployeeHasCards: true });
      } else {
        this.props.disableContinueButton(true);
        this.setState({ isEmployeeHasCards: false });
      }
    } else {

      if (e.target.value.length > 0 && +e.target.value <= +this.state.transferenceData.transferenceOptions.transferableAmount) {
        !_.isEmpty(this.state.selectedRadioSavedCardsInfoValue) ? null : this.props.disableContinueButton(true);
        this.setState({ isEmployeeHasCards: true, selectedRadioSavedCardsInfoValue: '' });
      } else {
        this.props.disableContinueButton(true);
        this.setState({ isEmployeeHasCards: false });
      }
    }
  }
  handleRadioSelected = (e) => {
    this.setState({ selectedRadioSavedCardsInfoValue: e.target.value });
    if (this.props.type === 'refund') {
      this.setState({
        tarjetaWalletAmount: this.state.transferenceData.transferenceOptions.transferableAmount
      });
      this.props.disableContinueButton(false);
      // }
    } else {
      if (this.state.tarjetaWalletAmount.length > 0 && +this.state.tarjetaWalletAmount <= +this.state.transferenceData.transferenceOptions.transferableAmount) {
        this.props.disableContinueButton(false);
      } else {
        this.props.disableContinueButton(true);
      }
    }
  }
  getFormData = () => {
    let reqParams = {};
    const employeeCardInfoObj = _.find(this.state.transferenceData.employeeCardInfo, { accountId: this.state.selectedRadioSavedCardsInfoValue });
    reqParams = {
      walletType: employeeCardInfoObj.accountName,
      walletOrEmployeeCardAmount: this.state.tarjetaWalletAmount,
      totalAmount: this.state.transferenceData.transferenceOptions.transferableAmount,
      walletOrEmployeeIdentifierId: this.state.selectedRadioSavedCardsInfoValue,
      accountNumber: employeeCardInfoObj.accountNumber,
      walletHolderName: employeeCardInfoObj.accountHolderName,
    };
    return reqParams;
  }
  render() {
    const employeeCardInfo = {
      name: 'cardsInfo',
      options: [],
    };
    if (this.state.transferenceData && this.state.transferenceData.employeeCardInfo) {
      this.state.transferenceData.employeeCardInfo.map(card =>
        employeeCardInfo.options.push({
          id: 'radio_' + card.accountId,
          value: card.accountId,
          displayName: <span>{card.accountName}</span>,
          subDetailsHTML: <p>{card.accountNumber}</p>,
          selected: false,
        }),
      );
    }
    return (
      <div className="stepTwoOption display-block">
        <div className="row show-grid-row">
          {this.props.type === 'refund' ?
            <React.Fragment>
              <input type="hidden" name="tarjetaWalletAmount" value={this.state.transferenceData.transferenceOptions.transferableAmount} />
              {/* <span>{commonUtil.getCurrency(this.state.transferenceData.transferenceOptions.transferableAmount)}</span> */}
            </React.Fragment>
            :
            <div className="col-xs-4">

              <React.Fragment>
                <TextInput
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  onChange={this.onTarjetaWalletAmountNumberChange}
                  name="tarjetaWalletAmount"
                  maxlength={10}
                  label="Ingresa cantidad a retirar"
                  inputValue={this.state.tarjetaWalletAmount}
                />
                <p className="copyright">Sin comisión por depósito a Tarjeta Liverpool</p>
              </React.Fragment>

            </div>
          }
          <div className="col-xs-4">

            <i className="iClass icon-ayuda tooltip-container">
              <span className="tooltip-box">Es el monto disponible y aprobado para depósito</span>
            </i>&nbsp;&nbsp;<span className="text">Disponible para retiro</span>
            <p className="articleName alignHelp">{commonUtil.getCurrency(this.state.transferenceData.transferenceOptions.transferableAmount)}</p>
          </div>
        </div>
        {this.state.isEmployeeHasCards || this.props.type === 'refund' ?
          <div className="row show-grid-row">
            <div className="col-xs-7">
              <span className="titleForm">Selecciona la cuenta o tarjeta</span>
              {employeeCardInfo.options.map((option, index) => (
                <div className="row" key={index}>
                  <div className="col-xs-7">
                    <RadioButton checked={this.state.selectedRadioSavedCardsInfoValue === option.value} displayName={option.displayName} id={option.id} value={option.value} name="savedCardInfo" radioCssClass={'radio selectCard'} subDetailsHTML={option.subDetailsHTML} onChangeFunction={this.handleRadioSelected} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          : null}
      </div>
    )
  }

}