
import React, { Component } from 'react';

class PermissionsModal extends Component {
render() {
return (
      <div className="modal fade" id="permissionsModal" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
              <p>¿Estás seguro de eliminar los derechos de administración de este festejado?</p>
              <button className="btnSecondaryAction size-Medium" data-dismiss="modal">Cancelar</button>
              <button className="btnPrimaryAction size-Medium">Aceptar</button>
            </div>
          </div>
        </div>
      </div>

);
}
}
export default PermissionsModal;
