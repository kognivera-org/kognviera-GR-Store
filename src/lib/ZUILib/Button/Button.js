import React from 'react';
import authenticate from '../../../pages/Authenticate';

const Button = (props, context) => {

  const buttonProps = Object.assign({}, props);
  delete buttonProps.dispatch;

  let button = <button {...buttonProps}>{buttonProps.children}</button>;
  if (buttonProps.notallowed) {
    button = <button {...buttonProps} disabled>{buttonProps.children}</button>;
  }
  return button;
}
Button.displayName = 'Button';
export default authenticate(Button);