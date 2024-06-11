import React, { Component } from 'react';

class DefaultListHeader extends Component {
render() {
return (
    <div className="row listHeader">
        <div className="col-xs-12"><a href="#">Regresar a regalos registrados</a></div>
        <div className="col-xs-5 listInfo">
            <h1>Casa Clásica</h1>
            <p className="articles">265 artículos</p>
            <p className="range">Regalos de $300.00 a $3,000.00</p>
            <p className="totalValue">Valor de lista <b>$185,000.00</b></p>
        </div>
        <div className="col-xs-7 addList">
            <button className="btnPrimary size-ExtraLarge">Agregar artículos a mi lista <i className="icon-flecha_lightsvg_derecha" /></button>
        </div>
    </div>
);
}
}
export default DefaultListHeader;