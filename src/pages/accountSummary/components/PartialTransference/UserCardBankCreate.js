import React from 'react';
import _ from 'lodash';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import TextInput from '../../../../lib/ZUILib/TextInput';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab';
import { deleteBankOrCardDetails } from '../../requests';
import commonUtil from '../../../../utils/commonUtil';

export default class UserCardBankCreate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      transferenceData: this.props.transferenceData.transferenceOptions,

      selectedDropdownAvailableCardsInfoValue: '',
      selectedRadioSavedCardsInfoValue: '',
      isNuevaCuentaButtonDisabled: false,

      isUserHasCards: false,
      isAddBankCard: false,
      isAddBankCardDetail: false,

      cardBankAmount: '',
      accountNumber: '',
      beneficiaryName: '',

      isNuevaCuentaDisabled: false,
    };
  }

  UNSAFE_componentWillMount() {

  }

  onUserBankCardClearState = () => {
    this.setState({
      accountNumber: '',
      beneficiaryName: '',
    });
    this.props.disableContinueButton(true);
  }

  checkUpdateAmountField = (e, type) => {
    if (e) {
      const prevVal = this.state[e.target.name];
      /* eslint-disable */
      const regEx = type === 'backAmount' ? /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/ :
        type === 'accountNumber' ? new RegExp('^[0-9]+$') : type === 'beneficiaryName' ? new RegExp('^[a-zA-Z ]*$') : null;
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
  onBankAmountInputChange = (e) => {
    this.checkUpdateAmountField(e, 'backAmount');
    // const regEx = /^(?:[0-9]+(?:\.[0-9]{0,2})?)?$/;
    // this.state[e.target.name] = regEx.test(e.target.value) ? e.target.value : '';
    // this.setState({ [e.target.name]: regEx.test(e.target.value) ? e.target.value : '' });
    // this.checkUpdateAmountField(e, 'walletAmount');
    if (((this.state.cardBankAmount.length) > 0 && +this.state.cardBankAmount < +this.state.transferenceData.transferableAmount && this.props.type !== 'refund')
      || ((this.state.cardBankAmount.length) > 0 && +this.state.cardBankAmount == +this.state.transferenceData.transferableAmount && this.props.type == 'refund')) {
      if (this.state.transferenceData.savedCardsInfo && this.state.transferenceData.savedCardsInfo.length > 0) {
        this.setState({ isUserHasCards: true, isAddBankCard: false });
      } else {
        this.setState({ isUserHasCards: false, isAddBankCard: true });
      }
      if (this.state.selectedRadioSavedCardsInfoValue.length > 0) {
        this.props.disableContinueButton(false);
      } else {
        this.props.disableContinueButton(true);
      }
    } else {
      this.props.disableContinueButton(true);
      this.setState({ isUserHasCards: false, isAddBankCard: true });
    }

  }

  onAddCardInputChange = (e) => {

    if (e.target.name === 'accountNumber') {
      this.checkUpdateAmountField(e, 'accountNumber');
      // const regEx = new RegExp('^[0-9]+$');
      // this.state[e.target.name] = regEx.test(e.target.value) ? e.target.value : '';
      // this.setState({ [e.target.name]: regEx.test(e.target.value) ? e.target.value : '' });
    } else {
      const regEx = new RegExp('^[a-zA-Z ]*$');
      this.checkUpdateAmountField(e, 'beneficiaryName');
      // this.state[e.target.name] = regEx.test(e.target.value) ? e.target.value : '';
      // this.setState({ [e.target.name]: regEx.test(e.target.value) ? e.target.value : '' });
    }
    if (this.props.type === 'refund') {
      if (this.state.accountNumber.length > 0 && this.state.beneficiaryName.length > 0 && this.state.cardBankAmount.length > 0
        && +this.state.cardBankAmount == +this.state.transferenceData.transferableAmount) {
        this.props.disableContinueButton(false);
      } else {
        this.props.disableContinueButton(true);
      }
    } else {
      if (this.state.accountNumber.length > 0 && this.state.beneficiaryName.length > 0) {
        this.props.disableContinueButton(false);
      } else {
        this.props.disableContinueButton(true);
      }
    }
  }

  onEliminarButtonClick = () => {
    deleteBankOrCardDetails({ accountId: this.state.selectedRadioSavedCardsInfoValue }, (res) => {
      if (res.data) {
        const transferenceData = this.state.transferenceData;
        _.remove(transferenceData.savedCardsInfo, { accountId: this.state.selectedRadioSavedCardsInfoValue });
        this.setState({ transferenceData });
        this.props.disableContinueButton(true);
      }
    });
  }
  onNuevaCuentaClick = () => {
    this.onFormCardAmountDivClick();
    this.setState({ isNuevaCuentaDisabled: true, isAddBankCard: true });
    this.props.disableContinueButton(true);
  }
  onFormCardAmountDivClick = () => {
    this.setState({ selectedRadioSavedCardsInfoValue: '' });
    if ((this.props.type !== 'refund' && (this.state.accountNumber && this.state.accountNumber.length > 0) && (this.state.beneficiaryName && this.state.beneficiaryName.value.length > 0))
      || (this.props.type === 'refund' && (this.state.accountNumber && this.state.accountNumber.length > 0) && (this.state.beneficiaryName && this.state.beneficiaryName.length > 0))) {
      this.props.disableContinueButton(false);
    } else {
      this.props.disableContinueButton(true);
    }
  }
  handleRadioSelected = (e) => {
    this.onUserBankCardClearState();
    this.setState({ selectedRadioSavedCardsInfoValue: e.target.value });
    if ((this.state.cardBankAmount.length > 0 && +this.state.cardBankAmount < +this.state.transferenceData.transferableAmount && this.props.type !== "refund")
      || (this.state.cardBankAmount.length > 0 && +this.state.cardBankAmount == +this.state.transferenceData.transferableAmount && this.props.type === "refund")) {
      this.props.disableContinueButton(false);
    } else {
      this.props.disableContinueButton(true);
    }
  }

  onAvailableCardsInfoSelectChange = (e) => {
    this.setState({ selectedDropdownAvailableCardsInfoValue: e.target.value, isAddBankCardDetail: true, selectedRadioSavedCardsInfoValue: '' });
  }

  getFormData = () => {
    let reqParams = {};
    if (this.state.selectedRadioSavedCardsInfoValue === '') {
      const availableCardsObj = _.find(this.state.transferenceData.availableCardsInfo, { accountId: this.state.selectedDropdownAvailableCardsInfoValue });
      reqParams = {
        paymentType: availableCardsObj.accountName,
        commissionValue: availableCardsObj.commissionFee,
        cardOrBankAmount: this.state.cardBankAmount,
        number: this.state.accountNumber,
        accountName: this.state.beneficiaryName,
        totalAmount: this.state.transferenceData.transferableAmount,
      };
    } else {
      const savedCardsObj = _.find(this.state.transferenceData.savedCardsInfo, { accountId: this.state.selectedRadioSavedCardsInfoValue });
      reqParams = {
        paymentType: savedCardsObj.accountType,
        commissionValue: '',
        cardOrBankAmount: this.state.cardBankAmount,
        cardOrBankIdentifierId: this.state.selectedRadioSavedCardsInfoValue,
        totalAmount: this.state.transferenceData.transferableAmount,
        cardNumber: savedCardsObj.accountNumber,
      };
    }
    return reqParams;
  }

  render() {
    /* eslint-disable */
    const eliminarButton = (id) => {
      return (<span>
        {this.state.selectedRadioSavedCardsInfoValue === id ?
          <button onClick={this.onEliminarButtonClick} id={'eliminarButton_' + id} className="btnDelete size-Medium">Eliminar Tarjeta</button>
          : null}
      </span>);
    };

    const savedCardsInfo = {
      name: 'cardsInfo',
      options: [],
    };
    if (this.state.transferenceData && this.state.transferenceData.savedCardsInfo) {
      this.state.transferenceData.savedCardsInfo.map(card =>
        savedCardsInfo.options.push({
          id: 'radio_' + card.accountId,
          value: card.accountId,
          displayName: <span>{card.accountType}</span>,
          subDetailsHTML: <p>{card.accountNumber}</p>,
          eliminarButton: eliminarButton(card.accountId),
          selected: false,
        }),
      );
    }

    const availableCardsInfo = {
      id: 'availableCardsInfoDropdown',
      optionCaption: 'Selecciona el banco de destino',
      optionText: 'labelResourceId',
      optionValue: 'value',
      options: [],
    };
    if (this.state.transferenceData && this.state.transferenceData.availableCardsInfo) {
      this.state.transferenceData.availableCardsInfo.map((card) => {
        availableCardsInfo.options.push({
          value: card.accountId,
          // labelResourceId: card.accountName,
          labelResourceId: +card.commissionFee !== 0 ? card.accountName + ' ' + '(' + card.commissionFee + '%' + ' ' + 'comisión' + ')' :
            wallet.card + ' ' + '(' + 'Sin' + ' ' + 'comisión' + ')',
        });
      });
    }
    /* eslint-enable */

    return (
      <div id="option2 display-block">
        <div className="row" >
          <div className="col-xs-4">
            <div className="formBlock">
              <TextInput
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                label="Ingresa cantidad a retirar"
                star="*"
                required="required"
                maxlength="10"
                name="cardBankAmount"
                onChange={this.onBankAmountInputChange}
                inputValue={this.state.cardBankAmount}
              />
              <p className="copyright">Sr cobrará comisión por depósito a cuenta bancaria o tarjeta</p>
            </div>
          </div>
          <div className="col-xs-4 offset-xs-4">
            <i className="fa fa-question-circle-o" aria-hidden="true" /><small>&nbsp;Disponible para retiro</small>
            <div className="quantityBlock">
              <strong className="quantity">{commonUtil.getCurrency(this.state.transferenceData.transferableAmount)}</strong>
            </div>
          </div>
        </div>
        {this.state.isUserHasCards ?
          <div className="row display-block" id="blockAccount">
            <div className="col-xs-7">
              <div>
                <span className="titleForm">Selecciona la cuenta o tarjeta</span>
                {savedCardsInfo.options.map((option, index) => (
                  <div className="radio_group" key={index}>
                    <RadioButton checked={this.state.selectedRadioSavedCardsInfoValue === option.value} displayName={option.displayName} id={option.id} value={option.value} name="savedCardsInfo" radioCssClass={'radio selectCard'} subDetailsHTML={option.subDetailsHTML} onChangeFunction={this.handleRadioSelected} />
                    {option.eliminarButton}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-2 display-block" id="blockAddAccounts">
              <button onClick={this.onNuevaCuentaClick} className={'btnSecondarySpecial size-Medium' + (this.state.isNuevaCuentaDisabled ? ' ' : 'btnPrimaryDisable')} disabled={this.state.isNuevaCuentaDisabled}>Nueva cuenta / tarjeta</button>
            </div>
          </div>
          : null}
        {this.state.isAddBankCard ?
          <div className="row display-block" id="blockNewAccount" >
            <div className="col-xs-4 offset-xs-8" onClick={this.onFormCardAmountDivClick}>
              <SelectionTab
                classname="cSelect required"
                id={availableCardsInfo.id}
                options={availableCardsInfo.options}
                optionCaption={availableCardsInfo.optionCaption}
                optionText={availableCardsInfo.optionText}
                optionValue={availableCardsInfo.optionValue}
                onChange={this.onAvailableCardsInfoSelectChange}
              />
              {this.state.isAddBankCardDetail ?
                <div>
                  <div className="formBlock">
                    <TextInput
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      label="Número de cuenta"
                      required="required"
                      star="*"
                      maxlength="16"
                      onChange={this.onAddCardInputChange}
                      name="accountNumber"
                      inputValue={this.state.accountNumber}
                    />
                  </div>
                  <div className="formBlock">
                    <TextInput
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      label="Nombre del beneficiario"
                      required="required"
                      star="*"
                      onChange={this.onAddCardInputChange}
                      name="beneficiaryName"
                      inputValue={this.state.beneficiaryName}
                    />
                  </div>
                </div>
                : null}
            </div>
          </div>
          : null}
      </div>
    );
  }

}
