import React, { Component } from 'react';
import ManagementMenu from '../../Navigation/ManagementMenu';
import { addAddress, updateAddress, getAdressSearch } from '../AddNewAddress/actions'
import TextInput from '../../../../lib/ZUILib/TextInput'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import { connect } from 'react-redux'
import Form from '../../../../lib/ZUILib/Form'
import routeconfig from '../../../../config/routeconfig';
import Base from '../../../../components/base'
import commonUtil from '../../../../utils/commonUtil'
import { getStateList } from '../../../browse/MainDashboard/components/SelectStoreModal/actions'
import _ from 'lodash'

@connect(
  store => ({
    eventData: store.eventdashboard.eventData,
    eventAddresses: store.eventAddresses.eventDeliveryAddressData,
    error: store.eventMgmtAddress.error,
    addAddresses: store.eventMgmtAddress,
    addAddressLoading: store.eventMgmtAddress.loading,
    addressSearch: store.eventMgmtAddress.addressSearch,
    sepomexisError: store.eventMgmtAddress.sepomexisError,
    labels: store.labels.labels,
    stateList: store.selectStore.data && store.selectStore.data,
  }),
  {
    updateAddress, getStateList, getAdressSearch
  }
)

class EditAddress extends Component {
  constructor(props) {
    super(props)
    this.resState = ''
    this.userData = ''
    this.postalCode = ''
    this.stateId = ''
    this.municipality = ''
    this.municipalityId = ''
    this.neighbourhood = ''
    this.neighbourhoodId = ''
    this.selectedState = ''
    this.routePage = false
    this.pageLoaded = true
  }

  state = {
    Err: '',
    formErrors: {},
    addCoOwner: false,
    showCoownerError: false,
  }

