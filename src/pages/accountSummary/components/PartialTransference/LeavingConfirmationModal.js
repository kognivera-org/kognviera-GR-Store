import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';

export default class LeavingConfirmationModal extends Component {
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
  onSiClick = () => {
    this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.props.eventId }) });
  }

  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose} id="passwordConfirmationModal" className="modal fade modal-custom">
        <ModalBody>
          <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
          <div className="col-xs-12">
            <p>{commonUtil.getLabel(this.props.labels, 'eventTransferences.leaveSection.message')}</p>
          </div>
          <div className="row show-grid-row">
            <div className="col-xs-6">
              <button onClick={this.handleClose} className="btnSecondaryAction size-Full">No</button>
            </div>
            <div className="col-xs-6">
              <button onClick={this.onSiClick} className="confirmModal btnPrimaryAction size-Full">Sí</button>
            </div>
          </div>
        </ModalBody>
      </Modal >
    );
  }
}
