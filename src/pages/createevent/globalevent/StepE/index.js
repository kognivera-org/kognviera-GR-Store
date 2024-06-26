import React, { Component } from 'react'
import routeconfig from '../../../../config/routeconfig';
import { connect } from 'react-redux'
import * as createEventActions from '../../actions'
import { getLabels } from '../../../global/Labels/actions'
import { fetchOwnerAddresses, resetAddressList } from '../../../createevent/address/actions'
import Form from '../../../../lib/ZUILib/Form'
import commonUtil from '../../../../utils/commonUtil'
import RadioButton from '../../../../lib/ZUILib/RadioButton'
import { updateSelectedAddresses, updateSelectedAssignees, flushSelectedAssignees } from './actions'
import appconfig from '../../../../config/appconfig'
import CheckBox from '../../../../lib/ZUILib/CheckBox';

@connect(
  store => ({
    eventData: store.createevent.eventData,
    ownerInfo: store.createevent.eventData ? store.createevent.eventData.ownerInfo : null,
    coownerInfo: store.createevent.eventData ? store.createevent.eventData.coownerInfo : null,
    coowner2Info: store.createevent.eventData ? store.createevent.eventData.coowner2Info : null,
    ownerAddresses: store.addAddress.ownerAddresses,
    eventCategories: store.createevent.eventCategories,
    selectedAddresses: store.selectAddress.selectedAddresses,
    selectedAssignees: store.selectAddress.selectedAssignees,
    labels: store.labels.labels,
  }), { ...createEventActions, updateSelectedAddresses, flushSelectedAssignees, updateSelectedAssignees, fetchOwnerAddresses, getLabels },
)

class StepE extends Component {

  state = {
    error: '',
    displayWarningMessage: true,
  }

  constructor(props) {
    super(props)
    this.selectedNickNames = []
    this.celebNameMap = {}
    this.maxAddressCount = 0
    this.minAddressCount = 0
    this.celebName = ''
    this.addressSelectionType = 'multi'
  }

  onAssigneeChange = (e, addressId) => {
    const value = e.currentTarget.value
    const assigneeValue = { [addressId]: value }
    const selectedAssignees = Object.assign({}, this.props.selectedAssignees)
    selectedAssignees[addressId] = value
    this.props.updateSelectedAssignees(selectedAssignees)
  }
  onChange = (e) => {
    const selectedAddresses = this.maxAddressCount === 1 ? [] : Object.assign([], this.props.selectedAddresses)
    const selectedAssignees = this.props.selectedAssignees
    const filteredAssigneeList = {}
    let filteredAddressList = this.addressSelectionType === 'multi' ? selectedAddresses : []
    if (e.currentTarget.checked) {
      filteredAddressList.push(e.currentTarget.value)
      // filteredAssigneeList = selectedAssignees;
    } else {
      filteredAddressList = selectedAddresses.filter((data, index) => data !== e.currentTarget.value)
      Object.keys(selectedAssignees).filter((key, index) => {
        if (key !== e.currentTarget.value) {
          filteredAssigneeList[key] = selectedAssignees[key]
        }
        return key !== e.currentTarget.value
      })
      this.props.updateSelectedAssignees(filteredAssigneeList)
    }
    this.props.updateSelectedAddresses(filteredAddressList)
  }

  handleRoute = (routePath) => {
    this.props.router.push(commonUtil.generateRedirect(routePath));
  }

  UNSAFE_componentWillMount() {
    if (!this.props.labels) {
      this.props.getLabels()
    }
    this.props.resetAddressList()
    if (this.props.eventData === undefined) {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
    }
    const profileIds = []
    // let ownerId = this.props.ownerInfo && this.props.ownerInfo.profileId
    // let coownerId = this.props.coownerInfo && this.props.coownerInfo.profileId

    // if (ownerId && coownerId) {
    //   this.props.fetchOwnerAddresses(ownerId, () => {
    //     this.props.fetchOwnerAddresses(coownerId)
    //   })
    // } else if (ownerId) {
    //   this.props.fetchOwnerAddresses(ownerId)
    // } else if (coownerId) {
    //   this.props.fetchOwnerAddresses(coownerId)
    // }

    if (this.props.ownerInfo && this.props.ownerInfo.profileId) {
      profileIds.push(this.props.ownerInfo.profileId);
    }
    //this.props.fetchOwnerAddresses(this.props.ownerInfo.profileId)
    if (this.props.coownerInfo && this.props.coownerInfo.profileId) {
      profileIds.push(this.props.coownerInfo.profileId);
      //this.props.fetchOwnerAddresses(this.props.coownerInfo.profileId)
    }
    if (this.props.coowner2Info && this.props.coowner2Info.profileId) {
      profileIds.push(this.props.coowner2Info.profileId);
      //this.props.fetchOwnerAddresses(this.props.coowner2Info.profileId)
    }
    if (profileIds.length > 0) {
      this.props.fetchOwnerAddresses(profileIds)
    }
  }
  getAddressById = (nickName) => {
    const addresses = this.props.ownerAddresses ? this.props.ownerAddresses : null
    let retAddress = null
    if (addresses) {
      const retAddresses = addresses.filter((address, index) => address.addressId === nickName)
      retAddress = retAddresses && retAddresses.length > 0 ? retAddresses[0] : null
    }
    return retAddress
  }

