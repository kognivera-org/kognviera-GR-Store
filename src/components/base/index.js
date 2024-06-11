import { Component } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { callValidateRules } from '../../components/validations/validation-rules';

export default class Base extends Component {

  constructor(props) {
    super(props);
    this.state = {
      values: {},
      errors: {},
    }
  }

  formErrors = {

  }

  values = {

  }

  validators = {

  }

  validateForm = (e) => {
    const formId = e.target.id;
    if (formId) {
      this.values[formId] = {}
      this.formErrors[formId] = {}
    } else {
      this.values = {}
      this.formErrors = {}
    }
    const formElements = e.target.elements;
    for (let i = 0; i < formElements.length; i++) {
      if (!formElements[i] || !formElements[i].name
        || formElements[i].name == '' || formElements[i].localname == 'button') {
        continue;
      }
      this.validateInput(formId, formElements[i], e.target);
    }
  }

  validateInput = (formId, element, formTarget) => {
    const inputName = element.name
    const value = element.value
    const localName = element.localName
    const validatorsAsString = element.attributes.validators ? element.attributes.validators.value : null
    const validators = validatorsAsString ? JSON.parse(validatorsAsString) : null
    // const formValidators = this.validators ? this.validators[formId] : null;
    // const validators = formValidators ? formValidators[inputName] : null;

    let isValid = true
    let message = ''
    let messageProperty = ''
    if (validators) {
      for (let i = 0; i < validators.length; i++) {
        if (validators[i].relField && formTarget) {
          const relValue = formTarget[validators[i].relField].value
          validators[i].relValue = relValue
        }
        messageProperty = validators[i].property
        if (!callValidateRules(value, validators[i])) {
          isValid = false
          message = validators[i].errorMessage
          break
        }
      }
    }
    if (element.type === 'checkbox') {
      if (element.checked) {
        if (formId) {
          this.values[formId][inputName] = value
        } else {
          this.values[inputName] = value
        }
      }
    } else if (formId) {
      this.values[formId][inputName] = value
      if (localName === 'select') {
        this.values[formId][`${inputName}_option`] = element.options[element.selectedIndex].text
      }
    } else {
      this.values[inputName] = value
      if (localName === 'select') {
        this.values[`${inputName}_option`] = element.options[element.selectedIndex].text
        this.values[`${inputName}_id`] = element.options[element.selectedIndex].value
      }
    }
    if (!isValid) {
      const key = messageProperty || inputName
      if (formId) {
        this.formErrors[formId][key] = message
      } else {
        this.formErrors[key] = message
      }
    }
  }

  handleChange = (event) => {
    event.preventDefault();
  };

  hasFormErrors = (formId) => {
    const tempErrors = formId ? this.formErrors[formId] : this.formErrors
    if (!tempErrors) {
      return false
    }

    for (const key in tempErrors) {
      if (tempErrors[key] && tempErrors[key] != '') {
        return true
      }
    }
    return false
  }

  updateValidators = (formId, inputName, validators) => {
    if (!this.validators[formId]) {
      this.validators[formId] = {};
    }
    this.validators[formId][inputName] = validators;
  }

  handleBlur = (formId, inputName, isValid, inputStr) => {
    if (!this.values[formId]) {
      this.values[formId] = {};
    }
    if (!this.formErrors[formId]) {
      this.formErrors[formId] = {};
    }
    if (isValid) {
      this.values[formId][inputName] = inputStr;
      this.formErrors[formId][inputName] = '';
    } else {
      this.formErrors[formId][inputName] = inputStr;
    }
    //e.preventDefault();
  };

  render() {
    return null;
  }
}
