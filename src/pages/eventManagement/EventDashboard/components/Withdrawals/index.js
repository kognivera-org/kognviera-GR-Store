import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import commonUtils from '../../../../../utils/commonUtil';
import routeconfig from '../../../../../config/routeconfig';
import Button from '../../../../../lib/ZUILib/Button';
import { getTransferenceOptions, initiateEventCloseProcess } from '../../../../accountSummary/requests';
import { getEventAccountStatementDetails } from '../../../../accountSummary/actions';
import { getDisplayEventStatusDropdown } from '../../../../global/Header/components/EventHeader/actions';
import ActivatePhysicalMonederoModal from './ActivatePhysicalMonederoModal';
import ValeSystemDownModal from '../../../../accountSummary/components/StatementAccountSummary/valeSystemDownModal';
import TemporaryClosingModal from '../../../../accountSummary/components/StatementAccountSummary/temporaryClosingModal';

class Withdrawals extends Component {
  constructor(props) {
    super(props);
    this.eventId = this.props.eventId;
    this._startTime = '';
    this._endTime = '';
    this._currentTime = '';
    this.isValeSystemDown = false;
  }
  state = {
    showAccordion: false,
  }

  navigateToPartialtransference = () => {
    if (this.isValeSystemDown) {
      this.valeSystemDownModal.handleShow();
    } else {
      // redirect to Retiros Anticipados
      this.props.router.push({ pathname: commonUtils.generateRedirect(routeconfig.partialtransference, { eventId: this.eventId }), state: { eventOwnerId: this.eventOwnerId } });
    }
  }

  navigateToClosuretransference = () => {
    if (this.isValeSystemDown) {
      this.valeSystemDownModal.handleShow();
    } else {
      this.props.router.push(commonUtils.generateRedirect(routeconfig.statementaccountsummary, { eventId: this.eventId }));
      getTransferenceOptions({ eventId: this.eventId, eventOwnerId: this.eventOwnerId, type: 'closure', activatePhysicalWallet: 'false' }, (res) => {
        if (res.data) {
          const transferenceData = res.data;
          if (transferenceData.transferenceOptions && +transferenceData.transferenceOptions.bonusAmount <= 0 && +transferenceData.transferenceOptions.transferableAmount <= 0) {
            if (transferenceData.isClosingGiftEligible && transferenceData.isClosingGiftEligible.toString() === 'true') {
              this.temporaryClosingModal.handleShow();
            } else {
              initiateEventCloseProcess({ eventId: this.eventId }, (initiateEventCloseProcessRes) => {
                if (initiateEventCloseProcessRes.data) {
                  this.props.getEventAccountStatementDetails(this.eventId);
                  this.props.getDisplayEventStatusDropdown({ eventId: this.eventId });
                }
              });
            }
          } else if (transferenceData && transferenceData.isEmployee && transferenceData.isEmployee.toString() === 'true') {
            if (!_.isEmpty(transferenceData.employeeCardInfo)) {
              this.temporaryClosingModal.handleShow();
            } else {
              this.activatePhysicalMonederoModal.handleShow();
            }
          } else {
            this.temporaryClosingModal.handleShow();
          }
        } else if (res.error && res.error.status && res.error.status.errorMessage) {
          if (res.error.status.errorMessage.indexOf('no purchased items') > -1) {
            initiateEventCloseProcess({ eventId: this.eventId }, (initiateEventCloseProcessRes) => {
              if (initiateEventCloseProcessRes.data) {
                this.props.getEventAccountStatementDetails(this.eventId);
                this.props.getDisplayEventStatusDropdown({ eventId: this.eventId });
              }
            });
          } else {
            this.setState({ accountStatementError: res.error.status && res.error.status.errorMessage });
          }
        }
      });
    }
  }

  onTemporaryClosingModalAcceptor = () => {
    this.temporaryClosingModal.handleClose();
    this.props.router.push({ pathname: commonUtils.generateRedirect(routeconfig.closuretransference, { eventId: this.eventId }), state: { eventOwnerId: this.eventOwnerId } });
  }

