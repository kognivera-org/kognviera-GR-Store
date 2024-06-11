
import React, { Component } from 'react';

class GiftListGridItem extends Component {
render() {
return (
<div className="col-xs-3">
<h2>Casa Clásica</h2>
<p className="articles">256 artículos</p>
<p className="range">Regalos de $300.00 a $3,000.00</p>
<p className="totalValue">Valor de lista <b>$185,000.00</b></p>
<div className="imgBlock">
  <div className="addedList">
    <p>Lista predeterminada agregada a lista de regalos</p>
  </div><img src="https://fotosdesalas.com/wp-content/uploads/2015/12/sala-gris.jpg" alt="Responsive image" />
</div>
<div className="buttonBlock"><a className="btnSecondarySpecial size-Full" href="./defaultListDetail.html">Ver artículos de lista</a>
  <button className="btnPrimary size-Full">Agregar artículos a lista <i className="icon-flecha_lightsvg_derecha" /></button>
</div>
</div>
);
}
}
export default DefaultListDetail;