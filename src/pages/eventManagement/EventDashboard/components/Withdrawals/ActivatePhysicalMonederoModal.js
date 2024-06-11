
import React, { Component } from 'react';
import CheckBox from '../../../../../lib/ZUILib/CheckBox';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../../lib/ZUILib/Modal';
import commonUtil from '../../../../../utils/commonUtil';
import routeconfig from '../../../../../config/routeconfig';


export default class ActivatePhysicalMonederoModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      isActivateWallet: false,
    };

  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleContinue = () => {
    if (this.state.isActivateWallet) {
      this.props.onActivateWallet();
    }
    this.handleClose();
  }

  handleChange = (e) => {
    this.setState({ isActivateWallet: !this.state.isActivateWallet });
    // this.state.isActivateWallet = !this.state.isActivateWallet;
  }
  redirectToAddNewEmpCard = () => {
    this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.addnewemployeecard, { eventId: this.props.eventId }) });
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose} id="activatePhysicalMonederoModal" className="modal fade modal-custom">
        <ModalBody>
          <div className="row">
            <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal">×</button>
            <div className="col-xs-12">
              <p>¿El usuario no cuenta con una Tarjeta Liverpool registrada, deseas continuar el cierre de mesa? </p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <CheckBox displayName="Activar uso de monedero fisico" id="activateWallet" checked={this.state.isActivateWallet} onClickLabel={this.handleChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6">
              <button className="btnSecondaryAction size-Full" onClick={this.handleClose}>Cancelar</button>
            </div>
            <div className="col-xs-6">
              <button className="confirmModal btnPrimaryAction size-Full" onClick={this.handleContinue} disabled={!this.state.isActivateWallet}>Continuar</button>
            </div>
            <div className="col-xs-12">
              <p onClick={this.redirectToAddNewEmpCard} className="mt-10"><a className="primaryLink">Registrar Tarjeta Liverpool</a></p>
            </div>
          </div>
        </ModalBody>
      </Modal >);
  }
}
