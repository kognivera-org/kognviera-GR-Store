import React, { Component } from "react";
import routeconfig from "config/routeconfig";
import SelectionTab from "../../../../lib/ZUILib/SelectionTab";
import TextInput from "../../../../lib/ZUILib/TextInput";
import RadioButton from "../../../../lib/ZUILib/RadioButton";
import CheckBox from "../../../../lib/ZUILib/CheckBox";
import * as createEventActions from "../../actions";
import Form from "../../../../lib/ZUILib/Form";
import DateTime from "../../../../lib/datetime/DateTime";
import commonUtil from "../../../../utils/commonUtil";
const settingsFile = require("../../../../../settings");
export default class CoownerVerificationForm extends Component {
  state = {
    errors: {},
    showError: true,
    settings: {},
  };

  UNSAFE_componentWillMount = () => {
    this.state.settings = settingsFile[process.env.NODE_ENV || "development"];
  };

  onSubmitCelebrated = () => {
    localStorage.setItem("iscoOwner", true);
    localStorage.removeItem("userCoOwner");
    const url = `${this.state.settings.redirectauth}/login`;
    const redirectUrl = url;
    const redirectBackUrl = `${window.location.origin}/event/stepc`;
    window.location.replace(
      `${this.state.settings.redirectauth}/login?redirectAfterLoginHref=${this.state.settings.redirectauth}/afterLogin?dataToGR`
    );
  };

  handleValidateCoowner = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    const eventType = this.props.eventType;
    this.setState({
      ...this.state,
      errors: formErrors,
    });
    const formId = e.target.id;
    if (isValidForm) {
      const values = formValues[formId];
      const userType = values.userType;
      this.props.updateEmailIds(values.email1, userType);
      if (userType === "coOwner") {
        this.props.handleCoownerAccValidation(values.email1, eventType);
      } else {
        this.props.handleCoowner2AccValidation(values.email1, eventType);
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      showError: true,
    });
  }
  closeError = () => {
    this.setState({
      showError: false,
    });
  };

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  };

  render() {
    const { ownerEmailId, validateCoownerError, error, index } = this.props;
    const { labels } = this.props;
    return (
      <div className="row" id={`contentValidate-${index}`}>
        {/* <div className="col-xs-12">
          <h3 className="formUser-title--small">
            Validación de cuenta Liverpool y datos de festejados
          </h3>
        </div> */}
        <div className="col-xs-12">
          {error && error.errorMessage && this.state.showError && (
            <div className="col-xs-12">
              <div className="alertError" id={`emailsDif-${index}`}>
                <i className="icon-tache2" />
                <p>{error.errorMessage}</p>
                <a
                  className="icon-tache2"
                  id={`cerrarMensaje-${index}`}
                  onClick={this.closeError}
                />
              </div>
            </div>
          )}
          {this.state.errors &&
            this.state.errors.formMailValidate2 &&
            this.state.errors.formMailValidate2.alertError && (
              <div className="col-xs-12">
                <div
                  className="alertError noEquals"
                  style={{ display: "block" }}
                >
                  <i className="icon-tache2" />
                  <p>{this.state.errors.formMailValidate2.alertError}</p>
                </div>
              </div>
            )}
          {this.state.errors &&
            this.state.errors.formMailValidate3 &&
            this.state.errors.formMailValidate3.alertError && (
              <div className="col-xs-12">
                <div
                  className="alertError noEquals"
                  style={{ display: "block" }}
                >
                  <i className="icon-tache2" />
                  <p>{this.state.errors.formMailValidate3.alertError}</p>
                </div>
              </div>
            )}
          {validateCoownerError && validateCoownerError.errorMessage && (
            <div className="col-xs-12">
              <div className="alertError noEquals" style={{ display: "block" }}>
                <i className="icon-tache2" />
                <p>{validateCoownerError.errorMessage}</p>
              </div>
            </div>
          )}
          <div className="formUser">
            {/* <Form
              id={`formMailValidate${index}`}
              onSubmit={this.handleValidateCoowner}
            >
              <p className="info--required">* Campos Obligatorios</p>
              <input
                type="hidden"
                name="userType"
                value={this.props.userType}
              />
              <TextInput
                value=""
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="email1"
                name="email1"
                type="text"
                label="Correo Electrónico"
                maxlength={100}
                required="required"
                star="*"
                errors={this.state.errors}
                formId={`formMailValidate${index}`}
                validators={[
                  {
                    type: "required",
                    errorMessage: "El email es obligatorio",
                  },
                  {
                    type: "email",
                    errorMessage: commonUtil.getLabel(
                      labels,
                      "email.verification.invalidEmail.errorMessage"
                    ),
                  },
                  {
                    type: "duplicate",
                    errorMessage: "duplicate email id",
                    relValue: ownerEmailId ? ownerEmailId.emailId : "",
                    property: "alertError",
                  },
                ]}
              />

              <TextInput
                value=""
                className="inputMaterial"
                labelClassName="placeHolderMaterial"
                htmlId="email2"
                name="email2"
                type="text"
                label="Rectificar Correo Electrónico"
                maxlength={100}
                required="required"
                star="*"
                disableOnPaste={true}
                errors={this.state.errors}
                formId={`formMailValidate${index}`}
                validators={[
                  {
                    type: "required",
                    errorMessage: "El email el obligatorio",
                  },
                  {
                    type: "email",
                    errorMessage: commonUtil.getLabel(
                      labels,
                      "email.verification.invalidEmail.errorMessage"
                    ),
                  },
                  {
                    type: "relMatch",
                    errorMessage: commonUtil.getLabel(
                      labels,
                      "email.verification.EmailsDontMatch.errorMessage"
                    ),
                    relField: "email1",
                  },
                ]}
              />

              <div className="form_block">
                <div className="button_center">
                  <input
                    className="btnPrimary size-ExtraLarge"
                    type="submit"
                    value="Validar cuenta en liverpool"
                    id={`validateUserMail-${index}`}
                  />
                </div>
              </div>
            </Form> */}
            <div className="form_block">
              <div className="button_center">
                <input
                  className="btnPrimary size-ExtraLarge"
                  //   type="submit"
                  onClick={this.onSubmitCelebrated}
                  value="Validar cuenta en liverpool"
                  id={`validateUserMail-${index}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
