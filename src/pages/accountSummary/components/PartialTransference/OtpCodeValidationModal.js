/* eslint-disable prefer-template */
import React, { Component } from 'react';
import ReactCodeInput from 'react-code-input';
import { Modal, ModalBody } from '../../../../lib/ZUILib/Modal';
import { validateOtp, createOtp } from '../../requests';
import MessageModal from '../../../../components/messageModal/MessageModal';

const TimerComponent = ({ timer }) => {
  const time = `${timer}`;
  const timerClock = `00:${time.length === 1 ? '0' + timer : timer}`;
  return (
    <span style={{ fontWeight: 600 }}>
      {timer > 30 ? '00:00' : timerClock }
    </span>
  );
};

export default class OtpCodeValidationModal extends Component {
  constructor(props, context) {
    super(props, context);
    // ----- CHECK: QA or Dev or Prod -----
    const isProd = true;
    this.username = 'MROtp';
    this.password = isProd ? 'zZ3qF5HKl4eXG65eDrokrDUhVNbA8Zn0t6cdzSEoAE2RzRl6' :
      'YHMjuyc1p2IiWQTwRn3Az0aXiT2a1jktsqeGI0mJV3WBnq4k';
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.token = this.props.token;
    this.state = {
      otpCode: 0,
      show: false,
      isCodeValid: true,
      otpTokenAuthentication: null,
      disabledButton: true,
      timer: 1000,
      attempts: 2,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState(state => ({
          ...state,
          timer: this.state.timer - 1,
        }));
      } else {
        this.setState(state => ({
          ...state,
          disabledButton: false,
          timer: 1000,
        }));
      }
    }, 1000);
    this.props.onRef(this);
  }

  componentWillUnmount() { this.props.onRef(undefined); this.stopTimer(); }

  stopTimer = () => { clearInterval(this.interval); };

  handleClose = () => {
    this.clear();
    this.setState({ otpCode: 0, show: false, timer: 1000 });
  }

  handleShow() {
    this.setState({ otpCode: 0, show: true, timer: 30 });
  }

  clear = () => {
    for (let index = 0; index < 6; index++) {
      this.reactCodeInput.state.input[index] = '';
      this.reactCodeInput.textInput[index].value = '';
    }
    this.reactCodeInput.textInput[0].focus();
  }

  handleCodeChange = async (code) => {
    await this.setState({ otpCode: code });
    if (this.state.otpCode.length === 6) {
      this.validateOtpCode(this.state.otpCode);
    }
  }

  sendCodeAgain = async () => {
    await this.setState(state => ({
      ...state,
      disabledButton: true,
      timer: 30,
    }));
    await createOtp({
      token: this.props.token,
      profileId: this.props.userData.id,
      eventNumber: this.props.userData.dashboardEventId,
    }, (response) => {
      if (response.data.status === '200') {
        this.setState(state => ({
          ...state,
          otpCode: 0,
          isCodeValid: true,
        }));
      } else {
        this.MessageModal.handleShow();
      }
    });
    this.clear();
  }

  validateOtpCode = (otpCode) => {
    if (this.state.attempts !== 0) {
      validateOtp({
        token: this.props.token,
        profileId: this.props.userData.id,
        otp: otpCode,
      }, (res) => {
        if (res.data === 'otpValidated') {
          this.props.otpCodeValidation(true);
        } else {
          this.setState({
            isCodeValid: false,
            attempts: this.state.attempts - 1,
          });
          this.clear();
        }
      });
    } else {
      this.MessageModal.handleShow();
    }
  }

  render() {
    return (
      <Modal
        show={this.state.show}
        onHide={this.handleClose}
        id="passwordConfirmationModal"
        className="modal fade modal-custom"
      >
        <ModalBody>
          <div
            style={{
              margin: '-14px',
              padding: '20px',
              boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
              fontSize: '18px',
            }}
          >
            Validemos su identidad
            <button
              onClick={this.handleClose}
              className="close"
              type="button"
              data-dismiss="modal"
            >
              ×
            </button>
          </div>
          <div
            className="row show-grid-row"
            style={{ paddingTop: '3rem', textAlign: 'center' }}
          >
            <div className="col-xs-12" style={{ textAlign: 'left', fontSize: '16px' }}>
              <span>
                Para confirmar el {this.props.type === 'partial' ? 'retiro' : 'cierre'},
                {' '}se enviara un código de seguridad al correo electrónico:
              </span>
              <span style={{ fontWeight: 600 }}>
                {' '}{this.props.email}
              </span>
              <span> y al número de celular: </span>
              <span style={{ fontWeight: 600 }}>
                {this.props.phoneNumber}
              </span>
            </div>
            <div
              className="col-xs-12"
              style={{ padding: '3% 0', textAlign: 'center' }}
            >
              <ReactCodeInput
                id="codeRef"
                type="tel"
                fields={6}
                ref={(ref) => { this.reactCodeInput = ref; }}
                value={this.state.otpCode}
                onChange={this.handleCodeChange}
                autoFocus
                inputStyle={this.state.isCodeValid
                  ?
                {
                  width: '40px',
                  height: '60px',
                  margin: '10px',
                  border: '1px solid #E10098',
                  fontSize: '30px',
                  borderRadius: '6px',
                  textAlign: 'center',
                }
                  :
                {
                  width: '40px',
                  height: '60px',
                  margin: '10px',
                  border: '1px solid #FF0000',
                  fontSize: '30px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                }}
              />
              <div>
                <button
                  type="button"
                  style={{
                    marginTop: '2rem',
                    cursor: 'pointer',
                    background: 'none',
                    border: 0,
                    textDecoration: 'underline',
                  }}
                  disabled={this.state.disabledButton}
                  onClick={this.sendCodeAgain}
                >
                  <span>Reenviar código </span>
                </button>
                <TimerComponent timer={this.state.timer} />
              </div>
            </div>
          </div>
        </ModalBody>
        <MessageModal
          onRef={(ref) => { this.MessageModal = ref; }}
          eventId={this.props.eventId}
          router={this.props.router}
        />
      </Modal >
    );
  }
}
