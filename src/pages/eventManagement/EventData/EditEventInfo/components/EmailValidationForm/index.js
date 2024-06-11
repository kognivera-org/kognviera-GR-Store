import React, { Component } from 'react';
import { connect } from 'react-redux'
import Form from '../../../../../../lib/ZUILib/Form';
import TextInput from 'lib/ZUILib/TextInput'
// import FormTextInput from 'lib/ZUILib/FormTextInput'
import { validateEmail } from '../../actions'
import CoOwnerAccountEdit from '../CoOwnerAccountEdit'
import { getLabels } from '../../../../../global/Labels/actions'
import commonUtil from '../../../../../../utils/commonUtil'
import { debug } from 'util';

@connect(
    store => ({
        editEvent: store.saveeditevent,
        editError: store.saveeditevent,
        labels: store.labels.labels,
        eventDetails: store.eventdashboard && store.eventdashboard.eventData &&
            store.eventdashboard.eventData.eventDetailsInfo
    }),
    { validateEmail, getLabels },
)


class EmailValidationForm extends Component {
    state = {
        values: {},
        errors: {},
    }
    constructor(props) {
        super(props);
        // this.pageLoad = true
        this.state = {
            disableEmailSubmit: true,
            tmpVal: this.props.defaultValue
        };
    }
    // componentWillMount = () => {
    //     this.props.getLabels();
    // }

    handleEmailValidationSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            errors: formErrors
        })
        let formId = e.target.id;
        if (isValidForm) {
            let eventType = this.props.eventDetails && this.props.eventDetails.eventType;
            const values = formValues[formId];
            // this.defaultValue = values.email
            let objParams = {
                email: values.email,
                eventType: eventType
            }
            this.props.validateEmail(objParams);
            // this.pageLoad = false
        }
    }
    handleEmailChange = (e) => {
        if (this.state.tmpVal != e.target.value) {
            this.setState({ disableEmailSubmit: false });
            this.props.onEmailChange(true);
        } else {
            this.setState({ disableEmailSubmit: true });
            this.props.onEmailChange(false);
        }
        this.props.emailValue(e.target.value);
    }

    componentDidUpdate = () => {
        commonUtil.errorScrollUp();
    }
    render() {
        const { editError, editEvent, defaultValue } = this.props;
        const { labels } = this.props
        const { errors } = this.state;
        const validationEmailProps = {
            className: 'inputMaterial emailValid',
            formId: "emailForm",
            type: 'email',
            star: "*",
            required: 'required',
            htmlId: 'email',
            name: 'email',
            value: defaultValue,
            disabled: (!!(editEvent && editEvent.validateEmaildata && editEvent.validateEmaildata.status && editEvent.validateEmaildata.status.status === "success")),
            label: !(editEvent && editEvent.validateEmaildata && editEvent.validateEmaildata.status && editEvent.validateEmaildata.status.status === "success") && 'Correo electrónico',
            onChange: this.handleEmailChange,
            validators:
                [{
                    type: 'required',
                    errorMessage: 'El email el obligatorio'
                }, {
                    type: 'email',
                    errorMessage: commonUtil.getLabel(labels, 'email.verification.invalidEmail.errorMessage'),
                }],
            errors: errors
        }
        return (
            <React.Fragment>
                <div>
                    <Form id="emailForm" onSubmit={this.handleEmailValidationSubmit}>
                        <div className="validateEmailDiv">
                            <p className="validateMessage">Validación de cuenta liverpool</p>
                            <TextInput {...validationEmailProps} />
                            <p className="formHeader-result">
                                {editEvent && editEvent.validateEmaildata && editEvent.validateEmaildata.status && editEvent.validateEmaildata.status.status === "success" ? editEvent && editEvent.validateEmaildata && editEvent.validateEmaildata.profileId ? <font style={{ verticalAlign: 'inherit' }}>{commonUtil.getLabel(labels, 'eventCreation.stage1.registered.statusMessage')}</font>
                                    : <font style={{ verticalAlign: 'inherit' }}>{commonUtil.getLabel(labels, 'eventCreation.stage1.nonRegistered.statusMessage')}</font> : ''}
                            </p>
                            {!(editEvent && editEvent.validateEmaildata && editEvent.validateEmaildata.status && editEvent.validateEmaildata.status.status === "success") && <button disabled={this.state.disableEmailSubmit} className="btnPrimary size-Full validateEmail">Validar cuenta en Liverpool</button>}
                        </div>
                    </Form>
                </div>
                {editEvent && editEvent.validateEmaildata && editEvent.validateEmaildata.status && editEvent.validateEmaildata.profileId === undefined ?
                    <div>
                        <CoOwnerAccountEdit editForm={this.props.editForm} passwordValue={this.props.passwordValue} genderValue={this.props.genderValue} />
                    </div> : ''}
                {editError && editError.errorMessage && editError.errorMessage != 'proporcionar un ID de correo electronico valido' ?
                    <div className="alertError">
                        <i className="icon-tache"></i>
                        <p>Esta cuenta ya tiene un evento similar registrado. No de evento 3283838382</p>
                        <a className="icon-tache2"></a>
                    </div> : ''
                }

            </React.Fragment>
        );
    }
}
export default EmailValidationForm;