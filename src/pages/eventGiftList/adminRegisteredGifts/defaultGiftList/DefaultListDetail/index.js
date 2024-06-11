
import React, { Component } from 'react';
import DefaultListHeader from './DefaultListHeader';
import DefaultItemList from './DefaultItemList';
import DefaultListFilter from './DefaultListFilter';

class DefaultListDetail extends Component {
render() {
return (
      <div>
        <div className="container">
          <DefaultListHeader/>
          <DefaultListFilter/>
          <DefaultItemList/>
         <div className="row">
              <div className="col-xs-3 col-xs-offset-9 paginator paginatorBottom">
              <ul>
                  <li><a href="#"><i className="icon-flechas_doble_izquierda" /></a></li>
                  <li><a href="#"><i className="icon-flecha_light_izq" /></a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#"><i className="icon-flecha_lightsvg_derecha" /></a></li>
                  <li><a href="#"><i className="icon-flechas_doble_derecha" /></a></li>
              </ul>
              </div>
          </div>
        </div>
      </div>

);
}
}
export default DefaultListDetail;
