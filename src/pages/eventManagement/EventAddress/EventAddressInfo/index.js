import React, { Component } from 'react';
import ManagementMenu from '../../Navigation/ManagementMenu';
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../lib/ZUILib/Modal'
import { getLabels } from '../../../global/Labels/actions';
import { getEventDeliveryAddresses, deleteAddress, assignAddress } from '../../../eventManagement/EventAddress/EventAddressInfo/actions';
import { connect } from 'react-redux';
import Link from 'lib/ZUILib/Link';
import { debug } from 'util';
import { fail } from 'assert';
import Form from '../../../../lib/ZUILib/Form';
import Button from '../../../../lib/ZUILib/Button';
import CommonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';
import { addAddress } from '../AddNewAddress/actions';
import commonUtil from '../../../../utils/commonUtil';
import PrintDownload from '../../../global/PrintDownload'

@connect(
  store => ({
    labels: store.labels.labels,
    // eventData: store.eventdashboard.eventData,
    //eventdetail: store.eventdashboard.eventData,
    ecommDashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,
    event: store.eventdashboard && store.eventdashboard.eventData,
    eventAddresses: store.eventAddresses.eventDeliveryAddressData,
    eventAddressesLoading: store.eventAddresses,
  }),
  {
    getLabels,
    getEventDeliveryAddresses,
    deleteAddress,
    assignAddress
  }
)

class EventAddressInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addressToDeleteNickName: '',
      selValAddress1: '',
      selValAddress2: '',
      selValAddress3: '',
      selCeleb1: '',
      selCeleb2: '',
      selCeleb3: '',
      errors: {},
      celebChanged: false,
      guardarDivId: '',
      assignSuccess: false,
      assignFailure: false,
      deleteFailure: false,
      disableDownload: false,
    }
  }


  componentWillMount = () => {
    this.props.getLabels();
    const eventId = this.props.params && this.props.params.eventId;
    eventId && this.props.getEventDeliveryAddresses(eventId);

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.eventAddresses && !this.props.eventAddresses.deleteSuccess && nextProps.eventAddresses.deleteSuccess === true) {
      this.handleClose();
      const eventId = this.props.params && this.props.params.eventId;
      this.props.getEventDeliveryAddresses(eventId);
    }
    if (!nextProps.eventAddresses.deleteSuccess && nextProps.eventAddresses && nextProps.eventAddresses.error && nextProps.eventAddresses.error.errorMessage) {
      this.handleClose();
      this.setState({ deleteFailure: true })
    }
    if (nextProps.eventAddresses && nextProps.eventAddresses.AssignAddressSuccess === true) {
      this.setState({ assignSuccess: true, celebChanged: false })
    }
    if (nextProps.eventAddresses && nextProps.eventAddresses.AssignAddressSuccess === false) {
      this.setState({ assignFailure: true })
    }
  }
  goToAddAddress = () => {
    let addAddressRoute = CommonUtil.generateRedirect(routeconfig.addnewaddress2, { eventId: (this.props.params && this.props.params.eventId) });
    this.props.router.push(addAddressRoute);
  }
  handleClose = () => {
    this.setState({ showModal: false })
  }

  handleDeleteAddress = (nickName) => {
    this.setState({ addressToDeleteNickName: nickName, showModal: true })
  }

  confirmDeleteAddress = () => {
    const eventId = this.props.params && this.props.params.eventId;
    let objParams = {
      channel: 'INSTORE',
      brand: CommonUtil.getBrand(),
      eventId: eventId,
      addressId: this.state.addressToDeleteNickName
    }
    this.props.deleteAddress(objParams, this.props.eventAddresses);
  }

  handleDropDownChange = (drdpId, addressId, index, event) => {
    this.setState({ celebChanged: true });
    this.setState({ errors: {} });
    //const drdpId = event.target.id;
    let sel = document.getElementById(drdpId);
    let selText = sel.options[sel.selectedIndex].text;
    let selValue = '';
    if (selText.toLowerCase() === 'adicional') {
      selValue = 'adicional';
    } else {
      selValue = event.target.value;
    }
    if (index === 0) {
      if (document.getElementById('drdp1') != null) {
        this.checkForSimilar('drdp1', selValue);
      }
      if (document.getElementById('drdp2') != null) {
        this.checkForSimilar('drdp2', selValue);
      }
      this.setState({ guardarDivId: 'guardarDivId0' })
    }
    if (index === 1) {
      this.checkForSimilar('drdp0', selValue);
      if (document.getElementById('drdp2') != null) {
        this.checkForSimilar('drdp2', selValue);
      }
      this.setState({ guardarDivId: 'guardarDivId1' })
    }
    if (index === 2) {
      this.checkForSimilar('drdp0', selValue);
      this.checkForSimilar('drdp1', selValue);
      this.setState({ guardarDivId: 'guardarDivId2' })
    }
  }

  checkForSimilar = (drdpId, valueToCompare) => {
    let e = document.getElementById(drdpId);
    if (valueToCompare.toLowerCase() === 'adicional') {
      let selValue = e.options[e.selectedIndex].text;
      if (valueToCompare == selValue.toLowerCase()) {
        e.selectedIndex = '0';
      }
    } else {
      let selValue = e.options[e.selectedIndex].value;
      if (valueToCompare == selValue) {
        e.selectedIndex = '0';
      }
    }
  }
  handleAssignCeleb = (e, values, formErrors, isValidForm) => {
    this.setState({ errors: formErrors })
    if (isValidForm) {
      let objParams = {
        brand: CommonUtil.getBrand(),
        channel: "INSTORE",
        eventId: this.props.params.eventId,
      }
      if (document.getElementById('drdp0') != null) {
        if (values.drdp0 === '') {
          //return false;
        } else {
          objParams = {
            ...objParams,
            addressId1: this.props.eventAddresses.deliveryAddressInfo.addresses[0].addressId,
            celebrityId1: values.drdp0,
          }
        }
      }
      if (document.getElementById('drdp1') != null) {
        if (values.drdp1 === '') {
          //return false;
        } else {
          objParams = {
            ...objParams,
            addressId2: this.props.eventAddresses.deliveryAddressInfo.addresses[1].addressId,
            celebrityId2: values.drdp1,
          }
        }
      }
      if (document.getElementById('drdp2') != null) {
        if (values.drdp2 === '') {
          //return false;
        } else {
          objParams = {
            ...objParams,
            addressId3: this.props.eventAddresses.deliveryAddressInfo.addresses[2].addressId,
            celebrityId3: values.drdp2,
          }
        }
      }
      this.props.assignAddress(objParams, this.props.params.eventId);
    }
  }
  handleCancelAssignCaleb = (index) => {
    this.setState({ celebChanged: false });
    // if (index === 0) {
    let e = document.getElementById('drdp0');
    e.selectedIndex = '1';
    // }
    // if (index === 1) {
    e = document.getElementById('drdp1');
    e.selectedIndex = '1';
    //}
    // if (index === 2) {
    e = document.getElementById('drdp2');
    e.selectedIndex = '1';
    //}
  }

  hideMessage = () => {
    this.setState({ assignSuccess: false, assignFailure: false, deleteFailure: false });
  }
  getAddressForHtml = (address) => {

    let addressDataHtml = ' ';
    if (address.address1) {
      addressDataHtml += ' ' + address.address1
    }
    if (address.exteriorNumber) {
      addressDataHtml += ', Ext. ' + address.exteriorNumber
    }
    if (address.interiorNumber) {
      addressDataHtml += ', Int. ' + address.interiorNumber
    }
    if (address.building) {
      addressDataHtml += ', ' + address.building
    }
    if (address.city) {
      addressDataHtml += ', ' + address.city
    }
    if (address.colony) {
      addressDataHtml += ', ' + address.colony
    }
    if (address.delegationMunicipality) {
      addressDataHtml += ', ' + address.delegationMunicipality
    }
    if (address.postalCode) {
      addressDataHtml += ', C.P.' + address.postalCode;
    }
    if (address.state) {
      addressDataHtml += ', ' + address.state
    }
    if (address.address2) {
      addressDataHtml += ', ' + address.address2
    }
    if (address.phoneNumber) {
      addressDataHtml += ', ' + (address.particularPhoneCode ? address.particularPhoneCode : '') + address.phoneNumber;
    }
    if (address.cellular) {
      addressDataHtml += ', ' + address.cellular;
    }
    return addressDataHtml;
  }

  downloadToPDF = (param) => {
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      CommonUtil.downloadPdf('.toDownload', 'eventAddress.pdf', 'true', '', () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      window.print()
    }
  }

  // getOwnerDetails = () => {
  //   let celebInfo = this.props.event.eventDetailsInfo && this.props.event.eventDetailsInfo.celebrityInfo;
  //   const objOwner = celebInfo && celebInfo.filter((celeb) => celeb.iscoOwner === 'false')[0];
  //   return objOwner;
  // }

  getAddressOwnerName = (address) => {
    let adminName = ' ';
    if (address.firstName) {
      adminName += address.firstName
    }
    if (address.middleName) {
      adminName += ' ' + address.middleName
    }
    if (address.lastName) {
      adminName += ' ' + address.lastName
    }
    if (address.maternalName) {
      adminName += ' ' + address.maternalName
    }
    return adminName;
  }
  render() {
    const { labels } = this.props; let disableAddAddress = false; const { errors } = this.state;
    const eventManagement = labels ? labels.eventManagement : null;

    const isMigratedEvent = this.props.event && this.props.event.eventDetailsInfo && this.props.event.eventDetailsInfo.isMigratedEvent
    let eventDeliveryAddressList = null;
    if (this.props.eventAddresses && this.props.eventAddresses.deliveryAddressInfo) {
      if (this.props.eventAddresses.deliveryAddressInfo.addresses) {
        let addressList = this.props.eventAddresses.deliveryAddressInfo.addresses;
        disableAddAddress = this.props.eventAddresses.deliveryAddressInfo.addressesToAdd === "0" || isMigratedEvent ? true : false;
        eventDeliveryAddressList = addressList.map((address, index) => {
          let SelectionOptions = []
          let celebMapList = address.celebMap ? address.celebMap : [];
          if (celebMapList.length > 0) {
            {
              celebMapList &&
                celebMapList.map(function (data, index) {
                  let _SelectionOptions = {}
                  let celebrityId = '';
                  let celebrityName = '';
                  let selected = false;
                  Object.keys(data).filter((key, index) => {
                    selected = data.associated;
                    if (key !== 'associated') {
                      celebrityId = key
                      celebrityName = data[key]
                    }
                  })
                  _SelectionOptions.id = celebrityId
                  _SelectionOptions.value = celebrityId
                  _SelectionOptions.labelResourceId = celebrityName
                  _SelectionOptions.selected = selected
                  SelectionOptions.push(_SelectionOptions)
                  // return <option key={index} value={celebrityId} selected={selected}>{celebrityName}</option>
                })
            }
          }
          let options = []; let celebOptions = {}; let drdpId = 'drdp' + index;
          let guardarDivId = 'guardarDivId' + index;
          let objErrors = this.state.errors;
          const selectedCeleb = SelectionOptions.filter((celeb) => { return celeb.selected })[0];
          return (
            <div className="col-xs-4" key={index}>
              <div className="addressBlock">

                <h3>{address.nickName}</h3>
                <h4>{this.getAddressOwnerName(address)}</h4>
                <p>{this.getAddressForHtml(address)}</p>
                {celebMapList.length > 0 &&
                  <React.Fragment>
                    <label>Asignar a festejado</label>
                    <SelectionTab
                      value={(selectedCeleb && selectedCeleb.value) || ''}
                      id={drdpId}
                      name={drdpId}
                      optionText="labelResourceId"
                      uiname="EventDeliveryChangeAddressAssociation"
                      options={SelectionOptions}
                      optionCaption='Selecciona preferencia'
                      errors={errors}
                      validators={([
                        {
                          type: 'required',
                          errorMessage: 'Seleccionar celeb',
                        },
                      ])}
                      onChange={(e) => this.handleDropDownChange(drdpId, address.addressId, index, e)}
                    />
                    {/* <div className="cSelect">
                      <select name={drdpId} id={drdpId} uiname="EventDeliveryChangeAddressAssociation" onChange={(e) => this.handleDropDownChange(drdpId, address.addressId, index, e)} required
                        validators={JSON.stringify([{ type: 'required', errorMessage: 'required' },
                        ])}
                        errors={errors}>
                        <option key='SelectCeleb' value=''>Selecciona preferencia</option>
                        {
                          celebMapList &&
                          celebMapList.map(function (data, index) {
                            let celebrityId = '';
                            let celebrityName = '';
                            let selected = false;
                            Object.keys(data).filter((key, index) => {
                              selected = data.associated;
                              if (key !== 'associated') {
                                celebrityId = key
                                celebrityName = data[key]
                              }
                            })
                            return <option key={index} value={celebrityId} selected={selected}>{celebrityName}</option>
                          })
                        }
                      </select><i className="icon-caret_down" />
                      {objErrors && (Object.keys(objErrors).some(function (k) { return ~k.indexOf(drdpId) })) && <div className='error'> <p id={`${drdpId}-error`} className="error" htmlFor={drdpId}>Seleccionar celeb</p></div>}
                    </div> */}
                  </React.Fragment>
                }
                {
                  !this.state.celebChanged &&
                  <div className="buttonBlock more">
                    <Link uiname="EventDeliveryEditAddress" className="white btnPrimaryAction size-Full" to={CommonUtil.generateRedirect(`${routeconfig.addnewaddress2}?addressId=${address.addressId}`, { eventId: (this.props.params && this.props.params.eventId) })}>Editar</Link>
                    {addressList.length != 1 && <Button uiname="EventDeliveryDeleteAddress" type="button" onClick={(e) => this.handleDeleteAddress(address.addressId)} className="btnSecondarySpecial size-Full"
                      data-toggle="modal" data-target="#deleteModal">Eliminar</Button>}
                  </div>
                }
                {
                  this.state.celebChanged &&
                  < div className="more">
                    <Button uiname="EventDeliveryChangeAddressAssociation" className="btnPrimaryAction size-Full saveAddress">Guardar</Button>
                    <button type="button" onClick={(e) => this.handleCancelAssignCaleb(index)} className="btnSecondaryAction size-Full">Cancelar</button>
                  </div>
                }
              </div >
            </div >
          )
        })
      }
    }

    return (
      <div>
        <div className="container main-container">
          <div className="row">
            <div className="col-xs-2">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="dynamicFrame toPrint">
                <div className="row contentHeader">
                  <div className="col-xs-6">
                    <h1 className="titleSection">Direcciones registradas</h1>
                  </div>
                  <div className="col-xs-6">
                    <Button uiname="EventDeliveryAddAddress" disabled={disableAddAddress} onClick={this.goToAddAddress} className="btnPrimary size-Large addAddressButton">Agregar dirección</Button>
                    {/* <Link disabled={this.state.disableDownload} className="download" onClick={() => this.downloadToPDF('download')}><i className="iClass icon-descarga icono-grande-inline mr-15" /></Link> */}
                    {/* <Link disabled={this.state.disableDownload} className="print" onClick={() => this.downloadToPDF('print')}><i className="iClass icon-imprimir icono-grande-inline" /></Link> */}
                    <PrintDownload elem='.toDownload' fileName='eventAddress.pdf' usePageHeader='true' />
                  </div>
                </div>
                <div className="row messagesBlock">
                  {this.state.assignFailure &&
                    <div className="alertWarning alertBlock"><i className="icon-alerta_amarilla" />
                      <p>{eventManagement && eventManagement['dashboard.eventAddress.assignAddress.errorMessage']}</p><a className="icon-tache2" />
                    </div>
                  }
                  {this.state.assignSuccess &&
                    <div className="alertSuccess alertBlock"><i className="icon-check" />
                      <p>Se han guardado correctamente tu asignación de direcciones(key)</p><a onClick={this.hideMessage} className="icon-tache2" />
                    </div>
                  }
                  {this.props.eventAddresses && this.props.eventAddresses.error && this.props.eventAddresses.error.errorMessage &&
                    <div className="alertWarning alertBlock"><i className="icon-check" />
                      <p>{this.props.eventAddresses.error.errorMessage}</p><a onClick={this.hideMessage} className="icon-tache2" />
                    </div>
                  }
                </div>
                <div className="row addressRow">
                  <Form onSubmit={this.handleAssignCeleb}>
                    {eventDeliveryAddressList ? eventDeliveryAddressList : null}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={this.state.showModal} id="addPlasticCard" className="modal fade modal-custom" >
          <ModalHeader handleClose={this.handleClose}>
            <ModalTitle></ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="modal-body">
              <div className="row deleteModal">
                <div className="col-xs-12">
                  <p>¿Deseas eliminar la dirección {this.state.addressToDeleteNickName}?</p>
                </div>
                <div className="col-xs-12">
                  <div className="col-xs-6">
                    <button onClick={this.handleClose} className="btnSecondaryAction size-Full" data-dismiss="modal">Cancelar</button>
                  </div>
                  <div className="col-xs-6">
                    <button onClick={this.confirmDeleteAddress} className="btnPrimaryAction size-Full deleteAddress"
                      data-dismiss="modal" disabled={this.props.eventAddressesLoading.loading}>Aceptar</button>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>

    );
  }
}
export default EventAddressInfo;
