import React, { Component } from 'react'
import Datetime from 'lib/datetime/DateTime'
import routeconfig from 'config/routeconfig'
import TextInput from '../../../lib/ZUILib/TextInput'
import Form from '../../../lib/ZUILib/Form'
import { validateEventName } from '../../createevent/actions'
import { getLabels } from '../../global/Labels/actions'
import { connect } from 'react-redux'
import commonUtil from '../../../utils/commonUtil'

@connect(
  store => ({
    labels: store.labels.labels,
    eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
    eventNameError: store.createevent.eventNameError,
    celebrityInfo: store.eventdashboard.eventData.eventDetailsInfo && store.eventdashboard.eventData.eventDetailsInfo.celebrityInfo,
    eventData: store.createevent.eventData,
    isValidEvent: store.createevent.isValidEvent
  }), { validateEventName, getLabels },
)

class EventInfo extends Component {

  constructor(props) {
    super(props)
    this.pageLoad = true;
  }

  state = {
    errors: {},
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventDetailsInfo === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
    }
    if (!this.props.labels) {
      this.props.getLabels()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isValidEvent && nextProps.isValidEvent) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.selectaddress));
    }
  }

  handleRoute = (routePath) => {
    this.props.router.push(commonUtil.generateRedirect(routePath));
  }

  submitForm = (e) => {
    e.preventDefault()
    this.formToSubmit.dispatchEvent(new Event('submit'))
  }

  handleConfirmDate = (e, formValues, formErrors, isValidForm) => {
    const { eventData, eventDetailsInfo } = this.props
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    const formId = e.target.id
    if (isValidForm) {
      const values = formValues
      const preEventName = eventData && eventData.eventName ? eventData.eventName : eventDetailsInfo ? eventDetailsInfo.eventName : ''
      if (values.eventName === preEventName) {
        this.props.router.push(commonUtil.generateRedirect(routeconfig.selectaddress));
      } else {
        this.props.validateEventName(values)
      }
      this.pageLoad = false
    }
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  render() {
    const dateFormat = {
      input: true,
      name: 'eventDate',
      timeFormat: false,
      closeOnSelect: true,
      dateFormat: 'DD/MM/YYYY',
      validators: [
        {
          type: 'required',
          errorMessage: 'ingresa fecha del evento',
        },
      ],
    }
    const { labels, eventDetailsInfo, eventNameError, celebrityInfo, eventData } = this.props
    const { errors } = this.state
    // const EventCreation = labels ? labels.EventCreation : null
    return (
      <React.Fragment>
        <div className="container">
          <div className="main">
            <div className="row">
              <div className="col-xs-12">
                <p className="title text-centered titleModule">DATOS DEL EVENTO</p>
              </div>
              <div className="col-xs-12">
                <div className="grid-centered-big">
                  <div />
                  <div className="row">
                    {eventNameError && eventNameError.errorMessage &&
                      < div className="col-xs-12">
                        <div className="alertError" id="registeredInformation"><i className="icon-tache2" />
                          <p>{commonUtil.getLabel(labels, eventNameError.errorMessage)}</p><a className="icon-tache2" id="cerrarMensaje" />
                        </div>
                      </div>
                    }
                    <Form onRef={(formToSubmit) => { this.formToSubmit = formToSubmit }} onSubmit={this.handleConfirmDate} method="post">
                      <div className="col-xs-6 col-xs-offset-3 alignRight">
                        <p className="text-right requiredFields">* Campos Requeridos</p>
                      </div>
                      <input type="hidden" name="ownerEmail" value={celebrityInfo && celebrityInfo[0].email} />
                      {/* <input type="hidden" name="coOwnerEmail" value={coownerEmail} /> */}
                      <div className="col-xs-6 col-xs-offset-3">
                        <div className="formBlock">
                          <Datetime
                            value={eventDetailsInfo && eventDetailsInfo.eventDate}
                            {...dateFormat}
                            disabled
                            errors={errors}
                            ref={(eventDate) => { this.eventDate = eventDate }}
                          />
                        </div>
                      </div>
                      <div className="col-xs-6 col-xs-offset-3">
                        <TextInput
                          value={eventData && eventData.eventName ? eventData.eventName : eventDetailsInfo ? eventDetailsInfo.eventName : ''}
                          className="inputMaterial"
                          labelClassName="placeHolderMaterial"
                          htmlId="eventName"
                          name="eventName"
                          type="text"
                          maxlength={255}
                          label={commonUtil.getLabel(labels, 'eventCreation.stage2.eventName')}
                          required="required"
                          star="*"
                          errors={errors}
                          validators={([
                            {
                              type: 'required',
                              errorMessage: 'ingresa nombre',
                            },
                          ])}
                        />
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <hr />
                <div className="botonesSeparados">
                  <button className="btnSecondary size-ExtraLarge" type="button" onClick={e => this.handleRoute(routeconfig.selectedcelebrated)}><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
                  <button className="btnPrimary size-ExtraLarge" type="button" onClick={this.submitForm}><i className="iconRight icon-flecha_lightsvg_derecha" /> Siguiente paso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
export default EventInfo

// import React, { Component } from 'react';
// import FormTextInput from 'lib/ZUILib/FormTextInput'

// class EventInfo extends Component {
//   render() {

//     const eventNameTextProps = {
//       className: 'inputMaterial',
//       type: 'text',
//       name: 'eventName',
//       id: 'eventName',
//       required: 'required',
//       label: '<span>*</span> Nombre de tu evento '
//     }
//     return (
//       <div>
//         <div className="grid-centered-big">
//           <div></div>
//           <div className="container-full white shadow">
//             <div className="grid-centered-small">
//               <div></div>
//               <div className="row">
//                 <div className="col-md-12">
//                   <p className="title text-centered titleModule">DATOS DEL EVENTO</p>
//                 </div>
//                 <div className="col-md-12">
//                   <div className="grid-centered-big">
//                     <div></div>
//                     <div className="row">
//                       <div className="col-md-12">
//                         <div className="alertError" id="registeredInformation">
//                           <i className="icon-tache2"></i>
//                           <p>Estos datos ya han sido registrados previamente, por favor verifica tus datos. (key)</p>
//                           <a className="icon-tache2" id="cerrarMensaje"></a>
//                         </div>
//                       </div>
//                       <form action="" id="eventInformationForm">
//                         <div className="col-md-12">
//                           <p className="text-right requiredFields">* Campos Requeridos</p>
//                         </div>
//                         <div className="col-md-12">
//                           <div className="formBlock">
//                             <div className="materialStyle">
//                               <div className="inputDate input-group date" id="date1">
//                                 <input className="inputMaterial" name="eventDate" id="eventDate" required="required" placeholder="Fecha del evento" />
//                                 <span className="input-group-addon area_date gris"><span className="glyphicon glyphicon-calendar gris"></span></span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-md-12">
//                           <FormTextInput {...eventNameTextProps} />
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <hr />
//             <div className="row show-grid borderTopStyle">
//               <div className="col-xs-6 alignLeft">
//                 <button className="btnSecondaryAction size-ExtraLarge"><i className="iconLeft icon-flecha_light_izq"></i> Regresar</button>
//               </div>
//               <div className="col-xs-6 alignRight">
//                 <button className="btnPrimary size-ExtraLarge" id="btnSiguiente">Siguiente paso <i className="iconRight icon-flecha_lightsvg_derecha"></i>
//                   <div></div> </button>
//               </div>
//               <div></div>
//             </div>
//           </div>
//           <div></div>
//         </div>
//       </div>

//     );
//   }
// }
// export default EventInfo;
