
import React, { Component } from 'react';

class StoreModal extends Component {
render() {
return (
      <div className="modal fade" id="storeModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
              <h4>SELECCIONA UNA TIENDA</h4>
              <p>Selecciona la tienda de la que deseas se imprima el documento</p>
              <p className="requiredLabel">*campos obligatorios</p>
              <div className="cSelect required">
                <select>
                  <option disabled="disabled" selected="selected">Selecciona una tienda</option>
                  <option>Tienda 1</option>
                  <option>Tienda 2</option>
                  <option>Tienda 3</option>
                </select><i className="icon-flecha_light_abajo" />
              </div>
              <button className="btnPrimary size-Full">Imprimir</button>
            </div>
          </div>
        </div>
      </div>

);
}
}
export default StoreModal;
