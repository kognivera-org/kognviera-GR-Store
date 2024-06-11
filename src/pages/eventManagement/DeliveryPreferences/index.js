import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManagementMenu from '../Navigation/ManagementMenu';
import PreferenceAddress from './preferenceAddress';
import CheckBox from '../../../lib/ZUILib/CheckBox';
import commonUtil from '../../../utils/commonUtil';
import * as preferredDeliveryDayActions from './action';
import Link from '../../../lib/ZUILib/Link'
import PrintDownload from '../../global/PrintDownload'

@connect(
  store => ({
    preferenceDelivery: store.preferenceDelivery,
  }),
  { ...preferredDeliveryDayActions },
)
class Preferences extends Component {
  constructor(props) {
    super(props);
    this.pageLoad = true
  }
  state = {
    preferenceDeliveryAddress: null,
    allowEditingDeliveryPreferencePreference: false,
    disableDownload: false,
  }
  addressTriedForSave = ""
  // this function is used only to undate the UI not the server

  handleNewDeliveryDayPreferences = (preference, deliveryAddress) => {
    const tempPreferenceDeliveryAddress = JSON.parse(JSON.stringify(this.state.preferenceDeliveryAddress));
    tempPreferenceDeliveryAddress.forEach((oldPreference) => {
      if (oldPreference.addressId === deliveryAddress.addressId) {
        if (oldPreference.delieveryDaysInfo.length) {
          oldPreference.delieveryDaysInfo.forEach((day) => {
            if (day.deliveryDay === preference.value) {
              day.opted = preference.checked;
            }
          })
        }
      }
    })

    this.setState({
      preferenceDeliveryAddress: tempPreferenceDeliveryAddress
    })
  }

  // this function used to update the delivery address prefernces at the database/ server level

