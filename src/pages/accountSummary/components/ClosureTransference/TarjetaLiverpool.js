import React, { Component } from 'react';
import _ from 'lodash';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import TextInput from '../../../../lib/ZUILib/TextInput';
import commonUtil from '../../../../utils/commonUtil';

export default class ClosureTarjetaLiverpool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tarjetaWalletAmount: '',
      isEmployeeHasCards: true,
      transferenceData: this.props.transferenceData,
      selectedRadioSavedCardsInfoValue: '',
      walletNumber: '',
    };
  }

  UNSAFE_componentWillMount() {
    if (this.state.transferenceData.employeeCardInfo && this.state.transferenceData.employeeCardInfo.length === 1) {
      this.props.disableContinueButton(false);
    }
  }
  handleRadioSelected = (e) => {
    this.setState({ selectedRadioSavedCardsInfoValue: e.target.value });
    this.props.disableContinueButton(false);
  }
  checkUpdateAmountField = (e) => {
    if (e) {
      const prevVal = this.state[e.target.name];
      /* eslint-disable */
      const regEx = new RegExp('^[0-9]*$');
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
  onWalletNumberChange = (e) => {
    this.checkUpdateAmountField(e);
    // const regEx = new RegExp('^[0-9]+$');
    // this.state[e.target.name] = regEx.test(e.target.value) ? e.target.value : '';
    // this.setState({ [e.target.name]: regEx.test(e.target.value) ? e.target.value : '' });
    if (this.state.walletNumber.length > 0) {
      this.props.disableContinueButton(false);
    } else {
      this.props.disableContinueButton(true);
    }
  }

  getFormData = () => {
    let reqParams = {};
    reqParams = {
      walletOrEmployeeCardAmount: this.state.transferenceData.transferenceOptions.transferableAmount,
      totalAmount: this.state.transferenceData.transferenceOptions.transferableAmount,
      bonusAmount: this.state.transferenceData.transferenceOptions.bonusAmount,
      bonusPercentage: this.state.transferenceData.transferenceOptions.bonusPercentage,
    };
    if (this.state.transferenceData && this.state.transferenceData.employeeCardInfo) {
      const selectedSavedCardsInfoObj = _.find(this.state.transferenceData.employeeCardInfo, { accountId: this.state.selectedRadioSavedCardsInfoValue });
      reqParams = {
        ...reqParams,
        walletType: selectedSavedCardsInfoObj.accountName,
        walletOrEmployeeIdentifierId: selectedSavedCardsInfoObj.accountId,
        accountHolderName: selectedSavedCardsInfoObj.accountHolderName,
        accountNumber: selectedSavedCardsInfoObj.accountNumber,
      };
    } else if (this.state.transferenceData.transferenceOptions && this.state.transferenceData.transferenceOptions.availableWalletsInfo) {
      const selectedDropdownAvailableWalletsInfoObj = this.state.transferenceData.transferenceOptions.availableWalletsInfo[0];
      reqParams = {
        ...reqParams,
        walletType: selectedDropdownAvailableWalletsInfoObj.accountName,
        walletNumber: this.state.walletNumber,
      };
    }
    return reqParams;
  }
  render() {
    const employeeCardInfo = {
      name: 'cardsInfo',
      options: [],
    };
    let isAvailableWalletsInfo = false;
    if (this.state.transferenceData && this.state.transferenceData.employeeCardInfo) {
      this.state.transferenceData.employeeCardInfo.map(card =>
        employeeCardInfo.options.push({
          id: 'radio_' + card.accountNumber,
          value: card.accountId,
          displayName: <span>{card.accountName}</span>,
          subDetailsHTML: <p>{card.accountNumber}</p>,
          selected: false,
        }),
      );
    } else if (this.state.transferenceData.transferenceOptions && this.state.transferenceData.transferenceOptions.availableWalletsInfo) {
      isAvailableWalletsInfo = true;
    }
    if (employeeCardInfo.options.length === 1 && this.state.selectedRadioSavedCardsInfoValue === '') {
      this.state.selectedRadioSavedCardsInfoValue = employeeCardInfo.options[0].value;
    }
    return (
      <div id="option1">
        <div className="stepTwoOption display-block">
          {employeeCardInfo.options.length > 1 ?
            <div className="row show-grid-row">
              <div className="col-xs-7">
                {/* <span className="titleForm">Selecciona la cuenta o tarjeta</span> */}
                {employeeCardInfo.options.map((option, index) => (
                  <div className="row" key={index}>
                    <div className="col-xs-7">
                      <RadioButton checked={this.state.selectedRadioSavedCardsInfoValue === option.value} displayName={option.displayName} id={option.id} value={option.value} name="savedCardInfo" radioCssClass={'radio selectCard'} subDetailsHTML={option.subDetailsHTML} onChangeFunction={this.handleRadioSelected} />
                    </div>
                  </div>
                ))}
              </div>
            </div> : null}
          {isAvailableWalletsInfo ?
            <div className="stepTwoOption display-block">
              <div className="row show-grid-row">
                <div className="col-xs-4">
                  <TextInput
                    className="inputMaterial"
                    labelClassName="placeHolderMaterial"
                    onChange={this.onWalletNumberChange}
                    maxlength={13}
                    name="walletNumber"
                    label="Número de monedero"
                    inputValue={this.state.walletNumber}
                  />
                  <p className="copyright">Sin comisión por depósito a monedero</p>
                </div>
              </div>
            </div>
            : null}
          <div className="stepTwoOption display-block" id="optionTwo">
            <div className="row show-grid-row">
              <div className="col-xs-2 nph">
                <i className="iClass icon-ayuda tooltip-container">
                  <span className="tooltip-box">{commonUtil.getLabel(this.props.labels, 'eventClosure.tarjetaLiverpool.tooltip')}</span>
                </i>&nbsp;&nbsp;<span className="text">Disponible para cierre</span>
                <span className="qtyDetail">{commonUtil.getCurrency(this.state.transferenceData.transferenceOptions.transferableAmount)}</span>

                {this.state.transferenceData && this.state.transferenceData.employeeCardInfo && this.state.transferenceData.employeeCardInfo.length === 1 && +this.state.transferenceData.transferenceOptions.bonusAmount <= 0 ?
                  <div >
                    <span className="messageDetail">{this.state.transferenceData.employeeCardInfo[0].accountName} {this.state.transferenceData.employeeCardInfo[0].accountHolderName}</span>
                    <p className="messageDetail">{this.state.transferenceData.employeeCardInfo[0].accountNumber}</p>
                  </div>
                  : null}
              </div>

              {+this.state.transferenceData.transferenceOptions.bonusAmount !== 0 ?
                <div>
                  <div className="col-xs-1 nph centered"><span className="signoDetail">+</span></div>
                  <div className="col-xs-2 nph">
                    <i className="iClass icon-ayuda tooltip-container">
                      <span className="tooltip-box">{this.state.transferenceData.transferenceOptions.bonusAmount}% {commonUtil.getLabel(this.props.labels, 'eventClosure.tarjetaLiverpool.bonusStatement')}</span>
                    </i>&nbsp;&nbsp;<span className="text">Bono total</span>
                    <span className="qtyDetail">{commonUtil.getCurrency(this.state.transferenceData.transferenceOptions.bonusAmount)}</span>
                    <p className="messageDetail">máximo a recibir {commonUtil.getCurrency(this.state.transferenceData.transferenceOptions.maxEligibleBonusAmount)}</p></div>
                  <div className="col-xs-1 nph centered"><span className="signoDetail">=</span></div>
                  <div className="col-xs-3"><span className="titleInfoDetail">Total</span><span className="qtyDetail">{commonUtil.getCurrency(+this.state.transferenceData.transferenceOptions.transferableAmount + +this.state.transferenceData.transferenceOptions.bonusAmount)}</span>
                    {this.state.transferenceData.employeeCardInfo && this.state.transferenceData.employeeCardInfo.length === 1 ?
                      <React.Fragment>
                        <span className="messageDetail">{this.state.transferenceData.employeeCardInfo[0].accountName} {this.state.transferenceData.employeeCardInfo[0].accountHolderName}</span>
                        <p className="messageDetail">{this.state.transferenceData.employeeCardInfo[0].accountNumber}</p>
                      </React.Fragment> : null}
                  </div>
                </div>
                : null}
            </div>
          </div>
        </div>
      </div >);
  }
}
