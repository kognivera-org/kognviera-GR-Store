import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { submitTransference, submitRefundTransaction } from '../../actions';
import VerificationPanel from './VerificationPanel';
import TextInput from '../../../../lib/ZUILib/TextInput';
import Form from '../../../../lib/ZUILib/Form';
import { verifyStoreAssociate, reAuthenticateUser } from '../../requests';
import WithDrawalConfirmationPopup from './WithDrawalConfirmationPopup';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';
import appconfig from '../../../../config/appconfig';
import PrintDownload from '../../../global/PrintDownload';

// const transactionStatusObject = {
//   "transactionStatusObject": {
//     "emailAddress": "coowner@gmail.com",
//     "monederoAccountInfo": {
//       "userName": "ankitas",
//       "bonusAmount": "0.0",
//       "commission": "1",
//       "commissionFee": "1",
//       "totalAmount": "9.0",
//       "transferAmount": "10.0",
//       "walletType": "Monedero de Mesa de Regalos",
//       "number": "xxxxxxxxxxxx4567"
//     },

//   },
//   "status": {
//     "errorMessage": "",
//     "errorCode": "",
//     "status": "success"
//   }
// }

const pageName = 'partialtransference';
@connect(
  store => ({
    submitTransferenceResponse: store.accountSummary.submitTransference,
    returnAndRefundList: store.returnAndRefund && store.returnAndRefund.returnList && store.returnAndRefund.returnList.returnItemsInfo,
  }),
  { submitTransference, submitRefundTransaction })

class VerificationForm extends Component {
  constructor(props) {
    super(props);
    this.submitTransferenceData = '';

    this.state = {
      formErrors: {},
      verifyStoreDetails: null,
      verifyStoreError: null,
      approverId: '',
      verifyUserDetails: null,
      userStoreError: null,
      confirmationButtonDisable: false,
      submitTransferenceError: null,
      isVerifyStoreDetailsLoading: false,
      isVerifyUserDetailsLoading: false,
      loadingText: null,
      userEmail: null
    };
  }

  onBackClick = () => {
    this.setState({
      verifyStoreDetails: null,
      verifyStoreError: null,
      verifyUserDetails: null,
      userStoreError: null,
      submitTransferenceError: null,
      submitTransferenceErrorMessage: null,
      confirmationButtonDisable: false,
    });
    this.props.nextPage(1)
    
  }
  confirmationClick = () => {
    this.withDrawalConfirmationPopup.handleShow();
  }

  refundTransferenceConfirmationClick = () => {
    this.props.nextPage(3)
  }

  onAcceptWithdraw = () => {
    this.callSubmitTransferece();
  }

  downloadToPDF = (param) => {
    if (param && param === 'download') {
      this.setState({ loadingText: 'Descargando' })
      commonUtil.downloadPdf('.toPrint', 'Verificación.pdf', 'false', 'Verificación', () => {
        this.setState({ loadingText: null })
      })
    } else if (param && param === 'print') {
      window.print();
    }
  }

