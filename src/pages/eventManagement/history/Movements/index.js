
import React, { Component } from 'react';

class Movements extends Component {
render() {
return (
      <div id="grayBackground">
        <div className="container search">
          <div className="row">
            <div className="col-xs-4 mainTitle">
              <h1>Historial de movimientos</h1>
            </div>
            <div className="col-xs-6" />
            <div className="col-xs-2">
              <div className="infoResult resultMovement"> 
                <label className="iClass icon-descarga" />
                <label className="iClass icon-imprimir" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <div className="input-group">
                <input className="form-control" type="text" placeholder="Buscar Movimiento" /><span className="input-group-btn"><span className="btn btn-default buttonSearch" type="button"><i className="icon-zoom" /></span></span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-8 resultTitle" />
            <div className="col-xs-4 paginator">
              <p className="infoResult numPages">48
                <label className="txtAchorPaginator">Movimientos</label>
              </p>
              <div className="numberPaginator">
                <div className="iClass icon-flechas_doble_izquierda anchorPaginator" />
                <div className="iClass icon-flecha_light_izq anchorPaginator" />
                <ul className="listPaginator">
                  <li> <a className="anchorPaginator">1</a></li>
                  <li><a className="active anchorPaginator">2</a></li>
                  <li> <a className="anchorPaginator">3</a></li>
                  <li> <a className="anchorPaginator">4</a></li>
                  <li> <a className="anchorPaginator">5</a></li>
                </ul>
                <div className="iClass icon-flecha_gruesa_derecha anchorPaginator" />
                <div className="iClass icon-flechas_doble_derecha anchorPaginator" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <ul className="listResult">
                <li className="header"><span className="cell firstColumn">Quien realiza el movimiento</span><span className="cell">Fecha y hora</span><span className="cell">Lugar</span><span className="cell">Quien realizo el movimiento</span><span className="cell">Quien autorizo</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
                <li className="itemList">
                  <p className="twice cell firstColumn"><span>Usuario:</span><span>Sergio Méndez Gutiérrez</span>
                  </p>
                  <p className="twice cell firstColumn"><span>10/10/2017</span><span>12:24 pm</span>
                  </p>
                  <p className="twice cell firstColumn"><span>Tienda</span><span>no: 39</span>
                  </p><span className="cell">Cierre de mesa de ragalos</span><span className="cell">Sergio Méndez Gutiérrez</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 paginator">
              <div className="numberPaginator">
                <div className="iClass icon-flechas_doble_izquierda anchorPaginator" />
                <div className="iClass icon-flecha_light_izq anchorPaginator" />
                <ul className="listPaginator">
                  <li> <a className="anchorPaginator">1</a></li>
                  <li><a className="active anchorPaginator">2</a></li>
                  <li> <a className="anchorPaginator">3</a></li>
                  <li> <a className="anchorPaginator">4</a></li>
                  <li> <a className="anchorPaginator">5</a></li>
                </ul>
                <div className="iClass icon-flecha_gruesa_derecha anchorPaginator" />
                <div className="iClass icon-flechas_doble_derecha anchorPaginator" />
              </div>
            </div>
          </div>
        </div>
      </div>

);
}
}
export default Movements;
