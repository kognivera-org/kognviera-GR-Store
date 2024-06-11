import React, { Component } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal'
import { connect } from 'react-redux'
import Datetime from 'lib/datetime/DateTime'
import moment from 'moment'
import TextInput from '../../../lib/ZUILib/TextInput'
import SelectionTab from '../../../lib/ZUILib/SelectionTab'
import { getEventCategories } from '../../createevent/actions'
import { getStateList, getStorelist } from '../../browse/MainDashboard/components/SelectStoreModal/actions'
import appconfig from '../../../config/appconfig'

@connect(
    store => ({
      eventTypes: store.createevent.eventCategories,
      states: store.selectStore.data && store.selectStore.data.stateListInfo,
      loadingStates: store.selectStore.loadingStates,
      loadingStores: store.selectStore.loadingStores,
      stores: store.selectStore.data && store.selectStore.data.storeListInfo,
    }),
    { getEventCategories, getStateList, getStorelist },
)

class EventSearchModal extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.event_date = false
    this.closing_date = false
    this.creation_date = false
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.pageLoad = true
    this.state = {
      show: false,
      disableAdvancedSearch: true,
      disableExactSearch: true,
    }
  }

  handleClose() {
    document.body.classList.remove('modal-open')
    this.setState({
      show: false,
      disableAdvancedSearch: true,
      disableExactSearch: true,
    })
  }

  handleShow() {
    document.body.classList.add('modal-open')
    this.pageLoad = true
    this.setState({ show: true })
    this.props.getStateList({ searchType: 'advanced' })
  }

  componentDidMount() {
    this.props.onRef(this)
    if (!this.props.eventTypes) {
      this.props.getEventCategories()
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  activeBtn = (eventType, e, rType) => {
    if (eventType === 'exact') {

      if (this.eventNumber.value.length > 2 || this.ecardNumber.value.length > 2 || this.cardNumber.value.length > 2) {
        this.setState({
          disableExactSearch: false,
        })
      } else {
        this.setState({
          disableExactSearch: true,
        })
      }
    } else if (this.parentName.value.length > 2 || this.alias.value.length > 2 || this.motherName.value.length > 2) {
      this.setState({
        disableAdvancedSearch: false,
      })
    } else {
      let validParamCount = 0
      if (this.eventType.value !== 'Selecciona tipo de evento') {
        validParamCount++
      }
      if (rType === 'eventDate') {
        if (e) {
          this.event_date = true
        } else {
          this.event_date = false
        }
                    // this.event_date = true
      }
      if (rType === 'closingDateRange') {
        if (e) {
          this.closing_date = true
        } else {
          this.closing_date = false
        }
                    // this.closing_date = true;
      }
      if (rType === 'eventCreationDate') {
        if (e) {
          this.creation_date = true
        } else {
          this.creation_date = false
        }
                    // this.creation_date = true;
      }
      if (this.event_date) {
        validParamCount++
      }
      if (this.closing_date) {
        validParamCount++
      }
      if (this.creation_date) {
        validParamCount++
      }
      if (this.storeAdvisor.value !== '' && this.storeAdvisor.value.length > 2) {
        validParamCount++
      }
      if (this.storeCreation && this.storeCreation.value) {
        validParamCount++
      }
      if (validParamCount > 1) {
        this.setState({
          disableAdvancedSearch: false,
        })
      } else {
        this.setState({
          disableAdvancedSearch: true,
        })
      }
    }
  }
  handleSearch = (e, searchType) => {
    e.preventDefault()
    let queryString = ''
    if (searchType === 'exact') {
      queryString += 'searchOption=exactSearch'
      if (this.eventNumber.value !== '') {
        queryString += `&eventNumber=${this.eventNumber.value}`
      }
      if (this.ecardNumber.value !== '') {
        queryString += `&onlineECardNumber=${this.ecardNumber.value}`
      }
      if (this.cardNumber.value !== '') {
        queryString += `&plasticEventCardNumber=${this.cardNumber.value}`
      }
    } else {
      queryString += 'searchOption=AdvancedSearch'

      if (this.eventType.value !== 'Selecciona tipo de evento') {
        queryString += `&eventType=${this.eventType.value}`
      }
      if (this.parentName.value !== '') {
        queryString += `&lastNameOrPaternalName=${this.parentName.value}`
      }
      if (this.motherName.value !== '') {
        queryString += `&motherName=${this.motherName.value}`
      }

      if (this.alias.value !== '') {
        queryString += `&firstNameOrNickName=${this.alias.value}`
      }
            // e && e._d ? { 'eventDate': e.format('YYYY/MM/DD') }
      const eventDateRange = this.eventDate.instanceRef.state.inputValue
      if (eventDateRange) {
        const eventDateRangeArr = eventDateRange.split(' - ')
        queryString += `&eventDateStartRange=${eventDateRangeArr[0]}`
        if (eventDateRangeArr && eventDateRangeArr.length > 1) {
          queryString += `&eventDateEndRange=${eventDateRangeArr[1]}`
        }
      }

      const closingDateRange = this.closingDateRange.instanceRef.state.inputValue
      if (closingDateRange) {
        const closingDateRangeArr = closingDateRange.split(' - ')
        queryString += `&closingStartDateRange=${closingDateRangeArr[0]}`
        if (closingDateRangeArr && closingDateRangeArr.length > 1) {
          queryString += `&closingEndDateRange=${closingDateRangeArr[1]}`
        }
      }

      const eventCreationDateRange = this.eventCreationDate.instanceRef.state.inputValue
      if (eventCreationDateRange) {
        const eventCreationDateRangeArr = eventCreationDateRange.split(' - ')
        queryString += `&eventCreationStartDateRange=${eventCreationDateRangeArr[0]}`
        if (eventCreationDateRangeArr && eventCreationDateRangeArr.length > 1) {
          queryString += `&eventCreationEndDateRange=${eventCreationDateRangeArr[1]}`
        }
      }

      if (this.storeAdvisor.value !== '') {
        queryString += `&storeAdvisorName=${this.storeAdvisor.value}`
      }
      if (this.storeCreation && this.storeCreation.value !== '') {
        queryString += `&creationStoreNumber=${this.storeCreation.value}`
      }
      if (this.isEmployeeEvent.checked) {
        queryString += `&employeeEventOnly=${this.isEmployeeEvent.checked}`
      }
    }
    queryString += '&type=new'
    this.handleClose()
    this.props.routeToSearch(queryString)
  }

  handleStateChange = (e) => {
    this.pageLoad = false
    const values = {
      searchType: 'advanced',
      stateId: e.target.value,
    }
    this.props.getStorelist(values)
  }

  render() {
    const { eventTypes } = this.props
    const eventTypeSelectionOptions = []
    if (eventTypes && eventTypes.eventConfigurations) {
      for (let i = 0; i < eventTypes.eventConfigurations.length; i++) {
        const eventType = {}
        eventType.option = eventTypes.eventConfigurations[i].name
        eventType.value = eventTypes.eventConfigurations[i].name
        eventTypeSelectionOptions.push(eventType)
      }
    }
    let btnPrimaryDisableExctClass = ''
    let btnPrimaryDisableAdvClass = ''
    if (this.state.disableAdvancedSearch) {
      btnPrimaryDisableAdvClass = 'btnPrimaryDisable'
    }
    if (this.state.disableExactSearch) {
      btnPrimaryDisableExctClass = 'btnPrimaryDisable'
    }

        /* var yearsNext = Datetime.moment().add(1, 'year');
 var valid = function (current) {
     return current.isAfter(yesterday);
 }; */

    const dateFormat = {
      range: true,
      timeFormat: false,
      input: true,
      closeOnSelect: false,
      dateFormat: 'YYYY/MM/DD',
      isValidDate(current, firstDate, endDate) {
        if (firstDate && !endDate) {
          return current.isAfter(firstDate)
        } else if (!firstDate || (firstDate && endDate)) {
          return current.isAfter(moment().subtract(5, 'year'))
        }
      },
    }
    const eventDateRangeFormat = {
      range: true,
      timeFormat: false,
      input: true,
      closeOnSelect: false,
      dateFormat: 'YYYY/MM/DD',
      isValidDate(current, firstDate, endDate) {
        if (firstDate && !endDate) {
          return current.isAfter(firstDate) && current.isBefore(moment().add(1, 'year'))
        } else if (!firstDate || (firstDate && endDate)) {
          return current.isBefore(moment().add(1, 'year')) && current.isAfter(moment().subtract(5, 'year'))
        }
      },
    }
    const eventTypeOptions = eventTypeSelectionOptions.length > 0 && eventTypeSelectionOptions.map((eventTypeOption, index) => <option key={index} value={eventTypeOption.value}>{eventTypeOption.option}</option>)

    const stateListInfo = !this.props.loadingStates && this.props.states
    const storeListInfo = !this.props.loadingStores && this.props.stores

    let StateOptions
    if (stateListInfo) {
      StateOptions = []
      Object.keys(stateListInfo).map((key, index) => {
        const stateId = key
        const _StateOptions = {}
                // _StateOptions.labelResourceId = stateListInfo[key]
        if (stateListInfo[key] === appconfig.states.Distrito_Federal) {
          _StateOptions.labelResourceId = appconfig.states.Cdmx
        } else {
          _StateOptions.labelResourceId = stateListInfo[key]
        }
        _StateOptions.id = stateId
        _StateOptions.value = stateId
        StateOptions.push(_StateOptions)
      })
    }

    return (
      <React.Fragment>
        {this.state.show &&
        <Modal show={this.state.show} onHide={this.handleClose} id="searchEventModal" className="searchEventModal modal fade">
          <ModalHeader closeButton handleClose={this.handleClose}>
                <ModalTitle>BUSCAR MESA DE REGALOS</ModalTitle>
                <p>Ingresa una o más opciones para buscar una mesa de regalos</p>
              </ModalHeader>
          <ModalBody>
                <div className="row">
                  <form id="form-searchEvent" ref={(searchForm) => { this.searchForm = searchForm }} noValidate>
                        <div className="row">
                          <div className="col-xs-12">
                                <label>Datos principales</label>
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                                <div className="cSelect">
                                    <select
                                        ref={(eventType) => { this.eventType = eventType }}
                                        onChange={e => this.activeBtn('advanced')}
                                                >
                                        <option disabled="disabled" selected="selected" defaultValue=""> Selecciona tipo de evento</option>
                                        {eventTypeOptions}
                                      </select><i className="icon-flecha_light_abajo" />
                                  </div>
                              </div>
                          <div className="col-xs-6">
                                <TextInput
                                    refProp={(parentName) => { this.parentName = parentName }}
                                    className="inputMaterial"
                                    labelClassName="placeHolderMaterial"
                                    name="parentName"
                                    type="textonly"
                                    label="Apellido paterno"
                                    required="required"
                                    maxlength={255}
                                    onChange={e => this.activeBtn('advanced')}
                                            />
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                                <TextInput
                                    refProp={(alias) => { this.alias = alias }}
                                    className="inputMaterial"
                                    labelClassName="placeHolderMaterial"
                                    name="alias"
                                    type="textonly"
                                    label="Nombre o alias"
                                    required="required"
                                    maxlength={255}
                                    onChange={e => this.activeBtn('advanced')}
                                            />
                              </div>
                          <div className="col-xs-6">
                                <TextInput
                                    refProp={(motherName) => { this.motherName = motherName }}
                                    className="inputMaterial"
                                    labelClassName="placeHolderMaterial"
                                    name="motherName"
                                    type="textonly"
                                    label="Apellido materno"
                                    required="required"
                                    maxlength={255}
                                    onChange={e => this.activeBtn('advanced')}
                                            />
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                                <Datetime
                                    {...eventDateRangeFormat}
                                    onChange={e => this.activeBtn('advanced', e, 'eventDate')}
                                    ref={(eventDate) => { this.eventDate = eventDate }}
                                    placeholder="Rango de fecha del evento"
                                            />

                              </div>

                          <div className="col-xs-6">
                                <Datetime
                                    {...dateFormat}
                                    onChange={e => this.activeBtn('advanced', e, 'closingDateRange')}
                                    ref={(closingDateRange) => { this.closingDateRange = closingDateRange }}
                                    placeholder="Rango de fecha de cierre"
                                            />
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                                <Datetime
                                    {...dateFormat}
                                    onChange={e => this.activeBtn('advanced', e, 'eventCreationDate')}
                                    ref={(eventCreationDate) => { this.eventCreationDate = eventCreationDate }}
                                    placeholder="Rango de fecha de creación"
                                            />
                              </div>
                          <div className="col-xs-6">
                                <SelectionTab
                                    id="storeIdDropdown"
                                    name="storeIdDropdown"
                                    options={StateOptions}
                                    optionCaption="Selecciona un estado"
                                    optionText="labelResourceId"
                                    optionValue="value"
                                    sortOptions
                                    downArrowClass="icon-flecha_light_abajo"
                                    onChange={this.handleStateChange}
                                    required="false"
                                            />
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                                <div className="formBlock">
                                    <div className="materialStyle">
                                        <input ref={(storeAdvisor) => { this.storeAdvisor = storeAdvisor }} onChange={e => this.activeBtn('advanced')} className="inputMaterial" type="text" required="required" />
                                        <label className="placeHolderMaterial">Asesor de tienda</label>
                                      </div>
                                  </div>
                              </div>
                          {
                                            !this.pageLoad && storeListInfo &&
                                            <div className="col-xs-6">
                                              <div className="cSelect">
                                                <select name="storeIdDropdown" onClick={this.selectStore} ref={(storeCreation) => { this.storeCreation = storeCreation }} onChange={e => this.activeBtn('advanced')}>
                                                  <option selected="true" disabled="disabled" value="">Selecciona una tienda</option>
                                                  {
                                                            storeListInfo &&
                                                            Object.keys(storeListInfo).map((key, index) => <option key={key} value={key}>{storeListInfo[key]}</option>)
                                                        }
                                                </select><i className="icon-flecha_light_abajo" />
                                              </div>
                                            </div>
                                        }
                        </div>
                        <div className="row">
                          <div className="col-xs-6">
                                <div className="checkbox">
                                    <input ref={(isEmployeeEvent) => { this.isEmployeeEvent = isEmployeeEvent }} id="checkbox1" type="checkbox" />
                                    <label htmlFor="checkbox1">Evento de empleado</label>
                                  </div>
                              </div>
                          <div className="col-xs-6">
                                <button disabled={this.state.disableAdvancedSearch} onClick={e => this.handleSearch(e, 'advanced')} className={`${btnPrimaryDisableAdvClass} btnPrimary size-Full searchEvent`}>Buscar mesa</button>
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12">
                                <label>Datos especificos</label>
                              </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-4">
                                <div className="formBlock">
                                    <div className="materialStyle">
                                        <TextInput
                                            label="Número de evento"
                                            className="inputMaterial"
                                            labelClassName="placeHolderMaterial"
                                            type="number"
                                            required="required"
                                            maxlength="10"
                                            refProp={(eventNumber) => { this.eventNumber = eventNumber }}
                                            onKeyUp={eventType => this.activeBtn('exact')}
                                                    />
                                      </div>
                                  </div>
                              </div>
                          <div className="col-xs-4">
                                <div className="formBlock">
                                    <div className="materialStyle">
                                        <input ref={(cardNumber) => { this.cardNumber = cardNumber }} onKeyUp={eventType => this.activeBtn('exact')} className="inputMaterial" type="text" required="required" />
                                        <label className="placeHolderMaterial">Número de tarjeta</label>
                                      </div>
                                  </div>
                              </div>
                          <div className="col-xs-4">
                                <div className="formBlock">
                                    <div className="materialStyle">
                                        <input ref={(ecardNumber) => { this.ecardNumber = ecardNumber }} onKeyUp={eventType => this.activeBtn('exact')} className="inputMaterial" type="text" required="required" />
                                        <label className="placeHolderMaterial">Número de e-card</label>
                                      </div>
                                  </div>
                              </div>
                        </div>
                        <div className="row show-grid-row">
                          <div className="col-xs-6 col-xs-offset-6">
                                <button disabled={this.state.disableExactSearch} onClick={e => this.handleSearch(e, 'exact')} type="submit" className={`btnPrimary size-Full searchEvent ${btnPrimaryDisableExctClass}`}>Buscar mesa</button>
                              </div>
                        </div>
                      </form>
                </div>
              </ModalBody>
        </Modal>
                }
      </React.Fragment>
    )
  }
}

export default EventSearchModal
