
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import _ from 'lodash';
import { submitTransference } from '../../actions';
import VerificationPanel from './VerificationPanel';
import TextInput from '../../../../lib/ZUILib/TextInput';
import Form from '../../../../lib/ZUILib/Form';
import { verifyStoreAssociate, reAuthenticateUser } from '../../requests';
import WithDrawalConfirmationPopup from './WithDrawalConfirmationPopup';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';
import ClosingGiftPanel from './ClosingGiftPanel';
import { getDisplayEventStatusDropdown } from '../../../global/Header/components/EventHeader/actions';
import PrintDownload from '../../../global/PrintDownload';

// const transactionStatusObject = {
//   "transactionStatusObject": {
//     "emailAddress": "testingprofile@gmail.com",
//     "closingGiftDetails": [
//       {
//         "remisionNumber": "0390067913",
//         "addressName": "First Name",
//         "skuName": "PANTALON VESTIR LCDN, 40, AZUL MARINO F"
//       },
//       {
//         "remisionNumber": "0390067913",
//         "addressName": "First Name",
//         "skuName": "SACO JBE 1500 059 L12 1500, 38R, CAFE"
//       }
//     ],
//     "bridgeCoreRequest": "success"
//   }
// }
// const transactionStatusObject = {
//   transactionStatusObject: {
//     emailAddress: 'coowner@gmail.com',
//     monederoAccountInfo: {
//       userName: 'ankitas',
//       bonusAmount: '0.0',
//       commission: '1',
//       commissionFee: '1',
//       totalAmount: '9.0',
//       transferAmount: '10.0',
//       walletType: 'Monedero de Mesa de Regalos',
//       number: 'xxxxxxxxxxxx4567',
//     },
//     closingGiftDetails: [
//       {
//         skuName: 'PANTALON VESTIR LCDN, 40, AZUL MARINO F',
//         skuImage: '/product/sku/image02.jpg',
//         addressName: 'Bengalore',
//         remisionNumber: '000050636',
//       },
//       {
//         skuName: 'SACO JBE 1500 059 L12 1500, 38R, CAFE',
//         skuImage: '/product/sku/image03.jpg',
//         addressName: 'Bengalore',
//         remisionNumber: '000050636',
//       },
//     ],
//   },
//   status: {
//     errorMessage: '',
//     errorCode: '',
//     status: 'success',
//   },
// };

