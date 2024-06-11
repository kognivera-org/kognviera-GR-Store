import React, { Component } from 'react';
import FormTextInput from 'lib/ZUILib/FormTextInput'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

class AddReminderModal extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    document.body.classList.remove('modal-open');
    this.setState({ show: false });
  }

  handleShow() {
    document.body.classList.add('modal-open');
    this.setState({ show: true });
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  render() {

    const titleTextProps = {
      className: 'inputMaterial',
      type: 'text',
      name: 'title',
      required: 'required',
      label: '<span>*</span>Título'
    }
    const noteTextProps = {
      className: 'inputMaterial',
      type: 'text',
      name: 'note',
      required: 'required',
      label: '<span>*</span>Escribe una nota'
    }
    const assignedUserTextProps = {
      className: 'inputMaterial',
      type: 'text',
      name: 'assignedUser',
      required: 'required',
      label: 'Asignar a un usuario'
    }

    return (
      <div>
        {
          this.state.show &&
          <Modal id="addReminder" className="addReminder modal fade modal-custom">
            <ModalHeader closeButton="" handleClose={this.handleClose}>
              <ModalTitle>AGREGAR RECORDATORIO</ModalTitle>
              <p>Agregar un recordatorio para ti o alguien más</p>
              <p className="requiredFields alignRight">*Campos obligatorios</p>
            </ModalHeader>
            <ModalBody>
              <form id="form-reminder">
                <FormTextInput {...titleTextProps} />
                <FormTextInput {...noteTextProps} />
                <FormTextInput {...assignedUserTextProps} />
                <div className="cSelect">
                  <select> <option disabled="disabled" selected="selected" value="value">Asignar a un perfil</option> <option value="opt1">Option 1</option> <option value="opt2">Option 2</option> <option value="opt3">Option 3</option> <option value="opt4">Option 4</option> <option value="opt4">Option 4</option> <option value="opt4">Option 4</option> </select>
                  <i className="icon-caret_down"></i>
                </div>
                <div className="form-group">
                  <div className="input-group date">
                    <input className="form-control" type="text" name="date" required="" />
                    <span className="input-group-addon"><span className="glyphicon glyphicon-calendar"></span></span>
                  </div>
                </div>
                <button className="btnPrimary size-Full">Aceptar</button>
              </form>
            </ModalBody>
          </Modal>
        }
      </div>
    );
  }
}
export default AddReminderModal;
