import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalTitle, ModalBody } from './../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil';
import { getLabels } from '../../../global/Labels/actions';
import { getDisplayEventStatusDropdown } from '../../../global/Header/components/EventHeader/actions';
import { initiateEventCloseProcess } from '../../requests';

@connect(
  store => ({
    labels: store.labels.labels,
  }),
  { getLabels, getDisplayEventStatusDropdown })

export default class TemporaryClosingModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      initiateEventCloseProcessErrorMessage: null,
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

  onAcceptClick = () => {
    // this.props.temporaryModal();
    initiateEventCloseProcess({ eventId: this.props.eventId }, (res) => {
      if (res.data) {
        this.props.getDisplayEventStatusDropdown({ eventId: this.props.eventId });
        this.props.temporaryModal();
      } else {
        this.setState({ initiateEventCloseProcessErrorMessage: res.error.status ? res.error.status.errorMessage : res.error.message });
      }
    });
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  render() {
    const { labels } = this.props;
    return (
      <div>
        {this.state.initiateEventCloseProcessErrorMessage ?
          <div className="alertError"><i className="icon-tache2" />
            <p>{this.state.initiateEventCloseProcessErrorMessage}</p><a className="icon-tache2" onClick={() => { this.setState({ initiateEventCloseProcessErrorMessage: null }); }} />
          </div> : null}
        <Modal show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom cerrarmesa-modal">

          <ModalHeader closeButton="" handleClose={this.handleClose}>
            <ModalTitle>Cerrar mesa de regalos</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Al iniciar el cierre de la mesa no podrán comprarte regalos ni hacer cambios por 30 minutos.</p>
            <p><span style={{fontWeight: "600"}}>Por seguridad, el cliente tiene que validar su correo electrónico.</span> Para cuentas con facebook genera una contraseña en la sección de <span style={{fontWeight: "600"}}>Mi cuenta</span></p>
            <p style={{fontWeight: "600", paddingBottom: "4%"}}>¿Estas seguro que deseas continuar?</p>
            <div className="row">
              <div className="col-xs-6">
                <button onClick={this.handleClose} className="btnDelete size-Full">Cancelar</button>
              </div>
              <div className="col-xs-6">
                <button className="btnPrimary size-Full" onClick={this.onAcceptClick} >Aceptar</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
