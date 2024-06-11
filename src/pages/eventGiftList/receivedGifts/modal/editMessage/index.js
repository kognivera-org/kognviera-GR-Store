import React, { Component } from 'react';
import TextInput from 'lib/ZUILib/TextInput'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import { getTrackOrderData } from '../../actions';
import { connect } from 'react-redux';
import Form from 'lib/ZUILib/Form'
import _ from 'lodash';

class EditMessageModal extends Component {
  values = {}
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,
      itemId: '',
      errors: {}
    };

  }
  handleSubmit = (e, values, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors
    })
    this.values.messageInfo = {
      ...this.values, messageFrom: values.guestName, guestEmail: values.emailId, customerMsg: values.message,
    }
    if (isValidForm) {
      this.props.onAddMessage(values, this.values.itemId);
      this.handleClose();
    }
  }
  handleShow(msgData, itemId) {
    this.values = {
      ...msgData,
      itemId: itemId
    }
    this.setState({
      show: true,
      errors: {}
    })
  }

  handleClose() {
    document.body.classList.remove('modal-open');
    this.setState({
      show: false,
    });
    this.values = {
    }
    this.form.reset();
  }

  render() {

    const invitadoEditTextProps = {
      className: 'inputMaterial borde-negro',
      type: 'text',
      name: 'guestName',
      validators:
        [
          {
            type: 'required',
            errorMessage: 'Ingresa una invitado',
          },
          {
            type: 'custom',
            errorMessage: 'Ingrese un nombre válido',
            pattern: '^[a-zA-ZÁÉÍÓÚÜÑáéíñóúü\s ]+$',
          }
        ],
      label: 'Invitado'
    }
    const emailEditTextProps = {
      className: 'inputMaterial borde-negro',
      type: 'text',
      name: 'emailId',
      validators:
        [
          {
            type: 'emailOpt',
            errorMessage: 'Ingresa un email válido',
          }
        ],
      label: 'Correo Electrónico'
    }
    const messageTextProps = {
      className: 'inputMaterial borde-negro h200 no-resizable',
      type: 'text',
      required: 'required',
      name: 'message',
      maxLength: '300',
      validators: JSON.stringify(
        [
          {
            type: 'required',
            errorMessage: 'Ingresa una Mensaje',
          }
        ])
    }
    const { errors } = this.state;
    let messageFrom = (this.values.messageInfo && this.values.messageInfo.messageFrom) || '';
    let email = (this.values.messageInfo && this.values.messageInfo.guestEmail) || '';
    let message = (this.values.messageInfo && this.values.messageInfo.customerMsg) || '';
    if (this.email != undefined) {
      this.email.value = email;
    }
    if (this.invitado != undefined) {
      this.invitado.value = messageFrom;
    }
    if (this.message != undefined) {
      this.message.value = message;
    }

    return (
      <Modal content="w300 centeredh" show={this.state.show} onHide={this.handleClose} className="modal fade" role="dialog" id="modalEditarMensaje">
        <ModalHeader className="modal-header nbb" closeButton handleClose={this.handleClose}>
          <ModalTitle className="mainTitle modalTitle">EDITAR MENSAJE INVITADO</ModalTitle>
        </ModalHeader>
        <ModalBody className="grid-centered-big">
          <div className="row">
            <Form onSubmit={this.handleSubmit} onRef={ref => this.form = ref}>
              <div className="col-xs-12">
                <TextInput {...invitadoEditTextProps} errors={errors} refProp={(ref) => this.invitado = ref} value={messageFrom} />
                <TextInput {...emailEditTextProps} errors={errors} refProp={(ref) => this.email = ref} value={email} />
                <div className="formBlock">
                  <div className="materialStyle">
                    <textarea ref={(ref) => this.message = ref} {...messageTextProps} defaultValue={message}></textarea>
                    <label className="placeHolderMaterial">Mensaje para los festejados</label>
                    <label className="error">{errors.message}</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 mb-15">
                <button className="btnPrimary btnFull" type="submit" >Guardar</button>
              </div>
              <div className="col-xs-12 mb-15">
                <button onClick={this.handleClose} className="btnSecondary btnFull" data-dismiss="modal" aria-hidden="true">Cancelar</button>
              </div>
            </Form>
          </div>
        </ModalBody>
      </Modal >

    )
  }
}
export default EditMessageModal;
