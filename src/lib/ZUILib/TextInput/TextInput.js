import React from 'react'
// import PropTypes from 'prop-types';
import Label from '../Label'
import { callValidateRules } from '../../../components/validations/validation-rules'
import authenticate from '../../../pages/Authenticate'

function renderLabel(props) {
  return (
    <Label htmlFor={props.htmlId} label={props.label} required={props.required} star={props.star} labelClassName={props.labelClassName ? props.labelClassName : 'placeHolderMaterial'} />
  )
}

const hasNonNumeric = (e) => {
  const text = e.clipboardData.getData('Text');
  const numericValue = text ? text.replace(/\D/g, '') : '';
  if (text !== numericValue) {
    e.preventDefault();
  }
}

const hasNumeric = (e) => {
  const text = e.clipboardData.getData('Text');
  const textonlyPattern = /^[\u00C0-\u00FFa-zA-Z-' ]+$/;
  // const numericValue = text ? text.replace(/\D/g, '') : '';
  if (!textonlyPattern.test(text)) {
    e.preventDefault();
  }
}

const isNumeric = (e) => {
  var charCode = e.charCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    e.preventDefault();
  }
}

const isNonNumeric = (e) => {
  var key = e.key
  const textonlyPattern = /^[\u00C0-\u00FFa-zA-Z-' ]+$/;
  if (!textonlyPattern.test(key)) {
    e.preventDefault();
  }
}

const isValidInput = (e, pattern) => {
  var key = e.key
  if (key && pattern && !pattern.test(key)) {
    e.preventDefault();
  } else {
    const text = e.clipboardData ? e.clipboardData.getData('Text') : '';
    if (text && pattern && !pattern.test(text)) {
      e.preventDefault();
    }
  }
}

// function onBlur(e, props) {
//   const value = e.target.value;
//   validateInput(value, props);
// }

// function validateInput(value, props) {
//   const validators = props.validators;
//   let isValid = true;
//   let message = '';

//   if (validators) {
//     if (validators instanceof Array) {
//       const errorMessage = props.errorMessage;
//       for (let i = 0; i < validators.length; i++) {
//         if (!callValidateRules(value, validators[i].type, props)) {
//           isValid = false;
//           message = validators[i].errorMessage;
//           break;
//         }
//       }
//     }
//   }
//   if (!isValid) {
//     isValid = false;
//     props.handleBlur(props.formId, props.name, isValid, message);
//   } else {
//     props.handleBlur(props.formId, props.name, isValid, value);
//   }
// }

const TextInput = (props, context) => {
  const { errors, name, htmlId, divClassName, value, formId, refProp, pattern, disableOnPaste } = props
  let type = !props.type || props.type === 'number' || props.type === 'textonly' ? 'text' : props.type
  let onKeyPressFunc = props.type === 'number' ? isNumeric : () => { javascript: void (0) }
  onKeyPressFunc = props.type === 'textonly' ? isNonNumeric : onKeyPressFunc
  if (pattern) {
    onKeyPressFunc = isValidInput
  }
  let onPasteFunc = props.type === 'number' ? hasNonNumeric : () => { javascript: void (0) }
  onPasteFunc = props.type === 'textonly' ? hasNumeric : onPasteFunc
  if (pattern) {
    onPasteFunc = isValidInput
  }
  // props.validators && props.updateValidators && props.updateValidators(formId, name, props.validators);
  let { className } = props
  if (!className) {
    className = 'inputMaterial'
  }
  const formErrors = formId && errors && errors[formId] ? errors[formId] : errors
  const error = formErrors ? formErrors[name] : null
  if (props.star && error && error != '') {
    className += ' error'
  }

  const disabled = props.notallowed || props.disabled;
  // console.log('value', props.inputValue)
  return (
    <div className="formBlock">
      <span className="printable display-hidden">{props.inputValue}</span>
      <div className={divClassName || 'materialStyle'}>
        {props.beforeElement}
        {disabled ?
          <input
            id={htmlId}
            type={type}
            name={props.name}
            className={`non-printable exclude-for-print-download  ${className}`}
            value={value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            maxLength={props.maxlength}
            onBlur={props.onBlur}
            required={props.required}
            disabled={disabled}
            onKeyPress={(e) => onKeyPressFunc(e)}
            ref={refProp}
            validators={props.validators ? JSON.stringify(props.validators) : ''}
          />
          :
          <input
            id={htmlId}
            type={type}
            name={props.name}
            className={`non-printable exclude-for-print-download  ${className}`}
            value={props.inputValue}
            readOnly={props.readOnly}
            defaultValue={value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            maxLength={props.maxlength}
            onBlur={props.onBlur}
            required={props.required}
            disabled={props.disabled}
            onKeyPress={(e) => onKeyPressFunc(e, pattern)}
            onPaste={disableOnPaste ? (e) => e.preventDefault() : (e) => onPasteFunc(e, pattern)}
            ref={refProp}
            validators={props.validators ? JSON.stringify(props.validators) : ''}
            autoComplete={props.autoComplete ? props.autoComplete : ''}
          />
        }
        {!props.placeholder ? renderLabel(props) : ''}
        {props.childElement}
        {error && error != '' && <label id={`${htmlId}-error`} className="error" htmlFor={htmlId}>{error}</label>}
      </div>
      {props.children}
    </div>
  )
}
TextInput.displayName = 'TextInput';
export default authenticate(TextInput);