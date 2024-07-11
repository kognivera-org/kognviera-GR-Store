
import React, { Component } from 'react'
import { getLabels } from '../../global/Labels/actions'
import { connect } from 'react-redux'
import commonUtil from '../../../utils/commonUtil'
import SelectionTab from '../../../lib/ZUILib/SelectionTab'
import TextInput from '../../../lib/ZUILib/TextInput'
import Form from '../../../lib/ZUILib/Form'
import { handleUpdatedCelebrityInfo, handleUpdatedCelebrityInfos, handleDeletedCelebrityInfo, updateAddCoOwner, isCoOwnerEligible, isCoOwner2Eligible } from '../actions'
import routeconfig from '../../../config/routeconfig'
import appconfig from '../../../config/appconfig'
import _ from 'lodash'

const { strategy } = require('./strategy')

@connect(
  store => ({
    eventData: store.createevent.eventData,
    labels: store.labels.labels,
    eventCategories: store.createevent.eventCategories,
    celebrityInfo: store.eventdashboard.eventData.eventDetailsInfo && store.eventdashboard.eventData.eventDetailsInfo.celebrityInfo,
    eventId: store.eventdashboard.eventData.eventDetailsInfo && store.eventdashboard.eventData.eventDetailsInfo.eventId,
    addedCoowner: store.changeOfEvent.addedCoowner,
    eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
    updatedcelebrityInfo: store.changeOfEvent.celebrityInfo,
    celebrityInfos: store.changeOfEvent.celebrityInfos,
    celebrityInfoUpdating: store.changeOfEvent.celebrityInfoUpdating,
    validationRequired: store.changeOfEvent.validationRequired,
    eligibilityValidationSuccess: store.changeOfEvent.eligibilityValidationSuccess,
    eligibilityValidation2Success: store.changeOfEvent.eligibilityValidation2Success,
    eligibilityValidationError: store.changeOfEvent.eligibilityValidationError,
    eligibilityValidation2Error: store.changeOfEvent.eligibilityValidation2Error,

  }),
  { getLabels, handleUpdatedCelebrityInfo, handleUpdatedCelebrityInfos, handleDeletedCelebrityInfo, updateAddCoOwner, isCoOwnerEligible, isCoOwner2Eligible },
)

class SelectedCelebrated extends Component {
  constructor(props) {
    super(props)
    this.deletedCelebInfo = []
    this.maxCount = ''
    this.minCount = ''
    this.selectedEventConfiguration = ''
    this.coOwner2 = false
    this.pageLoad = false
    this.titles = ''
    this.ownerLabels = ''
  }
  state = {
    formErrors: {},
    celebInfo: [],
    errorMessage: '',
    handleDynamically: false,
    // deletedCelebInfo: []
  }

  handleSubmit = (e) => {
    //e.preventDefault()
    this.formToSubmit.dispatchEvent(new Event('submit'))
  }

  handleDelete = (index) => {
    if (this.state.celebInfo[index].repositoryId) {
      const deletedCelebInfo = this.state.celebInfo[index]
      const deletedCelebrityInfo = []
      const formValues = {}
      formValues.ownerId = deletedCelebInfo.repositoryId
      deletedCelebrityInfo.push(formValues)
      this.props.handleDeletedCelebrityInfo(deletedCelebrityInfo)
      const updatedInfo = this.props.updatedcelebrityInfo.filter((celeb, id) => celeb.repositoryId !== this.state.celebInfo[index].repositoryId)
      this.pageLoad = false
      this.props.handleUpdatedCelebrityInfo(updatedInfo)
    } else {
      const updatedInfo = this.props.addedCoowner.filter((celeb, id) => celeb.myUUID !== this.state.celebInfo[index].myUUID)
      this.props.updateAddCoOwner(updatedInfo)
    }

  }

