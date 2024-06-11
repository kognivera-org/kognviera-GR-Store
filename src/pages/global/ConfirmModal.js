import React, { Component } from 'react';
import { Modal, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class ConfirmModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose() {
        document.body.classList.remove('modal-open');
        this.setState({ show: false });
    }

    handleShow(type) {
        document.body.classList.add('modal-open');
        this.setState({ show: true, type });
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
                {
                    this.state.show &&
                    <Modal show={this.state.show} id="quitEvent" className="addReminder modal fade modal-custom">
                        <ModalBody>
                            <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                            <div className="grid-centered-big">
                                <div />
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="parrafo">{this.props.displayMessage}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="grid-two-elements">
                                            <div>
                                                <button className="btnSecondaryCustom" onClick={this.handleClose}>Cancelar</button>
                                            </div>
                                            <div />
                                            <div>
                                                <button className="btnPrimaryCustom" onClick={e => this.props.handleConfirmOnBack(this.state.type)}>Aceptar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div />
                            </div>
                        </ModalBody>
                    </Modal>
                }
            </div>
        );
    }
}
export default ConfirmModal;
