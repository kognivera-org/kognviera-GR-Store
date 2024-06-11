import React, { Component } from 'react';
import { connect } from 'react-redux'
import Form from '../../../../../../lib/ZUILib/Form';
import TextInput from 'lib/ZUILib/TextInput'
import RadioButton from '../../../../../../lib/ZUILib/RadioButton'
// import FormTextInput from 'lib/ZUILib/FormTextInput'
import { createCoOwner } from '../../actions'
import commonUtil from '../../../../../../../src/utils/commonUtil';

@connect(
    store => ({
        editEvent: store.saveeditevent,
        editError: store.saveeditevent.error,
        coownerCreated: store.saveeditevent.coownerCreated,
    }),
    { createCoOwner },
)


class CoOwnerAccountEdit extends Component {
    state = {
        values: {},
        errors: {},
    }

    handleCoOwnerAccountSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            errors: formErrors
        })
        let formId = e.target.id;
        if (isValidForm) {
            this.props.editForm.dispatchEvent(new CustomEvent('submit', { detail: { 'createuser': true } }));
        }
    }
    passwordChange = (e) => {
        this.props.passwordValue(e.target.value)
    }

    radioChange = (e) => {
        this.props.genderValue(e.target.value)
    }
    render() {
        const { editError, editEvent } = this.props;
        const { errors } = this.state;
        const coownerCreated = editEvent && editEvent.coOwnerData && editEvent.coOwnerData.status && editEvent.coOwnerData.status.status === 'success'
        return (
            <Form id="createCoOwnerForm" onSubmit={this.handleCoOwnerAccountSubmit}>
                <div className="accountEdit">
                    <label className="lblGender">Sexo</label>
                    <RadioButton onChange={this.radioChange}
                        name="sexo" selected="" id="radioGender" displayName="Hombre" value="male" />
                    <span>&nbsp;</span>
                    <RadioButton onChange={this.radioChange}
                        name="sexo" selected="" id="radioGender2" displayName="Mujer" value="female" />
                    <div className="formBlock">
                        <TextInput value="" className="inputMaterial"
                            labelClassName="placeHolderMaterial" formId="createCoOwnerForm" htmlId="password"
                            name="password" type="password" label="Contraseña" star="*" required="required"
                            onChange={this.passwordChange} disabled={coownerCreated}
                            validators={(
                                [{
                                    type: 'required',
                                    errorMessage: 'Por favor ingresa una contraseña'
                                }])
                            }
                            errors={errors}
                        />
                    </div>

                    <div className="formBlock">
                        <TextInput value="" className="inputMaterial"
                            labelClassName="placeHolderMaterial" formId="createCoOwnerForm" htmlId="modifyPassword"
                            name="modifyPassword" type="password" label="Modificar contraseña" star="*" required="required"
                            disabled={coownerCreated}
                            validators={(
                                [{
                                    type: 'required',
                                    errorMessage: 'Por favor ingresa una contraseña'
                                }, {
                                    type: 'relMatch',
                                    errorMessage: ' ', //commonUtil.getLabel(labels, 'email.verification.EmailsDontMatch.errorMessage'),
                                    relField: 'password',
                                }])
                            }
                            errors={errors}
                        />
                    </div>

                    {coownerCreated ?
                        <p className="formHeader-result"><span className="iClass icon-estado_de_mensaje_aprobado" /> usuario creado y con accesso a su mesa</p> : <button className="btnPrimaryAction size-Medium saveAccount">Guardar</button>}

                    {/* <p><span className="iClass icon-estado_de_mensaje_aprobado" /><span className="user">{ownerSaved ? 'Guardado' : 'Usuario creado'}</span></p> */}
                </div>
            </Form>
        );
    }
}
export default CoOwnerAccountEdit;

{/* <div className="radio">
                        <input id="radioGender" type="radio" name="optionsRadios" defaultValue="{1}" />
                        <label htmlFor="radioGender">Hombre</label>
                    </div>
                    <div className="radio">
                        <input id="radioGender2" type="radio" name="optionsRadios" defaultValue="{2}" />
                        <label htmlFor="radioGender2">Mujer</label>
                    </div> */}

{/* <div className="materialStyle">
                            <input className="inputMaterial" type="password" name="password" required="" />
                            <label className="placeHolderMaterial"><span>*</span>Contraseña</label>
                        </div> */}

{/* <div className="materialStyle">
                            <input className="inputMaterial" type="password" name="modifyPassword" required="required" />
                            <label className="placeHolderMaterial"><span>*</span>Modificar contraseña</label>
                        </div> */}

{/* usuario creado y con */ }
{/* <p className="successSaved"> <i className="icon-estado_de_mensaje_aprobado"></i>{eventManagement && eventManagement['dashboard.eventDetails.coOwner.created']}</p> */ }
