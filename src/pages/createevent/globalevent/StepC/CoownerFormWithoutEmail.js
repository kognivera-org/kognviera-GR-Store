import React, { Component } from 'react'
import routeconfig from 'config/routeconfig'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import TextInput from '../../../../lib/ZUILib/TextInput'
import RadioButton from '../../../../lib/ZUILib/RadioButton'
import CheckBox from '../../../../lib/ZUILib/CheckBox'
import * as createEventActions from '../../actions'
import { connect } from 'react-redux'
import Form from '../../../../lib/ZUILib/Form'
import DateTime from '../../../../lib/datetime/DateTime'
import commonUtil from '../../../../utils/commonUtil'

export default class CoownerFormWithoutEmail extends Component {

    state = {
        errors: {}
    }
    handleSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault()
        this.setState({
            ...this.state,
            errors: formErrors,
        })
        const formId = e.target.id
        if (isValidForm) {
            const values = formValues[formId]
            this.props.handleCreateUser(e, values.userType, true, values)
        }
    }

    render() {
        const { labels } = this.props
        const dateFormat = {
            input: true,
            timeFormat: false,
            closeOnSelect: true,
            dateFormat: 'DD/MM/YYYY',
        }

        const { coownerInfo, coownerCreated, coownerSaved, coownerProfileError } = this.props
        const { SelectionOptions, errors } = this.props
        const isExistingCoowner = !!((coownerInfo && coownerInfo.firstName))

        return (
            <div className="row" id="dataCelebrated-2">
                <div className="col-xs-12">
                    <div className="formUser">
                        <p className="info--required">* Campos Obligatorios</p>
                        <Form id="formNewUserSimple2" onSubmit={this.handleSubmit}>
                            <input type="hidden" name="isExistingUser" value={isExistingCoowner} />
                            <input type="hidden" name="userType" value="coowner" />
                            <input type="hidden" name="email" value={coownerInfo ? coownerInfo.email : ''} />
                            <input type="hidden" name="profileId" value={coownerInfo ? coownerInfo.profileId : ''} />
                            <div className="form_block">
                                <p className="textSelect" />
                                <div className="materialStyle">
                                    <SelectionTab
                                        id={'typecelebrated2'}
                                        name={'typecelebrated'}
                                        options={SelectionOptions.options}
                                        optionCaption={commonUtil.getLabel(labels, 'eventCreation.stage1.selection.role')}
                                        optionText={'option'}
                                        optionValue={'value'}
                                        errors={this.state.errors}
                                        disable={SelectionOptions.options.length < 0}
                                        formId="formNewUserSimple2"
                                        validators={([
                                            {
                                                type: 'required',
                                                errorMessage: ' ',
                                            },
                                        ])}
                                    />
                                </div>
                            </div>

                            <TextInput
                                value=""
                                className="inputMaterial"
                                labelClassName="placeHolderMaterial"
                                htmlId="firstName2"
                                name="firstName"
                                type="text"
                                label="Nombre"
                                required="required"
                                star="*"
                                errors={this.state.errors}
                                formId="formNewUserSimple2"
                                validators={([
                                    {
                                        type: 'required',
                                        errorMessage: 'ingresa nombre',
                                    },
                                ])}
                            />

                            <TextInput
                                value=""
                                className="inputMaterial"
                                labelClassName="placeHolderMaterial"
                                htmlId="lastName2"
                                name="lastName"
                                type="text"
                                label="Apellido Paterno"
                                required="required"
                                star="*"
                                errors={this.state.errors}
                                formId="formNewUserSimple2"
                                validators={([
                                    {
                                        type: 'required',
                                        errorMessage: 'ingresa apellido paterno',
                                    },
                                ])}
                            />

                            <TextInput
                                value=""
                                className="inputMaterial"
                                labelClassName="placeHolderMaterial"
                                htmlId="maternalName2"
                                name="maternalName"
                                type="text"
                                label="Apellido Materno"
                                required="required"
                            />

                            <TextInput
                                value=""
                                className="inputMaterial"
                                divClassName="materialStyle formAlias"
                                labelClassName="placeHolderMaterial"
                                htmlId="alias2"
                                name="alias"
                                type="text"
                                label="Alias"
                                required="required"
                            >
                                <div className="formAlias_icon"><i className="icon-ayuda" /></div>
                            </TextInput>

                            <DateTime
                                {...dateFormat} name="birthday"
                                placeholder={commonUtil.getLabel(labels, 'eventCreation.stage1.selection.dob')}
                            />

                            <TextInput
                                value=""
                                className="inputMaterial"
                                labelClassName="placeHolderMaterial"
                                htmlId="celphone2"
                                name="celphone"
                                type="number"
                                label="Celular"
                                required="required"
                            />

                            <div className="form_block">
                                <div className="materialStyle">
                                    <CheckBox id="toRecibe_s2" name="toRecibe_s2" displayName="El festejado desea recibir promociones a su correo" />
                                    {/* <div className="checkbox">
                <input type="checkbox" name="toRecibe_s2" id="toRecibe_s2" />
                <label htmlFor="toRecibe">El festejado desea recibir promociones a su correo</label>
              </div> */}
                                </div>
                            </div>
                            {(!coownerCreated && !coownerSaved) ?
                                <div className="form_block formUser-status--action">
                                    <div className="button_center">
                                        <input className="btnPrimaryAction size-Small btn--save" type="submit" defaultValue="Guardar" />
                                    </div>
                                </div> :
                                <div className="form_block formUser-status--success" style={{ display: 'block' }}>
                                    <p><span className="iClass icon-estado_de_mensaje_aprobado" /><span className="user">Usuario creado</span></p>
                                </div>}
                        </Form>
                    </div>
                </div>
            </div>
        )
    }

}
