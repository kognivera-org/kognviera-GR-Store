import React, { Component } from 'react';
import FormTextInput from 'lib/ZUILib/FormTextInput'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import appconfig from '../../../../../../config/appconfig';


class DeleteEventModal extends React.Component {
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
        this.props.setCurrentStatus();
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
    handleAccept = (e) => {
        e.preventDefault();
        let params = {}
        const statusobj = appconfig.eventStatusCodes;
        params = {
            "selectedEventStatus": statusobj.deleted,
            "isSuspendedForPeriod": "false"
        }
        this.props.onDeleteAccept(params);
    }
    render() {
        return (
            <React.Fragment>
                {
                    this.state.show && (this.props.errorMsg === undefined || this.props.errorMsg === '') ?
                        <Modal id="deleteEventModal" className="deleteEventModal modal fade modal-custom" show={this.state.show}>
                            <ModalBody>
                                <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>

                                <div>
                                    <div className="col-xs-12">
                                        <p>¿Estas seguro de eliminar este evento?</p>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <button onClick={this.handleClose} className="btnSecondaryAction size-Full">Cancelar</button>
                                        </div>
                                        <div className="col-xs-6">
                                            <button disabled={this.props.changeEventStatusLoading} onClick={this.handleAccept} className="btnPrimaryAction size-Full">Aceptar</button>
                                        </div>
                                    </div>
                                </div>

                            </ModalBody>
                        </Modal>
                        :
                        <Modal id="deleteEventModal" className="deleteEventModal modal fade modal-custom" show={this.state.show}>
                            <ModalBody>
                                <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
                                <div className="col-xs-12">
                                    <p>{this.props.errorMsg}</p>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12">
                                        &nbsp;
                                         </div>
                                </div>
                            </ModalBody>
                        </Modal>
                }
            </React.Fragment>
        );
    }
}
export default DeleteEventModal;
