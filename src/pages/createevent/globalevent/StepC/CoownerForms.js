import React, { Component } from "react";
import routeconfig from "config/routeconfig";
import RadioButton from "../../../../lib/ZUILib/RadioButton";
import * as createEventActions from "../../actions";
import { connect } from "react-redux";
import CoownerVerificationForm from "./CoownerVerificationForm";
import CoownerFormWithEmail from "./CoownerFormWithEmail";
import commonUtil from "../../../../utils/commonUtil";

@connect(
  (store) => ({
    ownerEmailId: store.createevent.ownerEmail,
  }),
  { ...createEventActions }
)
export default class CoownerForms extends Component {
  state = {
    formErrors: {},
  };

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.coownerProfileError &&
      nextProps.coownerProfileError &&
      !this.state.showCoownerError
    ) {
      this.setState({
        ...this.state,
        showCoownerError: true,
      });
    }
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  };

  render() {
    const {
      coownerInfo,
      userType,
      ownerEmailId,
      coownerEmailId,
      coowner2EmailId,
      coownerCreated,
      coownerSaved,
      coownerProfileError,
      selectedTitle,
    } = this.props;
    //const selectedPartyOption = coownerEmailId ? 'optionAddManagement' : coownerInfo ? 'optionAddData' : this.state.partyOption
    const selectedPartyOption = this.state.partyOption
      ? this.state.partyOption
      : coownerInfo && coownerInfo.emailId
      ? "optionAddManagement"
      : coownerInfo
      ? "optionAddData"
      : "";
    if (
      this.props.displayThirdAddCoowner &&
      (selectedPartyOption === "optionAddData" ||
        selectedPartyOption === "optionAddManagement")
    ) {
      this.props.displayThirdAddCoowner(selectedPartyOption);
    }
    const {
      labels,
      selectedEventConfiguration,
      index,
      ownerCreated,
      ownerSaved,
    } = this.props;
    const dateFormat = {
      input: true,
      timeFormat: false,
      closeOnSelect: true,
      dateFormat: "DD/MM/YYYY",
    };
    const activeCoOwner = ownerCreated || ownerSaved;
    let emailId;
    let error;
    if (this.props.error) {
      error = this.props.error;
    }

    const { addCoOwner, SelectionOptions, errors } = this.props;
    let coownerBirthdate;
    //const coowner2Info = this.props.eventData ? this.props.eventData.coowner2Info : undefined
    const isExistingCoowner = !!(coownerInfo && coownerInfo.firstName);

    if (coownerInfo && coownerInfo.bdayDAY) {
      coownerBirthdate = `${coownerInfo.bdayDAY}/${coownerInfo.bdayMONTH}/${coownerInfo.bdayYEAR}`;
    }

    const addCoOwnerSelected = coownerInfo ? true : this.state.addCoOwner;
    const fes = "Festejado";

    return (
      <div className="row" id={`addCelebrated-${index}`}>
        {!addCoOwnerSelected ? (
          <div
            className="col-xs-12 linkAddCelebrated"
            id={`addCelebrating-${index}`}
          >
            <div className="col-xs-12">
              <a
                className="linkCelebrating"
                id={`linkCelebrating-${index}`}
                href="javascript:void(0)"
                onClick={() =>
                  this.props.enableCoowner &&
                  this.setState({
                    addCoOwner: true,
                  })
                }
              >
                <i className="iClass icon-agregar" />
                Agregar festejado
              </a>
            </div>
          </div>
        ) : (
          <div className="row areaNewCelebrated" id={`newCelebrated-${index}`}>
            <div className="col-xs-12">
              <h3 className="formUser-title">Agregar otro festejado</h3>
              <div className="selectTypeForm" id={`selectTypeForm-${index}`}>
                {this.props.ownerLabels ? (
                  <p className="textSelect">
                    {this.props.ownerLabels[1].toLowerCase() ===
                    "agregar festejado"
                      ? "Festejado"
                      : this.props.ownerLabels[1]}
                  </p>
                ) : null}
                {/* {this.props.ownerLabels[1].search(fes) > -1 ? this.props.ownerLabels[1].slice(this.props.ownerLabels[1].indexOf(" ") + 1) : this.props.ownerLabels[1]}</p> */}

                {selectedEventConfiguration &&
                  selectedEventConfiguration.type !== "ceremony" && (
                    <div>
                      <RadioButton
                        defaultChecked={selectedPartyOption === "optionAddData"}
                        id={`optionAddData-${index}`}
                        name={`optionsDataCelebrated-${index}`}
                        displayName="Solo datos del festejado"
                        onChangeFunction={() =>
                          this.setState({
                            partyOption: "optionAddData",
                            showCoownerError: false,
                          })
                        }
                      />
                      <RadioButton
                        defaultChecked={
                          selectedPartyOption === "optionAddManagement"
                        }
                        id={`optionAddManagement-${index}`}
                        name={`optionsDataCelebrated-${index}`}
                        displayName="Datos y administración de cuenta"
                        onChangeFunction={() =>
                          this.setState({
                            partyOption: "optionAddManagement",
                            showCoownerError: false,
                          })
                        }
                      />
                    </div>
                  )}
              </div>
            </div>
            {this.state.showCoownerError &&
              coownerProfileError &&
              coownerProfileError.errorMessage && (
                <div className="col-xs-12" id={`formUserAlerts-${index}`}>
                  <div
                    className="alertError noEquals"
                    style={{ display: "block" }}
                  >
                    <i className="icon-tache2" />
                    <p>{coownerProfileError.errorMessage}</p>
                    <a className="icon-tache2" />
                  </div>
                </div>
              )}
            {this.state.formErrors.formNewUserSimple2 &&
              this.state.formErrors.formNewUserSimple2.alertError && (
                <div className="col-xs-12" id={`formUserAlerts-${index}`}>
                  <div
                    className="alertError noEquals"
                    style={{ display: "block" }}
                  >
                    <i className="icon-tache2" />
                    <p>Las contraseñas ingresadas no coinciden.</p>
                    <a className="icon-tache2" />
                  </div>
                </div>
              )}
            {selectedEventConfiguration &&
              selectedEventConfiguration.type === "ceremony" && (
                <CoownerFormWithEmail
                  emailId={false}
                  ownerLabels={this.props.ownerLabels}
                  eventName={selectedEventConfiguration.nameInEnglish}
                  SelectionOptions={SelectionOptions}
                  coownerCreated={coownerCreated}
                  coownerSaved={coownerSaved}
                  coownerProfileError={coownerProfileError}
                  handleCreateUser={this.props.handleCreateUser}
                  errors={this.state.errors}
                  labels={labels}
                  selectedEventConfiguration={selectedEventConfiguration}
                  userType={userType}
                  index={index}
                  coownerInfo={coownerInfo}
                  selectedTitle={selectedTitle}
                  coownerEmailId={coownerEmailId}
                  isExistingCoowner={this.props.isExistingCoowner}
                  flag={this.props.flag}
                />
              )}
          </div>
        )}

        {selectedPartyOption == "optionAddData" &&
          selectedEventConfiguration &&
          selectedEventConfiguration.type !== "ceremony" && (
            <CoownerFormWithEmail
              emailId={false}
              ownerLabels={this.props.ownerLabels}
              eventName={selectedEventConfiguration.nameInEnglish}
              SelectionOptions={SelectionOptions}
              coownerCreated={coownerCreated}
              coownerSaved={coownerSaved}
              coownerProfileError={coownerProfileError}
              handleCreateUser={this.props.handleCreateUser}
              errors={this.state.errors}
              labels={labels}
              selectedEventConfiguration={selectedEventConfiguration}
              userType={userType}
              index={index}
              coownerInfo={coownerInfo}
              coownerEmailId={coownerEmailId}
              selectedTitle={selectedTitle}
              isExistingCoowner={this.props.isExistingCoowner}
              flag={this.props.flag}
            />
          )}

        {selectedPartyOption == "optionAddManagement" && (
          <div className="row" id={`dataManagement-${index}`}>
            {coownerInfo && this.props.isValidCoowner ? (
              <CoownerFormWithEmail
                emailId={true}
                SelectionOptions={SelectionOptions}
                ownerLabels={this.props.ownerLabels}
                index={index}
                eventName={selectedEventConfiguration.nameInEnglish}
                selectedEventConfiguration={selectedEventConfiguration}
                coownerInfo={coownerInfo}
                coownerProfileError={coownerProfileError}
                handleCreateUser={this.props.handleCreateUser}
                coownerEmailId={coownerEmailId}
                errors={this.state.errors}
                labels={labels}
                userType={userType}
                coownerSaved={this.props.coownerSaved}
                coownerCreated={this.props.coownerCreated}
                selectedTitle={selectedTitle}
                isExistingCoowner={this.props.isExistingCoowner}
                flag={this.props.flag}
              />
            ) : (
              <CoownerVerificationForm
                error={error}
                eventType={this.props.eventType}
                updateEmailIds={this.props.updateEmailIds}
                index={index}
                labels={labels}
                ownerEmailId={ownerEmailId}
                handleCoownerAccValidation={
                  this.props.handleCoownerAccValidation
                }
                handleCoowner2AccValidation={
                  this.props.handleCoowner2AccValidation
                }
                userType={userType}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
