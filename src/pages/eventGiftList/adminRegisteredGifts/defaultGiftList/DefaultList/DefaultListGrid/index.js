import React, { Component } from 'react';

class DefaultListGrid extends Component {
render() {
return (
    <div className="row listsBlock">
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
        <div className="col-xs-3">
            <h2>Casa Minimal</h2>
            <p className="articles"> 335 artículos</p>
            <p className="range">Regalos de $500.00 a $5,000.00</p>
            <p className="totalValue">Valor de lista <b>$225,000.00</b></p>
            <div className="imgBlock">
                <div className="addedList">
                <p>Lista predeterminada agregada a lista de regalos</p>
                </div><img src="https://assets.liverpool.com.mx/assets/images/categorias/muebles/salas-tommy-trendy.jpg" alt="Responsive image" />
            </div>
            <div className="buttonBlock"><a className="btnSecondarySpecial size-Full" href="./defaultListDetail.html">Ver artículos de lista</a>
                <button className="btnPrimary size-Full">Agregar artículos a lista <i className="icon-flecha_lightsvg_derecha" /></button>
            </div>
        </div>
        <div className="col-xs-3">
            <h2>Casa Contemporánea</h2>
            <p className="articles"> 165 artículos</p>
            <p className="range">Regalos de $800.00 a $6,000.00</p>
            <p className="totalValue">Valor de lista <b>$185,000.00</b></p>
            <div className="imgBlock">
                <div className="addedList">
                <p>Lista predeterminada agregada a lista de regalos</p>
                </div><img src="https://assets.liverpool.com.mx/assets/images/categorias/muebles/muebles-muebles-salas-davenport-blanca-izquierda-contemporanea.jpg" alt="Responsive image" />
            </div>
            <div className="buttonBlock"><a className="btnSecondarySpecial size-Full" href="./defaultListDetail.html">Ver artículos de lista</a>
                <button className="btnPrimary size-Full">Agregar artículos a lista <i className="icon-flecha_lightsvg_derecha" /></button>
            </div>
        </div>
        <div className="col-xs-3">
            <h2>Casa Modelo</h2>
            <p className="articles"> 415 artículos</p>
            <p className="range">Regalos de $900.00 a $8,000.00</p>
            <p className="totalValue">Valor de lista <b>$385,000.00</b></p>
            <div className="imgBlock">
                <div className="addedList">
                <p>Lista predeterminada agregada a lista de regalos</p>
                </div><img src="https://assets.liverpool.com.mx/assets/images/categorias/muebles/comedores-livenza-contemporaneo.jpg" alt="Responsive image" />
            </div>
            <div className="buttonBlock"><a className="btnSecondarySpecial size-Full" href="./defaultListDetail.html">Ver artículos de lista</a>
                <button className="btnPrimary size-Full">Agregar artículos a lista <i className="icon-flecha_lightsvg_derecha" /></button>
            </div>
        </div>
    </div>
   
);
}
}
export default DefaultListGrid;