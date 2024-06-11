import React from 'react';
import authenticate from '../../../pages/Authenticate';
import _ from 'lodash'

const SelectionTab = (props, context) => {
  const { optionCaption, value, formId, id, name, dropDownClass, errors, required, downArrowClass, notallowed, sortOptions } = props;
  let { options, optionText, optionValue, defaultValue, disable, disableCaption } = props;
  let printValue = '';
  if (props.notallowed) {
    disable = 'disabled';
  }
  //props.validators && props.updateValidators && props.updateValidators(formId, name, props.validators);
  //const error = errors ? errors[name] : null;
  const formErrors = formId && errors && errors[formId] ? errors[formId] : errors;
  const error = formErrors ? formErrors[name] : null;
  const errorClass = error ? 'select-error' : ''
  optionText = optionText ? optionText : 'option';
  optionValue = optionValue ? optionValue : 'value';
  let optionHtml = disable ? <option key={'caption' + id}>{optionCaption}</option> : <option key={'caption' + id} value=''>{optionCaption}</option>;
  if (options) {
    if (sortOptions) {
      options = _.sortBy(options, optionText);
    }
    optionHtml = options.map((option, index) => {
      if (!printValue) {
        printValue = value === option[optionValue] ? option[optionText] : '';
      }
      if (optionCaption && index === 0) {
        return ([
          <option
            disabled={!disableCaption}
            selected
            key={index + 'caption' + props.id}
            value=""
          >{optionCaption}</option>,
          <option
            disabled={option.disabled}
            id={option.id}
            key={index + 'option' + props.id}
            selected={optionValue ? value === option[optionValue] : false}
            value={optionValue ? option[optionValue] : null}
          >{option[optionText]}</option >]);
      }
      return (
        <option
          disabled={option.disabled}
          id={option.id} key={index + 'option' + props.id}
          selected={optionValue ? value === option[optionValue] : false}
          value={optionValue ? option[optionValue] : null}
        >{option[optionText]}</option>
      );
    });
  }

  const wrapperClassName = (required && required == 'false')
    ? 'cSelect ' + errorClass
    : 'cSelect required ' + errorClass;

  return (
    <div className="formBlock">
      {/* <div className={wrapperClassName}> */}
      <span className="printable display-hidden">{printValue}</span>
      <div className={`non-printable exclude-for-print-download ${wrapperClassName}`} >
        <select
          id={id} name={name} disabled={disable} onChange={props.onChange}
          className={(error && error != '') ? `${dropDownClass} error` : ''}
          validators={props.validators ? JSON.stringify(props.validators) : ''}
        // TODO: this style attribute will be removed once error css will be available.
        >
          {optionHtml}
        </select>
        <i className={downArrowClass || 'icon-caret_down'}></i>
        {error && error != '' && <label id={`${id}-error`} className="error" htmlFor={id}>{error}</label>}
      </div >
    </div >
  );
}
SelectionTab.displayName = 'SelectionTab';
export default authenticate(SelectionTab);