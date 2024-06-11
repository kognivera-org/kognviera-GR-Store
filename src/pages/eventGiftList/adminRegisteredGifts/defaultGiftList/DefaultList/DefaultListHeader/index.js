import React, { Component } from 'react';

class DefaultListHeader extends Component {
render() {
return (
    <div className="row listHeader">
        <div className="col-xs-12"><a href="#">Regresar a regalos registrados</a>
            <h1 className="titleSection">LISTAS PREDETERMINADAS</h1>
            <p>Para una selección rápida de regalos hemos creado listas con los productos más populares (key).</p>
        </div>
     </div>
);
}
}
export default DefaultListHeader;