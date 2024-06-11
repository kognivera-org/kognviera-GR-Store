import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import Form from 'lib/ZUILib/Form'

class EliminateMessageModal extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
            itemId: ''
        };
    }
    handleShow(itemId) {
        this.setState({
            show: true,
            itemId: itemId
        });

    }
    handleClose() {
        document.body.classList.remove('modal-open');
        this.setState({
            show: false,
            itemId: ''
        });
    }
    handleDelete = () => {
        this.handleClose();
        this.props.onDeleteMessage(this.state.itemId)
    }
    render() {
        return (
            <Modal content="w300 br0 centeredh" show={this.state.show} onHide={this.handleClose} className="modal fade" tabIndex={-1} role="dialog" id="modalEliminarMensaje">
                <ModalHeader closeButton handleClose={this.handleClose} className="modal-header">
                    <ModalTitle className="parrafo"> ¿Deseas eliminar el mensaje?</ModalTitle>
                </ModalHeader>
                <ModalBody className="grid-centered-big">
                    <div />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="grid-two-elements">
                                <div>
                                    <button className="btnSecondaryCustom" onClick={this.handleClose}>Cancelar</button>
                                </div>
                                <div />
                                <div>
                                    <button className="btnPrimaryCustom" onClick={this.handleDelete}>Aceptar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div />
                </ModalBody>
            </Modal>
        )
    }
}
export default EliminateMessageModal;