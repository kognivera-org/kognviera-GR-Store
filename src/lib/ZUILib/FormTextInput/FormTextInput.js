import React from 'react';

const FormTextInput = ({ children }, context) =>
  <div className="formBlock">
    <div className="materialStyle">
      <input className="inputMaterial" type="text" required />
      <label className="placeHolderMaterial">Apellido Materno</label>
    </div>
  </div>;

export default FormTextInput;