/* eslint no-throw-literal: "off" */
/* eslint-disable */
import React, { Component } from 'react'
import Link from 'lib/ZUILib/Link'
import { connect } from 'react-redux';
import Form from '../../../lib/ZUILib/Form'
import TextInput from '../../../lib/ZUILib/TextInput';
import Button from '../../../lib/ZUILib/Button';
import { loginUser } from './actions';
import CommonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';

@connect(
  store => ({
    user: store.user,
    error: store.user.error
  }),
  { loginUser: loginUser }
)

export default class LoginPage extends Component {

  constructor() {
    super();
    this.errorMessage = ''
    this.top = 287
    this.state = {
      errors: {}
    }
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors
    })
    if (isValidForm) {
      this.props.loginUser(formValues); //formValues.email, formValues.password)
    }
  }

  handleRedirect = (url) => {
    this.props.router.push(url);
  }

  componentDidMount() {
    if (typeof window != 'undefined') {
      let user = window.localStorage.getItem("user");
      if (user && user != 'null' && user != 'undefined') {
        this.props.router.push(CommonUtil.generateRedirect(routeconfig.maindashboard));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.loggedin) {
      if (nextProps.user.data.daysLeftForPwdExpiry != undefined && (nextProps.user.data.daysLeftForPwdExpiry <= 3 || nextProps.user.data.isPasswordUpdated === 'false')) {
        if (nextProps.user.data.daysLeftForPwdExpiry <= 0) {
          const tempUser = { storeAssociateId: nextProps.user.data.storeAssociateId, userName: nextProps.user.data.userName, isPasswordUpdated: nextProps.user.data.isPasswordUpdated, daysLeftForPwdExpiry: nextProps.user.data.daysLeftForPwdExpiry }
          window.localStorage.setItem("tempUser", JSON.stringify(tempUser));
          this.top = 352;
        } else {
          window.localStorage.setItem("user", JSON.stringify(nextProps.user.data));
          if (nextProps.user.data.isPasswordUpdated === 'false') {
            let updatepasswordUrl = CommonUtil.generateRedirect(routeconfig.updatepassword)
            updatepasswordUrl = this.props.location.query.to ? `${updatepasswordUrl}?to=${this.props.location.query.to}` : updatepasswordUrl
            this.props.router.push(updatepasswordUrl);
          } else {
            let updatepasswordUrl = CommonUtil.generateRedirect(routeconfig.updatepasswordnow)
            updatepasswordUrl = this.props.location.query.to ? `${updatepasswordUrl}?to=${this.props.location.query.to}` : updatepasswordUrl
            this.props.router.push(updatepasswordUrl);
          }
        }
      } else if (typeof window != 'undefined') {
        window.localStorage.setItem("user", JSON.stringify(nextProps.user.data));
        if (this.props.location.query.to) {
          this.props.router.push(this.props.location.query.to);
        } else {
          this.props.router.push(CommonUtil.generateRedirect(routeconfig.maindashboard));
        }

      }
    }
  }

  handleShowTooltip = (e) => {
    const tooltip = <div className="tooltip fade bottom in"
      style={{ top: this.top + 'px', left: 100 + 'px', display: 'block' }}>
      <div className="tooltip-arrow" style={{ left: 50 + '%' }}></div>
      <div className="tooltip-inner">{e.target.getAttribute('data-original-title')}</div>
    </div>
    this.setState({ tooltip })
  }

  updatePasword = () => {
    let updatepasswordUrl = CommonUtil.generateRedirect(routeconfig.updatepassword)
    updatepasswordUrl = this.props.location.query.to ? `${updatepasswordUrl}?to=${this.props.location.query.to}` : updatepasswordUrl
    this.props.router.push(updatepasswordUrl);
  }

  handleHideTooltip = (e) => {
    this.setState({ tooltip: '' })
  }

  componentDidUpdate = () => {
    CommonUtil.errorScrollUp();
  }

  render() {
    const { errors } = this.state;
    const { error, user } = this.props;
    if (error && error.errorMessage) {
      this.top = 345
    }
    return (
      <div>
        <div className="container loginContent">
          <div className="row">
            <div className="col-xs-4 col-xs-offset-4">
              <Form onSubmit={this.handleSubmit}>
                <h1>Inicia Sesión</h1>
                {(error && error.errorMessage) &&
                  <div className="alertError errorLoginForm">
                    <i className="icon-tache2"></i>
                    <p>{error.errorMessage}</p>
                  </div>}
                {user && user.data && user.data.daysLeftForPwdExpiry && user.data.daysLeftForPwdExpiry <= 0 &&
                  <div className="alertError"><i className="icon-tache2"></i>
                    <p>Tu contraseña ha expirado, <br /> asigna una nueva conraseña</p><a className="icon-tache2"></a>
                  </div>

                }
                <span>Usuario</span>
                <TextInput value="" handleBlur={this.handleBlur} className="inputMaterial"
                  labelClassName="placeHolderMaterial" htmlId="email"
                  name="email" type="text" label="Ingresa tu usuario" required="required"
                  validators={(
                    [{
                      type: 'required',
                      errorMessage: 'Por favor ingresa un usuario'
                    }])
                  }
                  maxlength={255}
                  errors={errors}
                />
                {/* </div> */}
                <span>Contraseña</span>
                {/* <div className="formBlock"> */}
                <TextInput value="" handleBlur={this.handleBlur} className="inputMaterial"
                  labelClassName="placeHolderMaterial" htmlId="password"
                  name="password" autoComplete="new-password" type="password" label="Ingresa contraseña" required="required"
                  validators={(
                    [{
                      type: 'required',
                      errorMessage: 'Por favor ingresa una contraseña'
                    }])
                  }
                  errors={errors}
                  maxlength={255}
                />
                {/* </div> */}
                {user && user.data && user.data.daysLeftForPwdExpiry && user.data.daysLeftForPwdExpiry <= 0 ? <button type="button" onClick={this.updatePasword} className="btnPrimary size-Full">Actualizar contraseña</button> :
                  <Button type="submit" className="btnPrimary size-Full" disabled={user.loading}>Ingresar</Button>
                }
                <a className="whiteTooltip"
                  onMouseOver={this.handleShowTooltip}
                  onMouseOut={this.handleHideTooltip}
                  data-toggle="tooltip"
                  data-placement="bottom"
                  data-original-title="Para recuperar tu contraseña, comunícate al centro de atención telefónica Liverpool CAU (030)">
                  ¿Olvidaste tu contraseña?
                </a>
                {this.state.tooltip}
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}