  callSubmitTransferece = () => {

    // using this flag as loading 
    this.setState({ confirmationButtonDisable: true });

    // this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.partialconfirmation, { eventId: this.props.submitTransferenceData.eventId }), state: { submitTransferenceDetails: transactionStatusObject, eventDetailsInfo: this.props.eventDetailsInfo } });
    this.submitTransferenceData = Object.assign({}, this.props.submitTransferenceData);
    if (this.submitTransferenceData.walletOrEmployeeIdentifierId) {
      this.submitTransferenceData.walletType = '0';
    }
    if (this.submitTransferenceData.cardOrBankIdentifierId) {
      this.submitTransferenceData.paymentType = '2';
    }
    delete this.submitTransferenceData.commissionValue;
    delete this.submitTransferenceData.accountNumber;
    delete this.submitTransferenceData.transferDate;
    delete this.submitTransferenceData.cardNumber;
    delete this.submitTransferenceData.userName;
    if (this.props.type !== 'refund') {
      this.submitTransferenceData.approverId = this.state.verifyStoreDetails ? this.state.verifyStoreDetails.approverId : '0000';
      this.props.submitTransference(this.submitTransferenceData).then((res) => {
        let submitTransferenceError;
        let confirmationButtonDisable = false;
        if (res.data && res.data.status) {
          if (res.data.status.status === 'success') {
            this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.partialconfirmation, { eventId: this.props.submitTransferenceData.eventId }), state: { submitTransferenceDetails: res.data, eventDetailsInfo: this.props.eventDetailsInfo } });
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
    } else {
      const refundList = {
        eventId: this.submitTransferenceData.eventId,
        // brand: commonUtil.getBrand(),
        initiateReturnList: this.props.returnAndRefundList.map(refund => ({ skuId: refund.skuId, quantity: refund.quantity })),
      };
      this.submitTransferenceData.type = 'refund';
      this.submitTransferenceData.approverId = this.state.verifyStoreDetails && this.state.verifyStoreDetails.approverId ? this.state.verifyStoreDetails.approverId : '1234';

      const submitRefundValues = {
        ...this.submitTransferenceData,
        refundList,
      };
      this.props.submitRefundTransaction(submitRefundValues).then((res) => {
        let submitTransferenceError;
        if (res && res.data && res.data.status) {
          if (res.data.status.status === 'success') {
            this.props.showConfirm();
          } else {
            submitTransferenceError = res.data.status.errorMessage;
            commonUtil.goToTop();
          }
        }
        this.setState({
          confirmationButtonDisable: false,
          submitTransferenceError
        });
      });
      this.withDrawalConfirmationPopup.handleClose();
    }
  }

  verifyStoreDetails = (e, formValues) => {
    e.preventDefault();
    this.setState({
      isVerifyStoreDetailsLoading: true
    });

    verifyStoreAssociate({ emailId: formValues.emailStoreUser, password: formValues.passwordStoreUser }, (res) => {
      if (res.data) {
        this.setState({
          verifyStoreDetails: { approverId: res.data.approverId },
          verifyStoreError: null,
          isVerifyStoreDetailsLoading: false,
        });
      } else {
        this.setState({
          verifyStoreDetails: null,
          verifyStoreError: res.error && res.error.status ? res.error.status.errorMessage : commonUtil.getLabel(this.props.labels, 'eventTransferences.verification.loginFailed'),
          isVerifyStoreDetailsLoading: false
        });

      }
    });
  }

  verifyUserDetails = (e, formValues) => {
    e.preventDefault();
    this.setState({
      isVerifyUserDetailsLoading: true
    });
    reAuthenticateUser({ email: formValues.emailClientUser, password: formValues.passwordClientUser }, (res) => {
      if (res.data) {
        this.setState({
          verifyUserDetails: {},
          userStoreError: null,
          isVerifyUserDetailsLoading: false,
        });
      } else {
        this.setState({
          verifyUserDetails: null,
          userStoreError: res.error && res.error.status ? res.error.status.errorMessage : commonUtil.getLabel(this.props.labels, 'eventTransferences.verification.loginFailed'),
          isVerifyUserDetailsLoading: false,
        });
      }
    });
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  render() {
    const { formValues, dashboardUser, eventDetailsInfo } = this.props;
    const user = commonUtil.getCurrentStoreUser();
    const isFraudUser = user && user.userRoleInfo && user.userRoleInfo.roleName && user.userRoleInfo.roleName.toLowerCase() === 'fraudes';
    const isVirtualAccount = !_.isEmpty(this.props.submitTransferenceData) && this.props.submitTransferenceData.paymentType === 'Virtual-Account';
    const isMigratedEvent = eventDetailsInfo && eventDetailsInfo.isMigratedEvent;
    let verifyUserDetails = this.state.verifyUserDetails;
    let verifyStoreDetails = this.state.verifyStoreDetails;
    if (isFraudUser || isVirtualAccount) {
      verifyStoreDetails = {};
    }
    if (isMigratedEvent || isFraudUser) {
      verifyUserDetails = {};
    }
    return (
      <div className="panel checkout-step">
        <WithDrawalConfirmationPopup onRef={ref => (this.withDrawalConfirmationPopup = ref)} onAcceptWithdraw={this.onAcceptWithdraw} type={this.props.type} />
        <div id="collapseTwo" aria-expanded="true" style={{}}>
          <div >
            {this.state.submitTransferenceError ? <div className="col-xs-8">
              <div className="alertError"><i className="icon-tache2" />
                <p>{this.state.submitTransferenceError}</p><a className="icon-tache2" onClick={() => { this.setState({ submitTransferenceError: null }); }} />
              </div>
            </div> : null}
            <div className="row show-grid-row toPrint">
              {!_.isEmpty(this.props.submitTransferenceData) ?
                <VerificationPanel submitTransferenceData={this.props.submitTransferenceData} loadFrom="verificationForm" type={this.props.type} labels={this.props.labels} returnDate={this.props.returnDate} />
                : null}
            </div>
            <div className="row show-grid-row non-printable">
              <div className="col-xs-2">
                <button className="btnSecondaryAction size-Full" onClick={this.onBackClick}><i className="icon-flecha_light_izq" /> Regresar</button>
              </div>
              <div className="col-xs-offset-10">
                <button
                  className="retireConfirm collapsed btnPrimary size-Full"
                  disabled={(this.state.confirmationButtonDisable ? 'disabled' : '')}
                  onClick={this.props.walletType === 'transference' ? this.refundTransferenceConfirmationClick : this.confirmationClick}>
                    {this.props.type === 'refund' ? this.props.walletType === 'transference' ? 'Siguiente' : 'Confirmar devolución' : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
export default VerificationForm;
