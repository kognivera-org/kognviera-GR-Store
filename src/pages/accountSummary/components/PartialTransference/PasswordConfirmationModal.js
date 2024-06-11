import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil';
import PasswordNotKnownModal from './PasswordNotKnownModal';

export default class PasswordConfirmationModal extends Component {
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
              {
                this.props.type === 'partial' ? 
                <p>¿El usuario tiene acceso a su correo electrónico?</p> : <p>{commonUtil.getLabel(this.props.labels, 'eventTransferences.passwordpopuup.message')}</p>
              }
            </div>
            <div className="row show-grid-row">
              <div className="col-xs-6">
                <button onClick={this.onNoClick} className="btnSecondaryAction size-Full">No</button>
              </div>
              <div className="col-xs-6">
                <button onClick={this.onPasswordConfirmClick} className="btnPrimaryAction size-Full" data-dismiss="modal">Sí</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <PasswordNotKnownModal onRef={ref => (this.PasswordnotKnownModal = ref)} router={this.props.router} labels={this.props.labels} eventId={this.props.eventId} type={this.props.type}/>
      </div>
    );
  }
}
