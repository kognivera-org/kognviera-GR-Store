import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class GiftAndShoppingModel extends React.Component {
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
        <Modal show={this.state.show} onHide={this.handleClose} id="GiftAndShoppingModel" className="modal fade modal-custom">
          <ModalBody>
            <button className="close" type="button" data-dismiss="modal" onClick={this.handleClose}>×</button>
            <div className="col-xs-12">
              <p>Who requests admission to this event?</p>
              <div className="radio">
                <input id="radio1-lm" type="radio" name="optionsRadios" />
                <label htmlFor="radio1-lm">Maria Eugenia Menchaca</label>
              </div>
              <div className="radio">
                <input id="radio2-lm" type="radio" name="optionsRadios" />
                <label htmlFor="radio2-lm">Segio López</label>
              </div>
              <div className="radio">
                <input id="radio3-lm" type="radio" name="optionsRadios" />
                <label htmlFor="radio3-lm">Consultation Consultant</label>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <button className="btnSecondaryAction size-Full">Cancel</button>
              </div>
              <div className="col-xs-6">
                <button className="btnPrimary size-Full loadModalContinue" onClick={this.handleClose}>Continue <i className="iconRight icon-flecha_lightsvg_derecha"></i></button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}
export default GiftAndShoppingModel;