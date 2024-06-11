import React, { Component } from 'react';
import EventSearchModal from 'pages/eventSearch/EventSearchModal';
import Link from 'lib/ZUILib/Link'
import commonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';

class EventSearchNoResults extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 mainTitle">
            <h1>Búsqueda de mesa de regalos</h1>
          </div>
          <div className="col-xs-12">
            <p className="infoResult">Tu búsqueda de mesa de regalos arrojó <label className="numResult">0</label>&nbsp;resultados
              </p>
          </div>
          <div className="col-xs-12">
            <p className="infoResult">

              <Link className="anchor" to={commonUtil.generateRedirect(routeconfig.maindashboard)}>
                Regresar a home
              <label className="txtAchor">&nbsp;o&nbsp;</label>
              </Link>
              <a className="anchor" onClick={this.props.opensearchmodal}>
                <label>Buscar de nuevo</label>
              </a>
            </p>
          </div>
        </div>
      </div>

    );
  }
}
export default EventSearchNoResults;
