
import React, { Component } from 'react';
// import FormTextInput from 'lib/ZUILib/FormTextInput'
import TextInput from 'lib/ZUILib/TextInput'
import { connect } from 'react-redux'
import commonUtil from '../../../utils/commonUtil'
import SelectionTab from '../../../lib/ZUILib/SelectionTab'
import Form from '../../../lib/ZUILib/Form'
import Datetime from 'lib/datetime/DateTime'
import { addCoOwner } from '../actions'
import uuid from 'uuid/v4';
import routeconfig from '../.././../config/routeconfig';
import appconfig from '../../../config/appconfig'

// const uuid = require('uuid-v4');
const { strategy } = require('../SelectedCelebrated/strategy')
@connect(
  store => ({
    eventData: store.createevent.eventData,
    labels: store.labels.labels,
    eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
    eventCategories: store.createevent.eventCategories,
    AddingCoowner: store.changeOfEvent.AddingCoowner
  }), { addCoOwner }
)

class AddNewManager extends Component {
  constructor(props) {
    super(props);
    this.selectedEventConfiguration = ''
    this.titles = ''
    this.ownerlabels = ''
  }
  state = {
    values: {},
    errors: {},
  }
  cancel = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.selectedcelebrated));
  }
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors
    })
    let formId = e.target.id;
    if (isValidForm) {
      const fValues = formValues[formId];
      let params = []
      const defaultOwnerTitle = fValues.nselect
      const index = this.titles.indexOf(defaultOwnerTitle)
      const defaultOwnerLabel = this.ownerlabels[index] ? this.ownerlabels[index] : ''
      let paramsObj = {}
      paramsObj = {
        myUUID: uuid(),
        firstName: fValues.firstName,
        lastName: fValues.lastName,
        motherName: fValues.motherName,
        alias: fValues.alias,
        birthday: fValues.dateOfBirth,
        celebrityLabel: fValues.celebrityLabel ? fValues.celebrityLabel : defaultOwnerLabel,
        title: fValues.nselect,
        // bdayDAY: fValues.dateOfBirth.split('/')[0],
        // bdayMONTH: fValues.dateOfBirth.split('/')[1],
        // bdayYEAR: fValues.dateOfBirth.split('/')[2],
        phone: fValues.ownerPhoneNo,
      }
      params.push(paramsObj)
      this.props.addCoOwner(params);
      this.props.router.push(commonUtil.generateRedirect(routeconfig.selectedcelebrated));
    }
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventDetailsInfo === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
    }
  }

  // componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.AddingCoowner) {
  //     this.enableButton = false
  //   } else {
  //     this.enableButton = true
  //   }
  // }

  render() {
    const { labels } = this.props;
    const { errors } = this.state;
    const eventType = this.props.eventData && this.props.eventData.GRType && this.props.eventData.GRType.tipoCelebracion
    this.titles = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'titles', this.props.eventCategories) : [];
    this.ownerlabels = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'labels', this.props.eventCategories) : [];
    const categoryType = this.props.eventData && this.props.eventData.GRType && this.props.eventData.GRType.tipoMesa_id
    const titleOptions = this.titles && this.titles.map((title, index) => {
      return { option: title, value: title, disabled: false, selected: false }
    })
    if (categoryType === appconfig.eventCategory.CELEBRATION) {
      this.selectedEventConfiguration = strategy.strategies.Celebraciones.types[eventType]
    } else {
      this.selectedEventConfiguration = strategy.strategies.Todo_tipo_de_eventos.types[eventType]
    }
    let SelectionOptions = {
      options: titleOptions,
    }

    const firstNameTextProps = {
      className: 'inputMaterial',
      formId: "addForm",
      type: 'textonly',
      star: "*",
      required: 'required',
      errors: errors,
      htmlId: 'firstName',
      name: 'firstName',
      label: 'Nombre',
      value: '',
      maxlength: 100,
      validators:
        [{
          type: 'required',
          errorMessage: 'El email el obligatorio'
        }],
    }
    const lastNameTextProps = {
      className: 'inputMaterial',
      formId: "addForm",
      type: 'textonly',
      maxlength: 100,
      star: "*",
      required: 'required',
      errors: errors,
      htmlId: 'lastName',
      name: 'lastName',
      label: 'Apellido Paterno',
      value: '',
      validators:
        [{
          type: 'required',
          errorMessage: 'El email el obligatorio'
        }],
    }
    const motherNameTextProps = {
      className: 'inputMaterial',
      formId: "addForm",
      type: 'textonly',
      required: 'required',
      errors: errors,
      htmlId: 'motherName',
      maxlength: 100,
      name: 'motherName',
      label: 'Apellido Materno',
      value: '',
    }
    const aliasTextProps = {
      className: 'inputMaterial',
      formId: "addForm",
      type: 'text',
      required: 'required',
      maxlength: 100,
      errors: errors,
      htmlId: 'alias',
      name: 'alias',
      label: 'Alias',
      value: '',
    }
    const mobileTextProps = {
      className: 'inputMaterial',
      formId: "addForm",
      type: 'number',
      required: 'required',
      errors: errors,
      htmlId: 'ownerPhoneNo',
      name: 'ownerPhoneNo',
      label: 'Celular',
      value: '',
      maxlength: '10'
    }

    const dateFormat = {
      input: true,
      name: 'dateOfBirth',
      className: 'detailInfo',
      timeFormat: false,
      closeOnSelect: true,
      closeOnTab: true,
      defaultValue: '',
      dateFormat: 'DD/MM/YYYY',
      placeholder: 'Fecha de nacimiento',
      stopAutocomplete: true,
      isValidDate: (current) => {
        return current.year() >= 1900 && current.isBefore(Datetime.moment);
      },
    }
    return (
      <div className="wrap-address">
        <div className="container">
          <div className="main">
            <Form id="addForm" onSubmit={this.handleSubmit} onRef={(form) => { this.addForm = form }}>
              <div className="col-xs-12 alignCenter">
                <p className="title">Agregar Administradores</p>
              </div>
              <div className="col-xs-12 borderTopStyle">
                <div className="row">
                  <div className="col-xs-6"></div>
                  <div className="col-xs-6 alignRight">
                    <p className="requiredFields">*Campos obligatorios</p>
                  </div>
                </div>
                <div className="row show-grid-row">
                  <div className="col-xs-12">
                    <div className="alertWarning hidden-alert">
                      <i className="icon-alerta_amarilla"></i>
                      <p>Los cambios realizados se verán reflejados en el usuario Liverpool. (key)</p>
                      <a className="icon-tache2"></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-grid show-grid-row">
                <div className="col-xs-4">
                  <span className="block boldText mb-15">{this.ownerlabels[1]}</span>
                  {!(this.selectedEventConfiguration.titlesEnabled && this.selectedEventConfiguration.dynamicHandling) && <input type="hidden" name="celebrityLabel" value={this.ownerlabels[1]} />}
                  {this.selectedEventConfiguration.titlesEnabled ? <div className="cSelect filters">
                    <SelectionTab
                      id={'typecelebrated'}
                      name={`nselect`}
                      options={SelectionOptions.options}
                      optionCaption={commonUtil.getLabel(labels, 'eventCreation.stage1.selection.role')}
                      optionText={'option'}
                      optionValue={'value'}
                      errors={this.state.errors}
                      disable={SelectionOptions.options.length < 0}
                      formId={`addForm`}
                      validators={([
                        {
                          type: 'required',
                          errorMessage: 'Seleccione una opción',
                        },
                      ])}
                    />
                  </div> : <input type="hidden" name="nselect" value={this.titles[0]} />}
                  <TextInput {...firstNameTextProps} />
                  <TextInput {...lastNameTextProps} />
                  <TextInput {...motherNameTextProps} />
                  <TextInput {...aliasTextProps} />
                  {/* <div className="formBlock">
                    <div className="materialStyle">
                      <div className="inputDate input-group date" id="datetimepicker1">
                        <Datetime
                          {...dateFormat}
                        />
                      </div>
                    </div>
                  </div> */}
                  < div className="form-group">
                    <div className="input-group date" id="datetimepicker1">
                      <Datetime
                        {...dateFormat}
                      />
                    </div>
                  </div>
                  <TextInput {...mobileTextProps} />

                </div>
              </div>
              <div className="row show-grid-row mb-60">
                <div className="col-xs-2">
                  <button type="button" onClick={this.cancel} className="btnSecondaryAction size-Full" data-dismiss="modal">Cancelar</button>
                </div>
                <div className="col-xs-2">
                  <button type="submit" className="btnPrimaryAction size-Full" id="btnGuardar" disabled={this.enableButton} data-dismiss="modal">Guardar</button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div >

    );
  }
}
export default AddNewManager;