  updateCelebRole = (e, index, property) => {
    if (property) {
      if (this.state.celebInfo[index].repositoryId) {
        const updatedInfo = this.props.updatedcelebrityInfo.map((celeb, id) => {
          if (celeb.repositoryId === this.state.celebInfo[index].repositoryId) {
            celeb[property] = e.currentTarget.value
            return celeb
          }
          return celeb
        })
        this.props.handleUpdatedCelebrityInfo(updatedInfo)
      } else {
        const updatedInfo = this.props.addedCoowner.map((celeb, id) => {
          if (celeb.myUUID === this.state.celebInfo[index].myUUID) {
            celeb[property] = e.currentTarget.value
            if (property === 'title') {
              const defaultOwnerTitle = e.currentTarget.value
              const index = this.titles.indexOf(defaultOwnerTitle)
              celeb.celebrityLabel = this.ownerLabels[index] ? this.ownerLabels[index] : ''
            }
            return celeb
          }
          return celeb
        })
        this.props.updateAddCoOwner(updatedInfo)
      }
    }
  }

  getParams = () => {
    const channel = 'INSTORE'
    const brand = 'lp'
    const params = {
      // channel: channel,
      // brand: brand,
      eventId: this.props.eventId,
    }
    return params
  }

  handleConfirmFormSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    if (this.state.handleDynamically) {
      this.minCount = 2
    }
    if (this.state.celebInfo.length < this.minCount || this.state.celebInfo.length > this.maxCount) {
      this.setState({
        errorMessage: 'Es necesario agregar o eliminar personas dependiendo del tipo de evento',
      })
    } else {
      this.setState({
        errorMessage: '',
        ...this.state,
        errors: formErrors,
      })
      const formId = e.target.id
      if (isValidForm) {
        this.setValues(e, formValues[formId])
      }
    }
  }

  componentDidMount = () => {
    if (!this.props.updatedcelebrityInfo) {
      this.props.handleUpdatedCelebrityInfo(this.props.celebrityInfo)
    } else {
      this.setState({
        celebInfo: [...this.props.updatedcelebrityInfo, ...this.props.addedCoowner],
      })
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (!this.props.eligibilityValidationError && nextProps.eligibilityValidationError) {
      this.setState({
        errorMessage: nextProps.eligibilityValidationError.errorMessage,
      })
    } else if (!this.props.eligibilityValidation2Error && nextProps.eligibilityValidation2Error) {
      this.setState({
        errorMessage: nextProps.eligibilityValidation2Error.errorMessage,
      })
    } else if (this.coOwner2 && this.props.eligibilityValidationSuccess && !this.props.eligibilityValidation2Success && nextProps.eligibilityValidation2Success) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.eventinfo))
    } else if (!this.coOwner2 && !this.props.eligibilityValidationSuccess && nextProps.eligibilityValidationSuccess) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.eventinfo))
    } else if (nextProps.updatedcelebrityInfo && !nextProps.celebrityInfoUpdating) {
      this.setState({
        celebInfo: [...nextProps.updatedcelebrityInfo, ...nextProps.addedCoowner],
      })
    }
  }

  handleRoute = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.selecteventtype))
  }

  addAdmin = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.addnewmanager))
  }

  setValues = (e, values) => {
    e.preventDefault()
    const celebrityTitle = []
    const eventType = this.props.eventData && this.props.eventData.GRType.tipoCelebracion
    let updatedCelebrityInfo = []
    for (let i = 0; i < Object.keys(values).length; i++) {
      const key = Object.keys(values)[i]
      if (key.indexOf('_option') === -1) {
        celebrityTitle.push(values[key])
      }
    }
    if (this.selectedEventConfiguration.dynamicHandling) {
      let check = true
      for (let i = 0; i < celebrityTitle.length; i += 2) {
        const isCelebrity = celebrityTitle[i].toLowerCase().includes(appconfig.celebLabels.festejado)
        if (isCelebrity) {
          check = false
        }
      }
      if (check) {
        return this.setState({
          errorMessage: 'uno debe ser celebrado',
        })
      }
      this.setState({
        errorMessage: '',
      })

    }
    let a = 0
    for (let i = 0; i < celebrityTitle.length; i += 2) {
      const defaultOwnerTitle = celebrityTitle[i]
      const index = this.titles.indexOf(defaultOwnerTitle)
      const defaultOwnerLabel = this.ownerLabels[index] ? this.ownerLabels[index] : ''
      let formValues = {}
      formValues = Object.assign({
        ...this.state.celebInfo[a],
        title: celebrityTitle[i],
        celebrityLabel: celebrityTitle[i + 1] ? celebrityTitle[i + 1] : defaultOwnerLabel,
      })
      a++
      updatedCelebrityInfo.push(formValues)
    }

    this.props.handleUpdatedCelebrityInfos(updatedCelebrityInfo)

    updatedCelebrityInfo = updatedCelebrityInfo.filter((celeb, id) => {
      if (celeb.repositoryId !== undefined) { return celeb }
    })
    this.props.handleUpdatedCelebrityInfo(updatedCelebrityInfo)
    const emails = []
    if ((updatedCelebrityInfo[1] && updatedCelebrityInfo[1].email) || (updatedCelebrityInfo[2] && updatedCelebrityInfo[2].email)) {
      if (updatedCelebrityInfo[1] && updatedCelebrityInfo[1].email) {
        emails.push(updatedCelebrityInfo[1].email)
      }
      if (updatedCelebrityInfo[2] && updatedCelebrityInfo[2].email) {
        emails.push(updatedCelebrityInfo[2].email)
      }
      if (emails.length === 2) {
        this.coOwner2 = true
      } else {
        this.coOwner2 = false
      }
      this.pageLoad = true
      this.props.isCoOwnerEligible(emails, eventType, this.props.eventId)
    } else {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.eventinfo))
    }
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventDetailsInfo === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root))
    }
    if (!this.props.labels) {
      this.props.getLabels()
    }
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }
  render() {
    const { labels, celebrityInfo, validationRequired } = this.props
    this.maxCount = validationRequired && validationRequired.maximumAllowed && validationRequired.maximumAllowed.maxOwnerAllowed
    this.minCount = validationRequired && validationRequired.minimumAllowed && validationRequired.minimumAllowed.minOwnerAllowed
    const eventType = this.props.eventData && this.props.eventData.GRType.tipoCelebracion
    const categoryType = this.props.eventData && this.props.eventData.GRType.tipoMesa_id
    const eventManagement = labels ? labels.eventManagement : null

    this.titles = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'titles', this.props.eventCategories) : []
    const ownerLabels = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'labels', this.props.eventCategories) : []
    this.ownerLabels = ownerLabels
    const titleOptions = this.titles && this.titles.map(title => ({ option: title, value: title, disabled: false, selected: false }))
    const lableOptions = ownerLabels && ownerLabels.map(title => ({ option: title, value: title, disabled: false, selected: false }))
    const SelectionOptions = {
      options: titleOptions,
    }
    const SelectionOptionsLables = {
      options: lableOptions,
    }
    if (categoryType === appconfig.eventCategory.CELEBRATION) {
      this.selectedEventConfiguration = strategy.strategies.Celebraciones.types[eventType]
    } else {
      this.selectedEventConfiguration = strategy.strategies.Todo_tipo_de_eventos.types[eventType]
    }
    return (
      <div className="wrap-address">
        <div className="container">
          <div className="main">
          <Form id="form1" onRef={(formToSubmit) => { this.formToSubmit = formToSubmit }} onSubmit={this.handleConfirmFormSubmit} method="post">
            <div className="col-xs-12 alignCenter">
              <p className="title">Selección de festejados</p>
            </div>
            <div className="col-xs-12 alignCenter">
              <p>Validación de número de festejados y roles de administración.</p>
            </div>
            <div className="row show-grid">
              <div className="col-xs-3 col-xs-offset-9 alignRight">
                {/* <button className="btnSecondarySpecial size-Full addDir" disabled={!(this.state.celebInfo.length < this.maxCount)} id="addFestejado" onClick={this.addAdmin}>Agregar festejados</button> */}
                <button className="btnSecondarySpecial size-Full addDir" id="addFestejado" onClick={this.addAdmin}>Agregar festejados</button>
              </div>
            </div>
            <div className="col-xs-12 borderTopStyle">
              <div className="row">
                <div className="col-xs-6">
                  <p className="grayText">{`Puedes tener ${this.maxCount} personas en este evento`}</p>
                </div>
                <div className="col-xs-6 alignRight">
                  <p className="requiredFields">*Campos obligatorios</p>
                </div>
              </div>
              {this.state.errorMessage && <div className="row show-grid-row" id="error1">
                <div className="col-xs-12 nph">
                  <div className="alertError"><i className="icon-alerta_amarilla" />
                    <p>{this.state.errorMessage}</p><a className="icon-tache2" />
                  </div>
                </div>
              </div>}
            </div>
            <div className="row row-grid show-grid-row mb-60">
              
                {this.state.celebInfo.map((celeb, id) => (
                  <div className="col-xs-4" key={id} id={id}>
                    {this.selectedEventConfiguration && this.selectedEventConfiguration.titlesEnabled ? <div><SelectionTab
                      id={'typecelebrated'}
                      name={`nselect${id}`}
                      value={this.selectedEventConfiguration.ownerRole && id === 0 ? titleOptions[0].value : celeb.title ? celeb.title : ''}
                      options={SelectionOptions.options}
                      optionCaption={commonUtil.getLabel(labels, 'eventCreation.stage1.selection.role')}
                      optionText={'option'}
                      optionValue={'value'}
                      onChange={e => this.updateCelebRole(e, id, 'title')}
                      errors={this.state.errors}
                      disable={(SelectionOptions.options && SelectionOptions.options.length < 0) || (this.selectedEventConfiguration.ownerRole && id === 0)}
                      formId={'form1'}
                      validators={([
                        {
                          type: 'required',
                          errorMessage: 'Seleccionar una opcion de festejado',
                        },
                      ])}
                    />
                      {!(this.selectedEventConfiguration.titlesEnabled && this.selectedEventConfiguration.dynamicHandling) ? <input type="hidden" name={`ownerLabel${id}`} value={id === 0 ? ownerLabels[0] : ownerLabels[1]} /> : <input type="hidden" name={`ownerLabel${id}`} value="" />}
                    </div>
                      :
                    <div>
                      <input type="hidden" name={`ownerTitle${id}`} value={id === 0 ? titleOptions[0] && titleOptions[0].value : titleOptions[1] ? titleOptions[1].value : titleOptions[0] && titleOptions[0].value} />
                      <SelectionTab
                        id={'typecelebrated'}
                        name={`nselect${id}`}
                        value={this.selectedEventConfiguration && this.selectedEventConfiguration.coOwnerRole ? id === 0 ? ownerLabels[0] : ownerLabels[1] : celeb.title ? celeb.title : ''}
                        options={SelectionOptionsLables.options}
                        optionCaption={commonUtil.getLabel(labels, 'eventCreation.stage1.selection.role')}
                        optionText={'option'}
                        optionValue={'value'}
                        onChange={e => this.updateCelebRole(e, id, 'celebrityLabel')}
                        errors={this.state.errors}
                        disable={SelectionOptions.options.length < 0 || (this.selectedEventConfiguration && this.selectedEventConfiguration.coOwnerRole)}
                        formId={'form1'}
                        validators={([
                          {
                            type: 'required',
                            errorMessage: 'Seleccionar una opcion de festejado',
                          },
                        ])}
                        /></div>}
                    <span className="block infoText">Nombre</span>
                    <span className="block boldText salto-doble">{celeb.firstName}</span>
                    <span className="block infoText">Apellido Paterno</span>
                    <span className="block boldText salto-doble">{celeb.lastName}</span>
                    <span className="block infoText">Apellido Materno</span>
                    <span className="block boldText salto-doble">{celeb.motherName}</span>
                    <span className="block infoText">Alias</span>
                    <span className="block boldText salto-doble">{celeb.alias}</span>
                    <span className="block infoText">Celular</span>
                    <span className="block boldText salto-doble">{celeb.phone}</span>
                    <span className="block infoText">Correo electrónico</span>
                    <span className="block boldText salto-doble">{celeb.email}</span>
                    {/* {id !== 0 && <button type="button" onClick={(e) => this.handleDelete(id)} className="btnPrimaryAction size-ExtraLarge" id={`btn${id}`}>Eliminar</button>} */}
                    {celeb.iscoOwner !== 'false' && <button type="button" onClick={e => this.handleDelete(id)} className="btnPrimaryAction size-ExtraLarge" id={`btn${id}`}>Eliminar</button>}
                  </div>
                ))}

            </div>
            <div className="row show-grid borderTopStyle">
              <div className="col-xs-6 alignLeft">
                <button type="button" onClick={this.handleRoute} className="btnSecondaryAction size-ExtraLarge"><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
              </div>
              <div className="col-xs-6 alignRight">
                <button className="btnPrimary size-ExtraLarge 111" id="btnSiguiente" onClick={this.handleSubmit}>Siguiente paso <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
              </div>
            </div>
            </Form>
          </div>
        </div>
      </div>

    )
  }
}
export default SelectedCelebrated
