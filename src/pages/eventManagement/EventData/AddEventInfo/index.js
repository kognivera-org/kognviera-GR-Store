import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from '../../../../lib/ZUILib/Form';
import TextInput from 'lib/ZUILib/TextInput';
import ManagementMenu from '../../Navigation/ManagementMenu';
import Datetime from 'lib/datetime/DateTime';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab';
import { getLabels } from '../../../global/Labels/actions';
import { addEventInfo } from './actions';
import { createCoOwner } from '../../EventData/EditEventInfo/actions';
import { executeEventDetail } from '../../EventDashboard/actions';
import { clearValidateEmail, clearCoownerCreated } from '../EditEventInfo/actions';
import routeconfig from '../../../../config/routeconfig';
import EmailValidationForm from '../EditEventInfo/components/EmailValidationForm';
import commonUtil from '../../../../utils/commonUtil';
import { addEventInfoData } from './request';
import { getEventCategories } from '../../../createevent/actions';


@connect(
  store => ({
    labels: store.labels.labels,
    editEvent: store.eventdashboard.eventData,
    eventInfoAdd: store.addEventInfo,
    saveEventValidateEmail: store.saveeditevent,
    // emailId: store.saveeditevent.validateEmaildata && store.saveeditevent.validateEmaildata.email,
    addingEventInfo: store.addEventInfo.addingEventInfo,
    saveediteventsuccess: store.saveeditevent && store.saveeditevent.coownerCreated,
    saveediteventerror: store.saveeditevent && store.saveeditevent.error,
    eventCategories: store.createevent.eventCategories,
    dashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,
  }),
  { getLabels, addEventInfo, createCoOwner, executeEventDetail, getEventCategories, clearValidateEmail, clearCoownerCreated },
)

