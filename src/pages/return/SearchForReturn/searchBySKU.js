import React, { Component } from 'react';
import { connect } from 'react-redux';
import routeconfig from 'config/routeconfig';
import { getInitiateReturnList } from '../actions'
import Form from '../../../lib/ZUILib/Form';
import TextInput from '../../../lib/ZUILib/TextInput';

@connect(
    store => ({
        loadingData: store.returnAndRefund.loadingData
    }), { getInitiateReturnList }
)

class SearchBySKU extends Component {
    constructor(props) {
        super(props);
        this.renderInitiateReturnList = [];
        this.initiateReturnList = [];
        this.skuErrorMessage = '';
        this.loadingSearchSKUData = false;
        this.isValidForm = false;
        this.isFormValueSKUTyped = false;
        this.isFormValueQtyTyped = false;
        this.sessionInvalidate = true;
    }
    state = {
        errors: '',
        skuError: 0,
        classNameForSubmit: []
        //classNameForSubmit: ["btnPrimaryDisable"]
    }

    addValidSKU = (data) => {
        // if ((!data.skuId) || (!data.quantity)) return false;

        return (
            <div className="row show-grid-row" key={data.key}>
                <div className="col-xs-4">
                    <div className="row">
                        <div className="col-xs-6">
                            <p className="informativeTextSecond">SKU: {data.skuId}</p></div>
                        <div className="col-xs-6">
                            <p className="informativeTextSecond">Cantidad: {data.quantity}</p>
                        </div>
                    </div>
                </div>
            </div>);
    }

    handleSubmit = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault();
        if ((formErrors.quantity == '') || (formErrors.sku == '') || (formValues.quantity == 0)) {
            formErrors.sku = this.skuErrorMessage;
            isValidForm = false;
        }
        this.isValidForm = isValidForm;

