import React from 'react';
import TextInput from '../../../../lib/ZUILib/TextInput';
import commonUtil from '../../../../utils/commonUtil';

export default class ClosureUserCardBankCreate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      transferenceData: this.props.transferenceData && this.props.transferenceData.transferenceOptions,
      transferableAmount: (+this.props.transferenceData.transferenceOptions.transferableAmount),
      walletAmount: (+this.props.transferenceData.transferenceOptions.transferableAmount),
      bonusAmount: (+this.props.transferenceData.transferenceOptions.bonusAmount),
      cardBankAmount: 0.00,
    };
  }

  onUserBankCardClearState = () => {
    this.props.disableContinueButton(true);
  }
  onAmountInputChange = (e) => {
    // const actualAmount = this.state.transferableAmount;
    const oppTextInput = e.target.name === 'cardBankAmount' ? 'walletAmount' : 'cardBankAmount';
    const adjustedValue = this.state.transferableAmount - (+e.target.value);
    if (e.target.name === 'cardBankAmount') {
      if (e.target.value <= this.state.walletAmount) {
        const bounusValueDeduction = this.state.transferenceData.bonusAmount - ((e.target.value * this.state.transferenceData.bonusPercentage) / 100);
        this.setState({
          bonusAmount: (Math.round(bounusValueDeduction * 100) / 100),
        });
      }
    } else if (e.target.name === 'walletAmount' && (e.target.value === '0' || e.target.value === '')) {
      const bounusValueDeduction = this.state.transferenceData.bonusAmount - ((this.state.transferableAmount * this.state.transferenceData.bonusPercentage) / 100);
      this.setState({
        bonusAmount: (Math.round(bounusValueDeduction * 100) / 100),
      });
    } else {
      const bounusValueDeduction = this.state.transferenceData.bonusAmount - ((this.state.cardBankAmount * this.state.transferenceData.bonusPercentage) / 100);
      this.setState({
        bonusAmount: (Math.round(bounusValueDeduction * 100) / 100),
      });
    }

    if (adjustedValue > 0) {
      this.props.disableContinueButton(false);
      this.setState({
        // [e.target.name]: regEx.test(e.target.value) ? +e.target.value : 0,
        [e.target.name]: (Math.round(+e.target.value * 100) / 100),
        [oppTextInput]: (Math.round(adjustedValue * 100) / 100),
      });
    } else {
      this.props.disableContinueButton(true);
    }
  }

  getFormData = () => {
    let reqParams = {};
    reqParams = {
      cardOrBankAmount: this.state.cardBankAmount.toString(),
      walletOrEmployeeCardAmount: this.state.walletAmount.toString(),
      bonusAmount: this.state.bonusAmount.toString(),
      totalAmount: Math.round(this.state.cardBankAmount + this.state.walletAmount + this.state.bonusAmount).toString(),
      paymentMode: '4',
    };
    return reqParams;
  }

  render() {
    return (
      <div>
        <div className="stepTwoOption" id="optionTwo" style={{ display: 'block' }}>
          <div className="row show-grid-row">
            <div className="col-xs-12 nph">
              <p>{commonUtil.getLabel(this.props.labels, 'eventClosure.closure.label4')}</p>
            </div>
          </div>
          <div className="row show-grid-row">
            <div className="col-xs-3 nph">
              <span className="titleInfoDetail">cantidad a cuenta bancaria o tarjeta</span>
              <TextInput
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                label="cantidad a cuenta bancaria o tarjeta"
                required="required"
                maxlength="10"
                name="cardBankAmount"
                onChange={this.onAmountInputChange}
                inputValue={this.state.cardBankAmount}
              />
              <p className="messageDetail">{commonUtil.getLabel(this.props.labels, 'eventClosure.combinado.bancariaotarjeta.title')}</p>
            </div>
            <div className="col-xs-2 nph">
              <span className="titleInfoDetail">cantidad a monedero</span>
              <TextInput
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                label="cantidad a monedero"
                required="required"
                maxlength="10"
                name="walletAmount"
                onChange={this.onAmountInputChange}
                inputValue={this.state.walletAmount}
              />
            </div>
            <div className="col-xs-1 nph centered"><span className="signoDetail">+</span></div>
            <div className="col-xs-2 nph"><span className="titleInfoDetail">Bono total</span><span className="qtyDetail">{commonUtil.getCurrency(this.state.bonusAmount)}</span></div>
            <div className="col-xs-1 nph centered"><span className="signoDetail">=</span></div>
            <div className="col-xs-3"><span className="titleInfoDetail">Total</span><span className="qtyDetail">{commonUtil.getCurrency(Math.round(this.state.cardBankAmount + this.state.walletAmount + this.state.bonusAmount))}</span></div>
          </div>
        </div>
      </div>
    );
  }

}
