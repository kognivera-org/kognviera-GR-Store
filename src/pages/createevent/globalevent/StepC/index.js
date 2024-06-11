import React, { Component } from "react";
import routeconfig from "config/routeconfig";
import * as createEventActions from "../../actions";
import { connect } from "react-redux";
import { getLabels } from "../../../global/Labels/actions";
import OwnerForm from "./OwnerForm";
import commonUtil from "../../../../utils/commonUtil";
import CoownerForms from "./CoownerForms";
import appconfig from "../../../../config/appconfig";
import {
  handleOwnerAccValidation,
  updateEmailIds,
  handleSelectGRType,
  getEventCategories,
} from "../../actions";

const { strategy } = require("./strategy");
const { handleOwnerData, handleCoownerData } = createEventActions;

@connect(
  (store) => ({
    ownerCreated: store.createevent.ownerCreated,
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

    ownerEmail: store.createevent.ownerEmail,
    eventData: store.createevent.eventData,

    isValidOwner: store.createevent.isValidOwner,
    error: store.createevent.validateAccError,

    labels: store.labels.labels,
  }),
  {
    handleOwnerAccValidation,
    updateEmailIds,
    handleSelectGRType,
    getEventCategories,
    ...createEventActions,
    getLabels,
  }
)
class StepC extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.thirdCoowner = "";
    this.ownerLabels = "";
    this.titles = "";
    this.user = "";
    this.dataUser = [];
  }
  state = {
    formErrors: {},
    addCoOwner: false,
    showCoownerError: false,
    error: "",
  };

  componentDidMount = () => {
    this.props.getEventCategories();
    let userHost = JSON.parse(localStorage.getItem("user_host")) || null;
    let url_string = window.location.href;
    let url = new URL(url_string);
    let user =
      userHost != null ? userHost.emailId : url.searchParams.get("user");

    this.user = user;

    let grType = localStorage.getItem("GRType");
    grType = JSON.parse(grType);
    this.props.handleSelectGRType(grType);
    const eventType = grType.tipoCelebracion;
    this.props.updateEmailIds(user, "owner");

    this.props.handleOwnerAccValidation(user, eventType);
    if (localStorage.getItem("iscoOwner")) {
      let userCoOwner = localStorage.getItem("userCoOwner") || null;
      let usercoOwner =
        userCoOwner != null ? userCoOwner : url.searchParams.get("user");
      this.props.updateEmailIds(usercoOwner, "coOwner");
      this.props.handleCoownerAccValidation(usercoOwner, eventType);
      localStorage.setItem("userCoOwner", usercoOwner);
    }
    // }
    if (!this.props.labels) {
      this.props.getLabels();
    }

    if (this.props.eventData === undefined) {
      // this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.error && nextProps.error) {
      this.setState({
        error: nextProps.error,
      });
    }
  }

  handleRoute = (routePath) => {
    //    this.props.router.push(`/${routePath}`)
    this.props.router.push(commonUtil.generateRedirect(routePath));
  };

  displayThirdAddCoowner = (type) => {
    this.thirdCoowner = type;
  };

  handleCreateUser = (e, userType, isExistingUser, values) => {
    e.preventDefault();
    const formId = e.target.id;
    const birthday = values.birthday;
    const bdayDay = birthday ? birthday.split("/")[0] : "";
    const bdayMonth = birthday ? birthday.split("/")[1] : "";
    const bdayYear = birthday ? birthday.split("/")[2] : "";
    let formValues = {};
    const defaultOwnerTitle = values.typecelebrated_option;
    const index = this.titles.indexOf(defaultOwnerTitle);
    const defaultOwnerLabel = this.ownerLabels[index]
      ? this.ownerLabels[index]
      : "";
    if (isExistingUser) {
      formValues = Object.assign({
        profileId: values.profileId,
        emailId: values.email,
        ownerLabel: values.ownerLabel ? values.ownerLabel : defaultOwnerLabel,
        ownerTitle: values.typecelebrated_option,
        firstName: values.firstName,
        lastName: values.lastName,
        maternalName: values.maternalName,
        alias: values.alias,
        bdayDate: values.birthday,
        gender: values.sexo,
        celphone: values.celphone,
        ownerHasPermission: values.toRecibe ? "true" : "false",
        channel: "INSTORE",
        brand: "LP",
        isMinor: values.isMinor,
      });
      if (userType == "owner") {
        this.props.handleOwnerData(formValues);
      } else if (userType == "coOwner") {
        this.props.handleCoownerData(formValues);
      } else {
        this.props.handleCoowner2Data(formValues);
      }
    } else {
      formValues = Object.assign({
        email: values.email && values.email.toLowerCase(),
        alias: values.alias,
        ownerLabel: values.ownerLabel ? values.ownerLabel : defaultOwnerLabel,
        ownerTitle: values.typecelebrated_option,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        maternalName: values.maternalName,
        bdayDAY: bdayDay,
        bdayMONTH: bdayMonth,
        bdayYEAR: bdayYear,
        celphone: values.celphone,
        gender: values.sexo,
        isMinor: values.isMinor,
        autoLoginCheckbox: false,
      });
      if (userType === "owner") {
        this.props.handleCreateProfile(formValues);
      } else if (userType == "coOwner") {
        this.props.handleCreateCoowner(formValues);
      } else {
        this.props.handleCreateCoowner2(formValues);
      }
    }
  };

  closeError = () => {
    this.setState({
      error: "",
    });
  };

  render() {
    const { labels } = this.props;
    const { errors, error } = this.state;
    const eventType =
      this.props.eventData && this.props.eventData.GRType.tipoCelebracion;
    const categoryType =
      this.props.eventData && this.props.eventData.GRType.tipoMesa_id;
    const { eventData, ownerCreated, coownerCreated, coownerSaved } =
      this.props;
    const ownerSaved = this.props.eventData
      ? this.props.eventData.ownerSaved
      : undefined;

    if (this.props.eventData && this.props.eventData.ownerInfo) {
      localStorage.setItem(
        "user_host",
        JSON.stringify(this.props.eventData.ownerInfo)
      );
    }

    const ownerInfo = eventData ? eventData.ownerInfo : undefined;
    const coownerInfo = eventData ? eventData.coownerInfo : undefined;
    let ownerBirthdate;
    const isExistingOwner = !!(ownerInfo && ownerInfo.firstName);
    const isExistingCoowner = !!(coownerInfo && coownerInfo.firstName);
    if (ownerInfo && ownerInfo.bdayDAY) {
      ownerBirthdate = `${ownerInfo.bdayDAY}/${ownerInfo.bdayMONTH}/${ownerInfo.bdayYEAR}`;
    }
    let selectedEventConfiguration = "";
    if (categoryType === appconfig.eventCategory.CELEBRATION) {
      selectedEventConfiguration =
        strategy.strategies.Celebraciones.types[eventType];
    } else {
      selectedEventConfiguration =
        strategy.strategies.Todo_tipo_de_eventos.types[eventType];
    }
    this.titles = eventType
      ? commonUtil.getPropertyValueByEventType(
          eventType,
          "titles",
          this.props.eventCategories
        )
      : [];
    this.ownerLabels = eventType
      ? commonUtil.getPropertyValueByEventType(
          eventType,
          "labels",
          this.props.eventCategories
        )
      : [];
    const titleOptions =
      this.titles &&
      this.titles.map((title, index) => ({
        option: title,
        value: title,
        disabled: false,
        selected: false,
      }));
    const SelectionOptions = {
      options: titleOptions,
    };
    const enableNextStep =
      (ownerCreated || ownerSaved) &&
      (coownerCreated ||
        coownerSaved ||
        (selectedEventConfiguration &&
          selectedEventConfiguration.coownerOptional &&
          ownerInfo.ownerTitle
            .toLowerCase()
            .includes(appconfig.celebLabels.festejado)) ||
        (selectedEventConfiguration &&
          selectedEventConfiguration.coownerOptional &&
          selectedEventConfiguration.nameInEnglish === "Baby"));
    const disabledStr = enableNextStep ? "" : "disabled";

    const addCoOwner = coownerInfo ? true : this.state.addCoOwner;

    const disableOrgniser =
      selectedEventConfiguration &&
      selectedEventConfiguration.coownerOptional &&
      (ownerCreated || ownerSaved) &&
      ownerInfo.ownerTitle
        .toLowerCase()
        .includes(appconfig.celebLabels.organizador);
    const disableOrgniser2 =
      selectedEventConfiguration &&
      selectedEventConfiguration.coownerOptional &&
      (coownerCreated || coownerSaved) &&
      coownerInfo.ownerTitle
        .toLowerCase()
        .includes(appconfig.celebLabels.organizador);
    let selectedTitle = "";
    let ownerSelectedTitle = "";
    let coownerSelectionOptions = SelectionOptions;
    if (disableOrgniser) {
      selectedTitle =
        SelectionOptions.options[1] && SelectionOptions.options[1].option;
    }

    if (disableOrgniser2) {
      ownerSelectedTitle =
        SelectionOptions.options[1] && SelectionOptions.options[1].option;
    }
    return (
      <div>
        <div className="container accountInfoCelebratedContent">
          {error && error.errorMessage ? (
            <div className="col-xs-12" style={{ margin: "25px" }}>
              <div className="alertError" id="emailsDif">
                <i className="icon-tache2" />
                <p>{error.errorMessage}</p>
                {/* <a
                  className="icon-tache2"
                  id="cerrarMensaje"
                  onClick={this.closeError}
                /> */}
              </div>
            </div>
          ) : (
            <div>
              <OwnerForm
                eventData={eventData}
                ownerInfo={ownerInfo}
                ownerCreated={ownerCreated}
                addCoOwner={addCoOwner}
                handleCreateUser={this.handleCreateUser}
                SelectionOptions={SelectionOptions}
                onRef={(ref) => (this.OwnerForm = ref)}
                labels={labels}
                selectedEventConfiguration={selectedEventConfiguration}
                ownerLabels={this.ownerLabels}
                selectedTitle={ownerSelectedTitle}
                user={this.user}
                dataUser={this.dataUser}
              />

              <CoownerForms
                eventData={eventData}
                coownerInfo={coownerInfo}
                eventType={eventType}
                coownerCreated={coownerCreated}
                enableCoowner={ownerCreated || ownerSaved}
                addCoOwner={addCoOwner}
                handleCreateUser={this.handleCreateUser}
                SelectionOptions={coownerSelectionOptions}
                index={2}
                labels={labels}
                selectedEventConfiguration={selectedEventConfiguration}
                coownerProfileError={this.props.coownerProfileError}
                ownerLabels={this.ownerLabels}
                coownerSaved={coownerSaved}
                selectedTitle={selectedTitle}
                userType="coOwner"
                isValidCoowner={this.props.isValidCoowner}
                coownerEmailId={this.props.coownerEmailId}
                displayThirdAddCoowner={this.displayThirdAddCoowner}
                isExistingCoowner={isExistingCoowner}
                CoownerEligibilityError={this.props.CoownerEligibilityError}
                error={this.props.error}
              />
            </div>
          )}
          <div className="row registerFooter">
            <div className="col-xs-6">
              <button
                className="btnSecondaryAction size-Large"
                onClick={(e) => this.handleRoute(routeconfig.globalstepb)}
              >
                <i className="iconLeft icon-flecha_light_izq" />
                Regresar
              </button>
            </div>
            <div className="col-xs-6 button_right">
              <button
                className={`btnNextStep size-Large${
                  !enableNextStep ? " btnPrimaryDisable" : ""
                }`}
                onClick={(e) =>
                  enableNextStep
                    ? this.handleRoute(routeconfig.globalstepd)
                    : { javascript: void 0 }
                }
                disabled={!enableNextStep}
              >
                <i className="iconRight icon-flecha_lightsvg_derecha" />
                SiguientePaso
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default StepC;
