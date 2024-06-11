import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlasticCardModel from './plasticCardModel';
import * as dashBoardActions from '../../actions';
import commonUtil from '../../../../../utils/commonUtil';
import Link from 'lib/ZUILib/Link';
import PlasticCardDeleteConfirmationPopUp from './confirmationPopup';

@connect(
  store => ({
    labels: store.labels.labels,
    plasticCardDetails: store.eventdashboard.plasticCardsData,
    addPlasticCardFailedMessage: store.eventdashboard.addPlasticCardFailedMessage,
    loading: store.eventdashboard.getPlasticCardDataLoading
  }),
  { ...dashBoardActions },
)

class PlasticCard extends Component {
  componentDidMount() {
    const eventId = this.props.eventId;
    this.props.getPlasticCardDetails(eventId);
  }
  state = {
    show: false,
    showAccordion: false,
    showPlasticCardDeleteConfimationPop: false
  }
  collapseToggle = () => {
    this.setState({
      showAccordion: !this.state.showAccordion
    })
  }
  handleClose = () => {
    this.setState({ show: false })
    this.props.clearErrorOfAddingNewPlasticCard();
  }

  handleShow = () => {
    this.setState({ show: true })
  }
  handleAddCardModal = () => {
    this.handleShow();
  }
  isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

  isEmptyArray = obj => obj.length > 0

  getPlasticCardInfo = () => {
    const plasticCardDetails = this.props.plasticCardDetails;
    if (!this.isEmptyObject(plasticCardDetails) && plasticCardDetails.plasticCardInfos &&
      this.isEmptyArray(plasticCardDetails.plasticCardInfos)) {
      return plasticCardDetails.plasticCardInfos.map((_plasticCard, index) => (
        <div key={index} className="contentAddedCards row">
          <div className="col-xs-6">
            <p>{_plasticCard.firstName}</p>
          </div>
          <div className="col-xs-4">
            <p>{_plasticCard.plasticCardNumber}</p>
          </div>
          <div className="col-xs-2">
            <Link uiname="EventDashboardDeletePlasticCard" href="javascript:void(0)" onClick={() => { this.inititateDetelion(_plasticCard); }}>
              <i className="icon-tache2" />
            </Link>
          </div>
        </div>
      ));
    }
    return null;
  }
  confirmDeletePlasticcard = () => {
    this.deletePlasticCard();
  }
  inititateDetelion = (plasticCard) => {
    this.setState({
      showPlasticCardDeleteConfimationPop: true,
      selectedPlastciCardForDeletion: plasticCard
    })
  }
  cancelDeletion = (e) => {
    e.preventDefault();
    this.setState({
      showPlasticCardDeleteConfimationPop: false,
      selectedPlastciCardForDeletion: ""
    })
  }
  deletePlasticCard = () => {
    const plasticCard = this.state.selectedPlastciCardForDeletion;
    const eventId = this.props.eventdetail.eventDetailsInfo.eventId;
    const plasticCardInfos = this.props.plasticCardDetails.plasticCardInfos;
    const ownerId = plasticCard.ownerId;
    const plasticCardNumber = plasticCard.plasticCardNumber;
    const queryParams = {
      eventId,
      ownerId,
      plasticCardNumber,
    };
    this.props.deletePlasticCardDetails(queryParams, plasticCardInfos);
    this.selectedPlastciCardForDeletion = "";
    this.setState({
      showPlasticCardDeleteConfimationPop: false,
      selectedPlastciCardForDeletion: ""
    })
  }
  render() {
    const { plasticCardDetails, labels } = this.props;
    return (
      <div className="col-xs-6 marginTop15 plasticCard">
        <div className="boxStyle" style={{ minHeight: "auto", height: "auto" }}>
          <h3>TARJETA PLÁSTICA <a role="button"
            data-toggle="collapse"
            data-parent="#accordion"
            onClick={(e) => this.collapseToggle()}
            href="javascript:void(0)"
            aria-expanded="true"
            aria-controls="collapse1"
            style={{ float: "right" }} >
            <i className="iClass icon-flecha_gruesa_abajo" style={{ padding: "0px 10px", color: "#666" }}></i>
          </a>
          </h3>
          {
            this.props.loading
              ? <div><p>Loading.....</p></div>
              : !commonUtil.isObjectEmpty(plasticCardDetails) && this.state.showAccordion &&
              < div className="panel-collapse collapse in" id="collapse1" role="tabpanel" aria-labelledby="headingOne">
                {!(plasticCardDetails && plasticCardDetails.plasticCardInfos) && <p className="emptySocketCard">Sin tarjetas asociadas</p>}
                <div className="contentAddedCards">
                  {/* below funtion to display the card details */}
                  {plasticCardDetails && !plasticCardDetails.status.errorMessage ? this.getPlasticCardInfo() : null}
                  <PlasticCardModel
                    handleClose={this.handleClose}
                    show={this.state.show}
                    isEmptyArray={this.isEmptyArray}
                    isEmptyObject={this.isEmptyObject}
                    plasticCardDetails={plasticCardDetails}
                    eventdetail={this.props.eventdetail}
                  />
                  <Link uiname="EventDashboardAddPlasticCard" className="linkAction" onClick={() => this.handleAddCardModal()} data-toggle="modal" data-target="#addCards">
                    Asociar tarjetas a evento</Link>
                </div>
              </div>
          }
        </div>
        {this.state.selectedPlastciCardForDeletion &&
          <PlasticCardDeleteConfirmationPopUp
            labels={labels}
            cancelDeletion={this.cancelDeletion}
            showPlasticCardDeleteConfimationPop={this.state.showPlasticCardDeleteConfimationPop}
            confirmDeletePlasticcard={this.confirmDeletePlasticcard}
            selectedPlastciCardForDeletion={this.state.selectedPlastciCardForDeletion}
          />}
      </div >

    );
  }
}

export default PlasticCard;
