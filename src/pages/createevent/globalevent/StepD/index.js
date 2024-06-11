import React, { Component } from 'react'
import Datetime from 'lib/datetime/DateTime'
import routeconfig from 'config/routeconfig'
import TextInput from '../../../../lib/ZUILib/TextInput'
import Form from '../../../../lib/ZUILib/Form'
import { validateEventName, enableSaveButton } from '../../actions'
import { getLabels } from '../../../global/Labels/actions'
import { connect } from 'react-redux'
import commonUtil from '../../../../utils/commonUtil'
import moment from 'moment'

@connect(
  store => ({
    labels: store.labels.labels,
    eventCategories: store.createevent.eventCategories,
    eventData: store.createevent.eventData,
    isValidEvent: store.createevent.isValidEvent,
    eventNameError: store.createevent.eventNameError,
  }), { validateEventName, getLabels, enableSaveButton },
)

class StepD extends Component {

  constructor(props) {
    super(props)
    this.pageLoad = true
  }

  state = {
    errors: {},
  }

  componentWillMount = () => {
    if (!this.props.labels) {
      this.props.getLabels()
    }
    if (this.props.eventData === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isValidEvent && nextProps.isValidEvent) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepe))
    }
    if (!this.props.eventNameError && nextProps.eventNameError) {
      this.setState({
        eventNameError: nextProps.eventNameError,
      })
    }
  }

  handleRoute = (routePath) => {
    this.props.enableSaveButton()
    this.props.router.push(commonUtil.generateRedirect(routePath))
  }

  submitForm = (e) => {
    e.preventDefault()
    this.formToSubmit.dispatchEvent(new Event('submit', { cancelable: true }))
  }

  handleConfirmDate = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    const formId = e.target.id
    if (isValidForm) {
      const values = formValues
      // delete values.eventDate;
      this.props.validateEventName(values)
      this.pageLoad = false
    }
  }

  closeError = () => {
    this.setState({
      eventNameError: '',
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }

  render() {
    const eventType = this.props.eventData && this.props.eventData.GRType.tipoCelebracion
    let minDays = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'minDays', this.props.eventCategories) : 0
    const maxDays = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'maxDays', this.props.eventCategories) : minDays
    minDays = minDays && minDays > 0 ? minDays - 1 : 0
    const minDate = minDays === 0 ? moment() : moment().add(minDays, 'day')
    const viewDate = minDays === 0 ? moment() : moment().add(minDays + 1, 'day')
    const maxDate = maxDays === 0 ? moment() : moment().add(maxDays, 'day')
    // maxDays = maxDays ? maxDays + minDays : minDays
    const dateFormat = {
      input: true,
      name: 'eventDate',
      timeFormat: false,
      viewDate,
      closeOnSelect: true,
      dateFormat: 'DD/MM/YYYY',
      required: true,
      isValidDate: current => (current.isAfter(minDate) && current.isBefore(maxDate)),
      validators: [
        {
          type: 'required',
          errorMessage: 'ingresa fecha del evento',
        }, {
          type: 'isAfter',
          errorMessage: 'ingresa fecha de válida',
          from: moment().add(minDays, 'day'),
        }, {
          type: 'isBefore',
          errorMessage: 'ingresa fecha de válida',
          to: moment().add(maxDays, 'day'),
        }, {
          type: 'dateFormat',
          errorMessage: 'Ingrese la fecha en el siguiente formato: DD/MM/YYYY',
          format: 'DD/MM/YYYY',
        },
      ],
      // validators: []
    }
    const { eventNameError } = this.state
    const { labels, eventData } = this.props
    const ownerEmail = eventData && eventData.ownerInfo ? eventData.ownerInfo.emailId : ''
    const coownerEmail = eventData && eventData.coownerInfo ? eventData.coownerInfo.emailId : ''
    const { errors } = this.state
    // const EventCreation = labels ? labels.EventCreation : null
    return (
      <React.Fragment>
        <div className="container">
          <div className="main">
            <div className="row">
              <div className="col-xs-12">
                <p className="title text-centered titleModule">DATOS DEL EVENTO</p>
              </div>
              <div className="col-xs-12">
                <div className="grid-centered-big">
                  <div />
                  <div className="row">
                    {eventNameError && eventNameError.errorMessage &&
                      <div className="col-xs-12">
                        <div className="alertError" id="registeredInformation"><i className="icon-tache2" />
                          <p>{commonUtil.getLabel(labels, eventNameError.errorMessage)}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeError} />
                        </div>
                      </div>
                    }
                    <Form onRef={(formToSubmit) => { this.formToSubmit = formToSubmit }} onSubmit={this.handleConfirmDate} method="post">
                      <div className="col-xs-6 col-xs-offset-3 alignRight">
                        <p className="text-right requiredFields">* Campos Requeridos</p>
                      </div>
                      <input type="hidden" name="ownerEmail" value={ownerEmail} />
                      <input type="hidden" name="coOwnerEmail" value={coownerEmail} />
                      <div className="col-xs-6 col-xs-offset-3">
                        <div className="formBlock">
                          <Datetime
                            defaultValue={eventData && eventData.eventDate}
                            {...dateFormat}
                            errors={errors}
                            stopAutocomplete
                            ref={(eventDate) => { this.eventDate = eventDate }}
                            placeholder={commonUtil.getLabel(labels, 'eventCreation.stage2.eventDate')}
                          />
                        </div>
                      </div>
                      <div className="col-xs-6 col-xs-offset-3">
                        <TextInput
                          value={eventData && eventData.eventName}
                          className="inputMaterial"
                          labelClassName="placeHolderMaterial"
                          htmlId="eventName"
                          name="eventName"
                          type="text"
                          maxlength={100}
                          label={commonUtil.getLabel(labels, 'eventCreation.stage2.eventName')}
                          required="required"
                          star="*"
                          errors={errors}
                          validators={([
                            {
                              type: 'required',
                              errorMessage: commonUtil.getLabel(labels, 'dashboard.eventDetails.editEventName.errorMessage2'),
                            },
                          ])}
                        />
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <hr />
                <div className="botonesSeparados">
                  <button className="btnSecondary size-ExtraLarge" type="button" onClick={e => this.handleRoute(routeconfig.globalstepc)}><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
                  <button className="btnPrimary size-ExtraLarge" type="button" onClick={this.submitForm}><i className="iconRight icon-flecha_lightsvg_derecha" /> Siguiente paso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default StepD
