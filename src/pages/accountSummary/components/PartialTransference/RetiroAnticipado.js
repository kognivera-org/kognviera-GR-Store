import React, { Component } from 'react';
import _, { times } from 'lodash';
import { connect } from 'react-redux';
import DepositForm from './DepositForm';
import VerificationForm from './VerificationForm';
import DepositFormRefund from './DepositFormRefund';
import PasswordConfirmationModal from './PasswordConfirmationModal';
import { getLabels } from '../../../global/Labels/actions';
import { getTransferenceOptions, calculateCommision } from '../../requests';
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader';
import commonUtil from '../../../../utils/commonUtil'
import MultiStepProgressBar from '../../../../components/MultiStepProgressBar/MultiStepProgressBar';
import OtpCode from './OtpCode';
import PartialTranferenceAutorization from './PartialTranferenceAutorization';
import PartialTransferenceVerficationForm from './PartialTransferenceVerficationForm';

@connect(
  store => ({
    eventdashboard: store.eventdashboard.eventData ? store.eventdashboard : null,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
    labels: store.labels.labels,
  }),
  { getLabels })

class PartialTransference extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    const dashboardUserIdHere = (this.props.dashboardUser && this.props.dashboardUser.dashboardUserId) || '';
    this.eventOwnerId = (this.props.location && this.props.location.state) ? this.props.location.state.eventOwnerId : dashboardUserIdHere;
    this.eventdashboard = null;
    this.userName = '';
    this.type = this.props.type === 'refund' ? 'refund' : 'partial';
    this.stepWallet = null,
    this.state = {
      transferenceData: null,
      transferenceDataError: null,
      submitTransferenceData: null,
      page : 1,
      step: 1,
      walletType: null,
    };
  }

  nextPage = (page) => {
    this.setState ({
      page: page
    })
  }

  getWalletType = (type) => {
    this.setState({
      walletType: type
    })
  }

  componentDidMount() {
    // show popup only for non-migrated events
    const event = this.props.eventdashboard;
    const isMigratedEvent = event
      && event.eventData
      && event.eventData.eventDetailsInfo
      && event.eventData.eventDetailsInfo.isMigratedEvent;
    if (!isMigratedEvent) {
      this.passwordConfirmationModal.handleShow();
    } else {
      this.getTransferenceOptions(this.props);
    }
  }

  onPasswordConfirmClick = () => {
    this.getTransferenceOptions(this.props);
  }

  getTransferenceOptions(nextProps) {
    if (!this.eventdashboard) {
      this.eventdashboard = nextProps.eventdashboard;
      // this.eventOwnerId = this.eventdashboard && _.find(this.eventdashboard.eventData.eventDetailsInfo.celebrityInfo, { iscoOwner: 'false' }).repositoryId;
      this.userName = this.eventdashboard.dashboardUser.dashboardUserName;
      if (this.eventOwnerId) {
        getTransferenceOptions({ eventId: this.eventId, eventOwnerId: this.eventOwnerId, type: this.type, activatePhysicalWallet: 'false' }, (res) => {
          if (res.data) {
            const tData = res.data;
            if (this.props.type === 'refund' && tData.transferenceOptions) {
              tData.transferenceOptions.transferableAmount = this.props.refundAmount;
            }
            this.setState({ transferenceData: tData });
          } else {
            this.setState({ transferenceDataError: res.error.status ? res.error.status.errorMessage : '' });
          }
        });
      }
    }
  }

  submitTransferenceData = (submitTransferenceParams) => {
    if (submitTransferenceParams.walletType) {
      let walletType = '';
      if (this.state.transferenceData.isEmployee.toString() === 'true') {
        walletType = '';
      } else if (submitTransferenceParams.walletOrEmployeeIdentifierId) {
        walletType = '0';
      } else {
        walletType = submitTransferenceParams.walletType;
      }
      calculateCommision({ eventId: this.eventId, walletType, accountId: submitTransferenceParams.walletOrEmployeeIdentifierId, amount: submitTransferenceParams.walletOrEmployeeCardAmount }, (res) => {
        if (res.data) {
          const transactionInfo = res.data.transactionInfo;
          if (transactionInfo.commissionToWallet) {
            this.setState({
              submitTransferenceData: {
                ...submitTransferenceParams,
                eventId: this.eventId,
                eventOwnerId: this.eventOwnerId,
                type: this.type,
                userName: this.userName,
                totalAmount: transactionInfo.totalAmountToWallet,
                commissionValue: transactionInfo.commissionFeeToWallet,
                transferDate: this.state.transferenceData.currTime,
                walletCommissionAmount: transactionInfo.commissionToWallet,
              },
            });
            if(this.props.type === 'refund') this.nextPage(2);
          }
        }
      });
    } else if (submitTransferenceParams.paymentType) {
      let accountType = '';
      if (submitTransferenceParams.cardOrBankIdentifierId) {
        accountType = '2';
      } else {
        accountType = submitTransferenceParams.paymentType;
      }
      calculateCommision({ eventId: this.eventId, accountType, accountId: submitTransferenceParams.cardOrBankIdentifierId, amount: submitTransferenceParams.cardOrBankAmount }, (res) => {
        if (res.data) {
          const transactionInfo = res.data.transactionInfo;
          if (transactionInfo.commissionToCard) {
            this.setState({
              submitTransferenceData: {
                ...submitTransferenceParams,
                eventId: this.eventId,
                eventOwnerId: this.eventOwnerId,
                type: this.type,
                userName: this.userName,
                totalAmount: transactionInfo.totalAmountToCard,
                commissionValue: transactionInfo.commissionFeeToCardOrBank,
                transferDate: this.state.transferenceData.currTime,
                commissionAmount: transactionInfo.commissionToCard,
              },
            });
            this.acc._next();
          }
        }
      });
    } else if (submitTransferenceParams.refundReinvest) {
      this.setState({
        submitTransferenceData: {
          totalAmount: this.props.refundAmount,
          eventId: this.eventId,
          paymentType: 'Virtual-Account',
          eventOwnerId: this.eventOwnerId,
          type: this.type,  // returns & refunds,
          userName: this.userName,
          // approverId: "12345", optional in case of reinvestment
        },
      });
      this.nextPage(2)
    }
  }

  componentDidUpdate = () => {
    if(this.type === 'refund') {
      this.props.step(this.state.page)
      this.props.walletStep(this.state.walletType)
    }
    commonUtil.errorScrollUp();
  }

  render() {
    const eventDetailsInfo = this.eventdashboard && this.eventdashboard.eventData.eventDetailsInfo;
    const { transferenceData } = this.state;
    const user = commonUtil.getCurrentStoreUser(); 
    const isFraudUser = user && user.userRoleInfo && user.userRoleInfo.roleName && user.userRoleInfo.roleName.toLowerCase() === 'fraudes';
    
    return (
      <React.Fragment>
        <div className={this.props.type === 'refund' ? null : 'container wrapTransference'}>
          <DownloadPrintHeader />
          <div className="row show-grid-row">
            <div className="col-xs-12">
              {this.type === 'partial' 
              ? isFraudUser 
              ? <div style={{width: "95%"}}>
                  <MultiStepProgressBar steps={2} page={this.state.page} stepsLabels={["Forma de depósito", "Confirmación de retiro"]}/>
                </div>
              : <div style={{width: "95%"}}>
                  <MultiStepProgressBar steps={4} page={this.state.page} stepsLabels={["Forma de depósito", "Verificación de retiro", "Verificación de seguridad","Autorización del movimiento"]}/>
                </div>  
              : null
              }
              {this.type === 'partial' ? 
                <React.Fragment>
                  <p>Puedes realizar retiros parciales a monederos propios antes del cierre del evento.</p>
                  <div className="alert alert-warning" role="alert"> Si haces un retiro anticipado, la cantidad que retires ya no participará para bono ni como acumulado de regalo.</div>
                </React.Fragment> : null}
              {this.state.transferenceDataError ?
                <div className="alertError non-printable"><i className="icon-tache2" />
                  <p>{this.state.transferenceDataError}</p>
                </div> : null}
              {!_.isEmpty(transferenceData) && !_.isEmpty(eventDetailsInfo) && !_.isEmpty(this.props.labels) ?
                <div className="checkout">
                  {this.type === 'partial' ? 
                  this.state.page === 1 ? <DepositForm ref={deposit => this.deposit = deposit} submitTransferenceData={this.submitTransferenceData} transference={transferenceData} eventDetailsInfo={eventDetailsInfo} router={this.props.router} eventId={this.eventId} type={this.type} labels={this.props.labels} onConfirmClicked={this.props.onConfirmClicked} nextPage={this.nextPage}/>
                  : this.state.page === 2 ? <PartialTransferenceVerficationForm isFraudUser={isFraudUser} submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} type={this.props.type} labels={this.props.labels} returnDate={transferenceData.currTime} nextPage={this.nextPage}/> 
                  : this.state.page === 3 ? <OtpCode nextPage={this.nextPage} submitTransferenceData={this.state.submitTransferenceData} eventId={this.eventId} dashboardUser={this.eventdashboard.dashboardUser} router={this.props.router} type={"partial"}/> 
                  : this.state.page === 4 ? <PartialTranferenceAutorization submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} type={this.props.type} showConfirm={this.props.showConfirm} labels={this.props.labels} returnDate={transferenceData.currTime} nextPage={this.nextPage}/> 
                  : null 
                  : 
                  this.state.walletType === "reinvest" ? 
                  this.state.page === 1 ? <DepositFormRefund walletStep={this.state.walletType} wallet={this.getWalletType} step={this.state.page} ref={deposit => this.deposit = deposit} submitTransferenceData={this.submitTransferenceData} transference={transferenceData} eventDetailsInfo={eventDetailsInfo} router={this.props.router} eventId={this.eventId} type={this.type} labels={this.props.labels} onConfirmClicked={this.props.onConfirmClicked} nextPage={this.nextPage}/>  
                  : this.state.page === 2 ? <VerificationForm walletType={this.state.walletType} nextPage={this.nextPage} submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} type={this.props.type} showConfirm={this.props.showConfirm} labels={this.props.labels} returnDate={transferenceData.currTime} /> : null
                  : 
                  this.state.page === 1 ? <DepositFormRefund walletStep={this.state.walletType} wallet={this.getWalletType} step={this.state.page} ref={deposit => this.deposit = deposit} submitTransferenceData={this.submitTransferenceData} transference={transferenceData} eventDetailsInfo={eventDetailsInfo} router={this.props.router} eventId={this.eventId} type={this.type} labels={this.props.labels} onConfirmClicked={this.props.onConfirmClicked} nextPage={this.nextPage}/> 
                  : this.state.page === 2 ? 
                  <VerificationForm walletType={this.state.walletType} nextPage={this.nextPage} submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} type={this.props.type} showConfirm={this.props.showConfirm} labels={this.props.labels} returnDate={transferenceData.currTime} />
                  : this.state.page === 3 ? <OtpCode nextPage={this.nextPage} submitTransferenceData={this.state.submitTransferenceData} eventId={this.eventId} dashboardUser={this.eventdashboard.dashboardUser} router={this.props.router} type={"refunds"}/> 
                  : this.state.page === 4 ? <PartialTranferenceAutorization submitTransferenceData={this.state.submitTransferenceData} dashboardUser={this.eventdashboard.dashboardUser} eventDetailsInfo={eventDetailsInfo} router={this.props.router} type={this.props.type} showConfirm={this.props.showConfirm} labels={this.props.labels} returnDate={transferenceData.currTime} nextPage={this.nextPage}/> 
                  : null 
                 }
                </div>
                : null}
            </div>
          </div>
        </div>
        <PasswordConfirmationModal onRef={ref => (this.passwordConfirmationModal = ref)} eventId={this.eventId} router={this.props.router} labels={this.props.labels} onPasswordConfirmClick={this.onPasswordConfirmClick} type={this.type}/>
      </React.Fragment>);
  }
}
export default PartialTransference;
