import React, { Component } from 'react';
import { connect } from 'react-redux'
import { updateSelectedAssignees } from '../../createevent/globalevent/StepE/actions'
import Form from '../../../lib/ZUILib/Form'
import commonUtil from '../../../utils/commonUtil'
import { updateEventAddresses, deletedAddressInfo } from '../actions'
import routeconfig from '../../../config/routeconfig';
import appconfig from '../../../config/appconfig';

@connect(
    store => ({
        eventAddresses: store.eventAddresses.eventDeliveryAddressData.deliveryAddressInfo,
        eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
        celebrityInfo: store.changeOfEvent.celebrityInfos,
        eventCategories: store.createevent.eventCategories,
        eventData: store.createevent.eventData,
        selectedAssignees: store.selectAddress.selectedAssignees,
        validationRequired: store.changeOfEvent.validationRequired,
        addressInfo: store.changeOfEvent.AddressInfo
    }), { updateSelectedAssignees, updateEventAddresses, deletedAddressInfo },
)

class SelectAddressCommon extends Component {
    constructor(props) {
        super(props)
        this.celebNameMap = {}
        this.celebIdMap = {}
        this.celebName = ''
        this.celebId = ''
        // this.minCount = ''
        this.deletedAddressInfo = []
    }
    state = {
        eventAddresses: [],
        errorMessage: ''
    }
    componentDidMount = () => {
        if (this.props.addressInfo) {
            const SavedAddress = [];
            for (let i = 0; i < this.props.addressInfo.length; i++) {
                const id = Object.values(this.props.addressInfo[i])[0]
                const address = this.props.eventAddresses.addresses.filter(address => address.addressId === id)
                SavedAddress.push(address[0])
            }
            this.setState({
                eventAddresses: SavedAddress
            })
        } else {
            this.setState({
                eventAddresses: (this.props.eventAddresses && this.props.eventAddresses.addresses) || []
            })
        }
    }

    handleRoute = () => {
        this.props.router.push(commonUtil.generateRedirect(routeconfig.eventinfo));
    }

    getAssignees = () => {
        const celebrated = this.props.celebrityInfo
        const assigneeOptions = []
        if (celebrated && celebrated.length > 0) {
            celebrated.forEach((item, index) => {
                if (item && (item.celebrityLabel.toLowerCase().includes(appconfig.celebLabels.festejado) || item.celebrityLabel.toLowerCase().includes(appconfig.celebLabels.organizador) || item.title.toLowerCase().includes(appconfig.celebLabels.festejado))) {
                    const assignee = {
                        option: item.firstName,
                        value: index.toString(),
                        id: item.repositoryId
                    }
                    this.celebNameMap[index.toString()] = item.firstName
                    this.celebIdMap[index.toString()] = item.repositoryId
                    assigneeOptions.push(assignee)
                }
            })
        }
        if (assigneeOptions.length > 1) {
            this.celebName = ''
            this.celebId = ''
        } else {
            this.celebName = assigneeOptions[0].option
            this.celebId = assigneeOptions[0].id
        }

        if (this.props.eventData && this.props.eventData.GRType.tipoCelebracion === appconfig.eventTypes.Boda) {
            const assignee = {
                option: 'Adicional',
                value: '3'
            }
            this.celebNameMap['3'] = 'Adicional'
            this.celebIdMap['3'] = ''
            assigneeOptions.push(assignee)
        }
        return assigneeOptions
    }

    handleDelete = (addressId) => {
        this.setState({
            eventAddresses: this.state.eventAddresses.filter(address => address.addressId !== addressId)
        })
        this.updateSelectedAssignee(addressId, '')
        const deletedAddressInfo = this.state.eventAddresses.filter(address => address.addressId === addressId)
        this.deletedAddressInfo.push(deletedAddressInfo)
    }
    onAssigneeChange = (e, addressId) => {
        const value = e.currentTarget.value
        this.updateSelectedAssignee(addressId, value)
    }
    updateSelectedAssignee = (addressId, value) => {
        const selectedAssignees = Object.assign({}, this.props.selectedAssignees)
        selectedAssignees[addressId] = value
        this.props.updateSelectedAssignees(selectedAssignees)
    }

    handleSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault()
        const assignees = this.getAssignees()
        if (this.state.eventAddresses.length > assignees.length) {
            this.setState({
                errorMessage: 'Es necesario agregar o eliminar personas dependiendo del tipo de evento'
            })
        } else {
            this.setState({
                errorMessage: ''
            })
            const formId = e.currentTarget.id
            if (!isValidForm) {
                this.setState({
                    formErrors: formErrors[formId],
                })
            } else {
                const values = formValues[formId]
                const eventAdderesses = []
                this.state.eventAddresses.forEach((address) => {
                    const selectedIndex = this.props.selectedAssignees[address.addressId]
                    if (this.celebName) {
                        address.celebrityName = this.celebName
                        address.celebrityId = this.celebId
                    } else {
                        const ownerFirstName = this.celebNameMap[selectedIndex] ? this.celebNameMap[selectedIndex] : 'Adicional'
                        const ownerId = this.celebIdMap[selectedIndex] ? this.celebIdMap[selectedIndex] : ''
                        address.celebrityName = ownerFirstName
                        address.celebrityId = ownerId
                    }
                    let addressMapping = {}
                    // addressMapping[address.addressId] = address.celebrityName
                    addressMapping.addressId = address.addressId
                    addressMapping.celebrityId = address.celebrityId
                    addressMapping.celebrityName = address.celebrityName
                    eventAdderesses.push(addressMapping)
                })
                let deletedEventAddresses = []
                for (let i = 0; i < this.deletedAddressInfo.length; i++) {
                    let formValues = {};
                    formValues.addressId = this.deletedAddressInfo[i][0].addressId
                    deletedEventAddresses.push(formValues)
                }
                // this.deletedAddressInfo
                this.props.updateEventAddresses(eventAdderesses)
                this.props.deletedAddressInfo(deletedEventAddresses)
                this.props.router.push(commonUtil.generateRedirect(routeconfig.celebratedcardinfo));
            }

        }
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

    componentWillMount = () => {
        if (this.props.eventDetailsInfo === undefined) {
            this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
        }
    }

    componentDidUpdate = () => {
        commonUtil.errorScrollUp();
    }
    render() {
        const eventAddresses = this.props.eventAddresses && this.props.eventAddresses.addresses
        const eventType = this.props.eventData && this.props.eventData.GRType.tipoCelebracion
        // this.minCount = validationRequired && validationRequired.minimumAllowed && validationRequired.minimumAllowed.minAddressAllowed
        const assignees = this.getAssignees()
        const disableNextStep = this.state.eventAddresses.length > assignees.length
        return (
            <div className="container">
                <div className="main">
                    <Form className="formSelect " id="form1" onSubmit={this.handleSubmit}>
                        <div className="col-xs-12 alignCenter">
                            <p className="title">Selecciona direcciones</p>
                        </div>
                        <div className="col-xs-12 alignCenter">
                            <p>Validación de número de direcciones dependiendo el tipo de evento</p>
                        </div>
                        <div className="col-xs-12 borderTopStyle mb-30">
                            <div className="row">
                                <div className="col-xs-6">
                                    <p className="grayText">{`Puedes tener únicamente 1 ${assignees.length > 1 && `o ${assignees.length}`} dirección en este evento`}</p>
                                    {/* <p>puedes tener 1{assignees.length > 1 && `o ${assignees.length}`} tarjetas plasticas para el evento</p> */}
                                </div>
                                <div className="col-xs-6 alignRight">
                                    <p className="requiredFields">*Campos obligatorios</p>
                                </div>
                            </div>
                            {this.state.errorMessage && <div className="row show-grid-row" id="error1">
                                <div className="col-xs-12 nph">
                                    <div className="alertError"><i className="icon-alerta_amarilla" />
                                        <p>{this.state.errorMessage}</p><a className="icon-tache2" />
                                    </div>
                                </div>
                            </div>}
                        </div>
                        {this.state.eventAddresses && this.state.eventAddresses.map((address, id) => (
                            <div className="row row-grid show-grid-row mb-30 vertical-align" id={`row${id}`}>
                                <div className="col-xs-3">
                                    <span className="block infoText">{address.firstName}{address.middleName ? ' ' + address.middleName : ''} {address.lastName}{address.maternalName ? ' ' + address.maternalName : ''}</span>
                                    <span className="block gray">{address.address1}, Ext. {address.exteriorNumber}{address.interiorNumber ? ', Int. ' + address.interiorNumber : ''}{address.building ? ', ' + address.building : ''} {address.city}, {address.neighbourhood}<br />{address.delegationMunicipality}, C.P.{address.postalCode}, {address.country}, {address.state}</span>
                                </div>
                                <div className="col-xs-3 ">
                                    {(assignees && assignees.length > 1 && !(this.state.eventAddresses.length > assignees.length)) &&
                                        <div className="addressDropdown">
                                            <span className="block ">Asigna dirección a festejado</span>
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
                                {this.state.eventAddresses.length > assignees.length && <div className="col-xs-3 btnAbajo">
                                    <button type="button" className="btnEliminar btnPrimaryAction size-ExtraLarge" onClick={(e) => this.handleDelete(address.addressId)} id="btnEliminar1">Eliminar</button>
                                </div>}
                            </div>))}
                        <div className="row show-grid borderTopStyle">
                            <div className="col-xs-6 alignLeft">
                                <button type="button" onClick={this.handleRoute} className="btnSecondaryAction size-ExtraLarge"><i className="iconLeft icon-flecha_light_izq" /> Regresar</button>
                            </div>
                            <div className="col-xs-6 alignRight">
                                <button type="submit" className="btnPrimary size-ExtraLarge" id="btnSiguiente">Siguiente paso <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div >
        );
    }
}
export default SelectAddressCommon;
