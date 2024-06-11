import React, { Component } from 'react';
import FormTextInput from 'lib/ZUILib/FormTextInput'

class EmployeeCardForm extends Component {

  render() {

const cardNumberTextProps = {
className : 'inputMaterial',
type : 'text',
required : 'required',
name : 'cardNumber',
label: '<span>*</span> Número de tarjeta'
}
const firstNameTextProps = {
className : 'inputMaterial',
type : 'text',
required : 'required',
name : 'firstName',
label: '<span>*</span> Nombre'
}
const firstName2TextProps = {
className : 'inputMaterial',
type : 'text',
name : 'firstName2',
label: 'Segundo Nombre'
}
const lastNameTextProps = {
className : 'inputMaterial',
type : 'text',
required : 'required',
name : 'lastName',
label: '<span>*</span> Apellido Paterno'
}
const lastName2TextProps = {
className : 'inputMaterial',
type : 'text',
name : 'lastName2',
label: 'Apellido Materno'
}

    return (
  <div className="grid-two-elements m-30"> 
   <div> 
    <form id="addNewCard"> 
     <div className="row nmh"> 
      <div className="col-md-12"> 
       <p className="tituloForm">Datos de la tarjeta</p> 
      </div> 
      <div className="col-md-12"> 
<FormTextInput {...cardNumberTextProps} />
      </div> 
      <div className="col-md-12 legendDown"> 
       <p>Escríbelo sin espacios</p> 
      </div> 
      <div className="col-md-12"> 
       <p className="tituloForm">datos del tarjetahabiente</p> 
      </div> 
      <div className="col-md-12"> 
<FormTextInput {...firstNameTextProps} />
      </div> 
      <div className="col-md-12"> 
<FormTextInput {...firstName2TextProps} />
      </div> 
      <div className="col-md-12"> 
<FormTextInput {...lastNameTextProps} />
      </div> 
      <div className="col-md-12"> 
<FormTextInput {...lastName2TextProps} />
      </div> 
      <div className="col-md-12"> 
       <div className="grid-two-elements"> 
        <div> 
         <button className="btnSecondaryAction custom-size" id="cancelar">Cancelar</button> 
        </div> 
        <div></div> 
        <div> 
         <button className="btnPrimaryAction custom-size" type="submit">Guardar</button> 
        </div> 
       </div> 
      </div> 
     </div> 
    </form> 
   </div> 
   <div></div> 
  </div> 

    );
  }

}
export default EmployeeCardForm;
