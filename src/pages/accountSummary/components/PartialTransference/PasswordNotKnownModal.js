import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';

export default class PasswordnotKnownModal extends Component {
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
  onAceptarClick = () => {
      this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.props.eventId }) });
    }

  render() {
      return (
          <Modal show={this.state.show} onHide={this.handleClose} id="passwordConfirmationModal" className="modal fade modal-custom">
              <ModalBody>
                  <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
                  <div className="col-xs-12">
                    {
                      this.props.type === 'partial' ? <p>Al no contar con el acceso a su correo electrónico no es posible realizar un retiro anticipado.</p> :
                      <p>{commonUtil.getLabel(this.props.labels, 'eventTransferences.passwordUnknown.message')}</p>
                    }
                    </div>
                  <div className="row show-grid-row">

                      <div className="col-xs-12">
                          <button onClick={this.onAceptarClick} className="confirmModal btnPrimaryAction size-Full">Aceptar</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal >
        );
    }
}
