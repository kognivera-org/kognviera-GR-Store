import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class EventGralInfoPrintModal extends React.Component {
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

    return (
      <div>
        <Modal show={this.state.show} onHide={this.handleClose} id="PrintGralInfo" className="modal fade modal-custom">
          <ModalBody>
            <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span></button>
            <h4>SELECCIONA UNA TIENDA</h4>
            <p>Selecciona la tienda de la que deseas se imprima el documento</p>
            <p className="requiredLabel">*campos obligatorios</p>
            <div className="cSelect required">
              <select>
                <option disabled="" selected="">Selecciona una tienda</option>
                <option>Tienda 1</option>
                <option>Tienda 2</option>
                <option>Tienda 3</option>
              </select><i className="icon-flecha_light_abajo"></i>
            </div>
            <button className="btnPrimary size-Full">Imprimir</button>

          </ModalBody>
        </Modal>
      </div>
    )
  }
}
export default EventGralInfoPrintModal;