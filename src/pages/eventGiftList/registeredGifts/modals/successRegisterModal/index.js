
import React, { Component } from 'react';
import { Modal, ModalBody } from '../../../../../lib/ZUILib/Modal';
import Image from '../../../../../lib/ZUILib/Image';

class SuccessRegisterModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
    };
    this.data = {}
  }
  openSuccessModal() {
    this.props.handleSucessModal();
  }
  handleClose() {
    if (this.data) {
      this.props.successServiceCall();
    }
    document.body.classList.remove('modal-open');
    this.setState({
      show: false,
    });
  }

  handleShow(data) {
    document.body.classList.add('modal-open');
    this.data = data;
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
      <Modal show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom" id="successRegisterModal" >
        <ModalBody >
          <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={this.handleClose}><span aria-hidden="true">×</span></button>
          <h4>REGALO REGISTRADO</h4>
          <div className="row">
            <div className="col-xs-6"><Image src={this.data.image} alt="Liverpool" /></div>
            <div className="col-xs-6">
              <p>{this.data.name}</p>
              <p>SKU:<span>{this.data.skuId}</span></p>
              <p>Modo de regalo: <span>{this.data.deliveryMode === 'physical' ? 'Físicos' : 'Electrónicos'}</span></p>
              <p>Cantidad:<span>{this.data.quantity}</span></p>
            </div>
          </div>
        </ModalBody>
      </Modal >
    );
  }
}
export default SuccessRegisterModal;
