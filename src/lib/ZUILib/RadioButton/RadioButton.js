import React from 'react';
// import PropTypes from 'prop-types';
import Label from '../Label';
import { callValidateRules } from '../../../components/validations/validation-rules';
import authenticate from '../../../pages/Authenticate';

const RadioButton = (props, context) => {
    const { defaultChecked } = props;
    let disabled = props.disabled;
    if (props.notallowed) {
        disabled = 'disabled';
    }
    return (
        <div className={props.radioCssClass ? props.radioCssClass : 'radio'}>
            <input
                disabled={disabled}
                id={props.id}
                type="radio"
                name={props.name}
                defaultChecked={defaultChecked}
                value={props.value}
                checked={props.checked}
                onChange={(event) => { props.onChangeFunction ? props.onChangeFunction(event) : { javascript: void (0) } }} />

            {props.divLabel ?
                props.divLabel
                :
                <label htmlFor={props.id}>{props.displayName}{props.subDetailsHTML ? props.subDetailsHTML : null}</label>
            }
        </div >
    );
}
RadioButton.displayName = 'RadioButton';
export default authenticate(RadioButton);