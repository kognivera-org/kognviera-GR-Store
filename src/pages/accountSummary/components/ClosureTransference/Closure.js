
import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import AccordionWizard from '../../../../lib/AccordianWizard';
import DepositForm from './DepositForm';
import VerificationForm from './VerificationForm';
import UserCardBankForm from './UserCardBankForm';
import MonederoForm from './MonederoForm';
import ClosurePasswordConfirmationModal from './ClosurePasswordConfirmationModal';
import { getLabels } from '../../../global/Labels/actions';
import { getTransferenceOptions, calculateCommision, initiateEventCloseProcess } from '../../requests';
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader'
import commonUtil from '../../../../utils/commonUtil';
import MultiStepProgressBar from '../../../../components/MultiStepProgressBar/MultiStepProgressBar';
import OtpCode from '../PartialTransference/OtpCode';
import ClosureTransferenceAutorization from './ClosureTransferenceAutorization';
import { submitTransference } from '../../actions';
import routeconfig from '../../../../config/routeconfig';

@connect(
  store => ({
    eventdashboard: store.eventdashboard.eventData ? store.eventdashboard : null,
    labels: store.labels.labels,
    submitTransferenceResponse: store.accountSummary.submitTransference,
  }),
  { getLabels, submitTransference})

class ClosureTransference extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    this.activateWallet = this.props.location.state && this.props.location.state.activateWallet ? this.props.location.state.activateWallet : false;
    this.eventOwnerId = (this.props.location && this.props.location.state) ? this.props.location.state.eventOwnerId : '';
    // this.eventId = '100002';
    // this.eventOwnerId = 'o1000002';
    this.eventdashboard = null;
    this.type = 'closure';
    this.userName = '';
    this.reqData = {};
    this.isCombinadoExists = false;
    this.closingGiftDetailsData = null;
    this.submitTransferenceData = '';
    this.state = {
      confirmationButtonDisable: false,
      transferenceData: null,
      submitTransferenceData: null,
      submitTransferenceError: null,
      page : 1
    };
  }

  componentDidMount() {
    // show popup only for non-migrated events
    const event = this.props.eventdashboard;
    const isMigratedEvent = event
      && event.eventData
      && event.eventData.eventDetailsInfo
      && event.eventData.eventDetailsInfo.isMigratedEvent;
    if (!isMigratedEvent) {
      this.ClosurePasswordConfirmationModal.handleShow();
    } else {
      this.getTransferenceOptions(this.props);
    }
  }

  nextPage = (page) => {
    this.setState ({
      page: page
    })
  }

  onClosurePasswordConfirmClick = () => {
    this.getTransferenceOptions(this.props);
  }

  noClosingGiftClosure = () => {
    this.setState({ confirmationButtonDisable: true });
    const totalAmount = this.state.transferenceData.transferenceOptions.transferableAmount;
    const clousureData = {
      eventId: this.eventId, 
      eventOwnerId: this.eventOwnerId,
      type: this.type,
      walletType: "Closing Gift",
      totalAmount: totalAmount,
      approverId: this.props.eventdashboard.dashboardUser.dashboardUserId
    }
    this.submitTransferenceData = Object.assign({}, clousureData);
    this.props.submitTransference(this.submitTransferenceData).then((res) => {
      let submitTransferenceError;
      let confirmationButtonDisable = false;
      if (res.data && res.data.status) {
        if (res.data.status.status === 'success') {
          this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.eventId }));
        } else {
          if (res.data && res.data.status && res.data.status.errorMessage) {
            if (res.data.status.errorMessage === commonUtil.getLabel(this.props.labels, 'eventTransferences.error.message')) {
              confirmationButtonDisable = true;
            }
          }
          submitTransferenceError = res.data.status.errorMessage;
          commonUtil.goToTop();
        }
      }
      this.setState({
        submitTransferenceError,
        confirmationButtonDisable
      });
    });    
  }

  getTransferenceOptions(nextProps) {
    if (!this.eventdashboard) {
      this.eventdashboard = nextProps.eventdashboard;
      // this.eventOwnerId = this.eventdashboard && _.find(this.eventdashboard.eventData.eventDetailsInfo.celebrityInfo, { iscoOwner: 'false' }).repositoryId;
      this.userName = this.eventdashboard.dashboardUser.dashboardUserName;
      if (this.eventOwnerId) {
        getTransferenceOptions({ eventId: this.eventId, eventOwnerId: this.eventOwnerId, type: this.type, activatePhysicalWallet: this.activateWallet.toString() }, (res) => {
          if (res.data) {
            this.setState({ transferenceData: res.data });
          } else {
            this.setState({ transferenceDataError: res.error.status ? res.error.status.errorMessage : '' });
          }
        });
      }
      this.reqData = {
        eventId: this.eventId,
        eventOwnerId: this.eventOwnerId,
        type: this.type,
      };
    }
  }

  submitTransferenceDataFunction = (submitTransferenceParams) => {
    if (submitTransferenceParams) {
      if (submitTransferenceParams.walletType !== 'undefined' && !submitTransferenceParams.paymentMode) {
        let walletType = '';
        const totalAmountForCommision = (+submitTransferenceParams.walletOrEmployeeCardAmount + +submitTransferenceParams.bonusAmount).toString();
        if (submitTransferenceParams.walletOrEmployeeIdentifierId) {
          walletType = '0';
        } else {
          walletType = submitTransferenceParams.walletType;
        }
        calculateCommision({ eventId: this.eventId, walletType, amount: totalAmountForCommision, accountId: submitTransferenceParams.walletOrEmployeeIdentifierId }, (res) => {
          if (res.data) {
            const transactionInfo = res.data.transactionInfo;
            if (transactionInfo.commissionToWallet) {
              this.setState({
                submitTransferenceData: {
                  ...this.reqData,
                  ...submitTransferenceParams,
                  walletUserName: submitTransferenceParams.walletHolderName ? submitTransferenceParams.walletHolderName : this.userName,
                  transferDate: this.state.transferenceData.currTime,
                  totalAmount_View: transactionInfo.totalAmountToWallet,
                  totalAmount: transactionInfo.totalAmountToWallet,
                  commissionValue: transactionInfo.commissionFeeToWallet,
                  walletCommissionAmount: transactionInfo.commissionToWallet,
                },
              });
              if (this.isCombinadoExists) {
                this.acc._goToPanel(3);
              } else {
                this.acc._goToPanel(1);
              }
            }
          } else {
            this.depositForm.displayError(res.error.status ? res.error.status.errorMessage : null);
          }
        });
      } else if (submitTransferenceParams.paymentMode === '4') {  // Combinado case
        this.setState({
          submitTransferenceData: {
            ...this.reqData,
            ...submitTransferenceParams,
            transferDate: this.state.transferenceData.currTime,
          },
        });
      } else if (submitTransferenceParams.paymentMode === 'UserCardBankForm') {
        this.setState({
          submitTransferenceData: {
            ...this.state.submitTransferenceData,
            ...submitTransferenceParams,
            cardBankUserName: submitTransferenceParams.accountName ? submitTransferenceParams.accountName : this.userName,
          },
        });
      } else if (submitTransferenceParams.paymentMode === 'MonederoForm') {
        this.setState({
          submitTransferenceData: {
            ...this.state.submitTransferenceData,
            ...submitTransferenceParams,
            walletOrEmployeeCardAmount: this.state.submitTransferenceData.walletOrEmployeeCardAmount,
            bonusAmount: this.state.submitTransferenceData.bonusAmount,
          },
        });
      } else if (submitTransferenceParams.paymentMode === 'ClosingGift') {
        this.setState({
          submitTransferenceData: {
            ...this.reqData,
            ...this.state.submitTransferenceData,
            ...submitTransferenceParams,
          },
        });
      }
    } else {
      this.setState({ submitTransferenceData: this.reqData });
    }
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  validateTransferenceOptions = (transferenceData) => {
    if (!_.isEmpty(transferenceData)) {
      const bonusAmountValidate = transferenceData.transferenceOptions && 
      +transferenceData.transferenceOptions.bonusAmount === 0
      const transferValidate = transferenceData.transferenceOptions && 
      +transferenceData.transferenceOptions.transferableAmount > 0
    
      if( transferenceData.isClosingGiftEligible && 
        transferenceData.isClosingGiftEligible.toString() !== 'false') {
        return <MultiStepProgressBar 
                  steps={4} 
                  page={this.state.page} 
                  stepsLabels={["Forma de depósito", 
                  "Verificación de cierre", 
                  "Verificación de seguridad",
                  "Autorización del movimiento"]}
                />
      } else if ( bonusAmountValidate && transferValidate ) {
        return <MultiStepProgressBar 
                  steps={4} 
                  page={this.state.page} 
                  stepsLabels={["Forma de depósito", 
                  "Verificación de cierre", 
                  "Verificación de seguridad",
                   "Autorización del movimiento"]}
                />
      } else if (bonusAmountValidate) {
        return null
      }  else {
        return <MultiStepProgressBar 
                  steps={4} 
                  page={this.state.page} 
                  stepsLabels={["Forma de depósito", 
                  "Verificación de cierre", 
                  "Verificación de seguridad",
                  "Autorización del movimiento"]}
               />
      }
    } 
    return null
  }

  render() {
    const eventDetailsInfo = this.eventdashboard && this.eventdashboard.eventData.eventDetailsInfo;
    const { transferenceData } = this.state;
    if (transferenceData && transferenceData.transferenceOptions && transferenceData.transferenceOptions.transferenceMethods) {
      this.isCombinadoExists = _.find(transferenceData && transferenceData.transferenceOptions && transferenceData.transferenceOptions.transferenceMethods, { code: '4' });
    }

    return (
      <div>
        <div className="container wrapTransference">
          <DownloadPrintHeader />
          <div className="row show-grid-row">
            <div className="col-xs-12">
              {this.state.transferenceDataError ?
                <div className="alertError non-printable"><i className="icon-tache2" />
                  <p>{this.state.transferenceDataError}</p>
                </div> : null
              }
              {
                this.validateTransferenceOptions(transferenceData)
              }           
              <div className="titleSection non-printable">Cierre de mesa </div>
              {!_.isEmpty(transferenceData) && !_.isEmpty(eventDetailsInfo) && !_.isEmpty(this.props.labels) ?
              transferenceData.transferenceOptions && +transferenceData.transferenceOptions.bonusAmount == 0 && +transferenceData.transferenceOptions.transferableAmount <= 0 && transferenceData.isClosingGiftEligible && transferenceData.isClosingGiftEligible.toString() === 'false' 
              ?
              <div className="row mt-50 non-printable">
                <div className="col-xs-12" style={{textAlign: "center"}}>
                <button style={{width: "60%", height: "50px"}}
                className="retireConfirm collapsed btnPrimary"
                disabled={this.state.confirmationButtonDisable ? 'disabled' : ''}
                onClick={this.noClosingGiftClosure}
                >Confirmar Cierre</button>
                </div>
              </div>  
              :<div className="checkout">
              {transferenceData.status.status === 'failure' ? <p>{transferenceData.status.errorMessage}</p> :                    
              this.state.page === 1 ? 
              <React.Fragment>
                <DepositForm ref={deposit => this.depositForm = deposit} nextPage={this.nextPage} submitTransferenceDataFunction={this.submitTransferenceDataFunction} transference={transferenceData} eventDetailsInfo={eventDetailsInfo} router={this.props.router} userName={this.userName} eventId={this.eventId} labels={this.props.labels} /> 
                {this.isCombinadoExists &&
                <React.Fragment>
                  <UserCardBankForm prev={() => this.acc._prev()} transferenceData={transferenceData} eventId={this.eventId} submitTransferenceDataFunction={this.submitTransferenceDataFunction} submitTransferenceData={this.state.submitTransferenceData} labels={this.props.labels} />
                  <MonederoForm prev={() => this.acc._prev()} goToPanel={(index) => { this.acc._goToPanel(index); }} submitTransferenceDataFunction={this.submitTransferenceDataFunction} submitTransferenceData={this.state.submitTransferenceData} transference={transferenceData} eventDetailsInfo={eventDetailsInfo} labels={this.props.labels} />
                </React.Fragment>}
              </React.Fragment>
              : this.state.page === 2 ?
              <VerificationForm nextPage={this.nextPage} goToPanel={(index) => { this.acc._goToPanel(index); }} isCombinadoExists={this.isCombinadoExists} submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} transferenceData={transferenceData} labels={this.props.labels} />
              : this.state.page === 3 ?
              <OtpCode nextPage={this.nextPage} submitTransferenceData={this.state.submitTransferenceData} eventId={this.eventId} dashboardUser={this.eventdashboard.dashboardUser} router={this.props.router} isCombinadoExists={this.isCombinadoExists} eventDetailsInfo={eventDetailsInfo} transferenceData={transferenceData}/> 
              : this.state.page === 4 ?
              <ClosureTransferenceAutorization nextPage={this.nextPage} goToPanel={(index) => { this.acc._goToPanel(index); }} isCombinadoExists={this.isCombinadoExists} submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} transferenceData={transferenceData} labels={this.props.labels} /> 
              : null}
            </div>                
                : null}
            </div>
          </div>
        </div>
        <ClosurePasswordConfirmationModal onRef={ref => (this.ClosurePasswordConfirmationModal = ref)} eventId={this.eventId} router={this.props.router} onPasswordConfirmClick={this.onClosurePasswordConfirmClick} labels={this.props.labels} />
      </div>);
  }
}
export default ClosureTransference;
