
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

@connect(
  store => ({
    submitTransferenceResponse: store.accountSummary.submitTransference,
  }),
  { submitTransference, getDisplayEventStatusDropdown })

class ClosureTransferenceAutorization extends Component {
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
        this.props.nextPage(3);
    } else {
        this.props.nextPage(3);
    }
  }

  confirmationClick = () => {
    this.withDrawalConfirmationPopup.handleShow();
  }

  onAcceptWithdraw = () => {
    this.callSubmitTransferece();
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
      <div className="panel checkout-step">
        <WithDrawalConfirmationPopup onRef={ref => (this.withDrawalConfirmationPopup = ref)} onAcceptWithdraw={this.onAcceptWithdraw} type={this.props.type} labels={this.props.labels} />
          <div className="toPrint">
            {this.state.submitTransferenceError ? <div className="alertError"><i className="icon-tache2" />
              <p>{this.state.submitTransferenceError}</p><a className="icon-tache2" onClick={() => { this.setState({ submitTransferenceError: null }); }} />
            </div> : null}
            <div >
              {this.props.transferenceData.isClosingGiftEligible && this.props.transferenceData.isClosingGiftEligible.toString() === 'true' ?
                <ClosingGiftPanel submitTransferenceData={this.props.submitTransferenceData} loadFrom="verificationForm" /> : null}
            </div>
          </div>
          {!isFraudUser &&
            <React.Fragment>
              <div className="row show-grid-row" style={{display: "flex", justifyContent: "center"}}>
                <div className="col-xs-8">
                  <Form onSubmit={this.verifyStoreDetails}>
                    <p className="mainText">Para autorizar el movimiento, tu jefe inmediato debe iniciar sesión.</p>
                    {this.state.verifyStoreError ?
                      <div className="alertMessage">
                        <div className="alertError"><i className="icon-tache2" />
                          <p>{this.state.verifyStoreError}</p><a className="icon-tache2" onClick={() => { this.setState({ verifyStoreError: null }); }} />
                        </div>
                      </div>
                      : null}
                    <form>
                      <label className="inputStick"><span>*</span> Usuario</label>
                      <TextInput
                        value=""
                        name="emailStoreUser"
                        htmlId="emailStoreUser"
                        formId="verificationForm"
                        className="inputMaterial inputLayout"
                        type="text"
                        required="required"
                      />
                      <label className="inputStick inputLayout"><span>*</span> Contraseña</label>
                      <TextInput
                        value=""
                        name="passwordStoreUser"
                        htmlId="passwordStoreUser"
                        formId="verificationForm"
                        className="inputMaterial"
                        type="password"
                        autoComplete="new-password"
                        required="required"
                      />
                      <div className="validationWrap">
                        {this.state.verifyStoreDetails ?
                          <p className="validationCheck" id="user" style={{ display: 'block' }}><i className="icon-check" /> Validación del Usuario en tienda</p>
                          : <button className={'validatePassword btnPrimaryAction size-Full '}  >Validar contraseña</button>}
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </React.Fragment>
          }
          <div className="row mt-50 non-printable">
            <div className="col-xs-2">
              <button className="btnSecondaryAction size-Full" onClick={this.onBackClick}><i className="icon-flecha_light_izq" /> Regresar</button>
            </div>
            <div className="col-xs-offset-10">
              <button
                className="retireConfirm collapsed btnPrimary size-Full"
                disabled={(!verifyStoreDetails) || (this.state.confirmationButtonDisable ? 'disabled' : '')}
                onClick={this.confirmationClick}
              >Confirmar Cierre</button>
            </div>
          </div>
      </div>
    );
  }
}
export default ClosureTransferenceAutorization;
