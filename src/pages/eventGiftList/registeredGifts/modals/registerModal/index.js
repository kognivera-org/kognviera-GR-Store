import React, { Component } from 'react'
import Form from '../../../../../lib/ZUILib/Form';
import { Modal, ModalBody } from '../../../../../lib/ZUILib/Modal';
import SelectionTab from '../../../../../lib/ZUILib/SelectionTab';
// import SelectionTab from '../../../../../components/SelectionTabMore/SelectionTab'
import TextInput from '../../../../../lib/ZUILib/TextInput';

class RegisterModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.processing = false;
    this.state = {
      show: false,
      errorMsg: ''
    };
  }
  showError = '';
  componentWillReceiveProps(nextProps) {
    // if (nextProps && nextProps.registeredGiftList && nextProps.registeredGiftList.addedBySkuItem) {
    //   this.handleClose();
    //   this.props.handleSucessModal();
    // }
  }

  handleSubmit = (e, formValues, formErrors, isValidForm) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      errors: formErrors,
    });
    const formId = e.target.id;
    if (isValidForm && !this.processing) {
      this.processing = true;
      const values = formValues[formId];
      this.props.submitAddSkuItem(values, this.callBackSuccessModal);
      // this.props.submitAddSkuItem(values, this.callBackSuccessModal); // formValues.email, formValues.password)
    }
  }
  callBackSuccessModal = (response) => {
    this.processing = false;
    this.btn.setAttribute("disabled", "disabled");
    if (response && response.data && response.data.status.status === 'success') {
      this.handleClose();
      this.props.handleSucessModal(response.data.itemsInfo);
    } else if (response && response.error && response.error.status && response.error.status.status === 'failure') {
      this.setState({
        errorMsg: response.error.status.errorMessage,
      })
      this.btn.removeAttribute("disabled");
    }
  }

  handleClose() {
    document.body.classList.remove('modal-open');
    this.setState({
      show: false,
      errorMsg: '',
      errors: {}
    });
  }
  handleShow() {
    this.form.reset();
    document.body.classList.add('modal-open');
    this.btn.removeAttribute("disabled");
    this.processing = false;
    this.setState({ show: true, errors: '' });
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    const optionChangeGiftMode = {
      id: 'changeGiftMode',
      defaultValue: 'Selecciona modo de regalo',
      options: [
        {
          id: '0',
          value: 'physical',
          labelResourceId: 'Fisicos ',
          disabled: false,

        }, {
          id: '1',
          value: 'electronic',
          labelResourceId: 'Electronicos',
          disabled: false,

        }],
    };
    return (
      <Modal show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom" id="registerModal">
        <ModalBody >
          <Form onSubmit={this.handleSubmit} onRef={(fo) => { this.form = fo }} method="post" id="addToCartForm">
            <button className="close" type="button" data-dismiss="modal" aria-label="Close" onClick={this.handleClose}><span aria-hidden="true">×</span></button>
            <h4>REGISTRAR REGALO</h4>
            {this.state.errorMsg !== '' && <p className="error-msg">{this.state.errorMsg}</p>}
            <TextInput className="inputMaterial" placeholder="Escribe SKU" required="required" name="skuId"
              formId="addToCartForm"
              validators={[
                {
                  type: 'required',
                  errorMessage: 'Ingresa SKU',
                }
              ]}
              errors={this.state.errors} />

            <SelectionTab
              id={optionChangeGiftMode.id}
              options={optionChangeGiftMode.options}
              optionCaption={optionChangeGiftMode.defaultValue}
              optionText={'labelResourceId'}
              optionValue={'value'}
              name='deliveryMode'
              downArrowClass="icon-flecha_gruesa_abajo"
              disableCaption={true}
              formId="addToCartForm"
              validators={[
                {
                  type: 'required',
                  errorMessage: 'Ingresa Modo de entrega',
                }

              ]}
              errors={this.state.errors}
            />
            <div className="col-xs-6">
              <p className="qntLbl">Cantidad</p>
            </div>
            <div className="col-xs-6">
              <TextInput type="number" maxlength="3" className="inputMaterial" name="quantity" htmlId="quantity_reg_modal" required="required"
                formId="addToCartForm"
                validators={[
                  {
                    type: 'required',
                    errorMessage: 'Ingresa Cantidad',
                  },
                  {
                    type: 'custom',
                    errorMessage: 'La cantidad mínima debe ser 1',
                    pattern: '^[1-9][0-9]*$|^0[0-9]+$',
                  }
                ]}
                errors={this.state.errors} />
            </div>
            <input type="hidden" name="channel" value="instore" />
            <input type="hidden" name="brand" value="ws" />
            <button ref={btn => this.btn = btn} className="btnPrimary size-Full" id="addGift" >Agregar</button>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

export default RegisterModal;