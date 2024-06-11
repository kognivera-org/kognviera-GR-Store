import React, { Component } from 'react';
import CheckBox from '../../../../lib/ZUILib/CheckBox';
import commonUtil from '../../../../utils/commonUtil';

class PrefferenceAddress extends Component {
    state = {
        isModifiled: false
    }
    setNewDeliveryDayPreferences = (preference, deliveryAddress) => {
        this.setState({
            isModifiled: true
        })
        this.props.handleNewDeliveryDayPreferences(preference, deliveryAddress)
    }
    saveNewDeliveryDayPreference = (e, deliveryAddress) => {
        e.preventDefault();
        this.props.handleUpdateNewDeliveryDayPreference(deliveryAddress);
    }
    hideCancelAndSaveButton = () => {
        this.setState({
            isModifiled: false
        })
        this.props.clearAddressTriedForSaveData();
    }
    componentWillReceiveProps(nextProps) {
        const deliveryAddress = this.props.address;
        if (nextProps.addressTriedForSave === deliveryAddress.addressId && !nextProps.preferenceDeliveryAddressError) {
            this.hideCancelAndSaveButton();
        }
    }
    cancel = (addressId) => {
        this.props.cancelNewChanges(addressId);
        this.hideCancelAndSaveButton();
    }
    getAddressForHtml = (address) => {

        let addressDataHtml = ' ';
        if (address.address1) {
            addressDataHtml += ' ' + address.address1
        }
        if (address.exteriorNumber) {
            addressDataHtml += ', Ext. ' + address.exteriorNumber
        }
        if (address.interiorNumber) {
            addressDataHtml += ', Int. ' + address.interiorNumber
        }
        if (address.building) {
            addressDataHtml += ', ' + address.building
        }
        if (address.city) {
            addressDataHtml += ', ' + address.city
        }
        if (address.colony) {
            addressDataHtml += ', ' + address.colony
        }
        if (address.delegationMunicipality) {
            addressDataHtml += ', ' + address.delegationMunicipality
        }
        if (address.postalCode) {
            addressDataHtml += ', ' + address.postalCode;
        }
        if (address.state) {
            addressDataHtml += ', ' + address.state
        }
        if (address.address2) {
            addressDataHtml += ', ' + address.address2
        }
        if (address.phoneNumber) {
            addressDataHtml += ', ' + (address.particularPhoneCode ? address.particularPhoneCode : '') + address.phoneNumber;
        }
        if (address.cellular) {
            addressDataHtml += ', ' + address.cellular;
        }
        return addressDataHtml;
    }
    getAddressOwnerName = (address) => {
        let adminName = ' ';
        if (address.firstName) {
            adminName += address.firstName
        }
        if (address.motherName) {
            adminName += ' ' + address.motherName
        }
        if (address.lastName) {
            adminName += ' ' + address.lastName
        }
        return adminName;
    }
    render() {
        const deliveryAddress = this.props.address;
        return (
            deliveryAddress &&
            <form className="col-xs-4 selectDays" onSubmit={e => this.saveNewDeliveryDayPreference(e, deliveryAddress)}>
                <h4>{deliveryAddress.nickName}</h4>
                <h2 className="subtitleModule">{this.getAddressOwnerName(deliveryAddress)}</h2>
                <p className="descriptiveText">{this.getAddressForHtml(deliveryAddress)}</p>
                {deliveryAddress.delieveryDaysInfo.length ? deliveryAddress.delieveryDaysInfo.map((day, index) => {
                    return <CheckBox key={index}
                        uiname="EventPreferredSelectDays"
                        id={deliveryAddress.addressId + day.deliveryDay}
                        value={day.deliveryDay}
                        name={deliveryAddress.addressId + day.deliveryDay}
                        checked={day.opted === true && true}
                        getSelectedValue={(e) => this.setNewDeliveryDayPreferences(e, deliveryAddress)}
                        displayName={day.deliveryDay}
                    />
                }) : <span><p>{deliveryAddress.message}</p></span>}
                {
                    this.state.isModifiled ?
                        // this.state.isModifiled && deliveryAddress.delieveryDaysInfo.filter(item => item.opted === true).length ?
                        <React.Fragment>
                            <button className="btnPrimaryAction size-Large">Guardar</button>
                            <input type="button" name="cancel" onClick={() => this.cancel(deliveryAddress.addressId)} value="Cancelar" className="btnSecondaryAction size-Large" />
                        </React.Fragment> : null
                }
            </form>

        )
    }

}
export default PrefferenceAddress;
