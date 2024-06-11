import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../lib/ZUILib/Form'
import TextInput from 'lib/ZUILib/TextInput'
import ManagementMenu from '../../Navigation/ManagementMenu'
import Datetime from 'lib/datetime/DateTime'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import { getLabels } from '../../../global/Labels/actions'
import { saveEditEvent, validateEmail, createCoOwner, clearValidateEmail, clearCoownerCreated } from './actions'
import { getEventCategoryDetails } from '../EventGralInfo/actions'
import routeconfig from '../../../../config/routeconfig'
import EmailValidationForm from './components/EmailValidationForm'
import DateTime from '../../../../lib/datetime/DateTime'
import moment from 'moment'
import RemovePermissionConfirmationPopUp from './confirmationPopup'
import commonUtil from '../../../../utils/commonUtil'
import appconfig from '../../../../config/appconfig'

const noEditableLabelEvents = [appconfig.eventTypes.Baptism, appconfig.eventTypes.Bar_Mitzvah, appconfig.eventTypes.Bat_Mitzvah, appconfig.eventTypes.Confirmaciòn, appconfig.eventTypes.First_Communion, appconfig.eventTypes.Other_Religious_Ceremonies, appconfig.eventTypes.XV_Anòs]
const eventsEligibleForPermission = [appconfig.eventTypes.XV_Anòs, appconfig.eventTypes.Bebè, appconfig.eventTypes.Boda, appconfig.eventTypes.Aniversario, appconfig.eventTypes.Cumpleaños, appconfig.eventTypes.Despedida, appconfig.eventTypes.Fiesta_infantil, appconfig.eventTypes.Fiesta_Reunión, appconfig.eventTypes.Open_House, appconfig.eventTypes.Others, appconfig.eventTypes.Mascotas]

@connect(
  store => ({
    eventCategoriesDetail: store.createevent.eventCategories,
    labels: store.labels.labels,
    editEvent: store.eventdashboard.eventData,
    editEventSaved: store.saveeditevent.editEventSuccess,
    saveEventValidateEmail: store.saveeditevent,
    saveediteventsuccess: store.saveeditevent && store.saveeditevent.coownerCreated,
    saveediteventerror: store.saveeditevent && store.saveeditevent.error,
    dashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,
  }),
  { getLabels, saveEditEvent, createCoOwner, clearValidateEmail, getEventCategoryDetails, clearCoownerCreated },
)

