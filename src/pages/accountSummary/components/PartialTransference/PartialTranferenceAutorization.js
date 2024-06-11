
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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

const pageName = 'partialtransference';
@connect(
  store => ({
    submitTransferenceResponse: store.accountSummary.submitTransference,
    returnAndRefundList: store.returnAndRefund && store.returnAndRefund.returnList && store.returnAndRefund.returnList.returnItemsInfo,
  }),
  { submitTransference, submitRefundTransaction })

class partialtransferenceAutorization extends Component {
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
    this.props.nextPage(3);
  }
  confirmationClick = () => {
    this.withDrawalConfirmationPopup.handleShow();
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
      <React.Fragment>
        <WithDrawalConfirmationPopup onRef={ref => (this.withDrawalConfirmationPopup = ref)} onAcceptWithdraw={this.onAcceptWithdraw} type={this.props.type} />
        {this.state.submitTransferenceError ? <div className="col-xs-12">
              <div className="alertError"><i className="icon-tache2" />
                <p>{this.state.submitTransferenceError}</p><a className="icon-tache2" onClick={() => { this.setState({ submitTransferenceError: null }); }} />
              </div>
            </div> : null}
        {!isFraudUser && !isVirtualAccount &&
              <React.Fragment>
                <p style={{textAlign: "center"}}>Para autorizar el movimiento, tu jefe inmediato debe iniciar sesión.</p>                
                <div className="row show-grid-row" style={{display: "flex", justifyContent: "center"}}>
                  <div className="col-xs-8">
                    <Form onSubmit={this.verifyStoreDetails}>
                      {this.state.verifyStoreError ?
                        <div className="alertMessage">
                          <div className="alertError"><i className="icon-tache2" />
                            <p>{this.state.verifyStoreError}</p><a className="icon-tache2" onClick={() => { this.setState({ verifyStoreError: null }); }} />
                          </div>
                        </div>
                        : null}

                      <form >
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
                          {verifyStoreDetails ?
                            <p className="validationCheck display-block" id="user"><i className="icon-check" /> Validación del Usuario en tienda</p>
                            : <button className={'validatePassword btnPrimaryAction size-Full ' + ((!this.state.isVerifyStoreDetailsLoading) ? '' : 'btnSecondarySpecialDisable')} >Validar contraseña</button>}
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </React.Fragment>
            }
            <div className="row show-grid-row non-printable">
              <div className="col-xs-2">
                <button className="btnSecondaryAction size-Full" onClick={this.onBackClick}><i className="icon-flecha_light_izq" /> Regresar</button>
              </div>
              <div className="col-xs-offset-10">
                <button
                  className="retireConfirm collapsed btnPrimary size-Full"
                  disabled={(!verifyStoreDetails) || (this.state.confirmationButtonDisable ? 'disabled' : '')}
                  onClick={this.confirmationClick}>{this.props.type === 'refund' ? 'Confirmar devolución' : 'Confirmar retiro'}
                </button>
              </div>
            </div>
      </React.Fragment>
    );
  }
}
export default partialtransferenceAutorization;
