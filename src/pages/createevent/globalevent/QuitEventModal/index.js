import React, { Component } from 'react';
import { Modal, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil'

class QuitEventModal extends React.Component {
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

    handleShow() {
        document.body.classList.add('modal-open');
        this.setState({ show: true });
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render() {
        const { handleQuitEvent } = this.props;

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
                                        <p className="parrafo">{commonUtil.getLabel(this.props.labels, 'createEventStep1.quitCreatingEvent.message')}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="grid-two-elements">
                                            <div>
                                                <button className="btnSecondaryCustom" onClick={this.handleClose}>Cancelar</button>
                                            </div>
                                            <div />
                                            <div>
                                                <button className="btnPrimaryCustom" onClick={handleQuitEvent}>Aceptar</button>
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
export default QuitEventModal;
