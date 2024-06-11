import React, { Component } from 'react';
import FormTextInput from 'lib/ZUILib/FormTextInput'
import ManagementMenu from '../../Navigation/ManagementMenu';
import Image from 'lib/ZUILib/Image';

class EditEmployeeCard extends Component {
  render() {

    const cardNumberTextProps = {
      className: 'inputMaterial',
      type: 'text',
      required: 'required',
      defaultValue: '{123456789}',
      name: 'cardNumber',
      label: '<span>*</span> Número de tarjeta'
    }
    const firstNameTextProps = {
      className: 'inputMaterial',
      type: 'text',
      required: 'required',
      defaultValue: 'maria',
      name: 'firstName',
      label: '<span>*</span> Nombre'
    }
    const firstName2TextProps = {
      className: 'inputMaterial',
      type: 'text',
      defaultValue: 'eugenia',
      name: 'firstName2',
      label: 'Segundo Nombre'
    }
    const lastNameTextProps = {
      className: 'inputMaterial',
      type: 'text',
      required: 'required',
      defaultValue: 'rosas',
      name: 'lastName',
      label: '<span>*</span> Apellido Paterno'
    }
    const lastName2TextProps = {
      className: 'inputMaterial',
      type: 'text',
      defaultValue: 'flores',
      name: 'lastName2',
      label: 'Apellido Materno'
    }
    return (
      <div>
        <div className="nav-wrap">
          <div className="container">
            <div className="row nav-style vertical-align">
              <div className="col-xs-1">
                <a className="icon-flecha_gruesa_izq backAction" href=""></a>
              </div>
              <div className="col-xs-1 wrapLiverpoolLogo">
                <a className="icon-logo_liver liverpoolAction" href=""></a>
              </div>
              <div className="col-xs-1">
                <Image asset src="/images/adminImage.png" className="picEvent" alt="Liverpool" />
              </div>
              <div className="col-xs-5 titleEvent">
                <h2 className="nameEvent">Ana López y Javier Sanchez</h2>
                <p className="noEvent">Boda / No. de evento: 793798398</p>
              </div>
              <div className="col-xs-2 wrapSearch">
                <p className="textLabel">ESTATUS DEL EVENTO</p>
                <div className="cSelect">
                  <select className="eventOption"> <option disabled="disabled" selected="selected" value="{0}">Evento activo</option> <option value="suspended">Suspendido</option> <option value="deleted">Eliminado</option> <option value="inProcess">En proceso administrativo</option> <option value="deletedByFraud">Eliminado por fraude</option> </select>
                  <i className="icon-caret_down"></i>
                </div>
              </div>
              <div className="col-xs-2">
                <div className="checkbox">
                  <input id="checkbox1" type="checkbox" />
                  <label htmlFor="checkbox1">Evento de empleado</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container fill">
          <div className="row fill">
            <div className="col-xs-2 fill">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="container-full white shadow mt-30">
                <div className="row mh-30">
                  <div className="col-md-12 mt-30">
                    <p className="tituloSeccion">Editar tarjeta</p>
                  </div>
                  <div className="col-md-12">
                    <p className="subtituloSeccion">La dirección se editará en la cuenta de Liverpool (Key).</p>
                  </div>
                </div>
                <div className="row mh-30">
                  <hr />
                </div>
                <div className="grid-two-elements m-30">
                  <div>
                    <form id="editCard">
                      <div className="row nmh">
                        <div className="col-md-12">
                          <p className="tituloForm">Datos de la tarjeta</p>
                        </div>
                        <div className="col-md-12">
                          <FormTextInput {...cardNumberTextProps} />
                        </div>
                        <div className="col-md-12 legendDown">
                          <p>Escríbelo sin espacios</p>
                        </div>
                        <div className="col-md-12">
                          <p className="tituloForm">datos del tarjetahabiente</p>
                        </div>
                        <div className="col-md-12">
                          <FormTextInput {...firstNameTextProps} />
                        </div>
                        <div className="col-md-12">
                          <FormTextInput {...firstName2TextProps} />
                        </div>
                        <div className="col-md-12">
                          <FormTextInput {...lastNameTextProps} />
                        </div>
                        <div className="col-md-12">
                          <FormTextInput {...lastName2TextProps} />
                        </div>
                        <div className="col-md-12">
                          <div className="grid-two-elements">
                            <div>
                              <button className="btnSecondaryAction custom-size" id="cancelar">Cancelar</button>
                            </div>
                            <div></div>
                            <div>
                              <button className="btnPrimaryAction custom-size" type="submit">Guardar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modalContent"></div>
      </div>

    );
  }
}
export default EditEmployeeCard;
