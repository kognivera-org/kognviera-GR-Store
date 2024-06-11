import React, { Component } from 'react';
import TextInput from '../../../../../lib/ZUILib/TextInput'
import Form from '../../../../../lib/ZUILib/Form'
import Button from '../../../../../lib/ZUILib/Button'
import { getLabels } from '../../../../global/Labels/actions'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../../../lib/ZUILib/Modal';
import moment from 'moment';

import Datetime from 'lib/datetime/DateTime';
@connect(
    store => ({
        labels: store.labels.labels
    }),
    { getLabels }
)
class NewMessageModal extends Component {
    componentWillMount = () => {
        this.props.getLabels()
    }
    state = {
        values: {},
        errors: {},
    }
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
            error: ''
        };
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    handleShow(product, eventid) {
        this.setState({
            show: true,
            errors: {}
        });
    }
    handleClose() {
        this.sendDisabled = false;
        document.body.classList.remove('modal-open');
        this.setState({
            show: false,
            error: '',
            errors: {}
        });
    }
    sendDisabled = false;
    handleSubmit = (e, values, formErrors, isValidForm) => {
        e.preventDefault();
        let values1 = {
            ...values,
            'brand': this.props.brand,
        }
        this.setState({
            ...this.state,
            errors: formErrors
        })
        if (isValidForm) {
            this.sendDisabled = true;
            this.props.onAddTicket(values1);
        }

    }
    handleError(errorMsg) {
        this.setState({
            error: errorMsg
        })
    }
    handleCloseError = () => {
        this.setState({
            error: ''
        })
    }
    render() {
        let { caller, labels, event } = this.props;
        let startDate = event && event.additionalInfo && moment(event.additionalInfo.creationDate, 'DD/MM/YYYY').subtract(1, 'day');
        // let endDate = event && moment(event.eventDate, 'DD/MM/YYYY').add(1, 'day');
        const empresaTextProps = {
            className: 'inputMaterial',
            type: 'text',
            required: 'required',
            name: 'empresaId',
            label: 'Ingresa empresa',
            validators:
                [
                    {
                        type: 'required',
                        errorMessage: 'Ingresa una empresa',
                    }
                ]
        }
        const tiendaTextProps = {
            className: 'inputMaterial',
            type: 'text',
            required: 'required',
            name: 'tiendaNumber',
            label: 'Ingresa tienda',
            validators:
                [
                    {
                        type: 'required',
                        errorMessage: 'Ingresa una tienda',
                    }
                ]
        }
        const terminalTextProps = {
            className: 'inputMaterial',
            type: 'text',
            required: 'required',
            name: 'terminalNumber',
            label: 'Terminal',
            validators:
                [
                    {
                        type: 'required',
                        errorMessage: 'Ingresa una terminal',
                    }
                ]
        }
        const boletaTextProps = {
            className: 'inputMaterial',
            type: 'text',
            required: 'required',
            name: 'boletaNumber',
            label: 'Boleta',
            validators:
                [
                    {
                        type: 'required',
                        errorMessage: 'Ingresa la boleta',
                    }
                ]
        }

        let rcTextProps = {
            className: 'inputMaterial',
            type: 'text',
            name: 'purchaserName',
            label: 'Remitente / Cliente',
            required: 'required',
        }
        if (caller === 'RegaloRecibidos') {
            rcTextProps = {
                ...rcTextProps,
                validators:
                    [
                        {
                            type: 'required',
                            errorMessage: 'Ingresa un cliente',
                        }
                    ]
            }
        }
        const giftListManagement = labels ? labels.giftListManagement : null;
        const dateFormat = {
            input: true,
            timeFormat: false,
            closeOnSelect: true,
            // range: true,
            range: false,
            isValidDate:
                function (current) {
                    return current.isAfter(startDate)
                }
            ,
            placeholder: 'Fecha de compra',
            dateFormat: "DD/MM/YYYY",
            name: 'purchaseDate',
            validators:
                [
                    {
                        type: 'required',
                        errorMessage: 'Ingresa una fecha',
                    }
                ]
        }
        const { errors } = this.state;
        return (
            <React.Fragment>
                {this.state.show &&
                    <Modal content="w300" show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom" id="modalNuevaBoleta" role="dialog">
                        <ModalHeader className="modal-header" closeButton handleClose={this.handleClose}>
                            <ModalTitle className="modal-title">AGREGAR BOLETA</ModalTitle>
                        </ModalHeader>

                        <ModalBody>
                            <div className="row">
                                {this.state.error !== '' &&
                                    <div className="col-xs-12 mb-5">
                                        <div className="danger-alert">
                                            <div className="red"><i className="icon-tache2"></i></div>
                                            <div className="message">
                                                <p>{this.state.error}</p>
                                            </div>
                                            <div className="close-alert">
                                                <div className="close-btn" onClick={this.handleCloseError}><a className="icon-tache2 btn-white"></a></div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="col-xs-12">
                                    <Form onSubmit={this.handleSubmit} onRef={ref => this.form = ref}>
                                        <TextInput {...empresaTextProps} errors={errors} />
                                        <TextInput {...tiendaTextProps} errors={errors} />
                                        <Datetime
                                            {...dateFormat}
                                            errors={errors}
                                        />
                                        <TextInput {...terminalTextProps} errors={errors} />
                                        <TextInput {...boletaTextProps} errors={errors} />
                                        <TextInput {...rcTextProps} errors={errors} />
                                        <Button disabled={this.sendDisabled} uiname="RecibidosWriteNewMessage" className="btnPrimary size-Full" type="submit">Aceptar</Button>
                                        <button onClick={this.handleClose} className="btnSecondaryAction size-Full marginTop15" data-dismiss="modal">Cancelar</button>
                                    </Form>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>}
            </React.Fragment>
        )
    }
}

export default NewMessageModal;