class AddEventInfo extends Component {
  state = {
    values: {},
    errors: {},
  }
  constructor(props) {
    super(props);
    this.evtConfigTitles = ''
    this.evntConfigurations = ''
    this.eventType = ''
    // this.enableButton = true
    this.state = {
      isValidationHidden: false,
      isAccountEditHidden: true,
      isAccessChecked: false,
      enableButton: true
    };
    this.handleShowValidation = this.handleShowValidation.bind(this);
  }
  UNSAFE_componentWillMount = () => {
    if (!this.props.labels) {
      this.props.getLabels();
    }
    if (!this.props.eventCategories) {
      this.props.getEventCategories();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ enableButton: !nextProps.addingEventInfo })
    if (!this.props.eventInfoAdd.addEventInfoSuccess && nextProps.eventInfoAdd.addEventInfoSuccess) {
      this.handleCancelEdit();
    }
  }
  handleShowValidation(event) {
    this.setState({
      isValidationHidden: !this.state.isValidationHidden,
      isAccessChecked: !this.state.isAccessChecked,
    });
    this.props.clearValidateEmail()
    this.props.clearCoownerCreated()
  }

  onEmailChange = (flag) => {
    this.setState({
      enableButton: flag
    })
  }

  getParams = () => {
    const channel = 'INSTORE';
    const brand = 'lp';
    const params = {
      eventId: this.props.params.eventId,
    };
    return params;
  }
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors,
    });
    const formId = e.target.id;
    if (isValidForm) {
      const fValues = formValues[formId];
      let params = this.getParams();
      const defaultOwnerTitle = fValues.celeb
      const index = this.evtConfigTitles.indexOf(defaultOwnerTitle)
      const defaultOwnerLabel = this.evntConfigurations.labels[index] ? this.evntConfigurations.labels[index] : ''
      if (e.nativeEvent.detail.createuser) {
        params = {
          email: fValues.ownerMail,
          password: fValues.ownerPassword,
          firstName: fValues.firstName,
          lastName: fValues.lastName,
          maternalName: fValues.motherName,
          bdayDAY: fValues.dateOfBirth.split('/')[0],
          bdayMONTH: fValues.dateOfBirth.split('/')[1],
          bdayYEAR: fValues.dateOfBirth.split('/')[2],
          gender: fValues.ownerGender,
          autoLoginCheckbox: false,
        };
        this.props.createCoOwner(params);
      } else {
        params = {
          ...params,
          title: fValues.celeb,
          celebfirstName: fValues.firstName,
          celeblastName: fValues.lastName,
          celebmotherName: fValues.motherName,
          celebnickName: fValues.alias,
          celebdateofbirth: fValues.dateOfBirth,
          celebphone: fValues.ownerPhoneNo,
          ownerHasPermission: this.state.isAccessChecked,
          ownerEmail: fValues.ownerMail,
          profileId: fValues.profileId,
          ownerLabel: defaultOwnerLabel,

        };
        addEventInfoData(params, (response) => {
          if (response && response.data && response.data.status && response.data.status.status
            && response.data.status.status.toLowerCase() === 'success') {
            this.props.addEventInfo(response);
            this.props.executeEventDetail(params.eventId, this.props.dashboardUserId || '12345678');
          } else {
            this.props.addEventInfoFailure(response);
          }
        });
        this.props.addEventInfo(params);
      }
    }
  }
  handleCancelEdit = () => {
    this.props.clearValidateEmail();
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventgralinfo, { eventId: this.props.params.eventId }));
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  setInputEmail = (emailVal) => {
    this.setState({ emailVal });
  }
  setPasswordVal = (passwordVal) => {
    this.setState({ passwordVal });
  }
  setGenderValue = (genderVal) => {
    this.setState({ genderVal });
  }

  onHover = () => {
    this.setState({
      showToolTipInfo: !this.state.showToolTipInfo,
    });
  }
  render() {
    const { labels, editEvent, saveEventValidateEmail, saveediteventsuccess } = this.props;
    const eventManagement = labels || null;
    const { error } = this.props;
    const { errors } = this.state;
    let roles = {}; let displayLabel = '';
    const evtCategories = this.props.eventCategories;
    if (evtCategories) {
      const evtType = editEvent.eventDetailsInfo && editEvent.eventDetailsInfo.eventType;
      this.eventType = evtType ? evtType : this.eventType
      this.evntConfigurations = evtCategories.eventConfigurations.filter((eCat => eCat.name === this.eventType))[0];
      displayLabel = this.evntConfigurations && this.evntConfigurations.labels[1] != undefined ? this.evntConfigurations.labels[1] : '';
      this.evtConfigTitles = this.evntConfigurations && this.evntConfigurations.titles;
      if (this.evtConfigTitles && this.evtConfigTitles.length > 0) {
        const options = [];
        Object.keys(this.evtConfigTitles).map((key, index) => {
          const option = {
            option: this.evtConfigTitles[key],
            value: this.evtConfigTitles[key],
            disabled: false,
            selected: false,
          };
          options.push(option);
        });
        roles = { options };
      }
    }

    const firstNameTextProps = {
      className: 'inputMaterial',
      formId: 'addForm',
      type: 'textonly',
      star: '*',
      required: 'required',
      maxlength: 100,
      errors,
      htmlId: 'firstName',
      name: 'firstName',
      label: 'Nombre',
      value: '',
      validators:
        [{
          type: 'required',
          errorMessage: 'El primer nombre es obligatorio',
        }],
    };
    const ownerTitle = {
      className: '',
      formId: 'addForm',
      type: 'hidden',
      errors,
      htmlId: 'ownerTitle',
      name: 'ownerTitle',
      label: 'ownerTitle',
      value: '',
    };
    const ownerId = {
      className: '',
      formId: 'addForm',
      type: 'hidden',
      errors,
      htmlId: 'ownerId',
      name: 'ownerId',
      label: 'ownerId',
      value: '',
    };
    const lastNameTextProps = {
      className: 'inputMaterial',
      formId: 'addForm',
      type: 'textonly',
      star: '*',
      required: 'required',
      maxlength: 100,
      errors,
      htmlId: 'lastName',
      name: 'lastName',
      label: 'Apellido Paterno',
      value: '',
      validators:
        [{
          type: 'required',
          errorMessage: 'El apellido es obligatorio',
        }],
    };
    const motherNameTextProps = {
      className: 'inputMaterial',
      formId: 'addForm',
      type: 'textonly',
      maxlength: 100,
      errors,
      htmlId: 'motherName',
      name: 'motherName',
      label: 'Apellido Materno',
      value: '',
    };
    const aliasTextProps = {
      className: 'inputMaterial',
      formId: 'addForm',
      maxlength: 100,
      type: 'textonly',
      errors,
      htmlId: 'alias',
      name: 'alias',
      label: 'Alias',
      value: '',
    };
    const mobileTextProps = {
      className: 'inputMaterial',
      formId: 'addForm',
      type: 'number',
      errors,
      htmlId: 'ownerPhoneNo',
      name: 'ownerPhoneNo',
      label: 'Celular',
      value: '',
      validators:
        [{
          type: 'exactLengthOpt',
          errorMessage: 'Debe ser de 10 dígitos',
          length: 10,
        }],
      maxlength: 10,
    };
    const validationEmailProps = {
      className: 'inputMaterial emailValid',
      formId: 'addForm',
      type: 'email',
      star: '*',
      required: 'required',
      maxlength: 100,
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
    };

    const TextProps = {
      className: 'inputMaterial date',
      type: 'text',
      placeholder: 'Fecha de nacimiento (key)',
    };

    const dateFormat = {
      input: true,
      name: 'dateOfBirth',
      className: 'detailInfo',
      timeFormat: false,
      closeOnSelect: true,
      closeOnTab: true,
      defaultValue: '',
      dateFormat: 'DD/MM/YYYY',
      // required: true,
      placeholder: 'Fecha de nacimiento',
      isValidDate: current => current.year() >= 1900 && current.isBefore(Datetime.moment),
    };

    let globalGuardarDisabled = editEvent &&
      editEvent.validateEmaildata &&
      editEvent.validateEmaildata.status &&
      editEvent.validateEmaildata.profileId === undefined;
    globalGuardarDisabled = !globalGuardarDisabled;
    globalGuardarDisabled = !!this.state.isValidationHidden;
    globalGuardarDisabled = saveEventValidateEmail.emailvalidationSuccess ? false : globalGuardarDisabled;
    globalGuardarDisabled = (saveEventValidateEmail && saveEventValidateEmail.validateEmaildata &&
      saveEventValidateEmail.validateEmaildata.status &&
      saveEventValidateEmail.validateEmaildata.profileId === undefined) ? true : globalGuardarDisabled;
    globalGuardarDisabled = saveediteventsuccess ? false : globalGuardarDisabled;

    let profileId
    if (saveediteventsuccess) {
      profileId = saveEventValidateEmail && saveEventValidateEmail.coOwnerData && saveEventValidateEmail.coOwnerData.profileId;
    } else {
      profileId = saveEventValidateEmail && saveEventValidateEmail.validateEmaildata && saveEventValidateEmail.validateEmaildata.profileId;
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
                  <div className="col-xs-6">
                    <h2 className="titleInfo">Agregar administrador</h2>
                  </div>
                  <div className="col-xs-3 col-xs-offset-3 alignRight">
                    <p className="requiredFields">* Campos obligatorios</p>
                  </div>
                </div>
                {!commonUtil.isObjectEmpty(this.props.saveediteventerror) ?
                  <div className="row show-grid-row vertical-align">
                    <div className="col-xs-12">
                      <div className="alertError"><i className="icon-tache" />
                        <p>{this.props.saveediteventerror.errorMessage}</p><a className="icon-tache2" />
                      </div>
                    </div>
                  </div> : null}
                {this.props.eventInfoAdd && this.props.eventInfoAdd.error && this.props.eventInfoAdd.error.errorMessage &&
                  <div className="row show-grid-row vertical-align">
                    <div className="col-xs-12">
                      <div className="alertError"><i className="icon-tache" />
                        <p>{this.props.eventInfoAdd && this.props.eventInfoAdd.error && this.props.eventInfoAdd.error.errorMessage}</p> <a className="icon-tache2" />
                      </div>
                    </div>
                  </div>
                }
                <div className="row show-grid-row vertical-align">
                  <div className="col-xs-5">
                    <p className="nameAdmin">
                      {displayLabel}
                    </p>
                    <Form id="addForm" onSubmit={this.handleSubmit} onRef={(form) => { this.addForm = form; }}>
                      <input type="hidden" name="profileId" value={profileId} />
                      <input type="hidden" name="ownerMail" value={this.state.emailVal} />
                      <input type="hidden" name="ownerPassword" value={this.state.passwordVal} />
                      <input type="hidden" name="ownerGender" value={this.state.genderVal} />
                      {/* <input type="hidden" name="ownerLabel" value={displayLabel} /> */}
                      <div className="cSelect filters">
                        <SelectionTab
                          id={'celeb'}
                          name={'celeb'}
                          options={roles.options}
                          optionText={roles.options && roles.options.value}
                          optionValue={roles.options && roles.options.value}
                          disable={false}
                        />
                        <i className="icon-caret_down" />
                      </div>
                      <TextInput {...firstNameTextProps} />
                      <TextInput {...lastNameTextProps} />
                      <TextInput {...motherNameTextProps} />
                      <TextInput {...aliasTextProps} />
                      <div className="formBlock">
                        <div className="materialStyle">
                          <div className="inputDate input-group date" id="datetimepicker1">
                            <Datetime
                              {...dateFormat}
                            />

                          </div>
                        </div>
                      </div>
                      <TextInput {...mobileTextProps} />
                    </Form>
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
                    </div>
                    {this.state.isValidationHidden &&
                      <EmailValidationForm
                        enableSubmit={this.enableSubmit}
                        emailValue={this.setInputEmail}
                        passwordValue={this.setPasswordVal}
                        onEmailChange={this.onEmailChange}
                        genderValue={this.setGenderValue}
                        editForm={this.addForm}
                      />
                    }
                    <div className="buttonsWrapper row">
                      <button
                        className="btnSecondaryAction size-Medium col-xs-5"
                        onClick={this.handleCancelEdit}
                      >Cancelar</button>
                      <button
                        disabled={globalGuardarDisabled || !this.state.enableButton}
                        className="btnPrimaryAction size-Medium col-xs-5 col-xs-offset-1"
                        onClick={() => this.addForm.dispatchEvent(new CustomEvent('submit', { detail: { createuser: false } }))}
                      >Guardar</button>
                    </div>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default AddEventInfo;