        this.setState({
            ...this.state,
            errors: formErrors
        })
        if (isValidForm) {
            this.loadingSearchSKUData = true;

            const searchData = {
                skuId: formValues.sku,
                quantity: formValues.quantity
            }
            this.initiateReturnList.push(searchData);
            this.renderInitiateReturnList.push(this.addValidSKU({
                ...searchData,
                key: Date.now()
            }));

            e.target[0].value = '';
            e.target[1].value = '';

            this.setState({
                skuError: 0,
                classNameForSubmit: []
            });

        } else {

            this.loadingSearchSKUData = false;

            if (((formValues.quantity == '') && (formValues.sku == '') && (formValues.quantity == 0)) && this.initiateReturnList.length) {
                this.isValidForm = true;
            } else {
                this.setState({
                    skuError: 1,
                    classNameForSubmit: []
                    //classNameForSubmit: ["btnPrimaryDisable"]
                });
            }

            // const tempObj = {
            //     skuError: 1,
            //     classNameForSubmit: ["btnPrimaryDisable"]
            // };
            // this.initiateReturnList.length > 0 ? (tempObj.classNameForSubmit = []) : (tempObj.classNameForSubmit = ["btnPrimaryDisable"])
            // this.setState(tempObj);
        }
    }
    requestReturn = (e) => {
        var a = this.formToSubmit.dispatchEvent(new Event('submit', { cancelable: true }));

        if (this.isValidForm && this.initiateReturnList.length) {
            this.props.getInitiateReturnList(this.initiateReturnList, this.props.eventId, this.sessionInvalidate.toString());
            this.isFormValueQtyTyped = false;
            this.isFormValueSKUTyped = false;
            this.sessionInvalidate = false;
            //console.log("this.sessionInvalidate>>>>>>>", this.sessionInvalidate);
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (!this.props.loadingData && this.loadingSearchSKUData) {
            this.setState({
                //classNameForSubmit: []
                classNameForSubmit: ["btnPrimarySpecialDisable"]
            });
            //this.sessionInvalidate = false;
            //  console.log("this.sessionInvalidate >>>>>> componentWillReceiveProps", this.sessionInvalidate);
        } else {
            this.initiateReturnList = [];
            this.renderInitiateReturnList = [];
            this.loadingSearchSKUData = false;
            this.setState({
                //classNameForSubmit: []
                classNameForSubmit: ["btnPrimarySpecialDisable"]
            });

            //  console.log("this.sessionInvalidate >>>>>> componentWillReceiveProps elseeeeeeeeee", this.sessionInvalidate);
        }

    }

    checkDisabledStatusSKU = (e) => {
        if (e.target.value) {
            this.isFormValueSKUTyped = true;
            if (this.isFormValueQtyTyped) {
                this.setState({
                    classNameForSubmit: []
                    //classNameForSubmit: ["btnPrimaryDisable"]
                });
            }
        } else {
            this.isFormValueSKUTyped = true;
        }
    }

    checkDisabledStatusQty = (e) => {
        if (e.target.value && e.target.value > 0) {
            this.isFormValueQtyTyped = true;

            if (this.isFormValueSKUTyped) {
                this.setState({
                    classNameForSubmit: []
                    //classNameForSubmit: ["btnPrimaryDisable"]
                });
            }
        } else {
            this.isFormValueQtyTyped = true;
        }
    }

    render() {
        const { show } = this.props;

        return (
            <div className="row show-grid-row non-printable exclude-for-print-download" style={{ display: (show == 1) ? 'block' : 'none' }}>

                <div className="row show-grid-row">
                    <div className="col-xs-6">
                        <h2 className="titleModule">Búsqueda por SKU</h2>
                    </div>
                    <div className="col-xs-6 alignRight"><span className="requiredFields">* Campos obligatorios</span></div>
                </div>
                <div className="skuSearchWrap">
                    {this.renderInitiateReturnList}
                </div>
                <div className="row show-grid-row">
                    <Form onSubmit={this.handleSubmit} onRef={(formToSubmit) => { this.formToSubmit = formToSubmit }}>
                        <div className="col-xs-2">
                            <div className="formBlock">
                                <div className="materialStyle">
                                    <TextInput value=""
                                        className="skuAdd inputMaterial"
                                        labelClassName="placeHolderMaterial"
                                        divClassName="materialStyle reduceLine"
                                        htmlId="sku"
                                        name="sku"
                                        label="Escribe SKU"
                                        type="number"
                                        required="required"
                                        star="*"
                                        validators={[{
                                            type: 'required',
                                            errorMessage: this.skuErrorMessage
                                        }]}
                                        onChange={this.checkDisabledStatusSKU}
                                        errors={this.state.errors}
                                    />
                                </div>
                                <span id="sku-error" className="error" style={{ display: (this.state.skuError == 1) ? 'block' : 'none' }}>Ingresa los datos para obtener resultado</span>
                            </div>
                        </div>

                        <div className="col-xs-1">
                            <div className="formBlock">
                                <div className="materialStyle">
                                    <TextInput value=""
                                        className="quantityAdd inputMaterial"
                                        labelClassName="placeHolderMaterial labelText"
                                        divClassName="materialStyle reduceLine"
                                        htmlId="sku1"
                                        name="quantity"
                                        label="Cantidad"
                                        type="number"
                                        required="required"
                                        star="*"
                                        maxlength="3"
                                        validators={[{
                                            type: 'required',
                                            errorMessage: '',
                                        }]}
                                        onChange={this.checkDisabledStatusQty}
                                        errors={this.state.errors}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-1">
                            <button type="submit" className="btn-addMore" style={{backgroundColor: "#E10098"}} >+</button>
                        </div>
                    </Form>
                </div >
                <div className="col-xs-4">
                    <button type="buttton" onClick={(e) => { this.requestReturn(e) }} className={["btnPrimarySpecial size-Full showResult"] + " " + this.state.classNameForSubmit}>Buscar</button>
                </div>

            </div >
        )
    }
}

export default SearchBySKU;