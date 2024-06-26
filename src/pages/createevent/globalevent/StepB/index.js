import React, { Component } from 'react'
import routeconfig from 'config/routeconfig'
import { connect } from 'react-redux'
import { handleOwnerAccValidation, updateEmailIds } from '../../actions'
import Form from '../../../../lib/ZUILib/Form'
import TextInput from '../../../../lib/ZUILib/TextInput'
import { getLabels } from '../../../global/Labels/actions'
import commonUtil from '../../../../utils/commonUtil'


@connect(
  store => ({
    ownerEmail: store.createevent.ownerEmail,
    eventData: store.createevent.eventData,
    isValidOwner: store.createevent.isValidOwner,
    error: store.createevent.validateAccError,
    labels: store.labels.labels,
  }), { handleOwnerAccValidation, updateEmailIds, getLabels },
)
class StepB extends Component {

  state = {
    errors: {},
    error: '',
  }

  UNSAFE_componentWillMount = () => {
    if (!this.props.labels) {
      this.props.getLabels()
    }
    if (this.props.eventData === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root))
    }
  }
  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    const eventType = this.props.eventData.GRType.tipoCelebracion
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    if (isValidForm) {
      const values = formValues
      // console.log('dispatch::', this.props.dispatch);
      this.props.updateEmailIds(values.email1, 'owner')
      this.props.handleOwnerAccValidation(values.email1, eventType)
      // this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepc))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isValidOwner && nextProps.isValidOwner) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepc))
    }
    if (!this.props.error && nextProps.error) {
      this.setState({
        error: nextProps.error,
      })
    }
  }

  closeError = () => {
    this.setState({
      error: '',
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }
  render() {
    const { labels, eventData, ownerEmail } = this.props
    const ownerInfo = eventData && eventData.ownerInfo
    const EventCreation = labels ? labels.EventCreation : null
    // const { error } = this.props
    // let error
    // if (this.props.error) {
    //   error = this.props.error
    // }
    const { errors, error } = this.state
    return (
      <React.Fragment>
        <div className="container">
          <div className="main">
            <div className="row">
              <div className="col-xs-12">
                <p className="title text-centered titleModule">
                  Validación de cuenta Liverpool y datos de festejados
                </p>
              </div>
              <div className="col-xs-12">
                <div className="grid-centered-big">
                  <div />
                  <div className="row">
                    {error && error.errorMessage &&
                      <div className="col-xs-12">
                        <div className="alertError" id="emailsDif"><i className="icon-tache2" />
                          <p>{error.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeError} />
                        </div>
                      </div>}
                    <Form onSubmit={this.handleSubmit}>
                      <div className="col-xs-6 col-xs-offset-3 alignRight">
                        <p className="text-right requiredFields">* Campos Requeridos</p>
                      </div>
                      <div className="col-xs-6 col-xs-offset-3">
                        <TextInput
                          value={ownerEmail && ownerEmail.emailId}
                          htmlId="email1"
                          name="email1"
                          type="text"
                          label="Correo Electrónico"
                          maxlength={100}
                          required="required"
                          star="*"
                          validators={[{
                            type: 'required',
                            errorMessage: 'El email es obligatorio',
                          }, {
                            type: 'email',
                            errorMessage: commonUtil.getLabel(labels, 'email.verification.invalidEmail.errorMessage'),
                          }]}

                          errors={errors}
                        />
                        {/* <div className="materialStyle">
                              <input className="inputMaterial" type="email" name="email1" id="email1" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$" />
                              <label className="placeHolderMaterial"><span>*</span> Correo Electrónico</label>
                            </div> */}
                      </div>
                      <div className="col-xs-6 col-xs-offset-3">
                        <TextInput
                          value={ownerEmail && ownerEmail.emailId}
                          htmlId="email2"
                          name="email2"
                          type="text"
                          label="Rectificar Correo Electrónico"
                          maxlength={100}
                          required="required"
                          disableOnPaste
                          star="*"
                          validators={(
                          [{
                            type: 'required',
                            errorMessage: 'El email el obligatorio',
                          }, {
                            type: 'email',
                            errorMessage: commonUtil.getLabel(labels, 'email.verification.invalidEmail.errorMessage'),
                          }, {
                            type: 'relMatch',
                            errorMessage: commonUtil.getLabel(labels, 'email.verification.EmailsDontMatch.errorMessage'),
                            relField: 'email1',
                          }])
                          }
                          errors={errors}
                        />


                        {/* <div className="materialStyle">
                              <input className="inputMaterial" type="email" name="email2" id="email2" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$" />
                              <label className="placeHolderMaterial"><span>*</span> Rectificar Correo Electrónico</label>
                            </div> */}
                      </div>
                      <div className="col-xs-4 col-xs-offset-4">
                        <button className="btnPrimary size-Full" type="submit">
                          Validar cuenta en Liverpool
                          </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default StepB
