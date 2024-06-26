
import React, { Component } from 'react'
import routeconfig from '../../../../config/routeconfig';
// import addPlasticCard from './action'
import { addPlasticCard } from './requests'
import { getLabels } from '../../../global/Labels/actions'
import { getPlasticCardDetails } from '../../../eventManagement/EventDashboard/actions'
import { connect } from 'react-redux'
import Form from '../../../../lib/ZUILib/Form'
import TextInput from '../../../../lib/ZUILib/TextInput'
import CommonUtil from '../../../../utils/commonUtil';

@connect(
  store => ({
    labels: store.labels.labels,
    eventdetail: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : undefined,
    plasticCardDetails: store.eventdashboard.plasticCardsData,
  }),
  { getLabels, addPlasticCard, getPlasticCardDetails },
)

class StepH extends Component {

  constructor(props) {
    super(props)
    this.noOfCardsAssigned = 0
  }

  UNSAFE_componentWillMount() {
    if (!this.props.labels) {
      this.props.getLabels()
    }
    this.props.getPlasticCardDetails(this.props.params.eventId);
  }

  getCardNumber = (celebId, plasticCardInfos) => {
    if (plasticCardInfos && plasticCardInfos.length > 0) {
      for (let i = 0; i < plasticCardInfos.length; i++) {
        if (celebId === plasticCardInfos[i].ownerId) {
          return plasticCardInfos[i].plasticCardNumber
        }
      }
    }
  }

