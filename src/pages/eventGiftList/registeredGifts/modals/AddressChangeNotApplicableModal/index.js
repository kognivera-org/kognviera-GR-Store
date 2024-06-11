import React, { Component } from 'react';
import { Modal, ModalBody } from '../../../../../lib/ZUILib/Modal';

class AddressChangeNotApplicableModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
        };
    }
    openSuccessModal() {
        this.props.handleSucessModal();
    }
    handleClose = (e) => {
        document.body.classList.remove('modal-open');
        this.setState({
            show: false,
        });
    }

    handleShow() {
        document.body.classList.add('modal-open');
        this.setState({ show: true });
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom" id="changeGiftType" >
                <ModalBody >
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close" value="cancel" onClick={this.handleClose}><span aria-hidden="true">×</span></button>
                    <div className="row">
                        <div className="col-xs-12">
                            <p>¿Estas seguro de cambiar la dirección de entrega de este articulo en tu lista de regalos? Esta acción no afectará a los artículos electrónicos</p>
                        </div>
                        <div className="col-xs-12">
                            <button className="btnSecondary btn-custom" value="cancel" onClick={this.handleClose}>Cancelar</button>
                            <button className="btnPrimaryAction btn-custom ml30" value="accept" onClick={this.props.changeStatus}>Aceptar</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal >
        );
    }
}

export default AddressChangeNotApplicableModal;
