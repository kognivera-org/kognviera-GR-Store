import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class TrackDeliverModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose} id="trackDeliver" className="modal fade modal-custom">
                    <ModalHeader closeButton>
                        <ModalTitle>Seguimiento a entrega</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <p>No. de pedido: 03292921471</p><span className="modalRow">
                            <p className="boldColor">Estatus de entrega:</p>
                            <p className="successColor">EN ALMACEN</p></span><span className="modalRow">
                            <p className="boldColor">Fecha estimada de entrega:</p>
                            <p className="successColor">12 de enero - 17 de enero</p></span>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
export default TrackDeliverModal;