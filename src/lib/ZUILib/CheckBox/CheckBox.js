import React from 'react';
// import PropTypes from 'prop-types';
import Label from '../Label';
import { callValidateRules } from '../../../components/validations/validation-rules';
import authenticate from '../../../pages/Authenticate';

function getselectedCheckBoxValue(event, props) {
    const selectedData = Object.assign({}, props);
    selectedData.checked = event.target.checked;
    if (props.getSelectedValue) {
        props.getSelectedValue(selectedData);
    }
    if (props.onChange) {
        props.onChange(event);
    }
}

const CheckBox = (props, context) => {

    const nowrapper = props.nowrapper;
    const styleShow = props.ShowStyle;
    let disabled = props.disabled;
    if (props.notallowed) {
        disabled = 'disabled';
    }
    let component = <React.Fragment>
        <input
            type="checkbox"
            id={props.id}
            value={props.value}
            name={props.name}
            disabled={disabled || null}
            checked={props.checked}
            defaultChecked={props.defaultChecked}
            className={props.className}
            onChange={event => getselectedCheckBoxValue(event, props)}
        />
        {props.divLabel ?
            props.divLabel
            :
            <label htmlFor={props.id} disabled={disabled || null} onClick={props.onClickLabel} {...props.labelProps} value={props.value} dangerouslySetInnerHTML={{ __html: props.displayName }} />
        }

    </React.Fragment>

    component = !nowrapper ? <div className={(styleShow === 'horizontal') ? 'checkboxH' : 'checkbox'}>
        {component}
    </div > : component;

    return component;
}
CheckBox.displayName = 'CheckBox';
export default authenticate(CheckBox);