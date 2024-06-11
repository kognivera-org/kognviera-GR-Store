
import React, { Component } from 'react'
import { getAdressSearch, flushAddressSearch } from '../../../createevent/address/actions'
import { updateAddress, addAddress, updateAddressGR } from './actions'
import ManagementMenu from '../../../eventManagement/Navigation/ManagementMenu'
import TextInput from '../../../../lib/ZUILib/TextInput'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import { connect } from 'react-redux'
import Form from '../../../../lib/ZUILib/Form'
import routeconfig from 'config/routeconfig'
import Base from '../../../../components/base'
import commonUtil from '../../../../utils/commonUtil'
import { getStateList } from '../../../browse/MainDashboard/components/SelectStoreModal/actions'
import _ from 'lodash'
import { addAddressReq } from '../AddNewAddress/requests'
import appconfig from '../../../../config/appconfig'


@connect(
  store => ({
    eventData: store.eventdashboard.eventData,
    addressUpdated: store.eventMgmtAddress.addressUpdated,
    addressUpdatedGR: store.eventMgmtAddress.addressUpdatedGR,
    GRDashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.dashboardUserId,
    ecommDashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,
    dashboardUser: store.eventdashboard.dashboardUser,
    eventAddresses: store.eventAddresses.eventDeliveryAddressData,
    addressSearch: store.addAddress.addressSearch,
    addressSearchLoading: store.addAddress.addressSearchLoading,
    sepomexisError: store.addAddress.sepomexisError,
    labels: store.labels.labels,
    stateList: store.selectStore.data && store.selectStore.data,
    error: store.eventMgmtAddress.error,
    addressAdded: store.eventMgmtAddress.addressAdded,

  }),
  { getStateList, getAdressSearch, flushAddressSearch, updateAddress, addAddress, updateAddressGR },
)

class AddNewAddress extends Component {

  constructor(props) {
    super(props)
    this.resState = ''
    this.userData = ''
    this.postalCode = ''
    this.celebId = ''
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
    this.updateGRAddressOnly = false
  }


  state = {
    Err: '',
    formErrors: {},
    addCoOwner: false,
    showCoownerError: false,
  }

  getCelebrated = () => {
    let celebrated
    const celebInfo = this.props.eventData && this.props.eventData.eventDetailsInfo && this.props.eventData.eventDetailsInfo.celebrityInfo
    const objCeleb = celebInfo && celebInfo.filter(celeb => celeb.isCelebrity)
    if (objCeleb && objCeleb.length > 0) {
      celebrated = objCeleb[0]
    }
    return celebrated
  }

