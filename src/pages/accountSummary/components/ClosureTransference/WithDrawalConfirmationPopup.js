
import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil';


export default class WithDrawalConfirmationPopup extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.disableSi = false;
    this.state = {
      disableSi: false,
      show: false,
    };
  }

  handleClose() {
    this.disableSi = false;
    this.setState({
      show: false,
      disableSi: false,
    });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleSubmit = () => {
    if (!this.disableSi) {
      this.disableSi = true;
      this.setState({ disableSi: true });
      this.props.onAcceptWithdraw();
    }
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose} id="withDrawalConfirmationPopup" className="modal fade modal-custom">
        <ModalBody>
          <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal"><span style={{ verticalAlign: 'inherit' }}><span style={{ verticalAlign: 'inherit' }}>×</span></span></button>
          <div className="col-xs-12">
            <p>{commonUtil.getLabel(this.props.labels, 'eventClosure.closure.label3')}</p>
          </div>
          <div className="row show-grid-row">
            <div className="col-xs-6">
              <button className="btnSecondaryAction size-Full" onClick={this.handleClose}><span style={{ verticalAlign: 'inherit' }}><span style={{ verticalAlign: 'inherit' }}>No</span></span></button>
            </div>
            <div className="col-xs-6">
              <button className="confirmModal btnPrimaryAction size-Full" onClick={this.handleSubmit} disabled={this.state.disableSi}><span style={{ verticalAlign: 'inherit' }}><span style={{ verticalAlign: 'inherit' }}>Sí</span></span></button>
            </div>
          </div>
        </ModalBody>
      </Modal>);
  }
}
