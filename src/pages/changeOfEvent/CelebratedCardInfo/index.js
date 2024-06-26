
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updatePlasticCards, deletePlasticCards, flushPlasticCardData } from '../actions'
import CommonUtil from '../../../utils/commonUtil'
import routeconfig from '../../../config/routeconfig'
import appconfig from '../../../config/appconfig'

@connect(
  store => ({
    labels: store.labels.labels,
    plasticCardDetails: store.eventdashboard.plasticCardsData,
    celebrityInfo: store.changeOfEvent.celebrityInfos,
    eventdetail: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : undefined,
    plasticCardsInfo: store.changeOfEvent.PlasticCardsInfo,
  }), { updatePlasticCards, deletePlasticCards, flushPlasticCardData },
)

class CelebratedCardInfo extends Component {
  constructor(props) {
    super(props)
    this.celebNameMap = {}
    this.celebName = ''
    this.deletedCardInfo = []
  }
  state = {
    plasticCardInfos: [],
    errorMessage: '',
  }

  handleDelete = (plasticCardNumber) => {
    this.setState({
      plasticCardInfos: this.state.plasticCardInfos.filter(plasticCard => plasticCard.plasticCardNumber !== plasticCardNumber),
    })
    const deletedCardInfo = this.state.plasticCardInfos.filter(plasticCard => plasticCard.plasticCardNumber === plasticCardNumber)
    this.deletedCardInfo.push(deletedCardInfo)
  }

  UNSAFE_componentWillMount = () => {
    if (this.props.eventdetail === undefined) {
      this.props.router.push(CommonUtil.generateRedirect(routeconfig.root))
    }
  }

  componentDidMount = () => {
    if (this.props.plasticCardsInfo && this.props.plasticCardsInfo.length > 0) {
      this.setState({
        plasticCardInfos: this.props.plasticCardsInfo,
      })
    } else if (this.props.plasticCardDetails.status && this.props.plasticCardDetails.status.errorMessage) {
      this.setState({
        errorMessage: this.props.plasticCardDetails.status.errorMessage,
      })
    }
    else if (!this.props.plasticCardDetails || (this.props.plasticCardDetails.plasticCardInfos && this.props.plasticCardDetails.plasticCardInfos.length === 0)) {
      this.props.router.push(CommonUtil.generateRedirect(routeconfig.updatedcontract))
    } else {
      const assignees = this.getAssignees()
      let plasticCards = []
      let plasticCardsAllowed = []
      for (let i = 0; i < this.props.celebrityInfo.length; i++) {
        let plasticCardAllowed = []
        plasticCardAllowed = this.props.plasticCardDetails && this.props.plasticCardDetails.plasticCardInfos && this.props.plasticCardDetails.plasticCardInfos.filter(plasticCard => plasticCard.ownerId === this.props.celebrityInfo[i].repositoryId)
        plasticCards = [...plasticCards, ...plasticCardAllowed]
      }
      for (let i = 0; i < assignees.length; i++) {
        let plasticCardAllowed = []
        plasticCardAllowed = plasticCards.filter(plasticCard => plasticCard.ownerId === assignees[i].id)
        plasticCardsAllowed = [...plasticCardsAllowed, ...plasticCardAllowed]
      }
      if (plasticCardsAllowed.length === 0) {
        this.setState({
          errorMessage: CommonUtil.getLabel(this.props.labels, 'eventCreation.plasticCard.errorMessage1'),
        })
      } else {
        this.setState({
          plasticCardInfos: plasticCardsAllowed,
        })
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const assignees = this.getAssignees()
    if (this.state.plasticCardInfos.length > assignees.length) {
      this.setState({
        errorMessage: 'Es necesario eliminar una tarjeta plástica.',
      })
    } else {
      this.setState({
        errorMessage: '',
      })
      const deletedPlasticCards = []
      for (let i = 0; i < this.deletedCardInfo.length; i++) {
        const formValues = {}
        formValues.ownerId = this.deletedCardInfo[i][0].ownerId
        deletedPlasticCards.push(formValues)
      }
      this.props.deletePlasticCards(deletedPlasticCards)
      this.props.updatePlasticCards(this.state.plasticCardInfos)
      this.props.router.push(CommonUtil.generateRedirect(routeconfig.updatedcontract))

    }
  }

  handleRoute = () => {
    this.props.flushPlasticCardData()
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.selectaddress))
  }

