
import React, { Component } from 'react';

class Reminders extends Component {
  render() {
    return (
      <div>
        <div className="col-xs-5">
          <div className="wrapReminders">
            <div className="row vertical-align">
              <div className="col-xs-6">
                <p className="title">RECORDATORIOS</p>
              </div>
              <div className="col-xs-6 alignRight">
                <a className="actionTag addAction" onClick={this.props.addremindermodal} data-toggle="modal" data-target="#addReminder">Agregar recordatoio +</a>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 rowReminder">
                <div className="radio">
                  <input id="radio1" type="radio" name="optionsRadios" defaultValue={1} />
                  <label htmlFor="radio1" data-toggle="modal" data-target="#reminderModal">Verificación de datos</label><span>Nota: verificar datos del evento no. 887846545521, solicitar papeles de corroboración de datos.</span>
                </div>
              </div>
              <div className="col-xs-12 rowReminder">
                <div className="radio">
                  <input id="radio2" type="radio" name="optionsRadios" defaultValue={1} />
                  <label htmlFor="radio2" data-toggle="modal" data-target="#noOptions">Cierre de mesa</label><span>Nota: verificar datos del evento no. 887846545521, solicitar papeles de corroboración de datos.</span>
                </div>
              </div>
              <div className="col-xs-12 rowReminder">
                <div className="radio">
                  <input id="radio3" type="radio" name="optionsRadios" defaultValue={1} />
                  <label htmlFor="radio3" data-toggle="modal" data-target="#editReminder">Solicitar</label><span>Nota: verificar datos del evento no. 887846545521, solicitar papeles de corroboración de datos.</span>
                </div>
              </div>
              <div className="col-xs-12 rowReminder">
                <div className="radio">
                  <input id="radio4" type="radio" name="optionsRadios" defaultValue={1} />
                  <label htmlFor="radio4" data-toggle="modal" data-target="#editReminder">Revisar mesa de regalo</label><span>Nota: verificar datos del evento no. 887846545521, solicitar papeles de corroboración de datos.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Reminders;