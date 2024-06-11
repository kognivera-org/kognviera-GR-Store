import React, { Component } from 'react';
import { Modal, ModalBody } from '../../lib/ZUILib/Modal';
import commonUtil from '../../utils/commonUtil';
import routeconfig from '../../config/routeconfig';

export default class MessageModal extends Component {
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

  confirmClick = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.props.eventId }))
  }

  render() {
    return (
      <div className="non-printable">
        <Modal show={this.state.show} onHide={this.handleClose} id="passwordConfirmationModal" className="modal fade modal-custom">
          <ModalBody>
            <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
            <div className="col-xs-12" style={{textAlign: "center"}}>
            <p>¡Lo sentimos! Algo salió mal. Por favor intenta de nuevo.</p>
            </div>
            <div className="row show-grid-row" style={{textAlign: "center"}}>
              <div className="col-xs-12">
                <button onClick={this.confirmClick} style={{width: "40%"}} className="btnPrimary size-Full" data-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}