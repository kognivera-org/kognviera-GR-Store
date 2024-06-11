import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from '../../../lib/ZUILib/Modal';
import Form from '../../../lib/ZUILib/Form';
import TextInput from '../../../lib/ZUILib/TextInput';
import { connect } from 'react-redux';
import commonUtil from '../../../utils/commonUtil'

@connect(
    store => ({
        labels: store.labels.labels,
        saveFavoriteReportsErrorsPopup: store.reports.saveFavoriteReportsErrorsPopup
    })
)
export default class SaveFevConfirmationModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.formSubmitted = false;
        this.state = {
            show: false,
            onLoadPopupErrorMsg: false
        };
    }
    handleClose() {
        this.setState({ show: false, onLoadPopupErrorMsg: false, errors: null });
    }

    handleShow() {
        this.formSubmitted = false;
        this.setState({ show: true });
        //this.props.saveFavoriteReportsErrorsPopup = {};
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    componentWillReceiveProps(nextProps) {
        if (this.formSubmitted) {
            if (!nextProps.saveFavoriteReportsErrorsPopup.errorMessage) {
                this.handleClose();
            } else {
                this.setState({ onLoadPopupErrorMsg: true });
            }
        }
    }
    closeSaveFevConfirmPopup = () => {
        this.handleClose();
        //this.props.router.go(-1);
    }
    onSaveFevConfirmClick = (formValues) => {
        this.props.onSaveFevConfirmClick(formValues);
        //this.handleClose();
    }
    handleSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault();

        this.setState({
            ...this.state,
            errors: formErrors
        })
        if (isValidForm) {
            e.target.reset();
            this.formSubmitted = true;
            this.onSaveFevConfirmClick(formValues);
        }
    }

    hideErrorMessage = () => {
        this.setState({
            onLoadPopupErrorMsg: false
        })
    }

    componentDidUpdate = () => {
        commonUtil.errorScrollUp();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} id="saveFevConfirmationModal" className="modal fade modal-custom" content={"modal-sm"}>

                <ModalBody>
                    <button onClick={this.closeSaveFevConfirmPopup} className="close" type="button" data-dismiss="modal">×</button>
                    <ModalTitle>GUARDAR COMO FAVORITO</ModalTitle>
                    <Form onSubmit={this.handleSubmit}>

                        {this.props.saveFavoriteReportsErrorsPopup.errorMessage && this.state.onLoadPopupErrorMsg &&
                            <div className="col-xs-12" >
                                <div className="alertError"><i className="icon-tache2" />
                                    <p > {this.props.saveFavoriteReportsErrorsPopup.errorMessage && this.state.onLoadPopupErrorMsg ? this.props.saveFavoriteReportsErrorsPopup.errorMessage : ''}</p><a className="icon-tache2" onClick={this.hideErrorMessage} />
                                </div>
                            </div>
                        }
                        {/* <div className="col-xs-12" style={this.props.saveFavoriteReportsErrorsPopup.errorMessage && this.state.onLoadPopupErrorMsg ? { display: 'block' } : { display: 'none' }}>
                            <div className="alertError"><i className="icon-tache2" />
                                <p > {this.props.saveFavoriteReportsErrorsPopup.errorMessage && this.state.onLoadPopupErrorMsg ? this.props.saveFavoriteReportsErrorsPopup.errorMessage : ''}</p><a className="icon-tache2" />
                            </div>
                        </div> */}
                        <div className="col-xs-12">
                            <TextInput
                                className="inputMaterial"
                                labelClassName="placeHolderMaterial"
                                divClassName="materialStyle reduceLine"
                                htmlId="nombre"
                                name="nombre"
                                label="Ingresa un nombre"
                                type="text"
                                required="required"
                                //placeholder="Dilisa card number"
                                star="*"
                                validators={[{
                                    type: 'required',
                                    errorMessage: 'Ingrese el nombre'
                                }, {
                                    type: 'custom',
                                    errorMessage: 'Ingrese un nombre válido',
                                    pattern: '^[0-9a-zA-ZÁÉÍÓÚÜÑáéíñóúü\\- ]+$',
                                }]}
                                //pattern={/[a-zA-Z0-9- ]+/}
                                errors={this.state.errors}
                                onChange={
                                    () => {
                                        this.setState({
                                            ...this.state,
                                            errors: null
                                        });
                                    }
                                }
                            />
                        </div>
                        <div className="row show-grid-row">
                            <div className="col-xs-6">
                                <button onClick={this.closeSaveFevConfirmPopup} className="btnSecondaryAction size-Full">Cancelar</button>
                            </div>
                            <div className="col-xs-6">
                                <button type="submit" className="btnPrimaryAction size-Full" data-dismiss="modal">Guardar</button>
                            </div>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        );
    }
}
