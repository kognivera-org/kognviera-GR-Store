import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../../lib/ZUILib/Modal';
import RadioButton from '../../../../../lib/ZUILib/RadioButton';
import commonUtil from '../../../../../utils/commonUtil';
class HomeDeliveryAddressOpeningGiftModal extends Component {
    state = {
        isAddressSelected: false,
        selectedAddress: ""
    }
    selectedOption = (address) => {
        if (address) {
            this.setState({
                isAddressSelected: true,
                selectedAddress: address
            })
        } else {
            this.setState({
                isAddressSelected: false,
                selectedAddress: ""
            })
        }
    }
    cancel = () => {
        this.setState({
            isAddressSelected: false,
            selectedAddress: ""
        })
        this.props.handleHomeModalClose();
    }
    handleSelectedDeliveryAddressForOpening = (e) => {
        e.preventDefault();
        this.props.submitOption(this.state.selectedAddress);
    }
    renderContent = (eventDeliveryAddress, eventDeliveryAddressFailed, eventDeliveryAddressLoading) => {
        const info = this.props.openingGiftDetailsForEventInfo;
        const selectedAddress = info && info.addressItem ? info.addressItem.addressId : null;
        return (
            !this.props.fail ?
                <form onSubmit={this.handleSelectedDeliveryAddressForOpening}>

                    {
                        !commonUtil.isObjectEmpty(eventDeliveryAddress.deliveryAddressInfo)
                        && eventDeliveryAddress.deliveryAddressInfo.addresses
                        && eventDeliveryAddress.deliveryAddressInfo.addresses.length
                        && eventDeliveryAddress.deliveryAddressInfo.addresses.map((address, index) => {
                            const add1 = address.nickName;
                            const add2 = this.props.getAddressForHtml(address);
                            const divLabel = <div className="chooseHome-radio-text"><p>{add1}</p><p>{add2}</p></div>
                            return (
                                <React.Fragment key={index}>
                                    <RadioButton
                                        defaultChecked={address.addressId === selectedAddress}
                                        id="radio1"
                                        radioCssClass="chooseHome-radio"
                                        name="chooseHome-radio"
                                        value={add2}
                                        onChangeFunction={() => this.selectedOption(address)}
                                        divLabel={divLabel}
                                    />
                                </React.Fragment>
                            );
                        })}
                    {this.state.isAddressSelected ?
                        <div className="row chooseHome-buttons">
                            <div className="col-xs-6">
                                <input
                                    type="button"
                                    name="cancel"
                                    onClick={this.cancel}
                                    value="Cancelar"
                                    className="btnSecondaryAction size-Large"
                                />
                            </div>
                            <div className="col-xs-6">
                                <button className="btnPrimaryAction size-Large">Guardar</button>
                            </div>
                        </div>
                        : null}
                </form> :
                <h3>try again later </h3>
        )
    }
    render() {
        const { eventDeliveryAddress, eventDeliveryAddressFailed, eventDeliveryAddressLoading } = this.props;
        return (
            <Modal show={this.props.showHomeDeliveryModal} id="chooseHomeModal" className="modal fade modal-custom">
                <ModalBody>
                    <button onClick={this.props.handleHomeModalClose} className="close" type="button" data-dismiss="modal">×</button>
                    <h4>Selección de domicilio</h4>
                    <p>Selecciona la dirección donde el festejado desea recibir su regalo.</p>
                    {eventDeliveryAddressLoading ? <p>Loading....</p> :
                        this.renderContent(eventDeliveryAddress, eventDeliveryAddressFailed, eventDeliveryAddressLoading)
                    }
                </ModalBody>
            </Modal>
        )
    }
}

export default HomeDeliveryAddressOpeningGiftModal;