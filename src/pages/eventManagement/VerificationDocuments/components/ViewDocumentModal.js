import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class ViewDocumentModal extends React.Component {
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
        const { imageToView, imageToViewName } = this.props;
        return (
            <React.Fragment>
                <Modal show={this.state.show} onHide={this.handleClose} id="ViewDocument" className="modal fade modal-custom">
                    <ModalHeader closeButton="" handleClose={this.handleClose}>
                        <ModalTitle><b>{imageToViewName}</b></ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        {imageToView ? <img src={this.props.imageToView} style={{ width: '100%' }} /> : 'Loading...'}
                    </ModalBody>
                </Modal>
            </React.Fragment>
        )
    }
}
export default ViewDocumentModal;