import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class RetryTransaction extends React.Component {
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
                <Modal show={this.state.show} onHide={this.handleClose} id="statusModal" className="modal fade modal-custom">
                    <ModalBody>
                        <button type="button" className="close" onClick={this.handleClose}>
                            <span aria-hidden="true">×</span>
                            <span className="sr-only"></span>
                        </button>
                        <div className="col-xs-12">
                            <p>¿Estas seguro de cambiar el estatus del evento?</p>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <button className="btnSecondaryAction size-Full">Cancelar</button>
                            </div>
                            <div className="col-xs-6">
                                <button className="btnPrimaryAction size-Full">Aceptar</button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
export default RetryTransaction;