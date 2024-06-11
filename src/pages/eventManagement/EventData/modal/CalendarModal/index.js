
import React, { Component } from 'react';

class CalendarModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }
  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }


  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div className="modal" id="calendarModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
              <h4>Fecha del evento</h4>
              <p>El cambio de fecha puede generar un cambio de estatus, es importante verificar las reglas de estatus.</p>
              <div className="formGroup">
                <div className="row">
                  <div className="col-xs-12">
                    <div id="datetimepicker2" />
                  </div>
                </div>
              </div>
              <button className="btnSecondaryAction size-Medium" data-dismiss="modal">Cancelar</button>
              <button className="btnPrimaryAction size-Medium dateChange">Aceptar</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default CalendarModal;
