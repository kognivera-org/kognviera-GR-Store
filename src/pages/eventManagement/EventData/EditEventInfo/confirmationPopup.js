import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal'
import commonUtil from '../../../../utils/commonUtil';

export default class RemovePermissionConfirmationPopUp extends Component {
    confirm = (e) => {
        e.preventDefault();
        this.props.confirmRemovePermission();
    }
    render() {
        const { labels } = this.props;
        const userEmailAddress = this.props.email;
        return (
            <Modal show={this.props.showRemovePermissionConfirmationPopUp} id="removePermissionPopUp" className="modal fade modal-custom">
                <ModalHeader handleClose={this.props.cancel} >
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={this.confirm}>
                        <p>¿Estás seguro de eliminar los derechos de administración de este usuario?</p>
                        <div className="row removePermissionConfirmationPopUp">
                            <div className="col-xs-6">
                                <input
                                    type="button"
                                    name="cancel"
                                    onClick={this.props.cancel}
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