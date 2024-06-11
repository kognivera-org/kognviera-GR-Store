import React, { Component } from 'react';
import { Modal, ModalBody } from '../../lib/ZUILib/Modal';
import commonUtil from '../../utils/commonUtil';
import routeconfig from '../../config/routeconfig';

export default class NoClientVerificationModal extends Component {
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
          <div style={{margin: "-14px", backgroundColor: "#F5F5F5", padding: "20px"}}>¿No se pudo verificar al cliente?
          <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
          </div>
          <div className="col-xs-12" style={{paddingTop: '7%'}}>
            <p style={{textAlign: 'center'}}>Si los datos no son correctos y no se pudo verificar al cliente:</p>
            <div>
            <ul style={{paddingTop: '5%'}}>
                <li>El cliente tiene que ingresar a <span style={{fontWeight: "500"}}>Mi cuenta/Actualizar Datos Personales</span> para comprobar y/o actualizar su correo electrónico.</li>
                <li style={{paddingTop: '3%'}}>También puedes entrar en <span style={{fontWeight: "500"}}> Datos del evento y editar los datos del cliente.</span></li>
            </ul>
            </div>            
            </div>
            <div className="row show-grid-row" style={{textAlign: "center"}}>
              <div className="col-xs-12">
                <button onClick={this.confirmClick} style={{width: "40%", margin: '5% 0'}} className="btnPrimary size-Full" data-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}