  handleRoute = () => {
    //this.props.router.push(`/eventdashboard/${this.props.eventId}#nuevo`)
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: `${this.props.params.eventId}#nuevo` }));
  }
  state = {
    errors: {},
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    const target = e.currentTarget
    this.setState({
      ...this.state,
      errors: {
        ...this.state.errors,
        [target.id]: formErrors[target.id],
      },
    })

    if (isValidForm) {
      const formId = target && target.id
      const values = formValues[formId]
      const plasticCardData = {}
      // plasticCardData.brand = 'LP'
      // plasticCardData.channel = 'INSTORE'
      plasticCardData.plasticCardNumber = values.tarjeta
      // TODO: HERE PASS OWNER ID
      plasticCardData.eventId = values.eventId
      plasticCardData.ownerId = values.ownerId
      // TODO: i CALLED THIS ACTION FROM REQUESTS NOT FROM ACTIONS
      addPlasticCard(plasticCardData, (response) => {
        if (response && response.data && response.data.status && response.data.status.status
          && response.data.status.status.toLowerCase() === 'success') {
          this.noOfCardsAssigned++
          this.setState({
            ...this.state,
            [values.ownerId]: true,
            error: undefined
          })
        } else {
          const error = response && response.error ? response.error.status : undefined;
          this.setState({
            ...this.state,
            [values.ownerId]: false,
            error
          })
        }
      })
      // this.props.addPlasticCard(values.tarjeta, values.eventId, values.cardAddedFor, values.ownerId)
    }
  }

  closeError = () => {
    this.setState({
      error: ''
    })
  }

  componentDidUpdate = () => {
    CommonUtil.errorScrollUp();
  }

  render() {
    const { labels, eventdetail, plasticCardDetails } = this.props
    const eventId = this.props.params.eventId
    const EventCreation = labels ? labels.EventCreation : null
    const { formErrors } = this.state
    let celebCount = 0;
    //this.noOfCardsAssigned = 0
    if (!eventdetail || eventdetail.eventId !== eventId) {
      return null;
    }
    const plasticCardInfos = plasticCardDetails && plasticCardDetails.plasticCardInfos
    const error = (formErrors && formErrors.errorMessage) ? formErrors : this.state.error
    // TODO: I WANT OWNER, ALL THE COOWNER ID FROM THE EVENT DETAILS HERE
    const ownerId = (eventdetail && eventdetail.celebrityInfo[0]) ? eventdetail.celebrityInfo[0].repositoryId : ''
    const coownerId = (eventdetail && eventdetail.celebrityInfo[1]) ? eventdetail.celebrityInfo[1].repositoryId : ''
    const coowner2Id = (eventdetail && eventdetail.celebrityInfo[2]) ? eventdetail.celebrityInfo[2].repositoryId : ''
    const ownerName = eventdetail && eventdetail.celebrityInfo[0] ? `${eventdetail.celebrityInfo[0].firstName} ${eventdetail.celebrityInfo[0].lastName}${eventdetail.celebrityInfo[0].maternalName ? ` ${eventdetail.celebrityInfo[0].maternalName}` : ''}` : ''
    const coownerName = eventdetail && eventdetail.celebrityInfo[1] ? `${eventdetail.celebrityInfo[1].firstName} ${eventdetail.celebrityInfo[1].lastName}${eventdetail.celebrityInfo[1].maternalName ? ` ${eventdetail.celebrityInfo[1].maternalName}` : ''}` : ''
    const coowner2Name = eventdetail && eventdetail.celebrityInfo[2] ? `${eventdetail.celebrityInfo[2].firstName} ${eventdetail.celebrityInfo[2].lastName}${eventdetail.celebrityInfo[2].maternalName ? ` ${eventdetail.celebrityInfo[2].maternalName}` : ''}` : ''
    let ownerCardNumber
    let coowner1CardNumber
    let coowner2CardNumber
    if (eventdetail && eventdetail.celebrityInfo[0] && eventdetail.celebrityInfo[0].isCelebrity) {
      ownerCardNumber = this.getCardNumber(ownerId, plasticCardInfos)
      if (ownerCardNumber) {
        this.noOfCardsAssigned++
      }
      celebCount++
    }
    if (eventdetail && eventdetail.celebrityInfo[1] && eventdetail.celebrityInfo[1].isCelebrity) {
      coowner1CardNumber = this.getCardNumber(coownerId, plasticCardInfos)
      if (coowner1CardNumber) {
        this.noOfCardsAssigned++
      }
      celebCount++
    }
    if (eventdetail && eventdetail.celebrityInfo[2] && eventdetail.celebrityInfo[2].isCelebrity) {
      coowner2CardNumber = this.getCardNumber(coowner2Id, plasticCardInfos)
      if (coowner2CardNumber) {
        this.noOfCardsAssigned++
      }
      celebCount++
    }

    return (
      <div className="container">
        <div className="main">
          <div className="row">
            <div className="col-xs-12">
              <p className="title text-centered titleModule">Por último asigna las tarjetas plasticas a los invitados.</p>
            </div>
            <div className="col-xs-12">
              <div className="grid-centered-big">
                <div />
                <div className="row">
                  <hr />
                  <div className="col-xs-12">
                    <p className="subtituloForm">Tarjetas asignadas <strong>{this.noOfCardsAssigned} de {celebCount}</strong> </p>
                  </div>
                  <div className="col-xs-12">
                    {(error && error.errorMessage) ?
                      <div className="alertError" id="errorTarjeta1"><i className="icon-tache2" />
                        <p>{error.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeError} />
                      </div>
                      : ''}
                  </div>
                  {eventdetail && eventdetail.celebrityInfo[0] && eventdetail.celebrityInfo[0].isCelebrity &&
                    <div className="row nmh mb-10">
                      <Form onSubmit={this.handleSubmit} method="post" id="AddPlasticCard1">
                        <input name="cardAddedFor" type="hidden" value="cardAddedForOwner" />
                        <input name="eventId" type="hidden" value={eventId} />
                        <input name="ownerId" type="hidden" value={ownerId} />
                        <div className="col-xs-4">
                          <div className="centrado-vertical h35">
                            <p className="textForm">{ownerName}</p>
                          </div>
                        </div>
                        <div className="col-xs-4">
                          <TextInput
                            value={ownerCardNumber}
                            formId="AddPlasticCard1"
                            className="inputMaterial label-up"
                            labelClassName="label-up"
                            htmlId="tarjeta1"
                            name="tarjeta"
                            type="number"
                            label="Ingresa numero de tarjeta plástica"
                            maxlength={13}
                            required="required"
                            validators={[{
                              type: 'required',
                              errorMessage: 'ingresa tarjeta',
                            }]}
                            errors={this.state.errors}
                          />
                        </div>
                        <div className="col-xs-4">
                          {!this.state[ownerId] && !ownerCardNumber ?
                            <button className="btnPrimaryAction size-Small" type="submit" id="guardar1">Guardar </button>
                            :
                            <div className="guardado centrado-vertical h35" id="asignada1">
                              <div className="iClass icon-estado_de_mensaje_aprobado colorLiverpool centrado-vertical"> <span className="text-small-bold gris">Tarjeta asignada                                                                    </span></div>
                            </div>}
                        </div>
                      </Form>
                    </div>}
                  {eventdetail && eventdetail.celebrityInfo[1] && eventdetail.celebrityInfo[1].isCelebrity &&
                    <div className="row nmh">
                      <Form onSubmit={this.handleSubmit} method="post" id="AddPlasticCard2">
                        <input name="eventId" type="hidden" value={eventId} />
                        <input name="ownerId" type="hidden" value={coownerId} />
                        <div className="col-xs-4">
                          <div className="centrado-vertical h35">
                            <p className="textForm">{coownerName}</p>
                          </div>
                        </div>
                        <div className="col-xs-4">
                          <TextInput
                            value={coowner1CardNumber}
                            formId="AddPlasticCard2"
                            className="inputMaterial label-up"
                            labelClassName="label-up"
                            htmlId="tarjeta2"
                            name="tarjeta"
                            type="number"
                            label="Ingresa numero de tarjeta plástica"
                            maxlength={13}
                            required="required"
                            validators={[{
                              type: 'required',
                              errorMessage: 'ingresa tarjeta',
                            }]}
                            errors={this.state.errors}
                          />
                        </div>
                        <div className="col-xs-4">
                          {!this.state[coownerId] && !coowner1CardNumber ?
                            <button className="btnPrimaryAction size-Small" type="submit" id="guardar2">Guardar </button>
                            : <div className="guardado centrado-vertical h35" id="asignada2">
                              <div className="iClass icon-estado_de_mensaje_aprobado colorLiverpool centrado-vertical"> <span className="text-small-bold gris">Tarjeta asignada                                            </span></div>
                            </div>}
                        </div>
                      </Form>
                    </div>}
                  {eventdetail && eventdetail.celebrityInfo[2] && eventdetail.celebrityInfo[2].isCelebrity &&
                    <div className="row nmh">
                      <Form onSubmit={this.handleSubmit} method="post" id="AddPlasticCard3">
                        <input name="eventId" type="hidden" value={eventId} />
                        <input name="ownerId" type="hidden" value={coownerId} />
                        <div className="col-xs-4">
                          <div className="centrado-vertical h35">
                            <p className="textForm">{coowner2Name}</p>
                          </div>
                        </div>
                        <div className="col-xs-4">
                          <TextInput
                            value={coowner2CardNumber}
                            formId="AddPlasticCard3"
                            className="inputMaterial label-up"
                            labelClassName="label-up"
                            htmlId="tarjeta2"
                            name="tarjeta"
                            type="number"
                            label="Ingresa numero de tarjeta plástica"
                            maxlength={13}
                            required="required"
                            validators={[{
                              type: 'required',
                              errorMessage: 'ingresa tarjeta',
                            }]}
                            errors={this.state.errors}
                          />
                        </div>
                        <div className="col-xs-4">
                          {!this.state[coowner2Id] && !coowner2CardNumber ?
                            <button className="btnPrimaryAction size-Small" type="submit" id="guardar2">Guardar </button>
                            : <div className="guardado centrado-vertical h35" id="asignada2">
                              <div className="iClass icon-estado_de_mensaje_aprobado colorLiverpool centrado-vertical"> <span className="text-small-bold gris">Tarjeta asignada                                            </span></div>
                            </div>}
                        </div>
                      </Form>
                    </div>}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-xs-3 col-xs-offset-9">
              <button className="btnPrimary size-Full" type="submit" onClick={this.handleRoute}><i className="iconRight icon-flecha_lightsvg_derecha" /> Ir al panel del evento</button>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default StepH
