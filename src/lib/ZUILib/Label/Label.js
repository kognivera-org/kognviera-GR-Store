import React from 'react';
import PropTypes from 'prop-types';

/** Label with required field display, htmlFor, and block styling */
function Label({ htmlFor, label, required, star, ...a }) {
  return (
    <label style={{ display: 'block' }} htmlFor={htmlFor} className={a.labelClassName} required={required}>
      {star && <span>{star}</span>} {label}
    </label>
  );
}

Label.propTypes = {
  /** HTML ID for associated input */
  htmlFor: PropTypes.string,

  /** Label text */
  label: PropTypes.string,

  /** Display asterisk after label if true */
  // required: PropTypes.bool,
};

export default Label;
