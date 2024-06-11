import React, { Component } from 'react'
import Link from 'lib/ZUILib/Link'
import TextInput from '../../../lib/ZUILib/TextInput';
import Form from '../../../lib/ZUILib/Form'
import commonUtil from '../../../utils/commonUtil'

export default class UpdatePasswordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            updatePasswordError: { error: false, errorMessage: '' },
        }
    }

    handleSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            errors: formErrors
        })
        if (isValidForm) {
            this.props.updatePassword(formValues)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.updatePasswordError && this.props.updatePasswordError.errorMessage !== '' && nextProps.updatePasswordError && nextProps.updatePasswordError.errorMessage !== '') {
            // console.log("setting updatePasswordError to {}..")
            // this.setState({
            //     updatePasswordError: {},
            // })
        } else if ((!this.props.updatePasswordError || this.props.updatePasswordError.errorMessage === '') && nextProps.updatePasswordError && nextProps.updatePasswordError.errorMessage !== '') {
            this.setState({
                updatePasswordError: nextProps.updatePasswordError,
            })
        }
    }

    componentDidUpdate = () => {
        commonUtil.errorScrollUp();
    }

    render() {
        const { submitValidate, updatingPassword } = this.props;
        const { errors } = this.state;

        let user = undefined;
        if (typeof window != 'undefined') {
            let userObj = window.localStorage.getItem("user");
            if (!userObj) {
                userObj = window.localStorage.getItem("tempUser");
            }
            user = userObj ? JSON.parse(userObj) : undefined;
        }

        return (
            <div className="row">
                <div className="col-xs-4 col-xs-offset-4">
                    <Form onSubmit={this.handleSubmit}>
                        <h1>ACTUALIZAR CONTRASEÑA</h1>

                        {this.state.updatePasswordError.errorMessage &&
                            <div className="alertError errorLoginForm">
                                <i className="icon-tache2"></i>
                                <p>Usuario y/o contraseña incorrectos. <br /> Por favor, intenta de nuevo. (key)</p>
                                <a className=" icon-tache2"></a>
                            </div>}

                        {/* {user && user.isPasswordUpdated !== 'false' &&
                            <React.Fragment>
                                <span>Contraseña</span>
                                <TextInput value="" handleBlur={this.handleBlur} className="inputMaterial"
                                    labelClassName="placeHolderMaterial" htmlId="currentPassword"
                                    name="currentPassword" type="password" label="Ingresa tu contraseña" required="required"
                                    validators={(
                                        [{
                                            type: 'required',
                                            errorMessage: 'ingresa tu contraseña'
                                        }])
                                    }
                                    errors={errors}
                                />
                            </React.Fragment> */}

                        <span>Nueva contraseña</span>
                        {/* <div className="formBlock">
                            <div className="materialStyle">
                                <input className="inputMaterial" type="password" required="required" name="newPassword" />
                                <label className="placeHolderMaterial">Ingresa Nueva contraseña</label>
                            </div>
                        </div> */}
                        <TextInput value="" handleBlur={this.handleBlur} className="inputMaterial"
                            labelClassName="placeHolderMaterial" htmlId="newPassword"
                            name="newPassword" type="password" label="Ingresa nueva contraseña" required="required"
                            validators={(
                                [{
                                    type: 'required',
                                    errorMessage: 'ingresa nueva contraseña'
                                }, {
                                    type: 'minLength',
                                    errorMessage: 'Tu contraseña debe de tener al menos 8 caracteres',
                                    minLength: 8
                                }])
                            }
                            errors={errors}
                        />

                        <span>Confirmación de nueva contraseña</span>

                        <TextInput value="" handleBlur={this.handleBlur} className="inputMaterial"
                            labelClassName="placeHolderMaterial" htmlId="confirmPassword"
                            name="confirmPassword" type="password" label="Confirma nueva contraseña" required="required"
                            validators={(
                                [{
                                    type: 'required',
                                    errorMessage: 'ingresa confirma nueva contraseña'
                                }, {
                                    type: 'relMatch',
                                    errorMessage: 'Confirmar contraseña no coincide con la contraseña',
                                    relField: 'newPassword'
                                }])
                            }
                            errors={errors}
                        />

                        <input type="hidden" name="storeAssociateId" value={user ? user.storeAssociateId : ''} />
                        <input type="hidden" name="userName" value={user ? user.userName : ''} />
                        <input type="hidden" name="requestType" value="EXPIREDPASSOWRD" />

                        <button type="submit" className="btnPrimary size-Full">Aceptar</button>
                        {/* <Link className="whiteTooltip" to="javascript:void(0)" data-toggle="tooltip" data-placement="bottom" title="Para recuperar tu contraseña, comunícate al centro de atención telefónica Liverpool CAU (030)">¿Olvidaste tu contraseña?</Link> */}

                    </Form>

                </div>
            </div>

        )
    }
}
/* eslint-enable */
