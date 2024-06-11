
import React, { Component } from 'react'
import { addAddress, updateAddress, getAdressSearch, flushAddressSearch } from '../actions'
import TextInput from '../../../../lib/ZUILib/TextInput'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import { connect } from 'react-redux'
import Form from '../../../../lib/ZUILib/Form'
import routeconfig from 'config/routeconfig'
import appconfig from 'config/appconfig'
import Base from '../../../../components/base'
import commonUtil from '../../../../utils/commonUtil'
import { getStateList } from '../../../browse/MainDashboard/components/SelectStoreModal/actions'
import _ from 'lodash'
// D:\Ayushi\LPGR\InStoreApp\src\pages\browse\MainDashboard\components\SelectStoreModal\actions.js


@connect(
  store => ({
    ownerInfo: store.createevent.eventData ? store.createevent.eventData.ownerInfo : null,
    error: store.addAddress.error,
    addAddresses: store.addAddress,
    addAddressLoading: store.addAddress.loading,
    addressSearch: store.addAddress.addressSearch,
    addressSearchLoading: store.addAddress.addressSearchLoading,
    sepomexisError: store.addAddress.sepomexisError,
    labels: store.labels.labels,
    stateList: store.selectStore.data && store.selectStore.data,
  }),
  { addAddress, updateAddress, getStateList, getAdressSearch, flushAddressSearch },
)