  componentDidMount() {
    const assignees = this.getAssignees()
    if (this.props.selectedAddresses.length > assignees.length) {
      this.props.updateSelectedAddresses([this.props.selectedAddresses[1]])
      this.props.flushSelectedAssignees()
    }
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    if (!isValidForm) {
      this.setState({
        formErrors: formErrors,
      })
    } else {
      const values = formValues
      const eventAdderesses = {}
      const addressById = this.getAddressById
      this.selectedNickNames = []
      let isValidData = true
      this.props.selectedAddresses.forEach((addressId) => {
        const address = addressById(addressId)
        const nickName = address ? address.nickName : ''
        const isDuplicate = this.selectedNickNames.indexOf(nickName) > -1
        if (isDuplicate) {
          isValidData = false
          const errorMsg = 'Please select addresses with unique nick name'
          this.setState({
            ...this.state,
            error: errorMsg,
          })
          return
        }
        this.selectedNickNames.push(nickName)

        const selectedIndex = this.props.selectedAssignees[addressId]
        if (this.celebName) {
          address.celebrityName = this.celebName
        } else {
          const ownerFirstName = this.celebNameMap[selectedIndex] ? this.celebNameMap[selectedIndex] : 'Adicional'
          address.celebrityName = ownerFirstName
        }
        eventAdderesses[addressId] = address
      })
      if (isValidData) {
        this.props.updateEventAddresses(eventAdderesses)
        if (this.props.eventData.GRType.isEmployeeEvent === 'true') {
          this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepi));
        } else {
          this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepg));
        }
      }
    }

  }

  handleEditAddress = (id) => {
    this.props.router.push(commonUtil.generateRedirect(`${routeconfig.addnewaddress}?addressId=${id}`));
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

    if (this.props.eventData && this.props.eventData.GRType.tipoCelebracion === appconfig.eventTypes.Boda) {
      const assignee = {
        option: 'Adicional',
        value: '3',
      }
      this.celebNameMap['3'] = 'Adicional'
      assigneeOptions.push(assignee)
    }
    return assigneeOptions
  }

  renderAssigneeOptions = (addressId, assignees) => {
    const { selectedAssignees } = this.props
    const selectedAssigneesValues = Object.values(selectedAssignees)
    const currentAssignee = selectedAssignees[addressId]
    const assigneeOptions = assignees.map((assignee, index) => {
      const disableOption = this.maxAddressCount === 1 ? false : selectedAssigneesValues.indexOf(assignee.value) > -1
      const selected = assignee.value === currentAssignee
      return <option key={index} selected={selected} disabled={disableOption} value={assignee.value}>{assignee.option}</option>
    })
    return <React.Fragment>{assigneeOptions}</React.Fragment>
  }


  renderAddresses = () => {
    const { ownerAddresses, selectedAddresses } = this.props
    const disableCheckbox = selectedAddresses.length >= this.maxAddressCount
    const assignees = this.getAssignees()
    this.addressSelectionType = (this.maxAddressCount === 1 || assignees.length === 1) ? 'single' : 'multi'
    const addresses = ownerAddresses.map((address, index) => {
      const isChecked = selectedAddresses.indexOf(address.addressId) > -1
      const displayAddress = (<React.Fragment><label value={address.addressId} onClick={this.onChange} htmlFor={`option${index}`}><span>{address.nickName}</span></label>
        <span>{address.firstName}{address.middleName ? ' ' + address.middleName : ''} {address.lastName}{address.maternalName ? ' ' + address.maternalName : ''}</span>
        <span>{address.address1}, Ext. {address.exteriorNumber}{address.interiorNumber ? ', Int. ' + address.interiorNumber : ''}{address.building ? ', ' + address.building : ''} {address.city}, {address.neighbourhood}<br />{address.delegationMunicipality}, C.P.{address.postalCode}, {address.country}, {address.state}</span>
      </React.Fragment>)
      return (
        <div key={index} className="row vertical-align row-grid show-grid-row">
          <div className="col-xs-4">
            {(this.maxAddressCount === 1 || assignees.length === 1 || this.celebName || this.props.ownerAddresses.length === 1) ?
              <RadioButton
                id={`option${index}`} value={address.addressId} checked={isChecked} name="optionsDataCelebrated-2" divLabel={displayAddress}
                onChangeFunction={this.onChange}
              /> :
              <CheckBox id={`option${index}`} name={`checkbox1${index}`} disabled={!isChecked && disableCheckbox} value={address.addressId} defaultChecked={isChecked} divLabel={displayAddress} onClickLabel={this.onChange} onChange={this.onChange} />
            }
          </div>
          <React.Fragment>
            <div className="col-xs-4">
              {isChecked && this.maxAddressCount > 1 && assignees.length > 1 &&
                <div>
                  <p>Asigna dirección a festejado:</p>
                  <div className="cSelect required">
                    <select
                      onClick={e => this.onAssigneeChange(e, address.addressId)}
                      name={address.addressId} style={{ marginBottom: 0 }}
                      validators={JSON.stringify([
                        {
                          type: 'required',
                          errorMessage: 'Favor de asignar un festejado a la dirección',
                        },
                      ])}
                    >
                      <option disabled selected="true" value=""> Selecciona preferencia</option>
                      {this.renderAssigneeOptions(address.addressId, assignees)}
                    </select><i className="icon-caret_down" />
                    {this.state.formErrors && this.state.formErrors[address.addressId] &&
                      <div className="error">{this.state.formErrors[address.addressId]}</div>
                    }
                  </div>
                </div>}
            </div>
          </React.Fragment>
          {isChecked &&
            <React.Fragment>
              <div className="col-xs-4 alignCenter">
                {address.isEventAssociated ?
                  'Dirección registrada en Mesa de Regalos' :
                  <button className="btnSecondarySpecial size-Large editDir" onClick={() => this.handleEditAddress(address.addressId)}>Editar dirección</button>
                }
              </div>
            </React.Fragment>}
        </div>
      )
    })

    return <React.Fragment>{addresses}</React.Fragment>
  }

  closeError = () => {
    this.setState({
      error: ''
    })
  }
  handleCloseWarningMessage = () => {
    this.setState({
      displayWarningMessage: false
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }


  render() {
    const assignees = this.getAssignees()
    const { ownerAddresses, selectedAddresses, selectedAssignees, ownerInfo, coownerInfo, coowner2Info, labels } = this.props
    const eventType = this.props.eventData && this.props.eventData.GRType.tipoCelebracion
    this.maxAddressCount = assignees && assignees.length > 0 ? assignees.length : '1'
    this.minAddressCount = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'minAddressCount', this.props.eventCategories) : null
    const enableNextStep = selectedAddresses.length > 0
    return (
      <div>
        <div className="wrap-address">
          <div className="container">
            <div className="main">
              <div className="col-xs-12 alignCenter">
                <p className="title">Selecciona direcciones del evento</p>
              </div>
              <div className="row show-grid">
                <div className="col-xs-3 col-xs-offset-9 alignRight">
                  <button onClick={e => this.handleRoute(routeconfig.addnewaddress)} className="btnSecondarySpecial size-Full addDir">Agregar dirección</button>
                </div>
              </div>
              <div className="col-xs-12 borderTopStyle" />
              <div className="row show-grid">
                <div className="col-xs-10">
                  <p className="tabsText">Direcciones seleccionadas <span className="min">{selectedAddresses.length}</span> <b>de</b> <span className="max">{this.maxAddressCount}</span></p>
                </div>
                <div className="col-xs-2 alignRight">
                  <p className="requiredFields">*Campos obligatorios</p>
                </div>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-12">
                  {this.props.router.location.query.addressUpdate && this.state.displayWarningMessage &&
                    <div className="alertWarning"><i className="icon-alerta_amarilla" />
                      <p>{commonUtil.getLabel(labels, 'eventCreation.stage3.editAddress.warningMessage')}</p><a className="icon-tache2" onClick={this.handleCloseWarningMessage} />
                    </div>
                  }
                </div>
              </div>
              {this.state.error && <div className="row show-grid-row">
                <div className="col-xs-12">
                  <div className="alertError"><i className="icon-alerta_amarilla" />
                    <p>{this.state.error}</p><a className="icon-tache2" onClick={this.closeError} />
                  </div>
                </div>
              </div>}
              <Form onSubmit={this.handleSubmit}>
                {ownerAddresses && this.renderAddresses()}
                <div className="row show-grid borderTopStyle">
                  <div className="col-xs-6 alignLeft">
                    <button className="btnSecondaryAction size-ExtraLarge" onClick={e => this.handleRoute(routeconfig.globalstepd)}><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
                  </div>
                  <div className="col-xs-6 alignRight">
                    <button type="submit" disabled={!enableNextStep} className={`btnNextStep size-ExtraLarge${!enableNextStep ? ' btnPrimaryDisable' : ''}`}>Siguiente paso <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
export default StepE
