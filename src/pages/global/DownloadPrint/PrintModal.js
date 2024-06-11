import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../lib/ZUILib/Modal';
import Form from 'lib/ZUILib/Form';

class PrintModal extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            error: ''
        };
    }

    handleClose() {
        document.body.classList.remove('modal-open');
        this.setState({ show: false });
        this.props.close();
    }

    handleShow() {
        document.body.classList.add('modal-open');
        this.setState({ show: true }, () => {
            setTimeout(function () {
                window && window.frames["printIframe"].focus();
                window && window.frames["printIframe"].print();
            }, 2000);
        });
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.show &&
                    <Modal id="printModal" className="printModal modal fade modal-custom" show={this.state.show}>
                        <ModalHeader handleClose={this.handleClose}>
                            <ModalTitle>{this.props.filename}</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <iframe src={this.props.url} type="application/pdf" name="printIframe" id="printIframe" className="printIframe" />
                        </ModalBody>
                    </Modal>
                }
            </React.Fragment>
        );
    }
}
export default PrintModal;