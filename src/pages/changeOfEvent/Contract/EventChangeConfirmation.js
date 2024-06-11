import React, { Component } from 'react';
import FormTextInput from 'lib/ZUILib/FormTextInput'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import commonUtil from '../../../utils/commonUtil'

class EventChangeConfirmation extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        };
    }

    handleClose() {
        document.body.classList.remove('modal-open');
        this.setState({ show: false });
        // this.props.setCurrentStatus();
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

    // handleAccept = (e) => {
    //     const isChecked = e.target.checked ? "true" : "false"
    //     const eventId = this.props.event.eventDetailsInfo.eventId
    //     this.props.changeEmployeeEvent(eventId, isChecked)
    // }

    render() {

        return (
            <React.Fragment>
                {
                    this.state.show &&
                    <Modal id="deleteEventModal" className="deleteEventModal modal fade modal-custom" show={this.state.show}>
                        <ModalBody>
                            <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
                            <div className="col-xs-12">
                                {/* <p>confirmation</p> */}
                                <p>{commonUtil.getLabel(this.props.labels, 'dashboard.eventType.confirmation.message')}</p>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <button onClick={this.handleClose} className="btnSecondaryAction size-Full">Cancelar</button>
                                </div>
                                <div className="col-xs-6">
                                    <button onClick={this.props.handleAccept} className="btnPrimaryAction size-Full">Aceptar</button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                }
            </React.Fragment>
        );
    }
}
export default EventChangeConfirmation;
