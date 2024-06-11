import { connect } from 'react-redux';
import React, { Component } from 'react';
import Button from '../../../../lib/ZUILib/Button';
import OtpCodeValidationModal from './OtpCodeValidationModal';
import { submitTransference } from '../../actions';
import { otpAuthenticate, otpCreateUser, createDevice, createOtp } from '../../requests';
import routeconfig from '../../../../config/routeconfig';
import commonUtil from '../../../../utils/commonUtil';
import MessageModal from '../../../../components/messageModal/MessageModal';

@connect(
  store => ({ submitTransferenceResponse: store.accountSummary.submitTransference }),
  { submitTransference })

export class OtpCode extends Component {
  constructor(props) {
    super(props);
    // ----- CHECK: QA or Dev or Prod -----
    const isProd = true;
    this.username = 'MROtp';
    this.password = isProd ? 'zZ3qF5HKl4eXG65eDrokrDUhVNbA8Zn0t6cdzSEoAE2RzRl6' :
      'YHMjuyc1p2IiWQTwRn3Az0aXiT2a1jktsqeGI0mJV3WBnq4k';
    this.state = {
      btnSendOtpDisabled: true,
      emailUser: '',
      phoneNumberUser: '',
      otpTokenAuthentication: '',
    };
  }

  componentDidMount = () => { this.initOTPAuthenticate(); }

  initOTPAuthenticate = () => {
    const username = this.username;
    const password = this.password;
    otpAuthenticate({ username, password }, response => this.initOTPCreateUser(response));
  }

  initOTPCreateUser = (data) => {
    const { token } = data.data;
    if (!token) {
      this.MessageModal.handleShow();
    } else {
      this.setState(state => ({ ...state, otpTokenAuthentication: token }));
      const profileId = this.props.dashboardUser.id;
      otpCreateUser({ profileId, token }, response => this.initOTPcreateDevice(response));
    }
  }

  initOTPcreateDevice = (data) => {
    const { data: res } = data;
    if (res !== 'userCreated') {
      this.MessageModal.handleShow();
    } else {
      const token = this.state.otpTokenAuthentication;
      const profileId = this.props.dashboardUser.id;
      createDevice({ profileId, token }, (response) => {
        if (response.data === 'deviceCreated') {
          this.setState(state => (
            { ...state, btnSendOtpDisabled: false }
          ));
        } else {
          this.MessageModal.handleShow();
        }
      });
    }
  }

  openOtpCodeModal = async () => {
    this.setState(state => (
      { ...state, btnSendOtpDisabled: true }
    ));
    await createOtp({
      token: this.state.otpTokenAuthentication,
      profileId: this.props.dashboardUser.id,
      eventNumber: this.props.dashboardUser.dashboardEventId,
    }, (response) => {
      if (response.data.status === '200') {
        this.setState({
          btnSendOtpDisabled: false,
          emailUser: response.data.email,
          phoneNumberUser: response.data.phoneNumber,
        });
        this.OtpCodeValidationModal.handleShow();
      } else {
        this.MessageModal.handleShow();
      }
    });
  }

  otpCodeValidation = (validation) => {
    if (validation) {
      this.props.nextPage(4);
    }
  }

  configureEmail = () => {
    this.props.router.push(
    commonUtil.generateRedirect(routeconfig.eventgralinfo, { eventId: this.props.eventId }));
  }

  render() {
    return (
      <React.Fragment>
        {this.props.dashboardUser.dashboardUserEmail ?
          <React.Fragment>
            <div className="row show-grid-row" style={{ textAlign: 'center' }}>
              <div className="col-xs-12">
                <p>
                  Para confirmar
                  <span style={{ fontWeight: '600' }}> te enviaremos un código de seguridad.</span>
                </p>
                <Button
                  id="btnSendOtp"
                  onClick={this.openOtpCodeModal}
                  className="btnPrimarySpecial size-Full"
                  style={{ width: '30%', margin: '15px 0' }}
                  disabled={this.state.btnSendOtpDisabled}
                >
                  {
                    // eslint-disable-next-line no-nested-ternary
                    this.props.type === 'partial' ? 'Retiro anticipado' :
                      this.props.type === 'refunds' ? 'Realizar devolución' : 'Cerrar Mesa'
                  }
                </Button>
                <p>
                  Al ingresar el código,
                  <span style={{ fontWeight: '600' }}> no habrá posibilidad de cambios.</span>
                </p>
              </div>
            </div>
            <div className="row show-grid-row">
              <div className="col-xs-2">
                <button
                  className="btnSecondaryAction size-Full"
                  onClick={() => this.props.nextPage(2)}
                >
                  Regresar
                </button>
              </div>
            </div>
          </React.Fragment> :
          <div className="row show-grid-row" style={{ textAlign: 'center' }}>
            <div className="col-xs-12">
              <p>
                Para usar esta funcionalidad es necesario tener un correo electrónico dado de alta.
              </p>
              <p>Por favor, configura uno.</p>
              <button
                className="btnPrimary size-Full"
                style={{ width: '40%' }}
                onClick={this.configureEmail}
              >
                Ir a configurar
              </button>
            </div>
          </div>
        }
        <OtpCodeValidationModal
          onRef={(ref) => { this.OtpCodeValidationModal = ref; }}
          otpCodeValidation={this.otpCodeValidation}
          userData={this.props.dashboardUser}
          eventId={this.props.eventId}
          router={this.props.router}
          email={this.state.emailUser}
          phoneNumber={this.state.phoneNumberUser}
          token={this.state.otpTokenAuthentication}
          type={this.props.type}
        />
        <MessageModal
          onRef={(ref) => { this.MessageModal = ref; }}
          eventId={this.props.eventId}
          router={this.props.router}
        />
      </React.Fragment>
    );
  }
}

export default OtpCode;
