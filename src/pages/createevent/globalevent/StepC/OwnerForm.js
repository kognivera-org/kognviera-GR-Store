import React, { Component } from "react";
import routeconfig from "config/routeconfig";
import SelectionTab from "../../../../lib/ZUILib/SelectionTab";
import TextInput from "../../../../lib/ZUILib/TextInput";
import RadioButton from "../../../../lib/ZUILib/RadioButton";
import CheckBox from "../../../../lib/ZUILib/CheckBox";
import * as createEventActions from "../../actions";
import { connect } from "react-redux";
import { handleOwnerAccValidation } from "../../actions";
import Form from "../../../../lib/ZUILib/Form";
import DateTime from "../../../../lib/datetime/DateTime";
import commonUtil from "../../../../utils/commonUtil";
import moment from "moment";

@connect(
  (store) => ({
    ownerEmailId: store.createevent && store.createevent.ownerEmail,
    ownerCreated: store.createevent && store.createevent.ownerCreated,
    ownerProfileError: store.createevent && store.createevent.ownerProfileError,
    // ownerCreated: store.createevent.ownerCreated,
    coownerCreated: store.createevent.coownerCreated,
    CoownerEligibilityError: store.createevent.CoownerEligibilityError,
    error: store.createevent.validateCoownerError,
    Coowner2EligibilityError: store.createevent.Coowner2EligibilityError,
    error2: store.createevent.validateCoowner2Error,
    coownerSaved:
      store.createevent.eventData && store.createevent.eventData.coownerSaved,
    coowner2Created: store.createevent.coowner2Created,
    coowner2Saved:
      store.createevent.eventData && store.createevent.eventData.coowner2Saved,
    isValidCoowner: store.createevent.isValidCoowner,
    coownerProfileError: store.createevent.coownerProfileError,
    coownerEmailId: store.createevent.coownerEmail,
    coowner2EmailId: store.createevent.coowner2Email,
    coowner2ProfileError: store.createevent.coowner2ProfileError,
    eventCategories: store.createevent.eventCategories,
    validateOwner: store.validateOwner,
  }),
  { ...createEventActions, handleOwnerAccValidation }
)
export default class OwnerForm extends Component {
  state = {
    errors: {},
  };
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors,
    });
    const formId = e.target.id;
    if (isValidForm) {
      const values = formValues[formId];
      const isExistingUser = values.isExistingUser === "true";
      this.props.handleCreateUser(e, values.userType, isExistingUser, values);
    }
  };

  // constructor(props, context) {
  //     super(props, context);
  //     this.setFormErrors = this.setFormErrors.bind(this);
  // }
  state = {
    formErrors: {},
  };
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  handleShowTooltip = (e) => {
    const tooltip = (
      <div className="tooltip fade bottom in" style={{ display: "block" }}>
        <div className="tooltip-arrow" style={{ left: `${49}%` }} />
        <div className="tooltip-inner">
          {e.target.getAttribute("data-content")}
        </div>
      </div>
    );
    this.setState({ tooltip });
  };

  handleHideTooltip = (e) => {
    this.setState({ tooltip: "" });
  };

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  };

  render() {
    const {
      ownerInfo,
      ownerEmailId,
      ownerCreated,
      ownerProfileError,
      selectedTitle,
      user,
      dataUser,
    } = this.props;

    const ownerSaved = this.props.eventData
      ? this.props.eventData.ownerSaved
      : undefined;
    const { labels } = this.props;
    const { addCoOwner, SelectionOptions, errors, selectedEventConfiguration } =
      this.props;
    let ownerBirthdate;
    const isExistingOwner = !!(ownerInfo && ownerInfo.firstName);

    if (
      ownerInfo &&
      (ownerInfo.bdayDAY || ownerInfo.bdayDate || ownerInfo.dob)
    ) {
      if (ownerInfo.dob) {
        ownerBirthdate = ownerInfo.dob;
      } else if (ownerInfo.bdayDate) {
        ownerBirthdate = ownerInfo.bdayDate;
      } else {
        ownerBirthdate = `${ownerInfo.bdayDAY}/${ownerInfo.bdayMONTH}/${ownerInfo.bdayYEAR}`;
      }
    }

    const dateFormat = {
      input: true,
      timeFormat: false,
      value: ownerBirthdate,
      closeOnSelect: true,
      dateFormat: "DD/MM/YYYY",
      // isValidDate: current => current.isBefore(DateTime.moment),
      isValidDate: (current) => {
        return current.year() >= 1900 && current.isBefore(DateTime.moment);
      },
      validators: [
        {
          type: "isAfter",
          errorMessage: "ingresa fecha de válida",
          from: moment("01/01/1900", "DD/MM/YYYY"),
        },
        {
          type: "isBefore",
          errorMessage: "ingresa fecha de válida",
        },
      ],
    };
    return (
      <div className="row" id="addCelebrated-1">
        {/* <div className="row" id="addCelebrated-1"> */}
        <div className="col-xs-12">
          <div className="formHeader">
            <h3 className="formHeader-title">
              Validación de cuenta Liverpool y datos de festejados
            </h3>

            {user && (
              <p className="formHeader-mail">
                <font style={{ verticalAlign: "inherit" }}>{user}</font>
              </p>
            )}
            {/* {ownerEmailId && (
              <p className="formHeader-mail">
                <font style={{ verticalAlign: "inherit" }}>
                  {ownerEmailId.emailId}
                </font>
              </p>
            )} */}
            <p className="formHeader-result">
              {/* {ownerInfo && ownerInfo.firstName ? (
                <div> */}
              {isExistingOwner ? (
                <font style={{ verticalAlign: "inherit" }}>
                  {commonUtil.getLabel(
                    labels,
                    "eventCreation.stage1.registered.statusMessage"
                  )}
                </font>
              ) : (
                <font style={{ verticalAlign: "inherit" }}>
                  {commonUtil.getLabel(
                    labels,
                    "eventCreation.stage1.nonRegistered.statusMessage"
                  )}
                </font>
              )}
              {/* </div>
              ) : (
                <font style={{ verticalAlign: "inherit" }}>
                  {commonUtil.getLabel(
                    labels,
                    "eventCreation.stage1.registered.statusMessage"
                  )}
                </font> */}
              {/* )} */}
            </p>
          </div>
        </div>
        <div className="col-xs-12">
          <h3 className="formUser-title">
            {ownerInfo && ownerInfo.firstName
              ? "Agrega datos de festejado a cuenta Liverpool"
              : "Ingresar datos de festejado y crea cuenta Liverpool"}
          </h3>
        </div>

        {ownerProfileError && ownerProfileError.errorMessage && (
          <div className="col-xs-12" id="formUserAlerts-1">
            <div className="alertError noEquals" style={{ display: "block" }}>
              <i className="icon-tache2" />
              <p>
                {commonUtil.getLabel(labels, ownerProfileError.errorMessage)}
              </p>
              <a className="icon-tache2" />
            </div>
          </div>
        )}
        {this.state.formErrors.formNewUser1 &&
          this.state.formErrors.formNewUser1.alertError && (
            <div className="col-xs-12" id="formUserAlerts-1">
              <div
                className="alertError noEqualAgrega datos de festejado a cuenta Liverpool s"
                style={{ display: "block" }}
              >
                <i className="icon-tache2" />
                <p>{this.state.formErrors.formNewUser1.alertError}</p>
                <a className="icon-tache2" />
              </div>
              {/* <div className="alertError minLength"><i className="icon-tache2" />
                <p>Tu contraseña debe contener al menos 8 caracteres.</p><a className="icon-tache2" />
              </div> */}
            </div>
          )}
        <div className="col-xs-12">
          <div className="formUser">
            <p className="info--required">* Campos Obligatorios</p>
            <Form id="formNewUser1" onSubmit={this.handleSubmit}>
              <input
                type="hidden"
                name="isExistingUser"
                value={isExistingOwner}
              />
              <input type="hidden" name="userType" value="owner" />
              <input
                type="hidden"
                name="email"
                value={user ? user : ""}
                // value={ownerEmailId ? ownerEmailId.emailId : ""}
              />
              <input
                type="hidden"
                name="profileId"
                value={ownerInfo ? ownerInfo.profileId : ""}
              />
              {selectedEventConfiguration &&
                (!(
                  selectedEventConfiguration.selectionEnable &&
                  selectedEventConfiguration.coownerOptional
                ) ||
                  selectedEventConfiguration.nameInEnglish === "Baby") && (
                  <input
                    type="hidden"
                    name="ownerLabel"
                    value={
                      (this.props.ownerLabels && this.props.ownerLabels[0]) ||
                      ""
                    }
                  />
                )}

              <div className="form_block">
                <p className="textSelect">
                  {this.props.ownerLabels && this.props.ownerLabels[0]}
                </p>
                {selectedEventConfiguration &&
                selectedEventConfiguration.selectionEnable &&
                !selectedTitle ? (
                  <div className="materialStyle">
                    <SelectionTab
                      value={ownerInfo ? ownerInfo.ownerTitle : ""}
                      id={"typecelebrated"}
                      name={"typecelebrated"}
                      options={SelectionOptions.options}
                      optionCaption={commonUtil.getLabel(
                        labels,
                        "eventCreation.stage1.selection.role"
                      )}
                      optionText={"option"}
                      optionValue={"value"}
                      errors={this.state.errors}
                      disable={
                        SelectionOptions.options &&
                        SelectionOptions.options.length < 0
                      }
                      formId="formNewUser1"
                      validators={[
                        {
                          type: "required",
                          errorMessage: "Seleccione una opción",
                        },
                      ]}
                    />
                  </div>
                ) : selectedTitle ||
                  (selectedEventConfiguration &&
                    selectedEventConfiguration.textField) ? (
                  <TextInput
                    value={
                      selectedTitle ||
                      (SelectionOptions.options &&
                        SelectionOptions.options.length > 0)
                        ? SelectionOptions.options[0].option
                        : null
                    }
                    className="inputMaterial"
                    htmlId="typecelebrated"
                    name="typecelebrated_option"
                    type="text"
                    formId="formNewUser1"
                    disabled="disabled"
                  />
                ) : (
                  <input
                    type="hidden"
                    name="typecelebrated_option"
                    value={
                      SelectionOptions.options &&
                      SelectionOptions.options.length > 0
                        ? SelectionOptions.options[0].option
                        : null
                    }
                  />
                )}
              </div>
              {ownerInfo &&
              ownerInfo.firstName != undefined &&
              ownerInfo.firstName != null ? (
                <TextInput
                  value={
                    ownerInfo && ownerInfo.firstName != undefined
                      ? ownerInfo.firstName
                      : "default"
                  }
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="firstName"
                  name="firstName"
                  type="textonly"
                  label="Nombre"
                  maxlength={100}
                  required="required"
                  star="*"
                  errors={this.state.errors}
                  formId="formNewUser1"
                  validators={[
                    {
                      type: "required",
                      errorMessage: "ingresa nombre",
                    },
                    {
                      type: "minLength",
                      errorMessage:
                        "Su primer nombre debe contener al menos 1 caracteres.",
                      minLength: "1",
                    },
                  ]}
                />
              ) : null}

              {ownerInfo &&
              ownerInfo.lastName != undefined &&
              ownerInfo.lastName != null ? (
                <TextInput
                  value={ownerInfo ? ownerInfo.lastName : ""}
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="lastName"
                  name="lastName"
                  type="textonly"
                  label="Apellido Paterno"
                  maxlength={100}
                  required="required"
                  star="*"
                  errors={this.state.errors}
                  formId="formNewUser1"
                  validators={[
                    {
                      type: "required",
                      errorMessage: "ingresa apellido paterno",
                    },
                    {
                      type: "minLength",
                      errorMessage:
                        "Su apellido debe contener al menos 1 caracteres.",
                      minLength: "1",
                    },
                  ]}
                />
              ) : null}

              {ownerInfo &&
              ownerInfo.maternalName != undefined &&
              ownerInfo.maternalName != null ? (
                <TextInput
                  value={ownerInfo ? ownerInfo.maternalName : ""}
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="maternalName"
                  name="maternalName"
                  type="textonly"
                  label="Apellido Materno"
                  maxlength={100}
                  required="required"
                  errors={this.state.errors}
                  formId="formNewUser1"
                  validators={[
                    {
                      type: "minLengthOpt",
                      errorMessage:
                        "Su apellido materno debe contener al menos 1 caracteres.",
                      minLength: "1",
                    },
                  ]}
                />
              ) : null}

              {ownerInfo &&
              ownerInfo.alias != undefined &&
              ownerInfo.alias != null ? (
                <TextInput
                  value={ownerInfo ? ownerInfo.alias : ""}
                  className="inputMaterial"
                  divClassName="materialStyle formAlias"
                  labelClassName="placeHolderMaterial"
                  htmlId="alias"
                  name="alias"
                  maxlength={100}
                  type="textonly"
                  label="Alias"
                  required="required"
                  errors={this.state.errors}
                  formId="formNewUser1"
                  validators={[
                    {
                      type: "minLengthOpt",
                      errorMessage:
                        "Su alias debe contener al menos 1 caracteres.",
                      minLength: "1",
                    },
                  ]}
                >
                  <div className="formAlias_icon">
                    <i
                      className="icon-ayuda popUpTooltip whiteTooltip"
                      aria-hidden="true"
                      tabIndex="0"
                      role="button"
                      onMouseOver={this.handleShowTooltip}
                      onMouseOut={this.handleHideTooltip}
                      data-placement="bottom"
                      data-toggle="tooltip"
                      data-trigger="focus"
                      data-content={commonUtil.getLabel(
                        labels,
                        "createEventStep1.alias.message"
                      )}
                      data-original-title=""
                      title=""
                    />
                    {this.state.tooltip}{" "}
                  </div>
                  {/* <div className="formAlias_icon"><i className="icon-ayuda" /></div> */}
                  {/* <a className="formAlias_icon"
                  onMouseOver={this.handleShowTooltip}
                  onMouseOut={this.handleHideTooltip}
                  data-toggle="tooltip"
                  data-placement="bottom"
                ><i className="icon-ayuda" data-original-title={commonUtil.getLabel(labels.createEventStep1, 'createEventStep1.alias.message')} />
                </a>
                {this.state.tooltip} */}
                </TextInput>
              ) : null}

              <div className="form_block">
                <div className="title_sexo">Sexo</div>
                <RadioButton
                  name="sexo"
                  selected=""
                  id="sexhombre"
                  displayName="Hombre"
                  value="male"
                  defaultChecked={
                    ownerInfo &&
                    ownerInfo.gender &&
                    ownerInfo.gender.toLowerCase() === "male"
                      ? "checked"
                      : ""
                  }
                />
                <span>&nbsp;</span>
                <RadioButton
                  name="sexo"
                  selected=""
                  id="sexxmujer"
                  displayName="Mujer"
                  value="female"
                  defaultChecked={
                    ownerInfo &&
                    ownerInfo.gender &&
                    ownerInfo.gender.toLowerCase() === "female"
                      ? "checked"
                      : ""
                  }
                />
              </div>

              <DateTime
                {...dateFormat}
                name="birthday"
                formId="formNewUser1"
                placeholder={commonUtil.getLabel(
                  labels,
                  "eventCreation.stage1.selection.dob"
                )}
                errors={this.state.errors}
              />

              <TextInput
                value={ownerInfo ? ownerInfo.celphone : ""}
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="celphone"
                name="celphone"
                type="number"
                label="Celular"
                required="required"
                maxlength={10}
              />

              {!isExistingOwner && (
                <TextInput
                  value=""
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="password"
                  name="password"
                  type="password"
                  label="Contraseña"
                  required="required"
                  maxlength={100}
                  star="*"
                  errors={this.state.errors}
                  formId="formNewUser1"
                  validators={[
                    {
                      type: "required",
                      errorMessage: "ingresa una contraseña",
                    },
                    {
                      type: "minLength",
                      errorMessage:
                        "Tu contraseña debe contener al menos 8 caracteres.",
                      minLength: "8",
                    },
                  ]}
                />
              )}

              {!isExistingOwner && (
                <TextInput
                  value=""
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="confirm_password"
                  name="confirm_password"
                  type="password"
                  label="Rectificar contraseña"
                  required="required"
                  maxlength={100}
                  star="*"
                  errors={this.state.errors}
                  formId="formNewUser1"
                  validators={[
                    {
                      type: "required",
                      errorMessage: "ingresa confirmación de contraseña",
                    },
                    {
                      type: "relMatch",
                      errorMessage: "Las contraseñas ingresadas no coinciden.",
                      relField: "password",
                    },
                  ]}
                />
              )}

              {/* <div className="form_block">
                <div className="materialStyle">
                  <CheckBox id="toRecibe" name="toRecibe" value displayName="El festejado desea recibir promociones a su correo" />
                </div>
              </div> */}
              {!ownerCreated && !ownerSaved ? (
                <div className="form_block formUser-status--action">
                  <div className="button_center">
                    <input
                      className="btnPrimaryAction size-Small btn--save"
                      type="submit"
                      defaultValue="Guardar"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="form_block formUser-status--success"
                  style={{ display: "block" }}
                >
                  <p>
                    <span className="iClass icon-estado_de_mensaje_aprobado" />
                    <span className="user">
                      {ownerSaved ? "Guardado" : "Usuario creado"}
                    </span>
                  </p>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
