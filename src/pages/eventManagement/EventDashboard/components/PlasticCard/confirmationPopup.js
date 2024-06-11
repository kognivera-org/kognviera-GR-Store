import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../../lib/ZUILib/Modal'
import commonUtil from '../../../../../utils/commonUtil';

export default class PlasticCardDeleteConfirmationPopUp extends Component {
    confirm = (e) => {
        e.preventDefault();
        this.props.confirmDeletePlasticcard();
    }
    render() {
        const { labels } = this.props;
        const deletedUserName = this.props.selectedPlastciCardForDeletion.firstName + ' ' + this.props.selectedPlastciCardForDeletion.lastName;
        return (
            <Modal show={this.props.showPlasticCardDeleteConfimationPop} id="deletePlastic" className="modal fade modal-custom">
                <ModalHeader handleClose={this.props.cancelDeletion} >
                    <ModalTitle>Advertencia</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={this.confirm}>
                        <p>{commonUtil.getLabel(labels, 'dashboard.plasticcard.removePopUp.message', { ownerName: deletedUserName })}</p>
                        <div className="row deletePlaticCard">
                            <div className="col-xs-6">
                                <input
                                    type="button"
                                    name="cancel"
                                    onClick={this.props.cancelDeletion}
                                    value="Cancelar"
                                    className="btnSecondaryAction size-Large"
                                />
                            </div>
                            <div className="col-xs-6">
                                <button className="btnPrimaryAction size-Large">Guardar</button>
                            </div>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        );
    }
}