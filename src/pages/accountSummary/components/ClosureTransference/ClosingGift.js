import React from 'react';
import RadioButton from '../../../../lib/ZUILib/RadioButton';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab';
import commonUtil from '../../../../utils/commonUtil';
import { getOpeningOrClosingGiftDetailsForEvent, getEventDeliveryAddresses } from '../../requests';

export default class ClosingGift extends React.Component {
  constructor(props) {
    super(props);
    this.eventId = this.props.eventId;
    this.state = {
      closingGiftDetailsData: null,
      deliveryAddressInfo: null,
      selectedRadioAddressPreferenceValue: 'store',
    };
    this.selectedDropdownAddressInfoValue = '';
    this.selectedDropdownAddressInfoName = '';
    this.giftDeliveryAddressPreference = [
      { name: 'Entrega a Domicilio', code: 'home' },
      { name: 'Entrega en Tienda', code: 'store' },
    ];
    this.skus = [];
    this.giftNames = '';
  }

  componentWillMount() {
    // 300005007
    getOpeningOrClosingGiftDetailsForEvent({ eventId: this.eventId, type: 'closing' }, (res) => {
      if (res.data) {
        this.setState({ closingGiftDetailsData: res.data.openingGiftDetailsForEventInfo });
      }
    });
    getEventDeliveryAddresses({ eventId: this.eventId }, (res) => {
      if (res.data) {
        this.setState({ deliveryAddressInfo: res.data.deliveryAddressInfo });
      }
    });
  }

  handleRadioSelected = (e) => {
    this.setState({ selectedRadioAddressPreferenceValue: e.target.value });
    this.selectedDropdownAddressInfoValue = '';
  }

  onAddressInfoSelectChange = (e) => {
    this.selectedDropdownAddressInfoValue = e.target.value;
    this.selectedDropdownAddressInfoName = e.nativeEvent.target.text;
  }
  getFormData = () => {
    let reqParams = {
      selectedStoreOption: this.state.selectedRadioAddressPreferenceValue === 'store' ? 'true' : 'false',
      skus: this.skus,
      skusNames: this.giftNames,
      selectedAddressId: null,
      selectedAddressName: null,
    };
    if (this.state.selectedRadioAddressPreferenceValue === 'home') {
      reqParams = {
        ...reqParams,
        selectedAddressId: this.selectedDropdownAddressInfoValue,
        selectedAddressName: this.selectedDropdownAddressInfoName,
      };
    }
    return reqParams;
  }
  render() {
    // console.log('closingGiftDetailsData', this.props.closingGiftDetailsData);
    const { closingGiftDetailsData, deliveryAddressInfo } = this.state;
    const deliveryAddressInfoDropdown = {
      id: 'giftDeliveryAddressDropdown',
      optionText: 'labelResourceId',
      optionValue: 'value',
      options: [],
    };

    if (deliveryAddressInfo && deliveryAddressInfo.addresses) {
      deliveryAddressInfo.addresses.forEach((address) => {
        deliveryAddressInfoDropdown.options.push({
          value: address.addressId,
          labelResourceId: address.nickName,
        });
      });
      if (deliveryAddressInfo.addresses.length) {
        this.selectedDropdownAddressInfoValue = deliveryAddressInfo.addresses[0].addressId;
        this.selectedDropdownAddressInfoName = deliveryAddressInfo.addresses[0].nickName;
      }
    }

    if (closingGiftDetailsData && closingGiftDetailsData.skuInfo) {
      this.skus = [];
      this.giftNames = '';
      closingGiftDetailsData.skuInfo.forEach((gift) => {
        this.skus.push(gift.skuId);
        this.giftNames += gift.skuName + ', ';
      });
      if (this.giftNames.length) {
        this.giftNames = this.giftNames.substring(0, this.giftNames.length - 2);
      }
    }

    return (
      <div id="giftListOption2">
        <hr />
        <div className="row show-grid-row">
          <h3>Regalo por cierre</h3>
          <p>{commonUtil.getLabel(this.props.labels, 'eventClosure.closingGift.message')}</p>
        </div>
        <div className="row show-grid-row">
          <div className="articleName"> {this.giftNames}</div>
        </div>
        <div className="row show-grid-row">
          {this.giftDeliveryAddressPreference.map((option, index) => (
            <div className="col-xs-7" key={index}>
              <RadioButton checked={this.state.selectedRadioAddressPreferenceValue === option.code} displayName={option.name} id={'radio_giftDeliveryAddressPreference_' + option.code} value={option.code} name="giftDeliveryAddressPreferences" radioCssClass={'radio'} onChangeFunction={this.handleRadioSelected} />
              {option.code === 'home' && this.state.selectedRadioAddressPreferenceValue === 'home' ?
                <div className="col-xs-7">
                  <span className="liverpoolCategorySecond">Asignar dirección de envío</span>
                  <SelectionTab
                    classname="cSelect required"
                    id={deliveryAddressInfoDropdown.id}
                    options={deliveryAddressInfoDropdown.options}
                    optionCaption={deliveryAddressInfoDropdown.optionCaption}
                    optionText={deliveryAddressInfoDropdown.optionText}
                    optionValue={deliveryAddressInfoDropdown.optionValue}
                    onChange={this.onAddressInfoSelectChange}
                  />
                </div>
                : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
