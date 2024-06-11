import React, { Component } from 'react';
import TextInput from 'lib/ZUILib/TextInput';
import Form from 'lib/ZUILib/Form';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import moment from 'moment';
import Datetime from '../../../../../lib/datetime/DateTime';

class EliminatePurchaseTicketModal extends Component {
    componentWillMount = () => {
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
        document.body.classList.remove('modal-open');
        this.sendDisabled = false;
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
        });
        if (isValidForm) {
            this.sendDisabled = true;
            this.props.onRemoveTicket(values1);
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
        const { errors } = this.state;
        const { caller, event } = this.props;
        let startDate = event && event.additionalInfo && moment(event.additionalInfo.creationDate, 'DD/MM/YYYY').subtract(1, 'day');
        const empresaEditTextProps = {
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
        const tiendaEditTextProps = {
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
        const terminalEditTextProps = {
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
        const boletaEditTextProps = {
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
        let rcEditTextProps = {
            className: 'inputMaterial',
            type: 'text',
            name: 'purchaserName',
            label: 'Remitente / Cliente',
        }
        if (caller === 'RegaloRecibidos') {
            rcEditTextProps = {
                ...rcEditTextProps,
                validators:
                    [
                        {
                            type: 'required',
                            errorMessage: 'Ingresa un cliente',
                        }
                    ]
            }
        }
        const dateFormat = {
            input: true,
            timeFormat: false,
            closeOnSelect: true,
            dateFormat: "DD/MM/YYYY",
            name: 'purchaseDate',
            range: false,
            isValidDate:
                function (current) {
                    return current.isAfter(startDate)
                }
            ,
            validators:
                [
                    {
                        type: 'required',
                        errorMessage: 'Ingresa una fecha',
                    }
                ]
        }

        return (
            <React.Fragment>
                {this.state.show &&
                    <Modal content="w300" show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom" role="dialog" id="modalEliminarBoleta">
                        <ModalHeader className="modal-header" closeButton handleClose={this.handleClose}>
                            <ModalTitle className="modal-title">ELIMINAR BOLETA</ModalTitle>
                        </ModalHeader>
                        <ModalBody className="modal-body">
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
                                        <TextInput {...empresaEditTextProps} errors={errors} />
                                        <TextInput {...tiendaEditTextProps} errors={errors} />
                                        <TextInput {...terminalEditTextProps} errors={errors} />
                                        <TextInput {...boletaEditTextProps} errors={errors} />
                                        <Datetime
                                            {...dateFormat}
                                            errors={errors}
                                        />
                                        <TextInput {...rcEditTextProps} errors={errors} />
                                        <button disabled={this.sendDisabled} className="btnDelete size-Full" type="submit">Eliminar</button>
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

export default EliminatePurchaseTicketModal;
