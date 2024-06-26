import React, { Component } from 'react'
import routeconfig from 'config/routeconfig'
import SelectionTab from '../../../lib/ZUILib/SelectionTab'
import { handleSelectGRType, getCategorySpecificEvents, getEventCategories, resetEventData } from '../../createevent/actions'
import { connect } from 'react-redux'
import Form from '../../../lib/ZUILib/Form'
import { getLabels } from '../../global/Labels/actions'
import commonUtil from '../../../utils/commonUtil'
import { validateRequiredOwner, flushChangeOfEventData } from '../actions'
import appconfig from '../../../config/appconfig'

@connect(
  store => ({
    labels: store.labels.labels,
    eventTypes: store.createevent.eventTypes,
    eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
    eventData: store.createevent.eventData,
    validationRequiredError: store.changeOfEvent.validationRequiredError,
    validationRequired: store.changeOfEvent.validationRequired,
  }),
  { handleSelectGRType, flushChangeOfEventData, getCategorySpecificEvents, getLabels, getEventCategories, resetEventData, validateRequiredOwner },
)
class SelectEventType extends Component {

  constructor(props) {
    super(props)
    this.pageName = ''
    this.state = {
      formErrors: {},
      // enableNextButton: !!(props.eventDetailsInfo && props.eventDetailsInfo.eventType)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.validationRequired && nextProps.validationRequired) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.selectedcelebrated))
    }
    if (!this.props.validationRequiredError && nextProps.validationRequiredError) {
      this.setState({
        error: nextProps.validationRequiredError,
      })
    }
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventDetailsInfo === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root))
    }
    if (!this.props.labels) {
      this.props.getLabels()
    }
    this.props.getEventCategories()
    const eventData = this.props.eventData
    const eventDetailsInfo = this.props.eventDetailsInfo
    let eventCategory = eventDetailsInfo && eventDetailsInfo.eventCategory
    const GRType = eventData && eventData.GRType
    if (GRType) {
      eventCategory = GRType && GRType.tipoMesa
    }
    if (eventCategory) {
      this.props.getCategorySpecificEvents(eventCategory)
    }
  }

  onChangeGiftType = (e) => {
    const val = e.currentTarget.value
    if (val != '') {
      this.props.getCategorySpecificEvents(val)
      if (this.state.errors) {
        this.setState({
          errors: {
            ...this.state.errors,
            [e.target.name]: null,
          },
        })
      }
    }
  }

  onChangeCelebrationType = (e) => {
    const val = e.currentTarget.value
    if (val != '') {
      const eventType = this.props.eventDetailsInfo && this.props.eventDetailsInfo.eventType
      // let enableNextButton = false;
      // if (eventType !== val) {
      //   enableNextButton = true;
      // }
      if (this.state.errors) {
        const updatedState = {
          ...this.state,
          errors: {
            ...this.state.errors,
            [e.target.name]: null,
          },
        }
        this.setState(updatedState)
      }
    }
    this.props.flushChangeOfEventData()
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    if (isValidForm) {
      const eventData = this.props.eventData
      const eventType = eventData && eventData.GRType ? eventData.GRType.tipoCelebracion : ''
      const selectedEventType = formValues.tipoCelebracion
      const eventCategory = formValues.tipoMesa
      const celebrityInfo = this.props.eventDetailsInfo && this.props.eventDetailsInfo.celebrityInfo
      // const ownerEmailId = celebrityInfo && celebrityInfo[0].email
      let ownerEmailId = ''
      celebrityInfo.map((celeb) => {
        if (celeb.iscoOwner === 'false') {
          ownerEmailId = celeb.email
        }
      })
      if (eventType && eventType !== selectedEventType) {
        this.props.resetEventData()
      }
      this.props.handleSelectGRType(formValues)
      const eventId = this.props.eventDetailsInfo && this.props.eventDetailsInfo.eventId
      this.props.validateRequiredOwner(eventCategory, selectedEventType, eventId, ownerEmailId)
      // this.props.router.push(commonUtil.generateRedirect(routeconfig.selectedcelebrated))
    }
  }

  closeError = () => {
    this.setState({
      error: '',
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }

  render() {
    const { labels, eventData, eventDetailsInfo } = this.props
    const EventCreation = labels ? labels.EventCreation : null
    const GRType = eventData && eventData.GRType
    let eventCategory
    let eventType
    if (GRType) {
      eventCategory = GRType && GRType.tipoMesa
      eventType = GRType && GRType.tipoCelebracion
    } else {
      eventCategory = eventDetailsInfo && eventDetailsInfo.eventCategory
      eventType = eventDetailsInfo && eventDetailsInfo.eventType
    }
    const SelectionOptions = {
      options: [{
        option: commonUtil.getLabel(labels, 'categoryLanding.celebration.name'),
        value: appconfig.eventCategory.CELEBRATION,
        disabled: false,
        selected: false,
      }, {
        option: commonUtil.getLabel(labels, 'categoryLanding.open.name'),
        value: appconfig.eventCategory.OPENEVENT,
        disabled: false,
        selected: false,
      }],
    }

    const { errors, error } = this.state
    const { eventTypes } = this.props
    let tipoCelebracionOptions = {}
    const options = []
    if (eventTypes && eventTypes.eventTypesInfo && eventTypes.eventTypesInfo.length > 0) {
      eventTypes.eventTypesInfo.forEach((eventTypeInfo) => {
        const option = {
          option: eventTypeInfo.name,
          value: eventTypeInfo.name,
          disabled: eventTypeInfo.enabled !== true,
          selected: false,
        }
        options.push(option)
      })
      tipoCelebracionOptions = { options }
    }
    const disableNextButton = tipoCelebracionOptions.options ? tipoCelebracionOptions.options.length < 0 : true
    return (
      <div className="container">
        <div className="main">
          <div className="row">
            {error && error.errorMessage &&
              <div className="col-xs-12">
                <div className="alertError" id="emailsDif"><i className="icon-tache2" />
                  <p>{error.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeError} />
                </div>
              </div>}
            <div className="col-md-12">
              {/* <p className="title text-centered titleModule">{EventCreation && EventCreation['category.selection.message']}</p> */}
              <p className="title text-centered titleModule">{commonUtil.getLabel(labels, 'category.selection.message')}</p>
            </div>
            <div className="col-md-12">
              <p className="text-centered">Al cambiar el tipo de evento se deberán validar cambios de los datos registrados en un inicio</p>
            </div>
            <div className="col-md-12">
              <div className="grid-centered-big">
                <div />
                <div className="row">
                  <Form onSubmit={this.handleSubmit}>
                    <div className="col-xs-6 col-xs-offset-3">
                      <p className="text-right requiredFields">* Campos Requeridos</p>
                    </div>
                    <div className="col-xs-6 col-xs-offset-3">
                      <SelectionTab
                        value={eventCategory}
                        id={'tipoMesa'}
                        name={'tipoMesa'}
                        showArrow={false}
                        options={SelectionOptions.options}
                        optionCaption={commonUtil.getLabel(labels, 'category.selection.message')}
                        errors={errors}
                        disable={SelectionOptions.options.length < 0}
                        validators={([
                          {
                            type: 'required',
                            errorMessage: 'Seleccione una opción',
                          },
                        ])}
                        onChange={this.onChangeGiftType}
                      />
                    </div>
                    <div className="col-xs-6 col-xs-offset-3">
                      <SelectionTab
                        value={eventType}
                        id={'tipoCelebracion'}
                        name={'tipoCelebracion'}
                        showArrow={false}
                        options={tipoCelebracionOptions.options}
                        optionCaption={commonUtil.getLabel(labels, 'category.eventType.selection.message')}
                        optionText={'option'}
                        optionValue={'value'}
                        errors={errors}
                        disable={tipoCelebracionOptions.options ? tipoCelebracionOptions.options.length < 0 : true}
                        validators={([
                          {
                            type: 'required',
                            errorMessage: 'Seleccione una opción',
                          },
                        ])}
                        onChange={this.onChangeCelebrationType}
                      />
                    </div>
                    <div className="col-xs-12 centered">
                      <button disabled={disableNextButton} className="btnPrimary size-ExtraLarge">Iniciar cambio de evento</button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default SelectEventType
