
import React, { Component } from 'react';
import { connect } from 'react-redux'
import routeconfig from 'config/routeconfig'
import Form from '../../../../lib/ZUILib/Form'
import FormTextInput from 'lib/ZUILib/FormTextInput'
import TextInput from '../../../../lib/ZUILib/TextInput'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import { getLabels } from '../../../global/Labels/actions'
import { addNewCreditCardDetails, updateEmployeeCardDetails } from '../../employeeCreditCardInfo/actions'
import commonUtil from '../../../../utils/commonUtil'

@connect(
  store => ({
    error: store.employeeCard.error,
    eventData: store.createevent.eventData,
    employeeCard: store.employeeCard.employeeCard
  }), { getLabels, addNewCreditCardDetails, updateEmployeeCardDetails }
)

class AddNewCreditCard extends Component {
  state = {
    errors: {},
    error: ''
  }
  componentWillMount = () => {
    this.props.getLabels()
  }

  componentWillReceiveProps = (nextProps) => {

    if (!this.props.employeeCard && nextProps.employeeCard) { // check success of api calll
      this.props.updateEmployeeCardDetails(this.props.eventData, nextProps.employeeCard, nextProps.location.query.idx)
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepi + '?cardAdded=true'));
    }

    if (nextProps.error) {
      this.setState({
        error: nextProps.error
      })
    }
  }

  handleRoute = (routePath) => {
    this.props.router.push(commonUtil.generateRedirect(routePath));
    //this.props.router.push(`/${routePath}`)
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors
    })
    if (isValidForm) {
      //const values = formValues;
      this.props.addNewCreditCardDetails(formValues);
    }
  }

  closeError = () => {
    this.setState({
      error: ''
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {

    const { errors, error } = this.state;
    const { eventData } = this.props;
    // const ownerId = (eventData && eventData.ownerInfo) ? eventData.ownerInfo.profileId : '';
    const employeeCardData = eventData ? eventData.employeeCardData : []
    const index = this.props.location.query.idx;
    const cardForEdit = index && employeeCardData.length > parseInt(index) ? employeeCardData[index] : undefined

    return (
      <div className="container">
        <div className="main">
          <div className="row">
            <div className="col-xs-12 mainTitle">
              <h1>Agregar tarjeta</h1>
            </div>
            <div className="col-xs-12 rowLblInfo">
              <label>La dirección se agregará a la cuenta de Liverpool.</label>
            </div>
          </div>
          <div className="row bodyEmployee">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 rowNotification reverseInfo">
                  <label className="lblrequired">* Campos obligatorios</label>
                </div>
              </div>
              <Form onSubmit={this.handleSubmit}>
                {/* <input name="ownerId" type="hidden" value={ownerId} /> */}
                {error && error.errorMessage &&
                  <div className="row">
                    <div className="col-xs-12 errorInfo">
                      <div className="alertError">
                        <i className="icon-tache2"></i>
                        <p>{error.errorMessage}</p>
                        <a className="icon-tache2" onClick={this.closeError} ></a>
                      </div>
                    </div>
                  </div>}

                <div className="row">
                  <div className="col-xs-4 formNewCard">
                    <p className="detailCard cardIdentifier lblform">Datos de la tarjeta</p>

                    <TextInput value={cardForEdit && cardForEdit.cardNumber}
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      divClassName="materialStyle reduceLine"
                      htmlId="tarjeta1"
                      name="cardNumber"
                      label="Número de tarjeta"
                      type="number"
                      maxlength={16}
                      required="required"
                      //placeholder="Dilisa card number"
                      star="*"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingresa el número de la tarjeta'
                      }, {
                        type: 'minLength',
                        errorMessage: 'El número de la tarjeta debe tener 16 dígitos',
                        minLength: 16
                      }]}
                      errors={this.state.errors}
                    />
                    {/* <SelectionTab
                      name="cardType"
                      options={tarjetaOptions.options}
                      optionText={'option'}
                      optionValue={'value'}
                      disable={tarjetaOptions.options.length < 0}
                    /> */}

                    <p className="infoDetail">Escribelo sin espacios</p>
                    <p className="detailCard cardIdentifier lblform">Datos del tarjetahabiente</p>

                    <TextInput value={cardForEdit && cardForEdit.firstName}
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      htmlId="tarjeta2"
                      name="firstName"
                      type="textonly"
                      pattern={/[a-zA-ZÁÉÍÓÚÜÑáéíñóúü-]+/}
                      required="required"
                      star="*"
                      maxlength={255}
                      label="Nombre"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingrese el nombre del tarjetahabiente'
                      }]}
                      errors={this.state.errors}
                    />

                    <TextInput value={cardForEdit && cardForEdit.middleName}
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      type="textonly"
                      htmlId="tarjeta3"
                      name="middleName"
                      // pattern={/^[\u00C0-\u00FFa-zA-Z-']+$/}
                      label="Segundo Nombre"
                      maxlength={255}
                      required="required"
                    />

                    <TextInput value={cardForEdit && cardForEdit.lastName}
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      type="textonly"
                      htmlId="tarjeta4"
                      name="lastName"
                      // pattern={/^[\u00C0-\u00FFa-zA-Z-']+$/}
                      maxlength={255}
                      required="required"
                      star="*"
                      label="Apellido Paterno"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingrese el apellido paterno'
                      }]}
                      errors={this.state.errors}
                    />

                    <TextInput value={cardForEdit && cardForEdit.motherLastName}
                      className="inputMaterial"
                      labelClassName="placeHolderMaterial"
                      type="textonly"
                      htmlId="tarjeta5"
                      name="motherLastName"
                      maxlength={255}
                      // pattern={/^[\u00C0-\u00FFa-zA-Z-']+$/}
                      // type="text"
                      label="Apellido Materno"
                      required="required"
                    />
                  </div>

                  <div className="col-xs-8">
                    <div className="ctrlBtn ctrlBtnAddNewCreditCard">
                      <input className="btnSecondaryAction size-Large" type="button" onClick={(e) => this.handleRoute(routeconfig.globalstepi)} value="Cancelar" />
                      <button className="btnPrimaryAction size-Large" type="submit">Guardar</button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <p className="footerInfo">Al dar click en Guardar admites que estás de acuerdo con nuestros <label>Términos y Condiciones así como las Políticas de uso de datos.</label> </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AddNewCreditCard;
