import React, { Component } from 'react';
import { connect } from 'react-redux'
import routeconfig from '../../../../config/routeconfig';
import ManagementMenu from '../../Navigation/ManagementMenu';
import EmployeeCardForm from '../EmployeeCardForm';
import Form from '../../../../lib/ZUILib/Form'
import FormTextInput from 'lib/ZUILib/FormTextInput'
import TextInput from '../../../../lib/ZUILib/TextInput'
import { addUpdateEmployeeCardDetails } from './action'
import CommonUtil from '../../../../utils/commonUtil';
import Button from '../../../../lib/ZUILib/Button';
import { getEmployeeCardDetails } from '../EmployeeCards/action';

@connect(
  store => ({
    error: store.addUpdateEmployeeCardDetails.error,
    data: store.addUpdateEmployeeCardDetails,
    employeeCardDetailsData: store.getEmployeeCardDetails.data,
  }), { addUpdateEmployeeCardDetails, getEmployeeCardDetails }
)

class AddNewEmployeeCard extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    errors: {},
    cardData: undefined,
  }
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors
    })
    if (isValidForm) {
      this.props.addUpdateEmployeeCardDetails(formValues);
    }
  }
  UNSAFE_componentWillMount() {
    if (this.props.router.location.query.cardIdx) {
      this.props.getEmployeeCardDetails(this.props.params.eventId);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.success) {
      this.props.router.push(CommonUtil.generateRedirect(routeconfig.employeecards, { eventId: this.props.params.eventId }));
    }
  }
  cancelAddEmployeeCard = (e) => {
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.employeecards, { eventId: this.props.params.eventId }));
  }

  componentDidUpdate = () => {
    CommonUtil.errorScrollUp();
  }
  render() {
    const { error, data } = this.props;
    let editCardIndex = undefined;
    let dataForUpdate = undefined;
    let that = this;
    if (this.props.router.location.query.cardIdx) {
      const { employeeCardDetailsData } = this.props;
      editCardIndex = parseInt(this.props.router.location.query.cardIdx);
      dataForUpdate = employeeCardDetailsData && employeeCardDetailsData.dilisaCardInfo.filter(function (cardInfo, i) {
        if (i == editCardIndex) {
          return cardInfo;
        }
      })[0];
    }
    return (
      <div>
        <div className="container fill">
          <div className="row fill">
            <div className="col-xs-2 fill">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="container-full white shadow mt-30">
                <div className="row mh-30">
                  <div className="col-md-12 mt-30">
                    <p className="tituloSeccion">Agregar tarjeta</p>
                  </div>
                  <div className="col-md-12">
                    <p className="subtituloSeccion">La dirección se editará en la cuenta de Liverpool (Key).</p>
                  </div>
                </div>

                {(error && error.status && error.status.toLowerCase() == "failure") ?
                  <div className="row mh-30">
                    <hr />
                    <div className="col-md-12" id="mensajeError">
                      <div className="alertError" id="errorTarjeta1"><i className="icon-tache2" />
                        <p>{error.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" />
                      </div>
                    </div>
                  </div>
                  : ''}
                {/* employee card form */}
                {/* <EmployeeCardForm /> */}
                <div className="grid-two-elements m-30">
                  <div>
                    <Form onSubmit={this.handleSubmit} method="post" >
                      <input name="eventId" type="hidden" value={this.props.params.eventId} />
                      <input name="cardId" type="hidden" value={dataForUpdate && dataForUpdate.cardId ? dataForUpdate.cardId : ""} />
                      <div className="row nmh">
                        <div className="col-md-12">
                          <p className="tituloForm">Datos de la tarjeta</p>
                        </div>
                        <div className="col-md-12">
                          <TextInput value={dataForUpdate && dataForUpdate.cardNumber ? dataForUpdate.cardNumber : ""}
                            className="inputMaterial"
                            labelClassName="placeHolderMaterial"
                            htmlId="tarjeta1"
                            name="cardNumber"
                            label="Número de tarjeta"
                            type="number"
                            maxlength="16"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa el número de la tarjeta'
                            }, {
                              type: 'exactLength',
                              errorMessage: 'la longitud de la tarjeta debe ser 16',
                              length: 16
                            }]}
                            errors={this.state.errors}
                          />
                        </div>
                        <div className="col-md-12 legendDown">
                          <p>Escríbelo sin espacios</p>
                        </div>
                        <div className="col-md-12">
                          <p className="tituloForm">datos del tarjetahabiente</p>
                        </div>
                        <div className="col-md-12">
                          <TextInput value={dataForUpdate && dataForUpdate.firstName ? dataForUpdate.firstName : ""}
                            className="inputMaterial"
                            labelClassName="placeHolderMaterial"
                            htmlId="tarjeta2"
                            name="firstName"
                            type="text"
                            pattern={/[a-zA-ZÁÉÍÓÚÜÑáéíñóúü-]+/}
                            required="required"
                            label="Nombre"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingrese el nombre del tarjetahabiente'
                            }]}
                            errors={this.state.errors}
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInput value={dataForUpdate && dataForUpdate.middleName ? dataForUpdate.middleName : ""}
                            className="inputMaterial"
                            labelClassName="placeHolderMaterial"
                            htmlId="tarjeta3"
                            name="middleName"
                            type="text"
                            label="Segundo Nombre"
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInput value={dataForUpdate && dataForUpdate.lastName ? dataForUpdate.lastName : ""}
                            className="inputMaterial"
                            labelClassName="placeHolderMaterial"
                            htmlId="tarjeta4"
                            name="lastName"
                            type="text"
                            required="required"
                            label="Apellido Paterno"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingrese el apellido paterno'
                            }]}
                            errors={this.state.errors}
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInput value={dataForUpdate && dataForUpdate.motherLastName ? dataForUpdate.motherLastName : ""}
                            className="inputMaterial"
                            labelClassName="placeHolderMaterial"
                            htmlId="tarjeta5"
                            name="motherLastName"
                            type="text"
                            label="Apellido Materno"
                          />
                        </div>
                        <div className="col-md-12">
                          <div className="grid-two-elements">
                            <div>
                              <Button uiname="EventEmployeeCancelAddEditCard" className="btnSecondaryAction custom-size" id="cancelar" type="button" onClick={this.cancelAddEmployeeCard}>Cancelar</Button>
                            </div>
                            <div></div>
                            <div>
                              <Button uiname="EventEmployeeSaveAddEditCard" className="btnPrimaryAction custom-size" type="submit">Guardar</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modalContent" />
      </div>
    );
  }
}
export default AddNewEmployeeCard;
