import React, { Component } from 'react';
import _ from 'lodash';
import TextInput from '../../../../lib/ZUILib/TextInput';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab';
import commonUtil from '../../../../utils/commonUtil';
import { getEwalletInfo, deleteBankOrCardDetails } from '../../requests';


export default class ClosureMonedero extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transferenceData: this.props.transferenceData.transferenceOptions,

      selectedDropdownAvailableWalletsInfoValue: '',
      selectedDropdownAvailableWalletsInfoText: '',

      selectedRadioSavedWalletsInfoValue: '',

      walletNumber_mmdr: '',

      walletNumber_mltpc: '',
      beneficiaryName_mltpc: '',

      isUserHasWallet: false,
      isMonederoMesadeRegalos: false,
      isMonederoElectronico: false,
      isMonederoLiverpool_TarjetaPremiumCard: false,
      isMonederoLiverpool_TarjetaPremiumCard_New: false,

      isNuevaCuentaDisabled: false,
      walletStatus: false,
      eWalletNumber: '',
      walleterrorMessage: '',

    };
  }
  UNSAFE_componentWillMount() {
    if (this.state.transferenceData.savedWalletsInfo && this.state.transferenceData.savedWalletsInfo.length > 0) {
      this.setState({ isUserHasWallet: true });
    } else {
      this.setState({ isUserHasWallet: false });
    }
  }

  getEwalletInformation = () => {
    if (!this.state.walletStatus) {
      const userObj = _.find(this.props.eventDetailsInfo.celebrityInfo, { iscoOwner: 'false' });
      let profileId = '';
      if (userObj) {
        profileId = userObj.profileId;
        // profileId = '587570807';
      }
      getEwalletInfo({ profileId }, (res) => {
        if (res.data) {
          this.setState({ walletStatus: true, eWalletNumber: res.data.eWalletAccountNum });
        } else {
          this.setState({ walleterrorMessage: res.data });
        }
      });
    }
  }
  checkUpdateAmountField = (e, type) => {
    if (e) {
      const prevVal = this.state[e.target.name];
      /* eslint-disable */
      const regEx = type === 'walletNumber' ? new RegExp('^[0-9]*$') : type === 'beneficiaryName' ? new RegExp('^[a-zA-Z ]*$') : null;
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
  onMonederoClearState = () => {
    this.setState({
      walletNumber_mmdr: '',
      walletNumber_mltpc: '',
      beneficiaryName_mltpc: '',
    });
    this.props.disableContinueButton(true);
  }
  onMonederoInfoSelectChange = (e) => {
    this.onMonederoClearState();
    const selectedText = e.target.options[e.target.selectedIndex].text.toLowerCase();
    this.setState({ selectedDropdownAvailableWalletsInfoValue: e.target.value, selectedDropdownAvailableWalletsInfoText: selectedText });
    if (selectedText.indexOf('monedero mesa de regalos') > -1) {
      this.setState({ isMonederoMesadeRegalos: true, isMonederoElectronico: false, isMonederoLiverpool_TarjetaPremiumCard: false });
    } else if (selectedText.indexOf('monedero electronico (e-wallet)') > -1) {
      this.getEwalletInformation();
      this.setState({ isMonederoMesadeRegalos: false, isMonederoElectronico: true, isMonederoLiverpool_TarjetaPremiumCard: false });
    } else if (selectedText.indexOf('monedero liverpool premium card') > -1 || selectedText.indexOf('monedero tarjeta liverpool') > -1) {
      this.setState({ isMonederoMesadeRegalos: false, isMonederoElectronico: false, isMonederoLiverpool_TarjetaPremiumCard: true });
    }

    this.setState({ selectedRadioSavedWalletsInfoValue: '' });
  }
  onWalletAmountNumberChange = (e) => {
    this.checkUpdateAmountField(e, 'walletNumber');
    // const regEx = new RegExp('^[0-9]+$');
    // this.state[e.target.name] = regEx.test(e.target.value) ? e.target.value : '';
    // this.setState({ [e.target.name]: regEx.test(e.target.value) ? e.target.value : '' });
    if (this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero mesa de regalos') > -1) {
      if (this.state.walletNumber_mmdr.length > 0) {
        this.props.disableContinueButton(false);
      } else {
        this.props.disableContinueButton(true);
      }
    } else if (this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero electronico (e-wallet)') > -1) {
      if (true) {
        this.props.disableContinueButton(false);
      }
    } else if (this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero liverpool premium card') > -1 || this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero tarjeta liverpool') > -1) {
      if (this.state.isUserHasWallet) {
        if (this.state.selectedRadioSavedWalletsInfoValue === '') {
          if (this.state.walletNumber_mltpc && this.state.walletNumber_mltpc.length > 0 && this.state.beneficiaryName_mltpc && this.state.beneficiaryName_mltpc.length > 0) {
            this.props.disableContinueButton(false);
          } else {
            this.props.disableContinueButton(true);
          }
        } else if (this.state.walletAmount_mltpc.length > 0 && +this.state.walletAmount_mltpc < +this.state.transferenceData.transferableAmount) {
          this.props.disableContinueButton(false);
        } else {
          this.props.disableContinueButton(true);
        }
      } else if (this.state.walletNumber_mltpc.length > 0 && this.state.beneficiaryName_mltpc.length > 0) {
        this.props.disableContinueButton(false);
      } else {
        this.props.disableContinueButton(true);
      }
    }
  }

  onBeneficiaryNameChange = (e) => {
    this.checkUpdateAmountField(e, 'beneficiaryName');
    // const regEx = new RegExp('^[a-zA-Z ]*$');
    // this.state[e.target.name] = regEx.test(e.target.value) ? e.target.value : '';
    // this.setState({ [e.target.name]: regEx.test(e.target.value) ? e.target.value : '' });
    if (this.state.walletNumber_mltpc && this.state.walletNumber_mltpc.length > 0 && this.state.beneficiaryName_mltpc && this.state.beneficiaryName_mltpc.length > 0) {
      this.props.disableContinueButton(false);
    } else {
      this.props.disableContinueButton(true);
    }
  }

  handleRadioSelected = (e) => {
    this.setState({ selectedRadioSavedWalletsInfoValue: e.target.value });
    if (e.target.value !== '') {
      this.props.disableContinueButton(false);
    } else {
      this.props.disableContinueButton(true);
    }
  }

  onNuevaCuentaClick = () => {
    this.setState({ selectedRadioSavedWalletsInfoValue: '' });
    this.setState({ isNuevaCuentaDisabled: true, isMonederoLiverpool_TarjetaPremiumCard_New: true });
    this.props.disableContinueButton(true);
  }

  onUserDoesNotHasWalletFormClick = () => {
    this.setState({ selectedRadioSavedWalletsInfoValue: '' });
  }
  onEliminarButtonClick = () => {
    deleteBankOrCardDetails({ accountId: this.state.selectedRadioSavedWalletsInfoValue }, (res) => {
      if (res.data) {
        const transferenceData = this.state.transferenceData;
        _.remove(transferenceData.savedWalletsInfo, { accountId: this.state.selectedRadioSavedWalletsInfoValue });
        this.setState({ transferenceData });
        this.props.disableContinueButton(true);
      }
    });
  }
  getFormData = () => {
    let reqParams = {};
    const accountName = _.find(this.state.transferenceData.availableWalletsInfo, { accountId: this.state.selectedDropdownAvailableWalletsInfoValue }).accountName;
    if (this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero mesa de regalos') > -1) {
      reqParams = {
        walletType: accountName,
        walletNumber: this.state.walletNumber_mmdr,
        walletOrEmployeeCardAmount: this.state.transferenceData.transferableAmount,
        bonusAmount: this.state.transferenceData.bonusAmount,
        bonusPercentage: this.state.transferenceData.bonusPercentage,
      };
    } else if (this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero electronico (e-wallet)') > -1) {
      reqParams = {
        walletType: accountName,
        walletNumber: this.state.eWalletNumber ? this.state.eWalletNumber : '',
        walletOrEmployeeCardAmount: this.state.transferenceData.transferableAmount,
        bonusAmount: this.state.transferenceData.bonusAmount,
        bonusPercentage: this.state.transferenceData.bonusPercentage,
      };
    } else if (this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero liverpool premium card') > -1 || this.state.selectedDropdownAvailableWalletsInfoText.indexOf('monedero tarjeta liverpool') > -1) {
      if (this.state.selectedRadioSavedWalletsInfoValue === '') {
        reqParams = {
          walletType: accountName,
          walletNumber: this.state.walletNumber_mltpc,
          walletHolderName: this.state.beneficiaryName_mltpc,
          walletOrEmployeeCardAmount: this.state.transferenceData.transferableAmount,
          bonusAmount: this.state.transferenceData.bonusAmount,
          bonusPercentage: this.state.transferenceData.bonusPercentage,
        };
      } else {
        reqParams = {
          walletType: accountName,
          walletOrEmployeeIdentifierId: this.state.selectedRadioSavedWalletsInfoValue,
          accountNumber: _.find(this.state.transferenceData.savedWalletsInfo, { accountId: this.state.selectedRadioSavedWalletsInfoValue }).accountNumber,
          walletOrEmployeeCardAmount: this.state.transferenceData.transferableAmount,
          bonusAmount: this.state.transferenceData.bonusAmount,
          bonusPercentage: this.state.transferenceData.bonusPercentage,
        };
      }
    }
    return reqParams;
  }

  render() {
    const eliminarButton = id => (<span>
      {this.state.selectedRadioSavedWalletsInfoValue === id ?
        <button onClick={this.onEliminarButtonClick} id={'eliminarButton_' + id} className="btnDelete size-Medium">Eliminar Tarjeta</button>
        : null}
    </span>);
    const availableWalletsInfo = {
      id: 'availableWalletsInfo',
      optionCaption: 'Selecciona monedero',
      optionText: 'labelResourceId',
      optionValue: 'value',
      options: [],
    };
    /* eslint-disable */
    this.state.transferenceData.availableWalletsInfo.map((wallet) => {
      availableWalletsInfo.options.push({
        value: wallet.accountId,
        labelResourceId: +wallet.commissionFee !== 0 ? wallet.accountName + ' ' + '(' + wallet.commissionFee + '%' + ' ' + 'comisión' + ')' :
          wallet.accountName + ' ' + '(' + 'Sin' + ' ' + 'comisión' + ')',
      });
    });
    /* eslint-enable */

    const savedWalletsInfo = {
      name: 'savedWalletsInfo',
      options: [],
    };
    if (this.state.transferenceData && this.state.transferenceData.savedWalletsInfo) {
      this.state.transferenceData.savedWalletsInfo.map(wallet =>
        savedWalletsInfo.options.push({
          id: 'radio_' + wallet.accountId,
          value: wallet.accountId,
          displayName: <span>{wallet.accountType}</span>,
          subDetailsHTML: <p>{wallet.accountNumber}</p>,
          selected: false,
          eliminarButton: eliminarButton(wallet.accountId),
        }),
      );
    }

    const userHasWallet = (
      <div>
        <div className="line"><hr /></div>
        <div className="row">
          <div className="chooseWalletOption">
            <p>Selecciona cuenta o tarjeta</p>
            <button onClick={this.onNuevaCuentaClick} className={'mr15 btnSecondarySpecial size-Medium' + (this.state.isNuevaCuentaDisabled ? ' btnSecondaryDisable' : '')} disabled={this.state.isNuevaCuentaDisabled ? 'disabled' : ''}>Nueva Cuenta / Tarjeta</button>
          </div>
          <div className="monedero-savedwallets-options mb15">
            {savedWalletsInfo.options.map((option, index) => (
              <div key={index} className="row">
                <div className="col-xs-4">
                  <RadioButton checked={this.state.selectedRadioSavedWalletsInfoValue === option.value} displayName={option.displayName} id={option.id} value={option.value} name="savedWalletsInfo" radioCssClass={'radio selectCard'} subDetailsHTML={option.subDetailsHTML} onChangeFunction={e => this.handleRadioSelected(e)} />
                </div>
                <div className="col-xs-4">
                  {option.eliminarButton}
                </div>
              </div>
            ))}
          </div>
          {this.state.isMonederoLiverpool_TarjetaPremiumCard_New ?
            <div onClick={this.onUserDoesNotHasWalletFormClick}>
              <div className="row show-grid-row">
                <div className="col-xs-4">
                  <TextInput
                    className="inputMaterial"
                    labelClassName="placeHolderMaterial"
                    onChange={this.onWalletAmountNumberChange}
                    name="walletNumber_mltpc"
                    label="Número de Monedero"
                    maxlength="16"
                    star="*"
                    inputValue={this.state.walletNumber_mltpc}
                  />
                </div>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-4">
                  <TextInput
                    className="inputMaterial"
                    labelClassName="placeHolderMaterial"
                    onChange={this.onBeneficiaryNameChange}
                    name="beneficiaryName_mltpc"
                    maxlength="100"
                    label="Nombre del beneficiario"
                    inputValue={this.state.beneficiaryName_mltpc}
                  />
                </div>
              </div>
            </div>
            : null}
        </div>
      </div >
    );

    return (
      <div id="option1">
        <div className="stepOneOption display-block">
          <div className="row show-grid-row">
            <div className="col-xs-4">
              <SelectionTab
                classname="cSelect required"
                id={availableWalletsInfo.id}
                options={availableWalletsInfo.options}
                optionCaption={availableWalletsInfo.optionCaption}
                optionText={availableWalletsInfo.optionText}
                optionValue={availableWalletsInfo.optionValue}
                onChange={this.onMonederoInfoSelectChange}
              />
            </div>
          </div>
        </div>
        {this.state.isMonederoMesadeRegalos ?
          <div className="stepTwoOption display-block">
            <div className="row show-grid-row">
              <div className="col-xs-4">
                <TextInput
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  onChange={this.onWalletAmountNumberChange}
                  maxlength={13}
                  name="walletNumber_mmdr"
                  label="Número de monedero"
                  inputValue={this.state.walletNumber_mmdr}
                />
                <p className="copyright">Sin comisión por depósito a monedero</p>
              </div>
            </div>
          </div> : null}
        {this.state.isMonederoLiverpool_TarjetaPremiumCard ?
          <div className="stepTwoOption display-block">
            {this.state.isUserHasWallet ?
              userHasWallet
              :
              <div>
                <div className="row show-grid-row">
                  <div className="col-xs-4">
                    <TextInput
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      onChange={this.onWalletAmountNumberChange}
                      name="walletNumber_mltpc"
                      maxlength={16}
                      label="Número de cuenta"
                      inputValue={this.state.walletNumber_mltpc}
                    />
                  </div>
                </div>
                <div className="row show-grid-row">
                  <div className="col-xs-4">
                    <TextInput
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      onChange={this.onBeneficiaryNameChange}
                      name="beneficiaryName_mltpc"
                      label="Nombre del beneficiario"
                      maxlength={255}
                      inputValue={this.state.beneficiaryName_mltpc}
                    />
                  </div>
                </div>
              </div>}

          </div> : null}

        {!this.props.transferenceMethodTypeClosure &&
          <div className="stepTwoOption display-block" id="optionTwo">
            <div className="row show-grid-row">
              <div className="col-xs-2 nph">
                <i className="iClass icon-ayuda tooltip-container">
                  <span className="tooltip-box">{commonUtil.getLabel(this.props.labels, 'eventClosure.tarjetaLiverpool.tooltip')}</span>
                </i>&nbsp;&nbsp;<span className="text">Disponible para cierre</span>
                <span className="qtyDetail">{commonUtil.getCurrency(this.state.transferenceData.transferableAmount)}</span></div>
              <div className="col-xs-1 nph centered"><span className="signoDetail">+</span></div>
              <div className="col-xs-2 nph">
                <i className="iClass icon-ayuda tooltip-container">
                  <span className="tooltip-box">{this.state.transferenceData.bonusPercentage}% {commonUtil.getLabel(this.props.labels, 'eventClosure.tarjetaLiverpool.bonusStatement')}</span>
                </i>&nbsp;&nbsp;<span className="text">Bono total</span>
                <span className="qtyDetail">{commonUtil.getCurrency(this.state.transferenceData.bonusAmount)}</span></div>
              <div className="col-xs-1 nph centered"><span className="signoDetail">=</span></div>
              <div className="col-xs-3"><span className="titleInfoDetail">Total</span><span className="qtyDetail">{commonUtil.getCurrency(+this.state.transferenceData.transferableAmount + +this.state.transferenceData.bonusAmount)}</span>
                {/* <p className="messageDetail">No cuentas con un monedero electrónico , te será generado uno al confirmar tu retiro</p> */}
              </div>
            </div>
          </div>}
      </div>
    );
  }
}
