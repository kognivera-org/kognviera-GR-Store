import React, { Component } from 'react'
import routeconfig from '../../../../config/routeconfig';
import { connect } from 'react-redux'
import commonUtil from '../../../../utils/commonUtil';
import { flushDilisaCard, handleCheckbox } from '../../actions'
import appconfig from '../../../../config/appconfig'

@connect(
  store => ({
    eventId: store.event,
    eventData: store.createevent.eventData,
    ownerInfo: store.createevent.eventData ? store.createevent.eventData.ownerInfo : null,
    coownerInfo: store.createevent.eventData ? store.createevent.eventData.coownerInfo : null,
    coowner2Info: store.createevent.eventData ? store.createevent.eventData.coowner2Info : null,
    dilisaCardFlushed: store.createevent.eventData.dilisaCardFlushed,
    dilisaCheckBox: store.createevent.dilisaCheckBox
  }), { flushDilisaCard, handleCheckbox },
)

class StepI extends Component {

  constructor(props) {
    super(props)
    this.isCreditCardAdded = false
    this.isAddCreditCardDisabled = false

    this.celebNameMap = {}
    // this.isNextStepBtnDisabled = true
  }
  state = {
    isNextStepDisabled: true,
    successMessage: false
  }
  componentWillMount() {
    if (this.props.eventData === undefined) {
      this.props.router.push(`/${routeconfig.globalstepa}`)
    }
  }

  componentDidMount = () => {
    const assignees = this.getAssignees()
    if (this.props.eventData && this.props.eventData.employeeCardData && this.props.eventData.employeeCardData.length > assignees.length) {
      this.props.flushDilisaCard()
    }
    this.setState({
      isNextStepDisabled: !this.props.dilisaCheckBox
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dilisaCardFlushed) {
      this.isCreditCardAdded = false
      this.isAddCreditCardDisabled = false
      this.setState({
        isNextStepDisabled: true
      })
    }
  }

  addEmployeeCard = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.addnewcreditcard));
  }

  getAssignees = () => {
    const { ownerInfo, coownerInfo, coowner2Info } = this.props
    const celebrated = []
    celebrated.push(ownerInfo)
    coownerInfo && celebrated.push(coownerInfo)
    coowner2Info && celebrated.push(coowner2Info)
    const assigneeOptions = []
    celebrated.forEach((item, index) => {
      if (item && (item.ownerLabel.toLowerCase().includes(appconfig.celebLabels.festejado) || item.ownerLabel.toLowerCase().includes(appconfig.celebLabels.organizador) || item.ownerTitle.toLowerCase().includes(appconfig.celebLabels.festejado))) {
        const assignee = {
          option: item.firstName,
          value: index.toString(),
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

  handleEditEmployeeCard = (index) => {
    this.props.router.push(commonUtil.generateRedirect(`${routeconfig.addnewcreditcard}?idx=${index}`));
  }

  prevStep = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepe));
  }

  onChangeCheckCardHandler = () => {
    this.setState({ isNextStepDisabled: !this.state.isNextStepDisabled })
  }

  nextStep = () => {
    const isChecked = !this.state.isNextStepDisabled
    this.props.handleCheckbox(isChecked)
    this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepg));
  }

  // closeError = () => {
  //   this.setState({
  //     successMessage: ''
  //   })
  // }

  render() {
    const { eventData, dilisaCheckBox } = this.props
    const assignees = this.getAssignees()
    const employeeCardData = eventData ? eventData.employeeCardData : ''
    let creditCardData = ''
    const nextStepDisabledClass = employeeCardData || !this.state.isNextStepDisabled ? null : 'btnPrimaryDisable';
    let addCreditCardDisabledClass = ''

    // this.isNextStepBtnDisabled = !creditCardData

    // if (this.isNextStepBtnDisabled && this.state.isNextStepDisabled) {
    //   nextStepDisabledClass = 'btnPrimaryDisable'
    // }

    if (employeeCardData && employeeCardData.length > 0) {
      if (employeeCardData.length >= assignees.length) {
        this.isAddCreditCardDisabled = true
        addCreditCardDisabledClass = 'btnSecondarySpecialDisable'
      }
      const editEmployeeCard = this.handleEditEmployeeCard
      this.isCreditCardAdded = true
      creditCardData = employeeCardData.map((data, index) => (
        <div className="col-xs-6" key={index}>
          <p className="detailCard cardIdentifier">{data.firstName}&nbsp;{data.lastName}</p>
          <p className="detailCard cardNumber">xxxxxxxxxxxx{data.cardNumber.slice(-4)}</p>
          <p>
            <button className="btnSecondarySpecial size-Medium" onClick={e => editEmployeeCard(index)}>Editar tarjeta</button>
          </p>
        </div>
      ))
    }
    return (
      <div className="container employee">
        <div className="row">
          {/* {this.state.successMessage &&
            <div className="col-xs-12">
              <div className="alertSuccess"><i className="icon-check" />
                <p>tarjeta de dilisa añadida con éxito</p><a className="icon-tache2" onClick={this.closeError} />
              </div>
            </div>
          } */}
          <div className="col-xs-12 mainTitle">
            <h1>Tarjeta liverpool de empleado</h1>
          </div>
          <div className="col-xs-12 rowBtnAdd">
            <button className={`btnSecondarySpecial size-Medium btnAdd ${addCreditCardDisabledClass}`} onClick={this.addEmployeeCard} disabled={this.isAddCreditCardDisabled}>Agregar tarjeta</button>
          </div>
        </div>
        <div className="row bodyEmployee">
          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12 rowNotification">
                <label>Agrega tarjetas Liverpool de Empleados</label>
                <div className="checkbox">
                  <input id="checkCard" type="checkbox" defaultChecked={dilisaCheckBox} onChange={this.onChangeCheckCardHandler} disabled={this.isCreditCardAdded} />
                  <label htmlFor="checkCard">El empleado no tiene tarjeta liverpool</label>
                </div>
              </div>
              {/* {this.state.successMessage &&
                <div className="alertWarning"><i className="icon-alerta_amarilla" />
                  <p>tarjeta de dilisa añadida con éxito</p><a className="icon-tache2" onClick={this.closeError} />
                </div>
              } */}
            </div>
            <div className="row">
              <div className="col-xs-6 mainListCard">

                {creditCardData}

              </div>
            </div>
            <div className="row btnsRow">
              <div className="col-xs-12 rowButtons">
                <button className="btnSecondaryAction size-Large btnFlow" onClick={this.prevStep}><i className="iconLeft icon-flecha_light_izq" />	Regresar</button>
                <button className={`btnNextStep size-Large btnFlow ${nextStepDisabledClass}`} onClick={this.nextStep} disabled={!!nextStepDisabledClass} ><i className="iconRight icon-flecha_lightsvg_derecha" /> Siguiente paso</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default StepI
