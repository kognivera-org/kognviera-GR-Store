import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../lib/ZUILib/Modal';

export default class UpdateConfirmationModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        };
    }
    handleClose() {
        this.setState({ show: false });
    }

    handleShow(reportId) {
        this.setState({ show: true });
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    onUpdateConfirmClick = () => {
        this.handleClose();
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} id="deleteConfirmationModal" className="modal fade modal-custom" content={"modal-sm"}>
                <ModalBody>
                    <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
                    <div className="col-xs-12">
                        <p>Reporte favorito actualizado correctamente.</p>
                    </div>
                    <div className="row show-grid-row">
                        <div className="col-xs-6">
                            <button onClick={this.handleClose} className="btnPrimaryAction size-Full" data-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </ModalBody>
            </ Modal>
        );
    }
}
