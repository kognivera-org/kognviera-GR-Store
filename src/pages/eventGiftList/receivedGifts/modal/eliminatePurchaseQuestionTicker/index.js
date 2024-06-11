
import React, { Component } from 'react';

import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
class EliminatePurchaseTicketQuestionModal extends Component {
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
        };
    }
    handleShow(itemId) {
        this.setState({
            show: true,
        });

    }
    handleClose() {
        this.setState({
            show: false,
        });
    }
    dissociateTicket = () => {
        this.props.onRemoveTicket();
        this.handleClose()
    }
    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} content="w300 br0" className="modal fade" tabIndex={-1} role="dialog" aria-labelledby="modalEliminarBoleta" id="modalEliminarBoletaPregunta">
                <ModalHeader closeButton handleClose={this.handleClose} className="modal-header nbb" >
                    <ModalTitle className="parrafo"> Estas por eliminar la boleta, esta acción no podrá deshacerse, ¿esta seguro que deseas eliminarla? (key)</ModalTitle>
                </ModalHeader>
                <ModalBody className="grid-centered-big">
                    <div />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="grid-two-elements">
                                <div>
                                    <button onClick={this.handleClose} className="btnSecondaryCustom" aria-hidden="true">Cancelar</button>
                                </div>
                                <div />
                                <div>
                                    <button onClick={this.dissociateTicket} className="btnPrimaryCustom" >Aceptar</button>
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
export default EliminatePurchaseTicketQuestionModal;