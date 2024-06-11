import React, { Component } from 'react';
import TextInput from 'lib/ZUILib/TextInput'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import { connect } from 'react-redux';
import Form from 'lib/ZUILib/Form'

class NewInvitationMessageModal extends Component {
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
      errors: {},
    };
    this.itemId = ''

  }
  handleSubmit = (e, values, formErrors, isValidForm) => {
    e.preventDefault();

    this.setState({
      ...this.state,
      errors: formErrors
    })
    if (isValidForm) {
      this.props.onAddMessage(values, this.itemId);
    }
  }
  handleShow(itemId) {
    this.setState({
      show: true,
      errors: {}
    });
    this.itemId = itemId;
  }
  handleClose() {
    document.body.classList.remove('modal-open');
    this.setState({
      show: false
    });
    this.form.reset();
  }
  render() {

    const invitadoTextProps = {
      className: 'inputMaterial borde-negro',
      type: 'text',
      required: 'required',
      name: 'guestName',
      label: 'Invitado',
      validators:
        [
          {
            type: 'required',
            errorMessage: 'Ingresa una Invitado',
          },
          {
            type: 'custom',
            errorMessage: 'Ingrese un nombre válido',
            pattern: '^[a-zA-ZÁÉÍÓÚÜÑáéíñóúü\s ]+$',
          }
        ]
    }
    const emailTextProps = {
      className: 'inputMaterial borde-negro',
      type: 'text',
      name: 'emailId',
      label: 'Correo Electrónico',
      validators:
        [{
          type: 'emailOpt',
          errorMessage: 'Ingresa un email válido',
        }
        ]
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
    return (
      <Modal content="w300 modal-sm centeredh" show={this.state.show} onHide={this.handleClose} className="modal fade" tabIndex="{-1}" role="dialog" aria-labelledby="mySmallModalLabel" id="modalNuevoMensaje">
        <ModalHeader className="modal-header nbb" closeButton handleClose={this.handleClose}>
          <ModalTitle className="mainTitle modalTitle">AGREGAR MENSAJE INVITADO</ModalTitle>
        </ModalHeader>
        <ModalBody className="grid-centered-big">

          <div className="row">
            <Form onSubmit={this.handleSubmit} onRef={ref => this.form = ref}>
              <div className="col-xs-12">
                <TextInput {...invitadoTextProps} errors={errors} />
                <TextInput {...emailTextProps} errors={errors} />
                <div className="formBlock">
                  <div className="materialStyle">
                    <textarea {...messageTextProps}></textarea>
                    <label className="placeHolderMaterial">Mensaje para los festejados</label>
                    <label className="error">{errors.message}</label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 mb-15">
                <button className="btnPrimary btnFull" type="submit">Aceptar</button>
              </div>
              <div className="col-xs-12 mb-15">
                <button className="btnSecondary btnFull" href="" data-dismiss="modal" aria-hidden="true" onClick={(e) => this.handleClose()}>Cancelar</button>
              </div>
            </Form>
          </div>

        </ModalBody>

      </Modal>
    )
  }
}

export default NewInvitationMessageModal;