  getAssignees = () => {
    const celebrated = this.props.celebrityInfo
    const assigneeOptions = []
    celebrated && celebrated.forEach((item, index) => {
      if (item && (item.celebrityLabel.toLowerCase().includes(appconfig.celebLabels.festejado) || item.celebrityLabel.toLowerCase().includes(appconfig.celebLabels.organizador) || item.title.toLowerCase().includes(appconfig.celebLabels.festejado))) {
        const assignee = {
          option: item.firstName,
          value: index.toString(),
          id: item.repositoryId,
        }
        this.celebNameMap[index.toString()] = item.firstName
        assigneeOptions.push(assignee)
        this.celebName = item.firstName
      }
    })
    if (assigneeOptions.length > 1) {
      this.celebName = ''
    }
    return assigneeOptions
  }

  componentDidUpdate = () => {
    CommonUtil.errorScrollUp()
  }

  render() {
    const { plasticCardDetails, eventdetail } = this.props
    const plasticCardInfos = plasticCardDetails && plasticCardDetails.plasticCardInfos
    // const ownerId = ''
    // if (eventdetail && eventdetail.celebrityInfo) {
    //   eventdetail.celebrityInfo.map((celeb) => {
    //     if (celeb.iscoOwner === 'false') {
    //       ownerId = celeb.repositoryId
    //     }
    //   })
    // }
    // const ownerId = (eventdetail && eventdetail.celebrityInfo[0]) ? eventdetail.celebrityInfo[0].repositoryId : ''
    const assignees = this.getAssignees()
    const disableNextStep = this.state.plasticCardInfos.length > assignees.length
    return (
      <div className="wrap-address">
        <div className="container">
          <div className="main">
            <div className="col-xs-12 alignCenter mb-60">
              <p className="title">Tarjetas plasticas de festejados</p>
            </div>
            <hr />
            <div className="custom-container">
              <div className="col-xs-12 borderTopStyle">
                <div className="row">
                  <div className="col-xs-12">
                    <p>puedes tener 1{assignees.length > 1 && ` o ${assignees.length}`} tarjetas plasticas para el evento</p>
                  </div>
                </div>
                {this.state.errorMessage && <div className="row show-grid-row" id="error1">
                  <div className="col-xs-12 nph">
                    <div className="alertError"><i className="icon-tache2" />
                      <p>{this.state.errorMessage}</p><a className="icon-tache2" />
                    </div>
                  </div>
                </div>}
              </div>
              <div className="row row-grid show-grid-row">
                <div className="col-xs-4 text-center table-title"><span>Festejado</span></div>
                <div className="col-xs-4 text-center table-title"><span>Número de plástico</span></div>
              </div>
              <hr className="nmv" />
              {this.state.plasticCardInfos && this.state.plasticCardInfos.map((plasticCard, id) => (<div className="row row-grid show-grid-row" id="numTarjeta1">
                <div className="col-xs-4"><span className="block boldText">{plasticCard.firstName} {plasticCard.lastName}</span></div>
                <div className="col-xs-4 text-center"><span className="block boldText">{plasticCard.plasticCardNumber}
                  {/* {(plasticCard.ownerId !== ownerId && this.state.plasticCardInfos.length > assignees.length) && <span className="iClass icon-cerrar" id="tarjeta1" onClick={e => this.handleDelete(plasticCard.plasticCardNumber)} />} */}
                  {(this.state.plasticCardInfos.length > assignees.length) && <span className="iClass icon-cerrar" id="tarjeta1" onClick={e => this.handleDelete(plasticCard.plasticCardNumber)} />}
                </span></div>
              </div>))}
            </div>
            <hr />
            <div className="row show-grid-row mb-60">
              <div className="col-xs-6">
                <button onClick={this.handleRoute} className="btnSecondaryAction size-ExtraLarge" data-dismiss="modal"><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
              </div>
              <div className="col-xs-6 right">
                <button className="btnPrimary size-ExtraLarge" onClick={this.handleSubmit} id="btnSiguiente" data-dismiss="modal">Siguiente Paso <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
export default CelebratedCardInfo