  getOwnerDetails = () => {
    const celebInfo = this.props.eventData.eventDetailsInfo.celebrityInfo
    const objOwner = celebInfo.filter(celeb => celeb.iscoOwner === 'false')[0]
    return objOwner
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }


  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    const { dashboardUser } = this.props
    e.preventDefault()
    this.setState({
      ...this.state,
      errors: formErrors,
    })
    this.updateGRAddressOnly = false
    if (isValidForm) {
      const ownerDetails = this.getOwnerDetails()
      let celebrityName = formValues.selectCeleb_option
      if (!celebrityName) {
        const celebObj = this.getCelebrated()
        if (celebObj) {
          celebrityName = celebObj.firstName
        }
      }
      const values = Object.assign({
        eventId: this.props.params.eventId,
        profileId: this.props.ecommDashboardUserId !== '12345678' && this.props.ecommDashboardUserId ? this.props.ecommDashboardUserId : ownerDetails.profileId ? ownerDetails.profileId : '123456',
        ownerId: this.props.GRDashboardUserId,
        nickname: (this.userData.nickName && formValues.shortname !== this.userData.nickName) ? this.userData.nickName : formValues.shortname,
        newNickname: (this.userData.nickName && formValues.shortname !== this.userData.nickName) ? formValues.shortname : undefined,
        firstName: this.userData ? this.userData.firstName : dashboardUser.dashboardUserFirstName,
        celebrityName,
        maternalName: this.userData ? this.userData.maternalName : dashboardUser.dashboardUserMaternalName ? dashboardUser.dashboardUserMaternalName : '',
        lastName: this.userData ? this.userData.lastName : dashboardUser.dashboardUserLastName,
        middleName: this.userData ? this.userData.middleName : dashboardUser.dashboardUserMiddleName ? dashboardUser.dashboardUserMiddleName : '',
        city: formValues.city,
        country: formValues.country,
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
        particularPhoneCode: formValues.particularPhoneCode,
        phoneNumber: formValues.telphonePvt,
        businessPhoneCode: '',
        businessPhoneNumber: '',
        address1: formValues.street, // Street
        address2: formValues.betweenStreet, // betweenStreet
        address3: formValues.streetTwo, // StreetTwo
        cellular: formValues.cellPhone,
      })
      if (this.props.router.location.query.addressId) {
        if (values.profileId === '123456') {
          this.updateGRAddressOnly = true
          this.props.updateAddressGR(values, this.props.router.location.query.addressId)
        } else {
          this.props.updateAddress(values, this.props.router.location.query.addressId)
        }
        this.routePage = true
        this.pageLoaded = false
      } else {
        if (values.profileId === '123456') {
          this.props.addAddress(values)
        } else {
          addAddressReq(values, (response) => {
            if (response && response.data && response.data.status && response.data.status.status
              && response.data.status.status.toLowerCase() === 'success') {
              values.ecommAddressId = response.data.addressId
              this.props.addAddress(values)
            } else {
              this.setState({
                Err: response && response.error && response.error.status,
              })
            }
          })
        }
        this.routePage = true
        this.pageLoaded = false
      }
    }
  }

  handleRoute = () => {
    // this.props.flushAddressSearch()
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventaddressinfo, { eventId: this.props.params.eventId }))
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

  componentDidMount = () => {
    this.props.getStateList()

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.keydownlistener, true)
    }
  }

  keydownlistener = (e) => { if (e.keyIdentifier === 'U+000A' || e.keyIdentifier === 'Enter' || e.keyCode === 13) { if (e.target.nodeName === 'INPUT' && e.target.type === 'text' && e.target.type !== 'textarea') { e.preventDefault(); return false } } }

  componentWillUnmount = () => {
    this.props.flushAddressSearch()

    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.keydownlistener, true)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.updateGRAddressOnly && !this.props.addressUpdatedGR && nextProps.addressUpdatedGR) {
      this.handleRoute()
    }
    if (this.props.addressUpdatedGR && !this.props.addressUpdated && nextProps.addressUpdated) {
      this.handleRoute()
    }
    if (!this.props.addressAdded && nextProps.addressAdded) {
      this.handleRoute()
    }
    if (!this.props.error && nextProps.error && nextProps.error.errorMessage) {
      this.setState({
        Err: nextProps.error,
      })
    } else if (!this.props.sepomexisError && nextProps.sepomexisError) {
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

  render() {
    const querySelected = this.props.router.location.query
    const { error, labels, stateList, formValues, eventAddresses, sepomexisError, addAddresses, addAddressLoading, addressSearchLoading, eventData } = this.props
    const { Err } = this.state
    const addressInputDisabled = (addAddressLoading || addressSearchLoading) && 'disabled'
    const errorMessage = this.props.addAddress && this.props.addAddress.error && this.props.addAddress.error.status

    if (eventAddresses && eventAddresses.deliveryAddressInfo && eventAddresses.deliveryAddressInfo.addresses) {
      const id = querySelected.addressId
      eventAddresses.deliveryAddressInfo.addresses.map((data) => {
        if ((data.addressId !== 'undefined') && (id !== 'undefined') && data.addressId === id) {
          this.userData = data
          return this.userData
        }
        return null
      })
    }

    let statesOptions; let municipalityOptions; let colonyOptions
    const celebId = ''
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
        // _StateOptions.labelResourceId = this.userData.state
        if (this.userData.state === appconfig.states.Distrito_Federal) {
          _StateOptions.labelResourceId = appconfig.states.Cdmx
        } else {
          _StateOptions.labelResourceId = this.userData.state
        }
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

        this.otherColony = this.otherColony !== '' ? this.userData.neighbourhood : ''

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
          // _StateOptions.labelResourceId = e.substr(index + 1)
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
    // condition for Selecciona Preferencia selection tab
    let SelectionOptions = ''
    if (eventAddresses && eventAddresses.deliveryAddressInfo && eventAddresses.deliveryAddressInfo.addresses && eventAddresses.deliveryAddressInfo.addresses[0] && eventAddresses.deliveryAddressInfo.addresses[0].celebMap && eventAddresses.deliveryAddressInfo.addresses[0].celebMap.length > 0) {
      SelectionOptions = []
      const id = querySelected.addressId
      if (id) {
        let celebrityName
        const _celebOptions = {}
        let celebrityId
        const addressList = eventAddresses.deliveryAddressInfo.addresses.filter(address => address.addressId === id)
        const celebrity = addressList[0].celebMap.filter((data, index) => {
          Object.keys(data).filter((key, index) => {
            if (key !== 'associated' && data.associated) {
              celebrityName = data[key]
              celebrityId = key
            }
          })
        })
        _celebOptions.value = celebrityId
        _celebOptions.option = celebrityName
        SelectionOptions.push(_celebOptions)
        this.celebId = celebrityId
      } else {
        const deliveryAddresses = eventAddresses && eventAddresses.deliveryAddressInfo
        const selectedCelebrities = []
        let isAddionalSelected = false
        if (deliveryAddresses && deliveryAddresses.addresses) {
          deliveryAddresses.addresses.map((data) => {
            const celebMap = data.celebMap
            celebMap.map((celebData) => {
              Object.keys(celebData).map((key) => {
                const selected = celebData.associated
                if (selected && key !== 'associated') {
                  selectedCelebrities.push(key)
                  const value = celebData[key]
                  if (value && value === '' || value.toLowerCase() === 'adicional'
                    || value.toLowerCase() === 'adicional') {
                    isAddionalSelected = true
                  }
                }
                return null
              })
              return null
            })
            return null
          })
          deliveryAddresses.addresses[0].celebMap.map((data) => {
            Object.keys(data).map((key) => {
              if (key !== 'associated') {
                const optionText = data[key]
                let disabled = selectedCelebrities.indexOf(key) > -1
                if (!disabled && isAddionalSelected && (optionText && optionText === '' || optionText.toLowerCase() === 'adicional'
                  || optionText.toLowerCase() === 'adicional')) {
                  disabled = true
                }
                const option = { option: optionText, value: key, disabled }
                SelectionOptions.push(option)
              }
              return null
            })
            return null
          })
        }
      }
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
                    <h1 className="titleSection">Agregar dirección</h1>
                    <h2 className="descriptiveTextSecond">La dirección se editará en la cuenta de Liverpool (key)</h2>
                  </div>
                </div>
                <div className="row addAddressForm">
                  <div className="col-xs-12">
                    <Form onSubmit={this.handleSubmit}>
                      {this.pageLoaded === false && Err && Err.errorMessage &&
                        <div className="row">
                          <div className="col-xs-12">
                            <div className="alertError" id="emailsDif"><i className="icon-tache2" />
                              <p>{Err.errorMessage}</p><a className="icon-tache2" id="cerrarMensaje" onClick={this.closeMessage} />
                            </div>
                          </div>
                        </div>
                      }
                      <p className="requiredFields"><sup>*</sup>Campos obligatorios</p>
                      <input type="hidden" name="ownerId" value={eventData && eventData.eventDetailsInfo && eventData.eventDetailsInfo.celebrityInfo[0] && eventData.eventDetailsInfo.celebrityInfo[0].repositoryId} />
                      <div className="row show-grid-row">
                        <div className="col-xs-5">
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
                        <div className="col-xs-5">
                          <p className="subtitle">Datos de entrega</p>
                          {SelectionOptions && <SelectionTab
                            id={'selectCeleb'}
                            name={'selectCeleb'}
                            options={SelectionOptions}
                            optionCaption={'Selecciona preferencia'}
                            value={this.celebId ? this.celebId : celebId || ''}
                            errors={errors}
                            disable={!!this.celebId}
                            validators={([
                              {
                                type: 'required',
                                errorMessage: 'Seleccione una opción',
                              },
                            ])}
                          />}

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
                            // onBlur={e => this.handleBlurOnPostalCode('postalCode', e)}
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
                            // onChange={e => this.handleBlurOnPostalCode('state', e)}
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
                            maxlength="30"
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
                              // onChange={e => this.handleBlurOnPostalCode('neighbourhood', e)}
                              value={this.municipalityId && this.municipalityId}
                              validators={([
                                {
                                  type: 'required',
                                  errorMessage: 'Seleccione una opción',
                                },
                              ])}
                            />
                          }


                          {(sepomexisError && !this.pageLoaded) || ((this.userData && !this.userData.neighbourhoodId) && !this.neighbourhoodId) ?
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
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value == '-2') {
                                    this.otherColony = ''
                                    this.setState({
                                      showOtherColony: true,
                                    })
                                  } else {
                                    this.otherColony = this.userData.neighbourhood
                                    this.setState({
                                      showOtherColony: false,
                                    })
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
                        <div className="col-xs-5">
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
                        <div className="col-xs-5">
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
                        <div className="col-xs-5">
                          <div style={{ display: 'none' }}>
                          <TextInput
                            value={this.userData && this.userData.particularPhoneCode ? this.userData.particularPhoneCode : '000'}
                            type="number"
                            htmlId="privatePhoneCode"
                            name="particularPhoneCode"
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
                            value={this.userData && this.userData.phoneNumber ? this.userData.phoneNumber : ''}
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
                            value={this.userData && this.userData.businessPhoneCode ? this.userData.businessPhoneCode : '000'}
                            type="number"
                            htmlId="officePhoneCode"
                            name="businessPhoneCode"
                            label=" Lada"
                            required="required"
                            maxlength={3}
                          />
                          <TextInput
                            value={this.userData && this.userData.businessPhoneNumber ? this.userData.businessPhoneNumber : '0000000000'}
                            type="number"
                            htmlId="telPhoneOffice"
                            name="telPhoneOffice"
                            label="Tel. oficina con Lada"
                            required="required"
                            maxlength={10}
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
                            validators={[{
                              type: 'required',
                              errorMessage: 'Ingresa una Teléfono',
                            }]}
                            errors={errors}
                          />
                          <textarea placeholder="Notas sobre dirección" maxLength="100" name="landmark" defaultValue={this.userData && this.userData.landmark ? this.userData.landmark : ''} style={{ display: 'none' }} />
                        </div>
                      </div>
                      <div className="row show-grid-row">
                        <div className="col-xs-3">
                          <button className="btnSecondaryAction size-Full cancelar" type="button" onClick={this.handleRoute}>Cancelar</button>
                        </div>
                        <div className="col-xs-3">
                          <button className="btnPrimaryAction size-Full saveDir" type="submit">Guardar</button>
                        </div>
                        <div className="col-xs-12" />
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>

    )
  }
}

export default AddNewAddress
