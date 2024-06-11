import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal'
import Datetime from 'lib/datetime/DateTime'
import Form from 'lib/ZUILib/Form'
import appconfig from '../../../../../../config/appconfig'
import moment from 'moment'
import commonUtil from '../../../../../../utils/commonUtil'

@connect(
  store => ({
    eventDisplayStatus: store.header && store.header.eventDisplayStatus,
    eventCategories: store.createevent && store.createevent.eventCategories,
    eventDetailsInfo: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : null,
  }),
  {},
)
class SuspendEventModal extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false,
      showDateRange: false,
      disableSubmit: true,
      errors: '',
      selEventDate: '',
    }
  }

  handleClose() {
    document.body.classList.remove('modal-open')
    this.setState({ show: false, showDateRange: false, disableSubmit: false, errors: '', selEventDate: '' })
    this.props.setCurrentStatus()
  }

  handleShow() {
    document.body.classList.add('modal-open')
    this.setState({ show: true })
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  handleRadioChange = (e) => {
    if (e.target.value === 'suspendUndefined') {
      this.setState({ showDateRange: false, disableSubmit: false })
    } else {
      this.setState({ showDateRange: true, disableSubmit: false })
    }
  }

  handleSuspendAccept = (e, values, formErrors, isValidForm) => {
    e.preventDefault()
    let params = {}

    this.setState({
      ...this.state,
      errors: formErrors,
    })
    if (isValidForm) {
      const formId = e.target.id
      const fvalues = values[formId]
      const statusobj = appconfig.eventStatusCodes
      if (this.state.showDateRange) {
        params = {
          selectedEventStatus: statusobj.suspended,
          isSuspendedForPeriod: 'true',
          suspensionInfo: {
            eventDate: fvalues.eventDate,
            range: {
              startDate: fvalues.dateFrom != '' ? fvalues.dateFrom.split('-')[0].trim() : fvalues.dateFrom,
              endDate: fvalues.dateFrom != '' ? (fvalues.dateFrom.split('-')[1] != undefined ? fvalues.dateFrom.split('-')[1].trim() : fvalues.dateFrom.split('-')[0].trim()) : fvalues.dateFrom,
            },
          },
        }
      } else {
        params = {
          selectedEventStatus: statusobj.suspended,
          isSuspendedForPeriod: 'false',
        }
      }
      this.props.onSuspendAccept(params)
    }
  }

  render() {
    const dateFrom = {
      input: true,
      timeFormat: false,
      closeOnSelect: true,
      range: true,
      formId: 'suspendEventForm',
      dateFormat: 'DD/MM/YYYY',
      name: 'dateFrom',
      // isValidDate: current => (current.isAfter(moment().subtract(1, 'day')) && current.isBefore(this.state.selEventDate)),
      placeholder: 'Rango de suspensión del evento',
      validators:
        [
          {
            type: 'dateFormat',
            errorMessage: 'Ingrese la fecha en el siguiente formato: DD/MM/YYYY',
            format: 'DD/MM/YYYY',
          }, {
            type: 'isRangeValid',
            errorMessage: 'ingrese rango válido',
            from: moment().subtract(1, 'day'),
            to: this.state.selEventDate,
          },
        ],
    }

    const { eventDetailsInfo, eventCategories } = this.props;
    const eventDate = eventDetailsInfo && eventDetailsInfo.eventDate;
    const creationDate = moment();
    const eventType = eventDetailsInfo && eventDetailsInfo.eventType;
    let minDays = -1;
    let maxDays = eventType ? commonUtil.getPropertyValueByEventType(eventType, 'maxDays', eventCategories) : undefined;
    minDays = minDays && minDays > 0 ? minDays - 1 : 0;
    const minDate = minDays === 0 ? moment(creationDate) : moment(creationDate).add(minDays, 'day');
    const maxDate = maxDays === 0 ? moment(creationDate) : moment(creationDate).add(maxDays, 'day');
    maxDays = maxDays ? maxDays + minDays : minDays;

    const eventDateProps = {
      input: true,
      timeFormat: false,
      closeOnSelect: true,
      dateFormat: 'DD/MM/YYYY',
      formId: 'suspendEventForm',
      name: 'eventDate',
      placeholder: 'Fecha del evento',
      validators:
        [
          {
            type: 'required',
            errorMessage: 'Ingresa el remitente / clientea',
          }, {
            type: 'isAfter',
            errorMessage: 'ingresa fecha de válida',
            from: moment(),
          }, {
            type: 'isBefore',
            errorMessage: 'Ingresa fecha de válida',
            to: moment(creationDate).add(maxDays, 'day')
          }, {
            type: 'dateFormat',
            errorMessage: 'Ingrese la fecha en el siguiente formato: DD/MM/YYYY',
            format: 'DD/MM/YYYY',
          },
        ],
      isValidDate: (current) => {
        return (current.isAfter(minDate) && current.isBefore(maxDate));
      },
    }
    const { errors } = this.state
    return (
      <React.Fragment>
        {
          this.state.show &&
          <Modal id="suspendModal" className="suspendModal modal fade modal-custom" show={this.state.show}>
            <ModalHeader closeButton="" handleClose={this.handleClose}>
              ¿Selecciona el tipo de suspensión?
                        </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleSuspendAccept} id="suspendEventForm">
                <div className="radio">
                  <input id="radio1-sm" onChange={e => this.handleRadioChange(e)} type="radio" name="optionsRadios" defaultValue="suspendUndefined" />
                  <label htmlFor="radio1-sm">Tiempo indefinido</label>
                </div>
                <div className="radio">
                  <input id="radio2-sm" onChange={e => this.handleRadioChange(e)} type="radio" name="optionsRadios" defaultValue="suspendByPeriod" />
                  <label htmlFor="radio2-sm" data-option="period">Suspención programada por periodo</label>
                </div>
                {this.state.showDateRange &&
                  <React.Fragment>
                    <div className="calendarContent" style={{ display: 'block' }}>
                      <Datetime
                        {...eventDateProps}
                        onChange={(val) => {
                          this.setState({
                            selEventDate: val,
                          })
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="calendarContent" style={{ display: 'block' }}>
                      <Datetime
                        {...dateFrom}
                        errors={errors}
                        isValidDate={(current, firstDate) => current.isAfter(moment().subtract(1, 'day')) && current.isBefore(this.state.selEventDate)}
                        closeOnSelect
                      />
                    </div>
                  </React.Fragment>
                }
                <button disabled={this.state.disableSubmit || this.props.changeEventStatusLoading} className="btnPrimary size-Full">Aceptar</button>
              </Form>
            </ModalBody>
          </Modal>
        }
      </React.Fragment>
    )
  }
}
export default SuspendEventModal
