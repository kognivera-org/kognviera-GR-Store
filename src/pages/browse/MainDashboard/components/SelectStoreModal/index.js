import React, { Component } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal'
import { connect } from 'react-redux'
import { getStateList, getStorelist } from './actions'
import Datetime from 'lib/datetime/DateTime'
import SelectionTab from '../../../../../lib/ZUILib/SelectionTab'
import commonUtil from '../../../../../utils/commonUtil'
import appconfig from '../../../../../config/appconfig'

@connect(
  store => ({
    states: store.selectStore.data && store.selectStore.data.stateListInfo,
    stores: store.selectStore.data && store.selectStore.data.storeListInfo,
    error: store.selectStore.error,
    saved: store.selectStore.saved,
    storeBrandName: store.selectStore.storeBrandName,
    savedStoreId: store.selectStore.savedStoreId,
  }),
  {
    getStateList,
    getStorelist,
  },
)

class SelectStoreModal extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.pageLoad = true
    this.stateId = ''
    this.state = {
      show: false,
      stateId: null,
      storeId: null,
    }
  }
  handleClose() {
    this.setState({ show: false })
  }

  handleShow() {
    this.setState({ show: true })
  }

  componentWillMount() {
    this.props.getStateList()
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.saved) {
      this.handleClose()
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('storeId', nextProps.savedStoreId)
        const user = JSON.parse(window.localStorage.getItem('user')) || {}
        user.brandName = nextProps.storeBrandName
        window.localStorage.setItem('user', JSON.stringify(user))
      }
    }
  }

  selectStore = (e) => {
    this.setState({
      storeId: e.target.value,
    })
  }

  handleStateChange = (e) => {
    this.stateId = e.target.value
    const values = {
      stateId: e.target.value,
    }
    this.props.getStorelist(values)
    if (this.state.showStateError || this.state.showStoreError) {
      this.setState({ showStateError: false, showStoreError: false })
    }
  }

  submitStore = () => {
    this.pageLoad = false
    let updatedState = { showStateError: false, showStoreError: false }
    if (!this.stateId) {
      updatedState = { ...updatedState, showStateError: true }
    }
    if (!this.state.storeId) {
      updatedState = { ...updatedState, showStoreError: true }
    }
    this.setState(updatedState)
    this.state.storeId && this.props.saveStore(this.state.storeId)
  }
  componentDidUpdate = () => {
    commonUtil.errorScrollUp()
  }
  render() {
    const stateListInfo = this.props.states
    const storeListInfo = this.props.stores

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

    const error = this.props.error
    return (
      <div>
        <Modal show={this.state.show} onHide={this.handleClose} id="storeModal" className="searchEventModal modal fade">
          <ModalBody>
            {/* <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> */}
            <h4>SELECCIONA UNA TIENDA</h4>
            {
              error && error.errorMessage &&
              <div className="alertError">
                <i className="icon-tache2" />
                <p>{error.errorMessage.message
                  ? error.errorMessage.message
                  : error.errorMessage}</p>
              </div>
            }
            <p>¿A que tienda se asocia el movimiento a realizer?</p>
            <p className="requiredLabel">*campos obligatorios</p>

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
            />

            {this.state.showStateError && !this.pageLoad && <label id="storeIdDropdown-error" className="error" htmlFor="storeIdDropdown">Seleccione una opción</label>}
            {
              storeListInfo &&
              <div>
                <div className="cSelect required">
                  <select name="storeIdDropdown" onClick={this.selectStore}>
                    <option selected="true" disabled="disabled" value="">Selecciona una tienda</option>
                    {
                      storeListInfo &&
                      Object.keys(storeListInfo).map((key, index) => <option key={key} value={key}>{storeListInfo[key]}</option>)
                    }
                  </select><i className="icon-flecha_light_abajo" />
                </div>
                {this.state.showStoreError && !this.pageLoad &&
                  <label id="storeIdDropdown-error" className="error" htmlFor="storeIdDropdown">Seleccione una opción </label>
                }
              </div>
            }
            <button onClick={this.submitStore} className="btnPrimary size-Full">Aceptar</button>
          </ModalBody>
        </Modal>
      </div>
    )
  }

}
export default SelectStoreModal
