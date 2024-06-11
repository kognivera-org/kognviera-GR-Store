import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../../utils/commonUtil';

class StoreSubmitModal extends Component {
    cancelSavingStoreDelivery = (e) => {
        e.preventDefault();
        this.props.handleStoreModalClose(false);
    }
    saveStoreDelivery = (e) => {
        e.preventDefault();
        this.props.handleStoreModalClose(true);
    }
    render() {
        const { labels } = this.props;
        return (
            <Modal show={this.props.showStoreModal} id="storeModal" className="modal fade modal-custom">
                <div className="modal-header">
                    <button type="button" className="close" onClick={(e) => this.props.handleStoreModalClose(e)} >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <ModalTitle>{commonUtil.getLabel(labels, 'dashboard.openingGifts.confirmation.message')}</ModalTitle>
                </div>
                <ModalBody>
                    {!this.props.errorForOpeningAndClosingGifts ?
                        <form onSubmit={this.saveStoreDelivery}>
                            <button className="btnPrimaryAction size-Large">Guardar</button>
                            <input
                                type="button"
                                name="cancel"
                                onClick={this.cancelSavingStoreDelivery}
                                value="Cancelar"
                                className="btnSecondaryAction size-Large"
                            />
                        </form> : <p>{this.props.errorForOpeningAndClosingGifts}</p>
                    }
                </ModalBody>
            </Modal>
        )
    }
}

export default StoreSubmitModal;