  onActivateWallet = () => {
    this.props.router.push({ pathname: commonUtils.generateRedirect(routeconfig.closuretransference, { eventId: this.eventId }), state: { eventOwnerId: this.eventOwnerId, activateWallet: true } });
  }
  collapseToggle = () => {
    this.setState({
      showAccordion: !this.state.showAccordion,
    });
  }
  renderContent = (eventAccountStatementData) => {
    const eventAccountInfo = eventAccountStatementData.eventAccountStatementInfo;
    const transactionsAllowed = eventAccountStatementData.accountSystemAvailable;
    this.isValeSystemDown = !eventAccountStatementData.accountSystemAvailable;
    const dashboardUserValid = commonUtils.isDashboardUserValid(this.props.dashboardUser);
    const enableEventClosure = dashboardUserValid && eventAccountInfo.enableEventClosure;
    const enablePartialTransfer = dashboardUserValid && eventAccountInfo.enablePartialTransfer;
    const transferenceInfo = this.props.data.transferenceInfo;
    const tranferDetails = transferenceInfo && transferenceInfo.transferenceDetails;
    const maxTransferencesAllowed = (transferenceInfo && transferenceInfo.transferenceSummary && transferenceInfo.transferenceSummary.maxTransferencesAllowed) ? transferenceInfo.transferenceSummary.maxTransferencesAllowed : 0;
    const totalCountOfTransactions = (transferenceInfo && transferenceInfo.transferenceSummary && transferenceInfo.transferenceSummary.totalCountOfTransactions) ? transferenceInfo.transferenceSummary.totalCountOfTransactions : 0;
    const rows = [];
    const getTransactionRow = (data, key) => {
      return (
        <span className="borderRowPad" key={key}>
          <p className="weight">RETIRO {key + 1} -</p>
          <p className="weight">{data.transferenceMethod} / {data.userName}</p>
          <p className="esDate"><i className="icon-reloj" /> {data.time} / {commonUtils.getESDate(data.date)}</p>
        </span>
      )
    }
    if (tranferDetails) {
      tranferDetails.map((element, key) => {
        rows.push(getTransactionRow(element, key));
      });
    }
    return (
      !this.props.fali ?
        <div>
          <h3 className="accountStateTitle retire">RETIROS REALIZADOS
                        <span>{totalCountOfTransactions + '/' + maxTransferencesAllowed}
              <a role="button"
                onClick={(e) => this.collapseToggle()}
                href="javascript:void(0)">
                <i className="iClass icon-flecha_gruesa_abajo" style={{ padding: "0px 10px", color: "#fff" }}>
                </i>
              </a>
            </span>

          </h3>
          {this.state.showAccordion &&
            <div className="panel-collapse collapse in " id="collapse3" role="tabpanel" aria-labelledby="headingOne">
              <div className="contentRetire">
                {rows}
              </div>
            </div>
          }
          <Button disabled={!enablePartialTransfer} uiname="EventDashboardTransference" onClick={this.navigateToPartialtransference} className={"btnPrimarySpecial size-Full " + (!enablePartialTransfer && " btnPrimarySpecialDisable")}>Retiro anticipado</Button>
          {/* <Button disabled={!enableEventClosure} uiname="EventDashboardCloseEvent" onClick={this.navigateToClosuretransference} className={"btnPrimary size-Full marginTop15 " + (!enableEventClosure && " btnPrimaryDisable")}>Cerrar mesa</Button> */}
          <ActivatePhysicalMonederoModal onRef={activatePhysicalMonederoModal => (this.activatePhysicalMonederoModal = activatePhysicalMonederoModal)} onActivateWallet={this.onActivateWallet} router={this.props.router} eventId={this.eventId} />
          <ValeSystemDownModal onRef={ref => (this.valeSystemDownModal = ref)} isValeSystemDown={this.isValeSystemDown} startTime={this._startTime} EndTime={this._endTime} />
          <TemporaryClosingModal onRef={ref => (this.temporaryClosingModal = ref)} temporaryModal={this.onTemporaryClosingModalAcceptor} eventId={this.eventId} />
        </div>
        :
        <h3>try again later</h3>
    )
  }
  render() {
    const { data, loading, fail, eventAccountStatementData, dashboardUser } = this.props;
    const eventAccountInfo = eventAccountStatementData.eventAccountStatementInfo;
    this.eventOwnerId = dashboardUser && dashboardUser.dashboardUserId;
    return (
      <div className="col-xs-12">
        <div className="boxStyle withdraw">
          {
            this.props.loading || !eventAccountInfo ?
              <h3>Loading</h3> :
              this.renderContent(eventAccountStatementData)
          }

        </div>
      </div>
    )
  }
}

export default Withdrawals;
// export default Authenticate(Withdrawals)