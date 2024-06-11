import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { submitTransference, submitRefundTransaction } from '../../actions';
import VerificationPanel from './VerificationPanel';
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

class VerificationForm extends Component {
  constructor(props) {
    super(props);
    this.submitTransferenceData = '';

    this.state = {
      formErrors: {},
      approverId: '',
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
      userStoreError: null,
      submitTransferenceError: null,
      submitTransferenceErrorMessage: null,
      confirmationButtonDisable: false,
    });
    if(this.props.type === 'refund') this.props.prev();
      else this.props.nextPage(1);    
  }
  

  partialTransferenceConfirmationClick = () => {
    this.props.nextPage(3)
  }

  isFraudUserPartialTransference = () => {
    console.log("Realizar la transferencia si un usuario es de Fraudes")

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
    delete this.submitTransferenceData.userName;
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

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {
    const { formValues, dashboardUser, eventDetailsInfo } = this.props;
    const isFraudUser = this.props.isFraudUser;    
    const isVirtualAccount = !_.isEmpty(this.props.submitTransferenceData) && this.props.submitTransferenceData.paymentType === 'Virtual-Account';
    const isMigratedEvent = eventDetailsInfo && eventDetailsInfo.isMigratedEvent;

    return (
      <div className="panel checkout-step">
 {/*         --- INICIA FRAGMENTO DE TYPE PARTIAL ----- */}
        <React.Fragment>
          <div className="checkout-step-body">
            {this.state.submitTransferenceError ? <div className="col-xs-8">
              <div className="alertError"><i className="icon-tache2" />
                <p>{this.state.submitTransferenceError}</p><a className="icon-tache2" onClick={() => { this.setState({ submitTransferenceError: null }); }} />
              </div>
            </div> : null}
            <div className="row show-grid-row toPrint">
              {!_.isEmpty(this.props.submitTransferenceData) ?
                <div className="col-xs-12 alignRight iconAction exclude-for-print-download non-printable">
                  <p className="iconAction">
                    <PrintDownload footer='Verificación' elem='.toPrint' index={2} useDefault={true} fileName='Verificación.pdf' usePageHeader='false' useIframe={true} />
                  </p>
                </div>
                : null}
                {!_.isEmpty(this.props.submitTransferenceData) ? <VerificationPanel submitTransferenceData={this.props.submitTransferenceData} loadFrom="verificationForm" type={this.props.type} labels={this.props.labels} />          
                : null}
            </div>
            <div className="row show-grid-row non-printable">
              <div className="col-xs-2">
                <button className="btnSecondaryAction size-Full" onClick={this.onBackClick}><i className="icon-flecha_light_izq" /> Regresar</button>
              </div>
              <div className="col-xs-offset-10">
                {isFraudUser 
                ? <button
                    className="retireConfirm collapsed btnPrimary size-Full"
                    disabled={(this.state.confirmationButtonDisable ? 'disabled' : '')}
                    onClick={this.isFraudUserPartialTransference}>Confirmar retiro 
                  </button>
                : <button
                    className="retireConfirm collapsed btnPrimary size-Full"
                    onClick={this.partialTransferenceConfirmationClick}>Siguiente 
                 </button>
                }
              </div>
            </div>
          </div>
          </React.Fragment> 
      </div >
    );
  }
}
export default VerificationForm;