const pageName = 'closuretransference';
@connect(
  store => ({
    submitTransferenceResponse: store.accountSummary.submitTransference,
  }),
  { submitTransference, getDisplayEventStatusDropdown })

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
      loadingText: null,
    };
  }
  onBackClick = () => {
    this.setState({
      verifyStoreDetails: null,
      verifyStoreError: null,
      verifyUserDetails: null,
      userStoreError: null,
      submitTransferenceError: null,
      confirmationButtonDisable: false,
    });
    if (this.props.submitTransferenceData.walletType && !this.props.submitTransferenceData.paymentMode) {
      this.props.nextPage(1);
    } else {
      this.props.nextPage(1);
    }
  }

  confirmationClick = () => {
    this.props.nextPage(3);
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
    // using this flag for loading
    this.setState({ confirmationButtonDisable: true });

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
    delete this.submitTransferenceData.paymentMode;
    delete this.submitTransferenceData.bonusPercentage;
    delete this.submitTransferenceData.commissionValue_CardBank;
    delete this.submitTransferenceData.totalAmount_CardBank_View;
    delete this.submitTransferenceData.totalAmount_View;
    delete this.submitTransferenceData.walletUserName;
    delete this.submitTransferenceData.cardBankUserName;
    delete this.submitTransferenceData.skusNames;
    delete this.submitTransferenceData.selectedAddressName;
    delete this.submitTransferenceData.accountHolderName;

    if (!this.submitTransferenceData.selectedAddressId) {
      delete this.submitTransferenceData.selectedAddressId;
    }

    this.submitTransferenceData.approverId = this.state.verifyStoreDetails ? this.state.verifyStoreDetails.approverId : '';
    this.props.submitTransference(this.submitTransferenceData).then((res) => {
      let submitTransferenceError;
      let confirmationButtonDisable = false;
      if (res.data && res.data.status) {
        if (res.data.status.status === 'success') {
          this.props.router.push({ pathname: commonUtil.generateRedirect(routeconfig.closureconfirmation, { eventId: this.props.submitTransferenceData.eventId }), state: { submitTransferenceDetails: res.data, eventDetailsInfo: this.props.eventDetailsInfo } });
          this.props.getDisplayEventStatusDropdown({ eventId: this.props.submitTransferenceData.eventId });
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
      this.withDrawalConfirmationPopup.handleClose();
    });
  }

  verifyStoreDetails = (e, formValues) => {
    e.preventDefault();
    verifyStoreAssociate({ emailId: formValues.emailStoreUser, password: formValues.passwordStoreUser }, (res) => {
      if (res.data) {
        this.setState({
          verifyStoreDetails: { approverId: res.data.approverId },
          verifyStoreError: null,
        });
      } else {
        this.setState({
          verifyStoreDetails: null,
          verifyStoreError: res.error && res.error.status ? res.error.status.errorMessage : commonUtil.getLabel(this.props.labels, 'eventTransferences.verification.loginFailed'),
        });
      }
    });
  }

  verifyUserDetails = (e, formValues) => {
    e.preventDefault();
    reAuthenticateUser({ email: formValues.emailClientUser, password: formValues.passwordClientUser }, (res) => {
      if (res.data) {
        this.setState({
          verifyUserDetails: {},
          userStoreError: null,
        });
      } else {
        this.setState({
          verifyUserDetails: null,
          userStoreError: res.error && res.error.status ? res.error.status.errorMessage : commonUtil.getLabel(this.props.labels, 'eventTransferences.verification.loginFailed'),
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
    const isMigratedEvent = eventDetailsInfo && eventDetailsInfo.isMigratedEvent;
    // eventDetailsInfo && eventDetailsInfo.isMigratedEvent
    let verifyUserDetails = this.state.verifyUserDetails;
    let verifyStoreDetails = this.state.verifyStoreDetails;
    if (isFraudUser) {
      verifyStoreDetails = {};
    }
    if (isMigratedEvent || isFraudUser) {
      verifyUserDetails = {};
    }

    return (
      <div>
        <WithDrawalConfirmationPopup onRef={ref => (this.withDrawalConfirmationPopup = ref)} onAcceptWithdraw={this.onAcceptWithdraw} type={this.props.type} labels={this.props.labels} />
        <React.Fragment>
          <div className="col-xs-12 alignRight">
            <div className="requiredFields">* Campos obligatorios</div>
          </div>
          <div className="toPrint">
            {this.state.submitTransferenceError ? <div className="alertError"><i className="icon-tache2" />
              <p>{this.state.submitTransferenceError}</p><a className="icon-tache2" onClick={() => { this.setState({ submitTransferenceError: null }); }} />
            </div> : null}
            {!_.isEmpty(this.props.submitTransferenceData) && this.props.submitTransferenceData.paymentMode !== 'ClosingGift' ?
              <div>
                <div className="row show-grid-row">
                  <div className="col-xs-6 alignRight ">
                    <div className="row show-grid-row ">
                      {!_.isEmpty(this.props.submitTransferenceData) ?
                        <p>Fecha de operación <strong>{commonUtil.formatDate(this.props.submitTransferenceData.transferDate, 'monthName')}</strong></p>
                        : null}
                    </div>
                  </div>
                  <div className="col-xs-6 alignRight exclude-for-print-download non-printable ">
                    <PrintDownload elem='.toPrint' footer='Verificación' fileName='Verificación.pdf' usePageHeader='false' />
                  </div>
                </div>
                <div>
                  {!_.isEmpty(this.props.submitTransferenceData) ?
                    <VerificationPanel submitTransferenceData={this.props.submitTransferenceData} labels={this.props.labels} loadFrom="verificationForm" />
                    : null}
                </div>
              </div> : null}
            <div >
              {this.props.transferenceData.isClosingGiftEligible && this.props.transferenceData.isClosingGiftEligible.toString() === 'true' ?
                <ClosingGiftPanel submitTransferenceData={this.props.submitTransferenceData} loadFrom="verificationForm" /> : null}
            </div>
          </div>
          <div className="row mt-50 non-printable">
            <div className="col-xs-2">
              <button className="btnSecondaryAction size-Full" onClick={this.onBackClick}><i className="icon-flecha_light_izq" /> Regresar</button>
            </div>
            <div className="col-xs-offset-10">
              <button
                className="retireConfirm collapsed btnPrimary size-Full"
                onClick={this.confirmationClick}
              >Siguiente</button>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
export default VerificationForm;