class EditEventInfo extends Component {
  state = {
    values: {},
    errors: {},
    showToolTipInfo: false,
    sameEmailAddressError: '',
    showConfirmationPopup: true,
    emailChanged: false,
  }
  constructor(props) {
    super(props)
    const { editEvent } = this.props
    this.hideDefaultEmail = editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].email && (editEvent.eventDetailsInfo.isMigratedEvent && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].email.includes('@ta22t.dzewes'))
    this.state = {
      isValidationHidden: editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].displayEmailField === 'true' && true,
      guardarDisableOnIsValidationHidden: false,
      isAccountEditHidden: true,
      isAccessChecked: editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].hasPermission,
      emailVal: editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].email && !this.hideDefaultEmail ? editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].email : '',
      passwordVal: '',
      genderVal: '',
    }
    this.isNewDataSetState = false
    this.handleShowValidation = this.handleShowValidation.bind(this)

  }
  componentDidMount = () => {
    this.props.getLabels()
    if (this.props.eventCategoriesDetail) { this.props.getEventCategoryDetails() }
  }
  componentWillReceiveProps(nextProps) {
    const { editEvent } = nextProps
    if (editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo && !this.isNewDataSetState) {
      const celebrityInfo = editEvent.eventDetailsInfo.celebrityInfo
      this.setState({
        isValidationHidden: celebrityInfo[nextProps.params.celebrityIndex].displayEmailField === 'true' && true,
        guardarDisableOnIsValidationHidden: false,
        isAccessChecked: celebrityInfo[nextProps.params.celebrityIndex].hasPermission,
        emailVal: celebrityInfo[nextProps.params.celebrityIndex].email && !this.hideDefaultEmail ? celebrityInfo[nextProps.params.celebrityIndex].email : '',
      })
      this.isNewDataSetState = true
    }
    if (!this.props.editEventSaved && nextProps.editEventSaved) {
      this.handleCancelEdit()
    }
  }
  handleShowValidation(event) {
    const { editEvent } = this.props

    const email = editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].email && !this.hideDefaultEmail ? editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].email : ''

    const hasPermission = editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex].hasPermission
    if (hasPermission && this.state.emailVal && this.state.emailVal === email && !event.target.checked) {
      this.setState({
        showRemovePermissionConfirmationPopUp: true,
        // showConfirmationPpup: false
        emailVal: email,
        emailChanged: false,
      })
    } else {
      if (event.target.checked) {
        this.props.clearValidateEmail()
        this.props.clearCoownerCreated()
      }
      this.setState({
        emailVal: email,
        // isValidationHidden: event.target.checked,
        guardarDisableOnIsValidationHidden: event.target.checked,
        isAccessChecked: event.target.checked,
        emailChanged: false,
      })
    }
  }

  getParams = () => {
    const channel = 'INSTORE'
    const brand = 'lp'
    const params = {
      channel, //
      brand,
    }
    return params
  }
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    const formId = e.target.id
    if (isValidForm) {
      const fValues = formValues[formId]
      let params = this.getParams()
      if (e.nativeEvent.detail.createuser) {
        params = {
          email: fValues.ownerMail,
          password: fValues.ownerPassword,
          firstName: fValues.firstName,
          lastName: fValues.lastName,
          maternalName: fValues.motherName,
          bdayDAY: fValues.dob.split('/')[0],
          bdayMONTH: fValues.dob.split('/')[1],
          bdayYEAR: fValues.dob.split('/')[2],
          gender: fValues.ownerGender,
          autoLoginCheckbox: false,
        }
        this.props.createCoOwner(params)
      } else {
        params = {
          ...params,
          ownerId: fValues.ownerId,
          ownerTitle: fValues.celeb,
          ownerfirstName: fValues.firstName,
          ownerlastName: fValues.lastName,
          ownerMotherName: fValues.motherName,
          ownerDateofbirth: fValues.dob,
          ownerPhone: fValues.ownerPhoneNo,
          ownerHasPermission: this.state.isAccessChecked,
          ownerEmail: fValues.ownerMail,
          nickName: fValues.alias,
          eventId: this.props.params.eventId,
          profileId: fValues.profileId,
          dashboardUserId: this.props.dashboardUserId || '12345678',
        }
        this.props.saveEditEvent(params)
      }
    }
  }

  // onEmailChange = (flag) => {
  //   this.setState({
  //     enableButton: flag
  //   })
  // }

  handleCancelEdit = () => {
    this.props.clearValidateEmail()
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventgralinfo, { eventId: this.props.params.eventId }))
  }

  enableSubmit = () => {
    this.setState({ guardarDisableOnIsValidationHidden: false })
  }
  setInputEmail = (emailVal) => {
    const { editEvent } = this.props
    const eventData = editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo
    eventData.forEach((cele, index) => {
      if (cele.email) {
        if (index !== +this.props.params.celebrityIndex && cele.email !== emailVal) {
          this.setState({
            emailVal,
            sameEmailAddressError: '',
          })
        } else if (index !== +this.props.params.celebrityIndex && cele.email === emailVal) {
          this.setState({
            sameEmailAddressError: 'El propietario / copropietario no puede tener el mismo ID de correo electrónico',
          })
        }
      } else {
        this.setState({
          emailVal,
          sameEmailAddressError: '',
        })
      }
    })
  }
  setPasswordVal = (passwordVal) => {
    this.setState({
      passwordVal,
    })
  }
  setGenderValue = (genderVal) => {
    this.setState({
      genderVal,
    })
  }
  cancelRemovePermission = () => {
    this.setState({
      showRemovePermissionConfirmationPopUp: false,
    })
  }
  confirmRemovePermission = () => {
    this.setState({
      showRemovePermissionConfirmationPopUp: false,
      // isValidationHidden: false,
      guardarDisableOnIsValidationHidden: false,
      isAccessChecked: false,
      // emailVal: "",
    })
  }
  onHover = () => {
    this.setState({
      showToolTipInfo: !this.state.showToolTipInfo,
    })
  }
  clearReduxError = () => {
    this.props.resetRedux()
  }
  getAdminLabel = (celebrity, eventType) => {
    if (celebrity.hasPermission && celebrity.title && celebrity.celebrityLabel && !celebrity.title.toLowerCase().includes('mr')) {
      return <p className="nameAdmin">{celebrity.title} <span>(Administrador)</span></p>
    } else if (celebrity.hasPermission && celebrity.celebrityLabel && !celebrity.title) {
      return <p className="nameAdmin">{celebrity.celebrityLabel} <span>(Administrador)</span></p>
    }
    return <p className="nameAdmin">{celebrity.celebrityLabel}</p>

  }

  onEmailChange = (isDisabled) => {
    this.setState({
      guardarDisableOnIsValidationHidden: isDisabled,
      emailChanged: isDisabled,
    })
  }
  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }
  render() {

    const eventCategoriesDetail = this.props.eventCategoriesDetail
    const { labels, editEvent, saveEventValidateEmail, saveediteventsuccess } = this.props
    const eventManagement = labels || null
    const { error } = this.props
    let profileId
    if (saveediteventsuccess) {
      profileId = saveEventValidateEmail && saveEventValidateEmail.coOwnerData && saveEventValidateEmail.coOwnerData.profileId
    } else {
      profileId = saveEventValidateEmail && saveEventValidateEmail.validateEmaildata && saveEventValidateEmail.validateEmaildata.profileId
    }
    const displayLabel = ''
    const { errors } = this.state
    // const item = null;
    const item = editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.celebrityInfo[this.props.params.celebrityIndex]
    if (!item) {
      return null
    }
    if (!eventCategoriesDetail) {
      return null
    }
    const preselectedTitle = item.title
    const eventCategory = editEvent.eventDetailsInfo.eventCategory
    const eventType = editEvent.eventDetailsInfo.eventType
    const eventConfigurations = eventCategoriesDetail.eventConfigurations
    let options = []
    if (eventConfigurations) {
      eventConfigurations.forEach((config) => {
        if (config.eventCategory === eventCategory && eventType === config.name) {
          options = config.titles.map(title => ({
            option: title,
            value: title,
            default: title === preselectedTitle,
            selected: title === preselectedTitle,
          }))
        }
      })
    }
    const firstNameTextProps = {
      className: 'inputMaterial',
      formId: 'editForm',
      type: 'textonly',
      star: '*',
      required: 'required',
      errors,
      htmlId: 'firstName',
      name: 'firstName',
      label: 'Nombre',
      value: item && item.firstName,
      // disabled: "disabled",
      validators:
      [{
        type: 'required',
        errorMessage: 'El primer nombre es obligatorio',
      }],
    }
    const ownerTitle = {
      className: '',
      formId: 'editForm',
      type: 'hidden',
      errors,
      htmlId: 'ownerTitle',
      name: 'ownerTitle',
      label: 'ownerTitle',
      value: item && item.title,
    }
    const ownerId = {
      className: '',
      formId: 'editForm',
      type: 'hidden',
      errors,
      htmlId: 'ownerId',
      name: 'ownerId',
      label: 'ownerId',
      value: item && item.repositoryId,
    }
    const lastNameTextProps = {
      className: 'inputMaterial',
      formId: 'editForm',
      type: 'textonly',
      star: '*',
      required: 'required',
      errors,
      htmlId: 'lastName',
      name: 'lastName',
      label: 'Apellido Paterno',
      value: item && item.lastName,
      // disabled: "disabled",
      validators:
      [{
        type: 'required',
        errorMessage: 'El apellido es obligatorio',
      }],
    }
    const motherNameTextProps = {
      className: 'inputMaterial',
      formId: 'editForm',
      type: 'textonly',
      // star: "*",
      // required: 'required',
      errors,
      htmlId: 'motherName',
      name: 'motherName',
      label: 'Apellido Materno',
      value: item && item.motherName,
      // validators:
      //   [{
      //     type: 'required',
      //     errorMessage: 'El nombre de la madre es obligatorio'
      //   }],
    }
    const aliasTextProps = {
      className: 'inputMaterial',
      formId: 'editForm',
      type: 'textonly',
      // star: "*",
      // required: 'required',
      errors,
      htmlId: 'alias',
      name: 'alias',
      label: 'Alias',
      value: item && item.nickName,
      // validators:
      //   [{
      //     type: 'required',
      //     errorMessage: 'Alias ​​es obligatorio'
      //   }],
    }
    const mobileTextProps = {
      className: 'inputMaterial',
      formId: 'editForm',
      type: 'number',
      // star: "*",
      // required: 'required',
      errors,
      htmlId: 'ownerPhoneNo',
      name: 'ownerPhoneNo',
      label: 'Celular',
      value: item && item.phone,
      validators:
      [{
          //   type: 'required',
          //   errorMessage: 'El número de teléfono es obligatorio'
          // },{
        type: 'exactLengthOpt',
        errorMessage: 'Debe ser de 10 dígitos',
        length: 10,
      }],
      maxlength: 10,
    }
    const validationEmailProps = {
      className: 'inputMaterial emailValid',
      formId: 'editForm',
      type: 'email',
      star: '*',
      required: 'required',
      htmlId: 'email',
      name: 'email',
      label: 'Correo electrónico',
      validators:
      [{
        type: 'required',
        errorMessage: 'El email el obligatorio',
      }, {
        type: 'email',
        errorMessage: 'EL usuario ha alcanzado el número máximo de creación de mesas de regalo',
      }],
      errors,
    }

    const TextProps = {
      className: 'inputMaterial date',
      type: 'text',
      placeholder: 'Fecha de nacimiento (key)',
    }
    const roles = {
      options,
    }
    const dateFormat = {
      input: true,
      name: 'dob',
      className: 'detailInfo',
      timeFormat: false,
      closeOnSelect: true,
      closeOnTab: true,
      defaultValue: item && item.dateOfBirth,
      dateFormat: 'DD/MM/YYYY',
      // required: true,
      placeholder: 'Fecha de nacimiento',
      isValidDate: current => current.year() >= 1900 && current.isBefore(DateTime.moment),
      validators: [
        // {
        //   type: 'required',
        //   errorMessage: 'ingresa fecha de nacimiento',
        // },
        {
          type: 'isAfter',
          errorMessage: 'ingresa fecha de válida',
          from: moment('01/01/1900', 'DD/MM/YYYY'),
        }, {
          type: 'isBefore',
          errorMessage: 'ingresa fecha de válida',
        },
      ],
    }
    let globalGuardarDisabled = editEvent &&
      editEvent.validateEmaildata &&
      editEvent.validateEmaildata.status &&
      editEvent.validateEmaildata.profileId === undefined

    globalGuardarDisabled = !globalGuardarDisabled // disable
    globalGuardarDisabled = !!this.state.guardarDisableOnIsValdationHidden
    globalGuardarDisabled = this.state.emailChanged ? true : globalGuardarDisabled
    globalGuardarDisabled = saveEventValidateEmail.emailvalidationSuccess ? false : globalGuardarDisabled

    globalGuardarDisabled = (saveEventValidateEmail && saveEventValidateEmail.validateEmaildata &&
      saveEventValidateEmail.validateEmaildata.status &&
      saveEventValidateEmail.validateEmaildata.profileId === undefined) ? true : globalGuardarDisabled
    globalGuardarDisabled = saveediteventsuccess ? false : globalGuardarDisabled

    if (this.props.saveediteventerror && !commonUtil.isObjectEmpty(this.props.saveediteventerror)) {
      globalGuardarDisabled = !commonUtil.isObjectEmpty(this.props.saveediteventerror) && this.props.saveediteventerror.status && this.props.saveediteventerror.status === 'failure'
    }
    return (
      <React.Fragment>
        <div className="container fill wrapPanel">
          <div className="row fill">
            <div className="col-xs-2 fill">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10 fill">
              <div className="modal fade" id="permissionsModal" tabIndex="{-1}" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                      <p>¿Estás seguro de eliminar los derechos de administración de este festejado?</p>
                      <button className="btnSecondaryAction size-Medium" data-dismiss="modal">Cancelar</button>
                      <button className="btnPrimaryAction size-Medium">Aceptar</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dynamicFrame">
                <div className="row show-grid-row vertical-align">
                  <div className="col-xs-12">
                    <h2 className="titleInfo">Editar datos</h2>
                  </div>
                </div>
                {!commonUtil.isObjectEmpty(this.props.saveediteventerror) || this.state.sameEmailAddressError ?
                  <div className="row show-grid-row vertical-align">
                    <div className="col-xs-12">
                      <div className="alertError"><i className="icon-tache" />
                        <p>{this.props.saveediteventerror.errorMessage || this.state.sameEmailAddressError}</p><a className="icon-tache2" />
                      </div>
                    </div>
                  </div> : null}
                <div className="row show-grid-row vertical-align">
                  <div className="col-xs-5">
                    {/* <p className="nameAdmin">
                      {displayLabel}
                    </p> */}
                    <Form id="editForm" onSubmit={this.handleSubmit} onRef={(form) => { this.editForm = form }}>
                      <input type="hidden" name="profileId" value={profileId || item.profileId} />
                      <input type="hidden" name="ownerId" value={item && item.repositoryId} />
                      <input type="hidden" name="ownerTitle" value={item && item.repositoryId} />
                      <input type="hidden" name="ownerMail" value={this.state.emailVal} />
                      <input type="hidden" name="ownerPassword" value={this.state.passwordVal} />
                      <input type="hidden" name="ownerGender" value={this.state.genderVal} />
                      {this.getAdminLabel(item, eventType)}
                      {noEditableLabelEvents.indexOf(eventType) === -1 ?
                        <div className="cSelect filters">
                          <SelectionTab
                            id={'celeb'}
                            name={'celeb'}
                            options={roles.options}
                            optionText={'option'}
                            optionValue={'value'}
                            value={item.title}
                            disable
                          />
                          <i className="icon-caret_down" />
                        </div> :
                        <input type="hidden" name="celeb" value={item && item.celebrityLabel} />
                      }
                      <TextInput {...firstNameTextProps} />
                      <TextInput {...lastNameTextProps} />
                      <TextInput {...motherNameTextProps} />
                      <TextInput {...aliasTextProps} />
                      <div className="formBlock">
                        <div className="materialStyle">
                          <div className="inputDate input-group date">
                            <Datetime
                              {...dateFormat}
                            //  errors={errors}
                            // ref={(eventDate) => { this.eventDate = eventDate }}
                            // placeholder={"Fecha de nacimiento (key)"}
                            />

                          </div>
                        </div>
                      </div>
                      <TextInput {...mobileTextProps} />
                    </Form>
                    <RemovePermissionConfirmationPopUp
                      labels={labels}
                      cancel={this.cancelRemovePermission}
                      showRemovePermissionConfirmationPopUp={this.state.showRemovePermissionConfirmationPopUp}
                      confirmRemovePermission={this.confirmRemovePermission}
                      email={this.state.emailVal}
                    />
                    {(item && item.iscoOwner === 'true' && eventsEligibleForPermission.indexOf(eventType) > -1) ?
                      <div className="checkbox checkDiv">
                        <input id="accessCheck" type="checkbox" checked={this.state.isAccessChecked} onChange={this.handleShowValidation} />
                        <label htmlFor="accesCheck">{eventManagement && commonUtil.getLabel(eventManagement, 'dashboard.eventDetails.permission')}</label>
                        <span className="askIcon" onMouseLeave={this.onHover} onMouseOver={this.onHover}>?</span>
                        <div className={this.state.showToolTipInfo ? 'popover left showPopOver' : 'popover left'}>
                          <div className="arrow" />
                          <div className="popover-content">
                            {eventManagement && commonUtil.getLabel(eventManagement, 'editevent.remove.admin.permission')}
                          </div>
                        </div>
                      </div> : null
                    }
                    {(this.state.isValidationHidden && this.state.isAccessChecked && eventsEligibleForPermission.indexOf(eventType) > -1) ?
                      <EmailValidationForm
                        clearValidateEmail={this.props.clearValidateEmail}
                        enableSubmit={this.enableSubmit}
                        onEmailChange={this.onEmailChange}
                        defaultValue={this.state.emailVal}
                        emailValue={this.setInputEmail}
                        passwordValue={this.setPasswordVal}
                        genderValue={this.setGenderValue}
                        editForm={this.editForm}
                        onEmailChange={this.onEmailChange}
                      />
                      : null}
                    <div className="buttonsWrapper row">
                      <button className="btnSecondaryAction size-Medium col-xs-5" onClick={this.handleCancelEdit} >Cancelar</button>
                      <button
                        disabled={globalGuardarDisabled}
                        className="btnPrimaryAction size-Medium col-xs-5 col-xs-offset-1"
                        onClick={() => this.editForm.dispatchEvent(new CustomEvent('submit', { detail: { createuser: false } }))}
                      >
                        Guardar
                        </button>
                    </div>

                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default EditEventInfo
