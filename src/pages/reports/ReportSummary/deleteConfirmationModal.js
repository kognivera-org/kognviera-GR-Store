import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../lib/ZUILib/Modal';

export default class DeleteConfirmationModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        };
        this.reportId = '';
    }
    handleClose() {
        this.setState({ show: false });
    }

    handleShow(reportId) {
        this.reportId = reportId;
        this.setState({ show: true });
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    closeDeleteConfirmPopup = () => {
        this.handleClose();
        //this.props.router.go(-1);
    }
    onDeleteConfirmClick = () => {
        this.props.onDeleteConfirmClick(this.reportId);
        this.handleClose();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} id="deleteConfirmationModal" className="modal fade modal-custom" content={"modal-sm"}>
                <ModalBody>
                    <button onClick={this.closeDeleteConfirmPopup} className="close" type="button" data-dismiss="modal">×</button>
                    <div className="col-xs-12">
                        <p>Estás por eliminar este reporte, la acción no podrá deshacerse. ¿Deseas continuar?</p>
                    </div>
                    <div className="row show-grid-row">
                        <div className="col-xs-6">
                            <button onClick={this.closeDeleteConfirmPopup} className="btnSecondaryAction size-Full">Cancelar</button>
                        </div>
                        <div className="col-xs-6">
                            <button onClick={this.onDeleteConfirmClick} className="btnPrimaryAction size-Full" data-dismiss="modal">Eliminar</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}
