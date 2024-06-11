import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import Datetime from 'lib/datetime/DateTime'
import Form from '../../../../lib/ZUILib/Form';
import { getEventCategories } from '../../../createevent/actions'
import { connect } from 'react-redux'
import commonUtil from '../../../../utils/commonUtil'
import moment from 'moment';

@connect(
    store => ({
        eventCategories: store.createevent.eventCategories,
    }),
    { getEventCategories },
)

class EventDateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    componentDidMount() {
        this.props.onRef(this)
        if (!this.props.eventCategories) {
            this.props.getEventCategories();
        }
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    handleAccept = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault();

        let formId = e.target.id;
        if (isValidForm) {
            const values = formValues[formId];
            this.props.setEventdate(values.eventDate);
            this.handleClose();
        }
    }

    render() {
        const { eventDate, creationDate } = this.props;
        const isAfterDate = creationDate && moment(creationDate, 'DD/MM/YYYY').subtract(1, 'day');
        const dateFormat = {
            input: true,
            name: 'eventDate',
            className: 'detailInfo',
            timeFormat: false,
            viewDate: moment(),
            closeOnSelect: true,
            dateFormat: 'DD/MM/YYYY',
            defaultValue: eventDate,
            isValidDate: (current) => {
                return current.isAfter(isAfterDate);
            },
            validators: [
                {
                    type: 'required',
                    errorMessage: 'ingresa fecha del evento',
                }, {
                    type: 'isAfter',
                    errorMessage: 'ingresa fecha de válida',
                    from: isAfterDate
                }
            ],
        }
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose} id="PrintGralInfo" className="modal fade modal-custom">
                    <ModalBody>
                        <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4>Fecha del evento</h4>
                        <p>El cambio de fecha puede generar un cambio de estatus, es importante verificar las reglas de estatus.</p>

                        <Form id="dateoftheevent" onSubmit={this.handleAccept}>

                            <React.Fragment>
                                <div className="calendarContent" style={{ display: 'block' }}>
                                    <Datetime
                                        {...dateFormat}
                                        //errors={errors}
                                        nodropdown={true}
                                        open={true}
                                        closeOnSelect={false}
                                    />
                                </div>
                            </React.Fragment>
                            <button onClick={this.handleClose} className="btnSecondaryAction size-Medium" type="button" data-dismiss="modal">Cancelar</button>
                            <button className="btnPrimaryAction size-Medium dateChange">Aceptar</button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
export default EventDateModal;