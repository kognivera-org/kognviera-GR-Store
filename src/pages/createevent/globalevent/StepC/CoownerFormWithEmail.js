import React, { Component } from "react";
import routeconfig from "config/routeconfig";
import SelectionTab from "../../../../lib/ZUILib/SelectionTab";
import TextInput from "../../../../lib/ZUILib/TextInput";
import RadioButton from "../../../../lib/ZUILib/RadioButton";
import CheckBox from "../../../../lib/ZUILib/CheckBox";
import * as createEventActions from "../../actions";
import { connect } from "react-redux";
import Form from "../../../../lib/ZUILib/Form";
import DateTime from "../../../../lib/datetime/DateTime";
import commonUtil from "../../../../utils/commonUtil";
import CoownerForms from "./CoownerForms";
import moment from "moment";
import appconfig from "../../../../config/appconfig";

@connect(
  (store) => ({
    eventData: store.createevent.eventData,
    ownerCreated: store.createevent.ownerCreated,
    coowner2Created: store.createevent.coowner2Created,
  }),
  { ...createEventActions }
)
export default class CoownerFormWithEmail extends Component {
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
      if (this.props.emailId) {
        const isExistingUser = values.isExistingUser === "true";
        this.props.handleCreateUser(e, values.userType, isExistingUser, values);
      } else {
        this.props.handleCreateUser(e, values.userType, true, values);
      }
    }
  };

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

  render() {
    const {
      labels,
      index,
      coownerCreated,
      coownerSaved,
      isExistingCoowner,
      selectedEventConfiguration,
    } = this.props;
    const { coownerInfo, coownerEmailId, coownerProfileError, selectedTitle } =
      this.props;
    const ownerSaved = this.props.eventData
      ? this.props.eventData.ownerSaved
      : undefined;
    let bdayDate = "";
    if (
      coownerInfo &&
      (coownerInfo.bdayDAY || coownerInfo.bdayDate || coownerInfo.dob)
    ) {
      if (coownerInfo.dob) {
        bdayDate = coownerInfo.dob;
      } else if (coownerInfo.bdayDate) {
        bdayDate = coownerInfo.bdayDate;
      } else {
        bdayDate = `${coownerInfo.bdayDAY}/${coownerInfo.bdayMONTH}/${coownerInfo.bdayYEAR}`;
      }
    }
    const dateFormat = {
      input: true,
      timeFormat: false,
      value: bdayDate,
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

    const { SelectionOptions, errors, ownerCreated, userType, flag } =
      this.props;

    return (
      <div className="row" id={`userRegistryManagement-${index}`}>
        <div className="col-xs-12">
          {this.props.emailId && (
            <div className="formHeader">
              <h4 className="formUser-title--small">
                Validación de cuenta Liverpool y datos de festejados
              </h4>
              {coownerEmailId && (
                <p className="formHeader-mail">{coownerEmailId.emailId}</p>
              )}
              {isExistingCoowner ? (
                <p className="formHeader-result">
                  {commonUtil.getLabel(
                    labels,
                    "eventCreation.stage1.registered.statusMessage"
                  )}
                </p>
              ) : (
                <p className="formHeader-result">
                  {commonUtil.getLabel(
                    labels,
                    "eventCreation.stage1.nonRegistered.statusMessage"
                  )}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="col-xs-12">
          <div className="formUser">
            <p className="info--required">* Campos Obligatorios</p>
            <Form id={`formNewUser${index}`} onSubmit={this.handleSubmit}>
              <input
                type="hidden"
                name="isExistingUser"
                value={isExistingCoowner}
              />
              <input type="hidden" name="userType" value={userType} />
              <input
                type="hidden"
                name="email"
                value={
                  this.props.emailId && coownerEmailId
                    ? coownerEmailId.emailId
                    : ""
                }
              />
              <input
                type="hidden"
                name="profileId"
                value={coownerInfo ? coownerInfo.profileId : ""}
              />
              {(!(
                selectedEventConfiguration.selectionEnable &&
                selectedEventConfiguration.coownerOptional
              ) ||
                selectedEventConfiguration.nameInEnglish === "Baby") && (
                <input
                  type="hidden"
                  name="ownerLabel"
                  value={
                    this.props.ownerLabels ? this.props.ownerLabels[1] : null
                  }
                />
              )}

              {selectedEventConfiguration &&
              selectedEventConfiguration.selectionEnable &&
              !selectedTitle ? (
                <div className="form_block">
                  <p className="textSelect" />
                  <div className="materialStyle">
                    <SelectionTab
                      value={
                        selectedTitle || (coownerInfo && coownerInfo.ownerTitle)
                      }
                      id={"typecelebrated3"}
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
                        this.props.ownerLabels
                          ? SelectionOptions.options.length < 0
                          : false
                      }
                      formId={`formNewUser${index}`}
                      validators={[
                        {
                          type: "required",
                          errorMessage: "Seleccione una opción",
                        },
                      ]}
                    />
                  </div>
                </div>
              ) : selectedTitle ||
                (selectedEventConfiguration &&
                  selectedEventConfiguration.textField) ? (
                <TextInput
                  value={
                    SelectionOptions.options[1]
                      ? SelectionOptions.options[1].option
                      : appconfig.celebLabels.festejado
                  }
                  className="inputMaterial"
                  htmlId="typecelebrated"
                  name="typecelebrated_option"
                  type="text"
                  formId={`formNewUser${index}`}
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
              <TextInput
                value={coownerInfo ? coownerInfo.firstName : ""}
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="firstName3"
                name="firstName"
                type="textonly"
                label="Nombre"
                maxlength={100}
                required="required"
                star="*"
                errors={this.state.errors}
                formId={`formNewUser${index}`}
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

              <TextInput
                value={coownerInfo ? coownerInfo.lastName : ""}
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="lastName3"
                name="lastName"
                type="textonly"
                label="Apellido Paterno"
                maxlength={100}
                required="required"
                star="*"
                errors={this.state.errors}
                formId={`formNewUser${index}`}
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

              <TextInput
                value={coownerInfo ? coownerInfo.maternalName : ""}
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="maternalName3"
                name="maternalName"
                type="textonly"
                label="Apellido Materno"
                maxlength={100}
                required="required"
                errors={this.state.errors}
                formId={`formNewUser${index}`}
                validators={[
                  {
                    type: "minLengthOpt",
                    errorMessage:
                      "Su apellido materno debe contener al menos 1 caracteres.",
                    minLength: "1",
                  },
                ]}
              />

              <TextInput
                value={coownerInfo ? coownerInfo.alias : ""}
                className="inputMaterial"
                divClassName="materialStyle formAlias"
                labelClassName="placeHolderMaterial"
                htmlId="alias3"
                name="alias"
                type="textonly"
                label="Alias"
                maxlength={100}
                required="required"
                errors={this.state.errors}
                formId={`formNewUser${index}`}
                validators={[
                  {
                    type: "minLengthOpt",
                    errorMessage:
                      "Su alias debe contener al menos 1 caracteres.",
                    minLength: "1",
                  },
                ]}
              >
                {/* <div className="formAlias_icon"><i className="icon-ayuda" /></div> */}
                <div className="formAlias_icon">
                  {/* <i className="icon-ayuda" data-original-title={commonUtil.getLabel(labels.createEventStep1, 'createEventStep1.alias.message')} /> */}
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
                  {this.state.tooltip}
                </div>
              </TextInput>

              {this.props.emailId && (
                <div className="form_block">
                  <div className="title_sexo">Sexo</div>
                  <RadioButton
                    name="sexo"
                    selected=""
                    id={`sexhombre-${index}`}
                    displayName="Hombre"
                    value="male"
                    defaultChecked={
                      coownerInfo &&
                      coownerInfo.gender &&
                      coownerInfo.gender.toLowerCase() === "male"
                        ? "checked"
                        : ""
                    }
                  />
                  <span>&nbsp;</span>
                  <RadioButton
                    name="sexo"
                    selected=""
                    id={`sexxmujer-${index}`}
                    displayName="Mujer"
                    value="female"
                    defaultChecked={
                      coownerInfo &&
                      coownerInfo.gender &&
                      coownerInfo.gender.toLowerCase() === "female"
                        ? "checked"
                        : ""
                    }
                  />
                </div>
              )}

              <DateTime
                {...dateFormat}
                name="birthday"
                formId={`formNewUser${index}`}
                placeholder={commonUtil.getLabel(
                  labels,
                  "eventCreation.stage1.selection.dob"
                )}
                errors={this.state.errors}
              />

              <TextInput
                value={coownerInfo ? coownerInfo.celphone : ""}
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="celphone3"
                name="celphone"
                type="number"
                label="Celular"
                required="required"
                maxlength={10}
              />
              {!isExistingCoowner && this.props.emailId && (
                <TextInput
                  value=""
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="password3"
                  name="password"
                  maxlength={100}
                  type="password"
                  label="Contraseña"
                  required="required"
                  star="*"
                  errors={this.state.errors}
                  formId={`formNewUser${index}`}
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
              {!isExistingCoowner && this.props.emailId && (
                <TextInput
                  value=""
                  className="inputMaterial"
                  labelClassName="placeHolderMaterial"
                  htmlId="confirm_password3"
                  name="confirm_password"
                  type="password"
                  label="Rectificar contraseña"
                  required="required"
                  maxlength={100}
                  star="*"
                  errors={this.state.errors}
                  formId={`formNewUser${index}`}
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
              {selectedEventConfiguration &&
                selectedEventConfiguration.coownerOptional &&
                selectedEventConfiguration.nameInEnglish !== "Baby" && (
                  <div className="form_block">
                    <div className="materialStyle">
                      <CheckBox
                        id={`isMinor-${index}`}
                        name="isMinor"
                        defaultChecked={
                          selectedEventConfiguration.name ===
                            appconfig.eventTypes.Fiesta_infantil ||
                          (coownerInfo && coownerInfo.isMinor === "true")
                        }
                        disabled={
                          selectedEventConfiguration.name ===
                          appconfig.eventTypes.Fiesta_infantil
                        }
                        value
                        displayName="El festejado es menor de edad"
                      />
                    </div>
                  </div>
                )}
              {!coownerCreated && !coownerSaved ? (
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
                      {coownerSaved ? "Guardado" : "Usuario creado"}
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