  handleUpdateNewDeliveryDayPreference = (deliveryAddress) => {
    const eventId = !commonUtil.isObjectEmpty(this.props.params) && this.props.params.eventId;
    // DayoftheWeekForAddress
    const selectedWeekdays = [];
    const saveDayoftheWeekInfo = [];
    this.addressTriedForSave = deliveryAddress.addressId;
    deliveryAddress.delieveryDaysInfo.forEach((days) => {
      if (days.opted === true) {
        selectedWeekdays.push(days.deliveryDay)
      }
    })
    saveDayoftheWeekInfo.push({
      "addressId": deliveryAddress.addressId,
      "days": selectedWeekdays
    })
    const preferenceDeliveryAddress = this.props.preferenceDelivery.preferenceDeliveryAddress.deliveryDayAndAddressInfo.map((add) => {
      if (deliveryAddress.addressId === add.addressId) { add.delieveryDaysInfo = deliveryAddress.delieveryDaysInfo }
      return add;
    })

    this.props.saveDayoftheWeekForAddress(eventId, saveDayoftheWeekInfo, preferenceDeliveryAddress);
    this.pageLoad = true
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.preferenceDelivery && nextProps.preferenceDelivery.preferenceDeliveryAddress) {
      if (!this.state.preferenceDeliveryAddress) {
        this.setState({
          preferenceDeliveryAddress: nextProps.preferenceDelivery.preferenceDeliveryAddress.deliveryDayAndAddressInfo
        })
      }
      if (this.pageLoad) { this.handleDeliveryPreferenceCheck(nextProps.preferenceDelivery.preferenceDeliveryAddress.deliveryDayAndAddressInfo) }
    } else {
      this.setState({
        preferenceDeliveryAddress: null,
      })
    }
  }

  handleDeliveryPreferenceCheck = (deliveryDayAndAddressInfo) => {
    if (deliveryDayAndAddressInfo) {
      let hasOptedDays = false;
      const _selectedDay = deliveryDayAndAddressInfo.map((info) => {
        const days = info.delieveryDaysInfo.filter((day) => day.opted === true);
        if (days.length > 0) {
          hasOptedDays = true;
        }
      })
      if (hasOptedDays) {
        this.setState({ allowEditingDeliveryPreferencePreference: true })
      } else {
        this.setState({ allowEditingDeliveryPreferencePreference: false })
      }
    }
  }
  // this function allow to call get preferences
  handleAllowDeliveryDayPreferences = (event) => {
    const eventId = !commonUtil.isObjectEmpty(this.props.params) && this.props.params.eventId;
    const preferredDeliveryDayOpted = event.checked;
    if (event.checked) {
      this.setState({
        allowEditingDeliveryPreferencePreference: preferredDeliveryDayOpted
      })
    } else {
      this.setState({
        allowEditingDeliveryPreferencePreference: preferredDeliveryDayOpted
      })
    }
    this.props.getPreferredDeliveryDayDetails(eventId, preferredDeliveryDayOpted);
    this.pageLoad = false
  }

  clearAddressTriedForSaveData = () => {
    this.addressTriedForSave = "";
  }
  cancelNewChanges = (addressId) => {
    const tempAddresses = Object.assign([], this.props.preferenceDelivery.preferenceDeliveryAddress.deliveryDayAndAddressInfo);


    const newAddresses = Object.assign([], this.state.preferenceDeliveryAddress);

    /* eslint- dsiable*/
    tempAddresses.forEach((add) => {
      for (let i = 0; i < newAddresses.length; i++) {
        if (add.addressId === addressId && newAddresses[i].addressId === addressId) {
          newAddresses[i] = add;
        }
      }
    })
    this.setState({
      preferenceDeliveryAddress: newAddresses
    })
    /* eslint- enable*/
  }

  downloadToPDF = (param) => {
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      commonUtil.downloadPdf('.toDownload', 'deliveryPreference.pdf', 'true', '', () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      window.print()
    }
  }

  componentDidMount = () => {
    const eventId = !commonUtil.isObjectEmpty(this.props.params) && this.props.params.eventId;
    this.pageLoad = true
    this.props.getPreferredDeliveryDayDetails(eventId, true);
  }

  render() {
    const preferenceDeliveryAddress = this.state.preferenceDeliveryAddress;
    const preferenceDeliveryAddressError = this.props.preferenceDelivery.preferenceDeliveryAddressError;
    return (
      <div className="container main-container">
        <div className="row">
          <div className="col-xs-2 fill">
            <ManagementMenu params={this.props.params} />
          </div>
          <div className="col-xs-10">
            <div className="dynamicFrame eventCreationContent toPrint">
              <div className="row">
                <div className="col-xs-6">
                  <h2 className="subtitleSection">Preferencias de entrega de regalos</h2>
                  <CheckBox
                    uiname="EventPreferredSubscribe"
                    id="allowPreference"
                    name="allowPreference"
                    checked={this.state.allowEditingDeliveryPreferencePreference}
                    getSelectedValue={this.handleAllowDeliveryDayPreferences}
                    displayName="¿El usuario desea asignar días de entrega?"
                  />
                </div>
                <div className="col-xs-2 col-xs-offset-4">
                  <div className="buttonsPdf">
                    {/* <Link disabled={this.state.disableDownload} className="download" onClick={() => this.downloadToPDF('download')}><i className="iClass icon-descarga icono-grande-inline mr-15" /></Link>
                    <Link disabled={this.state.disableDownload} className="print" onClick={() => this.downloadToPDF('print')}><i className="iClass icon-imprimir icono-grande-inline" /></Link> */}
                    <PrintDownload elem='.toDownload' fileName='deliveryPreference.pdf' usePageHeader='true' />
                  </div>
                </div>
              </div>
              {preferenceDeliveryAddress && this.state.allowEditingDeliveryPreferencePreference ?
                <div className="row">
                  <div className="eventCreationChoose">
                    {preferenceDeliveryAddress.map((address, index) => {
                      return <PreferenceAddress
                        addressTriedForSave={this.addressTriedForSave}
                        key={index}
                        preferenceDeliveryAddressError={preferenceDeliveryAddressError}
                        address={address}
                        handleNewDeliveryDayPreferences={this.handleNewDeliveryDayPreferences}
                        clearAddressTriedForSaveData={this.clearAddressTriedForSaveData}
                        handleUpdateNewDeliveryDayPreference={this.handleUpdateNewDeliveryDayPreference}
                        cancelNewChanges={this.cancelNewChanges}
                      />
                    })}
                  </div>
                </div> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Preferences;
