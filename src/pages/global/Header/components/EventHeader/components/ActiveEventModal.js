import React, { Component } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal'
import Datetime from 'lib/datetime/DateTime'
import Form from 'lib/ZUILib/Form'
import appconfig from '../../../../../../config/appconfig'
import moment from 'moment'
import { connect } from 'react-redux'
import commonUtil from '../../../../../../utils/commonUtil'

@connect(
  store => ({
    eventCategories: store.createevent && store.createevent.eventCategories,
    eventDetailsInfo: store.eventdashboard && store.eventdashboard.eventData && store.eventdashboard.eventData.eventDetailsInfo
  })
)
class ActiveEventModal extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false,
      error: '',
    }
  }

  handleClose() {
    document.body.classList.remove('modal-open')
    this.setState({ show: false, errors: '' })
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

  handleAccept = (e, values, formErrors, isValidForm) => {
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
      params = {
        selectedEventStatus: statusobj.active,
        isSuspendedForPeriod: 'false',
        newEventDate: fvalues.eventDate,
      }
      this.props.onActivateAccept(params)
    }
  }

  render() {

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
      name: 'eventDate',
      placeholder: 'Fecha del evento',
      formId: 'activateEventForm',
      isValidDate: (current) => {
        return (current.isAfter(minDate) && current.isBefore(maxDate));
      },
      validators: [
        {
          type: 'required',
          errorMessage: 'Ingresa fecha del evento',
        }, {
          type: 'isAfter',
          errorMessage: 'Ingresa fecha de válida',
          from: moment(creationDate).add(minDays, 'day')
        }, {
          type: 'isBefore',
          errorMessage: 'Ingresa fecha de válida',
          to: moment(creationDate).add(maxDays, 'day')
        }, {
          type: 'dateFormat',
          errorMessage: 'Ingrese la fecha en el siguiente formato: DD/MM/YYYY',
          format: 'DD/MM/YYYY',
        },
      ]
    }

    const { errors } = this.state
    return (
      <React.Fragment>
        {
          this.state.show &&
          <Modal id="suspendModal" className="suspendModal modal fade modal-custom" show={this.state.show}>
            <ModalHeader closeButton="" handleClose={this.handleClose}>
              ¿Quien solicita el ingreso a este evento?
                        </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleAccept} id="activateEventForm">
                <Datetime
                  {...eventDateProps}
                  errors={errors}
                />
                <button disabled={this.props.changeEventStatusLoading} className="btnPrimary size-Full">Aceptar</button>
              </Form>
            </ModalBody>
          </Modal>
        }
      </React.Fragment>
    )
  }
}
export default ActiveEventModal
