import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonUtil from '../../../../utils/commonUtil';
import { Modal, ModalHeader, ModalTitle, ModalBody } from './../../../../lib/ZUILib/Modal';
import { getLabels } from '../../../global/Labels/actions';

// import { Router } from 'express';

@connect(
  store => ({
    labels: store.labels.labels,
  }),
  { getLabels })

class ValeSystemDownModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    const { labels } = this.props;
    return (
      <Modal show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom cerrarmesa-modal">
        <ModalHeader closeButton="" handleClose={this.handleClose}>
          <ModalTitle>{commonUtil.getLabel(labels, 'accountStatement.valesystemdown.message1')}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>{commonUtil.getLabel(labels, 'accountStatement.valesystemdown.message2')} {this.props.startTime} a {this.props.EndTime} {commonUtil.getLabel(labels, 'accountStatement.valesystemdown.message3')}</p>
          <div className="row">
            <div className="col-md-8 col-sm-8 col-md-offset-2 text-center">
              <button className="btnPrimaryAction size-Full" onClick={this.handleClose} >Aceptar</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
export default ValeSystemDownModal;