class AddNewAddress extends Component {

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
    this.firstName = ''
    this.lastName = ''
    this.middleName = ''
    this.maternalName = ''
    this.municipality_Options = ''

  }

  state = {
    Err: '',
    formErrors: {},
    addCoOwner: false,
    showCoownerError: false,
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    if (isValidForm) {
      const values = Object.assign({
        profileId: this.props.ownerInfo.profileId,
        nickname: (this.userData.nickName && formValues.shortname !== this.userData.nickName) ? this.userData.nickName : formValues.shortname,
        newNickname: (this.userData.nickName && formValues.shortname !== this.userData.nickName) ? formValues.shortname : undefined,
        firstName: formValues.firstName,
        maternalName: formValues.maternalName,
        lastName: formValues.lastName,
        middleName: formValues.middleName,
        city: formValues.city,
        stateId: formValues.selectedState_id,
        state: formValues.selectedState_option,
        delegationMunicipality: formValues.selectedCity_option ? formValues.selectedCity_option : formValues.selectedCity,
        delegationMunicipalityId: formValues.selectedCity_id ? formValues.selectedCity_id : '',
        building: formValues.building,
        landmark: formValues.landmark,
        postalCode: formValues.cp,
        otherColony: formValues.otherColony,
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
      })
      if (this.props.router.location.query.addressId) {
        this.pageLoaded = false
        this.props.updateAddress(values, this.userData.addressId)
        this.routePage = true
      } else {
        this.pageLoaded = false
        this.props.addAddress(values)
        this.routePage = true
      }
    }
  }
  handleEditRouteConfig = () => {
    // this.props.flushAddressSearch()
    if (this.props.router.location.query.addressId) {
      this.props.router.push(commonUtil.generateRedirect(`${routeconfig.globalstepe}?addressUpdate=true`))
    } else {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.globalstepe))
    }

  }

  handleRoute = (routePath) => {
    // this.props.flushAddressSearch()
    this.props.router.push(commonUtil.generateRedirect(routePath))
  }

  handleBlurOnPostalCode = (type, e) => {
    const object = {}
    if (type === 'postalCode') {
      if (e) {
        this.postalCode = e.target.value // 32654 //e.target.value
      }
      object.action = 'EMA'
      object.cp = this.postalCode
    }
    if ((object.cp && object.cp.toString().length === 5)) {
      this.props.getAdressSearch(object)
      if (e) { this.pageLoaded = false }// send param postal code
    }
  }

  componentWillUnmount = () => {
    this.props.flushAddressSearch()
  }
  componentDidMount = () => {
    this.props.getStateList()
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.keydownlistener, true)
    }
  }

  keydownlistener = (e) => { if (e.keyIdentifier === 'U+000A' || e.keyIdentifier === 'Enter' || e.keyCode === 13) { if (e.target.nodeName === 'INPUT' && e.target.type === 'text' && e.target.type !== 'textarea') { e.preventDefault(); return false } } }

  componentWillReceiveProps(nextProps) {
    if (this.props.addAddresses.addressAdded === false && nextProps.addAddresses.addressAdded === true && this.routePage === true) {
      this.handleEditRouteConfig()
    }
    if (nextProps.error && nextProps.error.errorMessage) {
      this.setState({
        Err: nextProps.error,
      })
    } else if (nextProps.sepomexisError) {
      this.setState({
        Err: nextProps.sepomexisError,
      })
    } else {
      this.setState({
        Err: '',
      })
    }
  }

  closeError = () => {
    this.setState({
      Err: '',
    })
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }

  render() {
    const querySelected = this.props.router.location.query
    const { error, labels, stateList, formValues, sepomexisError, addAddresses, addAddressLoading, addressSearchLoading } = this.props
    const addressInputDisabled = (addAddressLoading || addressSearchLoading) && 'disabled'
    const errorMessage = this.props.addAddress && this.props.addAddress.error && this.props.addAddress.error.status
    const { Err } = this.state
    let landmark = ''
    if (addAddresses && addAddresses.data && addAddresses.data.length > 0) {
      const id = querySelected.addressId
      addAddresses.data.map((data) => {
        if ((data.addressId !== 'undefined') && (id !== 'undefined') && data.addressId === id) {
          landmark = data.landmark
          return landmark
        }
        return null
      })
    }
    if (addAddresses && addAddresses.ownerAddresses) {
      const id = querySelected.addressId
      addAddresses.ownerAddresses.map((data) => {
        if ((data.addressId !== 'undefined') && (id !== 'undefined') && data.addressId === id) {
          this.userData = data
          this.userData.landmark = landmark
          return this.userData
        }
        return null
      })
    }
    let statesOptions; let municipalityOptions; let colonyOptions

    const { errors } = this.state
    let StateOptions
    if (sepomexisError || this.pageLoaded) {
      this.stateId = ''
      if (stateList && stateList.stateListInfo) {
        StateOptions = []
        const states = stateList.stateListInfo
        for (const i in states) {
          const _StateOptions = {}
          if (states[i] === appconfig.states.Distrito_Federal) {
            _StateOptions.labelResourceId = appconfig.states.Cdmx
          } else {
            _StateOptions.labelResourceId = states[i]
          }
          // _StateOptions.labelResourceId = states[i]
          _StateOptions.id = i
          _StateOptions.value = i
          StateOptions.push(_StateOptions)
        }
      }
    }

    if (this.userData && !sepomexisError && !addressSearchLoading) {
      if (this.userData.state && this.userData.stateId) {
        StateOptions = []
        const _StateOptions = {}
        if (this.userData.state === appconfig.states.Distrito_Federal) {
          _StateOptions.labelResourceId = appconfig.states.Cdmx
        } else {
          _StateOptions.labelResourceId = this.userData.state
        }
        // _StateOptions.labelResourceId = this.userData.state
        _StateOptions.id = this.userData.stateId
        _StateOptions.value = this.userData.stateId
        StateOptions.push(_StateOptions)
        this.stateId = StateOptions[0].id
      }

      if (this.userData.delegationMunicipality && this.userData.delegationMunicipalityId) {
        municipalityOptions = []
        const _municipalityOptions = {}
        _municipalityOptions.labelResourceId = this.userData.delegationMunicipality
        _municipalityOptions.id = this.userData.delegationMunicipalityId
        _municipalityOptions.value = this.userData.delegationMunicipalityId
        municipalityOptions.push(_municipalityOptions)
        this.municipalityId = municipalityOptions[0].id
      } else {
        this.municipality = this.userData.delegationMunicipality
      }

      if (this.userData.neighbourhood && this.userData.neighbourhoodId) {

        this.otherColony = this.otherColony !== '' ? this.userData.neighbourhood : '';

        colonyOptions = []
        const _colonyOptions = {}
        _colonyOptions.labelResourceId = this.userData.neighbourhoodId === '-2' ? 'OTRA COLONIA' : this.userData.neighbourhood
        _colonyOptions.id = this.userData.neighbourhoodId
        _colonyOptions.value = this.userData.neighbourhoodId
        colonyOptions.push(_colonyOptions)
        this.neighbourhoodId = colonyOptions[0].id

        if (this.neighbourhoodId !== '-2') {
          const _otherColonyOptions = {}
          _otherColonyOptions.labelResourceId = 'OTRA COLONIA'
          _otherColonyOptions.id = '-2'
          _otherColonyOptions.value = '-2'
          colonyOptions.push(_otherColonyOptions)
        }
      } else {
        this.neighbourhood = this.userData.neighbourhood
      }
    }

    if (this.props.addressSearch && this.props.addressSearch.addrSearchResponse) {
      if (this.props.addressSearch.addrSearchResponse.state) {
        StateOptions = []
        this.props.addressSearch.addrSearchResponse.state.forEach((e) => {
          const _StateOptions = {}
          const index = e.indexOf(':')
          if (e.substr(index + 1) === appconfig.states.Distrito_Federal) {
            _StateOptions.labelResourceId = appconfig.states.Cdmx
          } else {
            _StateOptions.labelResourceId = e.substr(index + 1)
          }
          _StateOptions.id = e.substr(0, index)
          _StateOptions.value = e.substr(0, index)
          StateOptions.push(_StateOptions)
        })
        this.stateId = StateOptions[0].id
      }
      if (this.props.addressSearch.addrSearchResponse.municipality) {
        municipalityOptions = []
        const municipalityList = this.props.addressSearch.addrSearchResponse.municipality
        if (municipalityList) {
          municipalityList.forEach((e) => {
            const index = e.indexOf(':')
            const id = e.substr(0, index)
            const text = e.substr(index + 1)
            const _municipalityOptions = {}
            _municipalityOptions.id = id
            _municipalityOptions.value = id
            _municipalityOptions.labelResourceId = text
            municipalityOptions.push(_municipalityOptions)
          })
          this.municipalityId = municipalityOptions[0].id
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
        this.neighbourhoodId = colonyOptions[0].id

        if (this.neighbourhoodId !== '-2') {
          const _otherColonyOptions = {}
          _otherColonyOptions.labelResourceId = 'OTRA COLONIA'
          _otherColonyOptions.id = '-2'
          _otherColonyOptions.value = '-2'
          colonyOptions.push(_otherColonyOptions)
        }
      }
    }

    const codeData = {}
    if (this.userData && this.userData.phoneNumber) {
      const index = this.userData.phoneNumber.indexOf('-')
      codeData.particularPhoneCode = this.userData.phoneNumber.substr(0, index)
      codeData.phoneNumber = this.userData.phoneNumber.substr(index + 1)
    }
    if (this.userData && this.userData.businessPhoneNumber) {
      const index = this.userData.businessPhoneNumber.indexOf('-')
      codeData.businessPhoneCode = this.userData.businessPhoneNumber.substr(0, index)
      codeData.businessPhoneNumber = this.userData.businessPhoneNumber.substr(index + 1)
    }
    this.firstName = this.userData ? this.userData.firstName : this.props.ownerInfo && this.props.ownerInfo.firstName
    this.middleName = this.userData ? this.userData.middleName : ''
    this.lastName = this.userData ? this.userData.lastName : this.props.ownerInfo && this.props.ownerInfo.lastName
    this.maternalName = this.userData ? this.userData.maternalName : this.props.ownerInfo && this.props.ownerInfo.maternalName

    return (
      <div>

        <div className="wrap-address">
          <div className="container">
            <div className="main">
              <div className="col-xs-12 alignCenter">
                <p className="title">Agregar dirección</p>
              </div>
              <div className="col-xs-12">
                <p className="tabsText">{commonUtil.getLabel(labels, 'eventCreation.stage3.editAddress')}</p>
              </div>
              <div className="col-xs-12 borderTopStyle" />
              {this.pageLoaded === false && Err && Err.errorMessage &&
                <div className="col-md-12">
                  <div className="alertError" id="emailsDif"><i className="icon-tache2" />
                    <p>{Err.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeError} />
                  </div>
                </div>}
              <div className="row show-grid-row">
                <div className="col-xs-2 col-xs-offset-10 alignRight">
                  <p className="requiredFields">*Campos obligatorios</p>
                </div>
              </div>
              <Form onSubmit={this.handleSubmit}>
                <div className="row show-grid-row">
                  <div className="col-xs-4">
                    <p className="subtitle">Dirección de envío</p>
                    <TextInput
                      value={(this.userData && this.userData.nickName) || ''}
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
                    <input name="firstName" type="hidden" value={this.firstName} />
                    <input name="lastName" type="hidden" value={this.lastName} />
                    <input name="maternalName" type="hidden" value={this.maternalName} />
                    {this.userData && this.userData.middleName &&
                      <input name="middleName" type="hidden" value={this.middleName} />
                    }

                    <TextInput
                      htmlId="country"
                      name="country"
                      value="Mexico"
                      type="text"
                      disabled
                      maxlength="30"
                      required="required"
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
                      onKeyUp={e => e.target.value && e.target.value.length == 5 && this.handleBlurOnPostalCode('postalCode', e)}
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingresa un Código postal.', // this.props.labels.cpCode
                      }, {
                        type: 'minLength',
                        errorMessage: 'El Código Postal es requerido.',
                        minLength: 5,
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
                      sortOptions
                      value={this.stateId && this.stateId}
                      errors={errors}
                      disabled={!StateOptions || StateOptions.length <= 0 || addressInputDisabled}
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
                      maxlength="40"
                      required="required"
                      star="*"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingresa una Ciudad', // this.props.labels.cpCode
                      }]}

                      errors={errors}
                    />

                    {(sepomexisError && !this.pageLoaded) || (this.userData && !this.userData.delegationMunicipalityId && !this.municipalityId) ?
                      <TextInput
                        value={this.municipality}
                        htmlId="selectedCity"
                        name="selectedCity"
                        type="text"
                        label=" Delegación o Municipio"
                        maxlength="100"
                        required="required"
                        disabled={addressInputDisabled}
                        required="required"
                        star="*"
                        validators={[{
                          type: 'required',
                          errorMessage: 'Ingresar a Delegación o Municipio', // this.props.labels.country
                        }]}

                        errors={errors}
                      />
                      :
                      <SelectionTab
                        id={'selectedCity'}
                        name={'selectedCity'}
                        options={municipalityOptions}
                        optionCaption={'Delegación o Municipio'}
                        optionText={'labelResourceId'}
                        optionValue={'value'}
                        disable={addressInputDisabled}
                        errors={errors}
                        value={this.municipalityId && this.municipalityId}
                        validators={([
                          {
                            type: 'required',
                            errorMessage: 'Seleccione una opción',
                          },
                        ])}
                      />
                    }


                    {(sepomexisError && !this.pageLoaded) || (this.userData && !this.userData.neighbourhoodId && !this.neighbourhoodId) ?
                      <TextInput
                        value={this.neighbourhood}
                        htmlId="selectColony"
                        name="selectColony"
                        type="text"
                        label=" Colonia o asentamiento"
                        maxlength="100"
                        required="required"
                        disabled={addressInputDisabled}
                        required="required"
                        star="*"
                        validators={[{
                          type: 'required',
                          errorMessage: 'Ingresar a Colonia o asentamiento', // this.props.labels.country
                        }]}

                        errors={errors}
                      />
                      :
                      <React.Fragment>
                        <SelectionTab
                          value={this.neighbourhoodId || ''}
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
                          onChange={e => {
                            const value = e.target.value;
                            if (value == '-2') {
                              this.otherColony = '';
                              this.setState({
                                showOtherColony: true
                              });
                            } else {
                              this.otherColony = this.userData.neighbourhood;
                              this.setState({
                                showOtherColony: false
                              });
                            }
                          }}
                        />
                        {
                          (this.state.showOtherColony || this.neighbourhoodId === '-2') &&
                          <TextInput
                            value={this.otherColony || ''}
                            htmlId="otherColony"
                            name="otherColony"
                            type="text"
                            label="Otra Colonia"
                            required="required"
                            star="*"
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa Otra Colonia',
                            }]}
                          />
                        }
                      </React.Fragment>
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
                      type="text"
                      htmlId="extNumber"
                      name="extNumber"
                      label="No. exterior"
                      maxlength="10"
                      required="required"
                      star="*"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingresa un Número exterior', // this.props.labels.exteriorNumber
                      }]}
                      errors={errors}
                    />
                    <TextInput
                      value={this.userData && this.userData.interiorNumber ? this.userData.interiorNumber : ''}
                      type="text"
                      htmlId="intNumber"
                      name="intNumber"
                      label="No. interior"
                      required="required"
                      maxlength="10"
                    />
                    <TextInput
                      value={this.userData && this.userData.building ? this.userData.building : ''}
                      htmlId="building"
                      name="building"
                      type="text"
                      label="Edificio"
                      required="required"
                      maxlength="100"
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
                      maxlength="100"
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
                      maxlength="100"
                    />
                  </div>
                </div>
                <div className="row show-grid-row">
                  <div className="col-xs-4">
                  <div style={{ display: 'none' }}>
                    <TextInput
                      value={codeData && codeData.particularPhoneCode ? codeData.particularPhoneCode : '000'}
                      type="number"
                      htmlId="privatePhoneCode"
                      name="privatePhoneCode"
                      label=" Lada"
                      maxlength={3}
                      required="required"
                      star="*"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Añadir un Lada',
                      }]}

                      errors={errors}
                    />
                    </div>
                    <TextInput
                      value={codeData && codeData.phoneNumber ? codeData.phoneNumber : ''}
                      type="number"
                      htmlId="telphonePvt"
                      name="telphonePvt"
                      label="Teléfono fijo"
                      maxlength="10"
                      required="required"
                      star="*"
                      validators={[{
                        type: 'required',
                        errorMessage: 'Ingresa una Teléfono',
                      }]}

                      errors={errors}
                    />
                    <div style={{ display: 'none' }}>
                      <TextInput
                        value={codeData && codeData.businessPhoneCode ? codeData.businessPhoneCode : ''}
                        type="number"
                        htmlId="officePhoneCode"
                        name="officePhoneCode"
                        label=" Lada"
                        required="required"
                        maxlength={3}
                      />
                      <TextInput
                        value={codeData && codeData.businessPhoneNumber ? codeData.businessPhoneNumber : ''}
                        type="number"
                        htmlId="telPhoneOffice"
                        name="telPhoneOffice"
                        label="Tel. oficina con Lada"
                        required="required"
                        maxlength={8}
                      />
                    </div>
                    <TextInput
                      value={this.userData && this.userData.cellular ? this.userData.cellular : ''}
                      type="number"
                      htmlId="cellPhone"
                      name="cellPhone"
                      label="Teléfono celular"
                      required="required"
                      maxlength={10}
                      star="*"
                    />
                    <textarea
                      placeholder="Notas sobre dirección"
                      maxLength="100"
                      name="landmark"
                      defaultValue={this.userData && this.userData.landmark ? this.userData.landmark : ''}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                <div className="row show-grid-row">
                  <div className="col-xs-3">
                    <button className="btnSecondaryAction size-Full cancelar" type="button" onClick={() => this.handleRoute(routeconfig.globalstepe)}>Cancelar</button>
                  </div>
                  <div className="col-xs-3">
                    <button className="btnPrimaryAction size-Full saveDir" disabled={addressInputDisabled} type="submit">Guardar</button>
                  </div>
                  <div className="col-xs-12">
                    <p className="terms">Al dar click en Guardar admites estás de acuerdo con nuestros <a className="primaryColorLink">Términos y Condiciones asi como las Políticas de uso de datos</a></p>
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

export default AddNewAddress