  getOwnerDetails = () => {
    let celebInfo = this.props.eventData.eventDetailsInfo.celebrityInfo;
    const objOwner = celebInfo.filter((celeb) => celeb.iscoOwner === 'false')[0];//.profileId;

    return objOwner;
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    if (isValidForm) {
      let ownerDetails = this.getOwnerDetails();

      let values = Object.assign({
        profileId: ownerDetails.profileId,
        eventId: this.props.params.eventId,
        addressId: this.props.params.addressId,
        nickname: formValues.shortname,
        celebrityName: formValues.selectCeleb_option,
        firstName: ownerDetails.firstName,
        maternalName: ownerDetails.motherName ? ownerDetails.motherName : '',
        lastName: ownerDetails.lastName,
        middleName: ownerDetails.middleName ? ownerDetails.middleName : '',
        country: formValues.country,
        city: formValues.city,
        stateId: formValues.selectedState_id,
        state: formValues.selectedState_option,
        delegationMunicipality: formValues.selectedCity_option ? formValues.selectedCity_option : formValues.selectedCity,
        delegationMunicipalityId: formValues.selectedCity_id ? formValues.selectedCity_id : '',
        building: formValues.building,
        otherColony: formValues.otherColony,
        postalCode: formValues.cp,
        neighbourhood: formValues.selectColony_option ? formValues.selectColony_option : formValues.selectColony, // colony
        neighbourhoodId: formValues.selectColony_id ? formValues.selectColony_id : '', // colony
        exteriorNumber: formValues.extNumber,
        interiorNumber: formValues.intNumber,
        particularPhoneCode: formValues.privatePhoneCode, //
        phoneNumber: formValues.telphonePvt,
        businessPhoneCode: formValues.officePhoneCode, //
        businessPhoneNumber: formValues.telPhoneOffice,
        address1: formValues.street, // Street
        address2: formValues.betweenStreet, // betweenStreet
        address3: formValues.streetTwo, // StreetTwo
        cellular: formValues.cellPhone,
        landmark: formValues.notesOnAddress
        // channel: 'INSTORE',
        // brandName: 'LP',
      })

      this.props.updateAddress(values, this.userData.addressId)
      this.routePage = true
    }
  }
  handleRoute = (routePath) => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventaddressinfo, { eventId: this.props.params.eventId }));
  }

  handleBlurOnPostalCode = (type, e) => {
    const object = {}
    if (type === 'postalCode') {
      if (e) {
        this.postalCode = e.target.value //32654 //e.target.value
      }
      object.action = 'EMA'
      object.cp = this.postalCode
    } else if (type === 'state') {
      this.stateId = e.target.value
      object.action = 'municipios'
      object.idEstado = this.stateId
    }
    else if (type === 'neighbourhood') {
      if (e) {
        const value = e.target.value
        const index = value.indexOf(':')
        const id = value.substr(0, index)
        const text = value.substr(index + 1)
        this.municipalityId = id
        this.municipality = text
      }
      object.action = 'asentamientos'
      object.cp = this.postalCode
      object.idEstado = this.stateId
      object.idMunicipio = this.municipalityId
    }
    if ((this.postalCode && this.postalCode.toString().length === 5) || !this.postalCode) {
      this.props.getAdressSearch(object)
      this.pageLoaded = false;// send param postal code
    }
  }

  componentDidMount = () => {
    this.props.getStateList()
    if (this.props.params.addressId) {
      this.postalCode = this.userData.postalCode;
      this.stateId = this.userData.stateId;
      this.municipalityId = this.userData.delegationMunicipalityId;
      this.municipality = this.userData.delegationMunicipality;
      this.neighbourhoodId = this.userData.neighbourhoodId;
      this.neighbourhood = this.userData.neighbourhood;
      if (this.userData.delegationMunicipalityId) {
        this.handleBlurOnPostalCode('neighbourhood', null)
      } else {
        this.handleBlurOnPostalCode('postalCode', null)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.addAddresses.addressAdded === true && nextProps.addAddresses.data.status && nextProps.addAddresses.data.status.status === 'success' && this.routePage === true) {
      this.handleRoute();
    }
    if (nextProps.error) {
      this.setState({
        Err: nextProps.error
      })
    } else if (nextProps.sepomexisError) {
      this.setState({
        Err: nextProps.sepomexisError
      })
    }
  }

  closeMessage = () => {
    this.setState({
      Err: ''
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }

  render() {
    const querySelected = this.props.router.location.query
    const { error, labels, stateList, formValues, sepomexisError, addAddresses, addAddressLoading } = this.props
    const { Err } = this.state
    let celebId = '';
    const { errors } = this.state
    const StateOptions = []; const celebOptions = [];
    if ((stateList && stateList.stateListInfo)) {
      const states = stateList.stateListInfo
      for (let i in states) {
        const _StateOptions = {}
        _StateOptions.labelResourceId = states[i]
        // if (i < 10) {
        //   i = `0${i}`;
        // }
        _StateOptions.id = i
        _StateOptions.value = i
        StateOptions.push(_StateOptions)
      }
    }

    const addressInputDisabled = addAddressLoading && 'disabled'
    const errorMessage = this.props.addAddress && this.props.addAddress.error && this.props.addAddress.error.status
    let statesOptions; let municipalityOptions; let colonyOptions


    if (this.props.addressSearch && this.props.addressSearch.addrSearchResponse) {
      municipalityOptions = []
      if (this.props.addressSearch.addrSearchResponse.municipality) {
        const municipalityList = this.props.addressSearch.addrSearchResponse.municipality
        if (municipalityList) {
          municipalityList.forEach((e) => {
            const index = e.indexOf(':')
            const id = e.substr(0, index)
            const text = e.substr(index + 1)
            const _municipalityOptions = {}
            _municipalityOptions.id = id
            _municipalityOptions.value = e
            _municipalityOptions.labelResourceId = text
            municipalityOptions.push(_municipalityOptions)
          })
        }
      } else if (this.municipality) {
        const _municipalityOptions = {}
        _municipalityOptions.id = this.municipalityId
        _municipalityOptions.value = this.municipalityId
        _municipalityOptions.labelResourceId = this.municipality
        municipalityOptions.push(_municipalityOptions)
      }
      if (this.userData && this.userData.stateId) {
        this.selectedState = this.userData.stateId
      }
      if ((this.props.addressSearch && this.props.addressSearch.addrSearchResponse && this.props.addressSearch.addrSearchResponse.state) || (this.userData && this.userData.state && this.userData.stateId)) {
        if (this.props.addressSearch && this.props.addressSearch.addrSearchResponse && this.props.addressSearch.addrSearchResponse.state) {
          this.props.addressSearch.addrSearchResponse.state.forEach((e) => {
            const index = e.indexOf(':')
            this.stateId = e.substr(0, index)
          })
        }
      }
      if (this.props.addressSearch.addrSearchResponse.neighbourhood) {
        colonyOptions = []
        const colonyList = this.props.addressSearch.addrSearchResponse.neighbourhood
        colonyList.forEach((e) => {
          const index = e.indexOf(':')
          const id = e.substr(0, index)
          const text = e.substr(index + 1)
          const _colonyOptions = {}
          _colonyOptions.id = id
          _colonyOptions.value = id
          _colonyOptions.labelResourceId = text
          colonyOptions.push(_colonyOptions)
        })
      }
    }
    if (this.props.eventAddresses && this.props.eventAddresses.deliveryAddressInfo.addresses) {
      const id = this.props.params.addressId
      let addressList = this.props.eventAddresses.deliveryAddressInfo.addresses
      addressList.map((data) => {
        if ((data.addressId !== 'undefined') && (id !== 'undefined') && data.addressId === id) {
          this.userData = data
          return this.userData
        }
        //return null
      })
    }
    if (this.props.eventAddresses && this.props.eventAddresses.deliveryAddressInfo.addresses) {
      const id = this.props.params.addressId
      let addressList = this.props.eventAddresses.deliveryAddressInfo.addresses
      addressList.map((data) => {

        let tmpCelebmap = data.celebMap;
        if (tmpCelebmap.length > 0) {
          tmpCelebmap.map(function (item, index) {
            let celebrityId = '';
            let celebrityName = '';
            let isDisabled = false;
            if (data.addressId === id && item.associated) {
              celebId = Object.keys(item)[0]
            }
            const _celebOptions = {};

            var removeIndex = celebOptions.map(function (item) { return item.celebrityId; })
              .indexOf(Object.keys(item)[0]);
            if (removeIndex != -1) {
              if (item.associated) {
                ~removeIndex && celebOptions.splice(removeIndex, 1);
                _celebOptions.disabled = item.associated;
                _celebOptions.celebrityId = Object.keys(item)[0];
                _celebOptions.celebrityName = item[Object.keys(item)[0]];

                celebOptions.push(_celebOptions);
              }
            } else {
              _celebOptions.disabled = item.associated;
              _celebOptions.celebrityId = Object.keys(item)[0];
              _celebOptions.celebrityName = item[Object.keys(item)[0]];

              celebOptions.push(_celebOptions);
            }
          })
        }
        //return null
      })
    }

    return (
      <React.Fragment>
        <div className="container main-container">
          <div className="row">
            <div className="col-xs-2">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="dynamicFrame">
                <div className="row contentHeader">
                  <div className="col-xs-7">
                    <h1 className="titleSection">Editar dirección</h1>
                    <h2 className="descriptiveTextSecond">La dirección se editará en la cuenta de Liverpool (key)</h2>
                  </div>
                </div>
                {this.pageLoaded === false && Err && Err.errorMessage &&
                  <div className="col-md-12">
                    < div className="alertError" id="emailsDif"><i className="icon-tache2" />
                      <p>{Err.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeMessage} />
                    </div>
                  </div>}
                <div className="row show-grid-row">
                  <div className="col-xs-2 col-xs-offset-10 alignRight">
                    <p className="requiredFields"><sup>*</sup>Campos obligatorios</p>
                  </div>
                </div>
                <div className="row addAddressForm">
                  <div className="col-xs-12">
                    <Form onSubmit={this.handleSubmit}>
                      <div className="row show-grid-row">
                        <div className="col-xs-4">
                          <p className="subtitle">Dirección de envío</p>
                          <TextInput
                            value={this.userData && this.userData.nickName ? this.userData.nickName : ''}
                            htmlId="shortname"
                            name="shortname"
                            type="text"
                            label="Nombre corto"
                            maxlength="30"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Agrega un Nombre corto', // this.props.labels.country
                            }]}

                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="row show-grid-row">
                        <div className="col-xs-4">
                          <p className="subtitle">Datos de entrega</p>
                          {/* <TextInput
                            value={this.userData && this.userData.firstName ? this.userData.firstName : ''}
                            htmlId="firstName"
                            name="firstName"
                            type="text"
                            label="nombre de pila"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Required ', // this.props.labels.country
                            }]}

                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.middleName ? this.userData.middleName : ''}
                            htmlId="middleName"
                            name="middleName"
                            type="text"
                            label=" Segundo nombre"
                            required="required"
                          />
                          <TextInput
                            value={this.userData && this.userData.lastName ? this.userData.lastName : ''}
                            htmlId="lastName"
                            name="lastName"
                            type="text"
                            label="apellido"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Required ', // this.props.labels.country
                            }]}

                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.maternalName ? this.userData.maternalName : ''}
                            htmlId="maternalName"
                            name="maternalName"
                            type="text"
                            label=" Apellido Materno"
                            required="required"
                          /> */}
                          <SelectionTab
                            id={'selectCeleb'}
                            name={'selectCeleb'}
                            options={celebOptions}
                            optionText={'celebrityName'}
                            optionValue={'celebrityId'}
                            value={celebId ? celebId : ''}
                            errors={errors}
                            //disabled={isDisabled}
                            validators={([
                              {
                                type: 'required',
                                errorMessage: 'Seleccione una opción',
                              },
                            ])}
                          />
                          <TextInput
                            value={this.userData && this.userData.country ? this.userData.country : ''}
                            htmlId="country"
                            name="country"
                            type="text"
                            label="País"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa una País', // this.props.labels.country
                            }]}

                            errors={errors}
                          />
                          <TextInput
                            value={this.postalCode ? this.postalCode : (this.userData && this.userData.postalCode ? this.userData.postalCode : '')}
                            htmlId="cp"
                            name="cp"
                            type="number"
                            label="Código Postal"
                            maxlength="5"
                            required="required"
                            disabled={addressInputDisabled}
                            star="*"
                            onBlur={e => this.handleBlurOnPostalCode('postalCode', e)}
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa un Código postal', // this.props.labels.cpCode
                            }]}

                            errors={errors}
                          />
                          <SelectionTab
                            id={'selectedState'}
                            name={'selectedState'}
                            options={StateOptions}
                            optionCaption={'Estado'}
                            optionText={'labelResourceId'}
                            optionValue={'value'}
                            sortOptions={true}
                            onChange={e => this.handleBlurOnPostalCode('state', e)}
                            value={this.stateId ? this.stateId : (this.userData && this.userData.stateId ? this.userData.stateId : '')}
                            errors={errors}
                            disabled={StateOptions.length <= 0 || addressInputDisabled}
                            validators={([
                              {
                                type: 'required',
                                errorMessage: 'Seleccione una opción',
                              },
                            ])}
                          />
                          <TextInput
                            value={this.userData && this.userData.city ? this.userData.city : ''}
                            htmlId="city"
                            name="city"
                            type="text"
                            label=" Ciudad"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa una Ciudad', // this.props.labels.cpCode
                            }]}

                            errors={errors}
                          />
                          {sepomexisError && !this.pageLoaded ?
                            <TextInput
                              value={this.userData && this.userData.delegationMunicipality ? this.userData.delegationMunicipality : ''}
                              htmlId="selectedCity"
                              name="selectedCity"
                              type="text"
                              label=" Delegación o Municipio"
                              required="required"
                              disabled={addressInputDisabled}
                              required="required"
                              star="*"
                              validators={[{
                                type: 'required',
                                errorMessage: 'Ingresa un Delegación o Municipio', // this.props.labels.country
                              }]}

                              errors={errors}
                            />
                            :
                            <div className="cSelect required">
                              <SelectionTab
                                id={'selectedCity'}
                                name={'selectedCity'}
                                options={municipalityOptions}
                                optionCaption={'Delegación o Municipio'}
                                optionText={'labelResourceId'}
                                optionValue={'value'}
                                disable={addressInputDisabled}
                                errors={errors}
                                onChange={e => this.handleBlurOnPostalCode('neighbourhood', e)}
                                value={this.municipalityId ? this.municipalityId : (this.userData && this.userData.delegationMunicipalityId ? this.userData.delegationMunicipalityId : '')}
                                validators={([
                                  {
                                    type: 'required',
                                    errorMessage: 'Seleccione una opción',
                                  },
                                ])}
                              />
                              <i className="icon-caret_down" />
                            </div>
                          }
                          {sepomexisError && !this.pageLoaded ?
                            <TextInput
                              value={this.userData && this.userData.neighbourhood ? this.userData.neighbourhood : ''}
                              htmlId="selectColony"
                              name="selectColony"
                              type="text"
                              label=" Colonia o asentamiento"
                              required="required"
                              disabled={addressInputDisabled}
                              required="required"
                              star="*"
                              validators={[{
                                type: 'required',
                                errorMessage: 'Ingresa un Colonia o asentamiento ', // this.props.labels.country
                              }]}

                              errors={errors}
                            />
                            :
                            <div className="cSelect required">
                              <SelectionTab
                                value={this.neighbourhoodId ? this.neighbourhoodId : (this.userData && this.userData.neighbourhoodId ? this.userData.neighbourhoodId : '')}
                                id={'selectColony'}
                                name={'selectColony'}
                                options={colonyOptions}
                                disable={addressInputDisabled}
                                optionCaption={'Colonia o asentamiento'}
                                optionText={'labelResourceId'}
                                optionValue={'value'}
                                errors={errors}
                                validators={([
                                  {
                                    type: 'required',
                                    errorMessage: 'Seleccione una opción',
                                  },
                                ])}
                              />
                              <i className="icon-caret_down" />
                            </div>
                          }
                          <TextInput
                            value={this.userData && this.userData.address1 ? this.userData.address1 : ''}
                            htmlId="street"
                            name="street"
                            type="text"
                            label="Calle"
                            maxlength="100"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa una Calle', // this.props.labels.streetMain
                            }]}
                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.exteriorNumber ? this.userData.exteriorNumber : ''}
                            htmlId="extNumber"
                            name="extNumber"
                            label="No. exterior"
                            required="required"
                            maxlength="10"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa un Número exterior', // this.props.labels.exteriorNumber
                            }]}
                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.interiorNumber ? this.userData.interiorNumber : ''}
                            htmlId="intNumber"
                            name="intNumber"
                            type="text"
                            maxlength="10"
                            label="No. interior"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Required', // this.props.labels.interiorNumber
                            }]}
                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.building ? this.userData.building : ''}
                            htmlId="building"
                            name="building"
                            type="text"
                            label="Edificio"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="row show-grid-row vertical-align">
                        <div className="col-xs-4">
                          <TextInput
                            value={this.userData && this.userData.address2 ? this.userData.address2 : ''}
                            htmlId="betweenStreet"
                            name="betweenStreet"
                            type="text"
                            label="Entre calle"
                            required="required"
                          />
                        </div>
                        <div className="col-xs-1 alignCenter"><p>y</p></div>
                        <div className="col-xs-4">
                          <TextInput
                            value={this.userData && this.userData.address3 ? this.userData.address3 : ''}
                            htmlId="streetTwo"
                            name="streetTwo"
                            type="text"
                            label="Calle2"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="row show-grid-row">
                        <div className="col-xs-4">
                          <TextInput
                            value={this.userData && this.userData.otherColony ? this.userData.otherColony : ''}
                            htmlId="otherColony"
                            name="otherColony"
                            type="text"
                            label="punto de referencia"
                            required="required"
                          />
                          <TextInput
                            value={this.userData && this.userData.particularPhoneCode ? this.userData.particularPhoneCode : ''}
                            htmlId="privatePhoneCode"
                            name="privatePhoneCode"
                            label="Lada"
                            maxlength={3}
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Required',
                            }]}

                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.phoneNumber ? this.userData.phoneNumber : ''}
                            htmlId="telphonePvt"
                            name="telphonePvt"
                            type="text"
                            label="Tel. particular sin Lada"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa una Teléfono',
                            }]}

                            errors={errors}
                          />
                          <TextInput
                            value={this.userData && this.userData.businessPhoneCode ? this.userData.businessPhoneCode : ''}
                            htmlId="officePhoneCode"
                            name="officePhoneCode"
                            label=" Lada"
                            star="*"
                            required="required"
                            maxlength={3}
                          />
                          <TextInput
                            value={this.userData && this.userData.businessPhoneNumber ? this.userData.businessPhoneNumber : ''}
                            htmlId="telPhoneOffice"
                            name="telPhoneOffice"
                            type="text"
                            label="Tel. oficina con Lada"
                            required="required"
                            maxlength={8}
                          />
                          <TextInput
                            value={this.userData && this.userData.cellular ? this.userData.cellular : ''}
                            htmlId="cellPhone"
                            name="cellPhone"
                            type="text"
                            label="Celular"
                            required="required"
                            maxlength={10}
                          />
                          {/* <TextInput
                      value=""
                      formId="addAddressForm"
                      htmlId="notesOnAddress"
                      name="notesOnAddress"
                      type="textarea"
                      label="Notas sobre dirección"
                      required="required"
                    /> */}
                          <textarea placeholder="Notas sobre dirección" name="notesOnAddress"
                            defaultValue={this.userData && this.userData.landMark ? this.userData.landMark : ''} />
                        </div>
                      </div>
                      <div className="row show-grid-row">
                        <div className="col-xs-3">
                          <button className="btnSecondaryAction size-Full cancelar" type="button" onClick={this.handleRoute}>Cancelar</button>
                        </div>
                        <div className="col-xs-3">
                          <button className="btnPrimaryAction size-Full saveDir" type="submit">Guardar</button>
                        </div>
                        <div className="col-xs-12">
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>

    );
  }
}
export default EditAddress;
