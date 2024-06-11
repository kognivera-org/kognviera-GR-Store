import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal';
import PasswordnotKnownModal from './PasswordnotKnownModal';
import commonUtil from '../../../../utils/commonUtil';

export default class ClosurePasswordConfirmationModal extends Component {
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
  onNoClick = () => {
    this.PasswordnotKnownModal.handleShow();
  }
  onPasswordConfirmClick = () => {
    this.props.onPasswordConfirmClick();
    this.handleClose();
  }
  reDirectToAccountStatement = () => {
    this.props.router.go(-1);
  }
  render() {
    return (
      <div className="non-printable">
        <Modal show={this.state.show} onHide={this.handleClose} id="passwordConfirmationModal" className="modal fade modal-custom">
          <ModalBody>
            <button onClick={this.reDirectToAccountStatement} className="close" type="button" data-dismiss="modal">×</button>
            <div className="col-xs-12">
              <p>¿El usuario tiene acceso a su correo electrónico?</p>
            </div>
            <div className="row show-grid-row" style={{paddingTop: "3%"}}>
              <div className="col-xs-6">
                <button onClick={this.onNoClick} className="btnSecondaryAction size-Full">No</button>
              </div>
              <div className="col-xs-6">
                <button onClick={this.onPasswordConfirmClick} className="btnPrimaryAction size-Full" data-dismiss="modal">Sí</button>
              </div>
            </div>
          </ModalBody>

        </Modal>
        <PasswordnotKnownModal onRef={ref => (this.PasswordnotKnownModal = ref)} router={this.props.router} eventId={this.props.eventId} labels={this.props.labels} />
      </div>
    );
  }
}
