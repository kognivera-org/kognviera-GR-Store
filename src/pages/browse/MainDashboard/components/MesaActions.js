import React, { Component } from 'react';
import Button from '../../../../lib/ZUILib/Button';

class MesaActions extends Component {

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="main">
            <div className="row">
              <div className="col-xs-6">
                <Button
                  uiname="HomeCreateEvent"
                  className="btnPrimary size-Full"
                  onClick={this.props.createnewevent}
                >
                  Crear una mesa de regalos
                </Button>
                <p>Crea y configura desde cero una nueva mesa de regalo</p>
              </div>
              <div className="col-xs-6">
                <Button
                  uiname="HomeSearchEvent"
                  onClick={this.props.opensearchmodal}
                  className="btnPrimarySpecial size-Full searchEvent"
                  data-toggle="modal"
                  data-target="#searchEventModal"
                >
                  Buscar mesa de regalos
                </Button>
                <p>
                  Buscar una mesa de regalo para visualizar listas de regalo o administrar datos
                </p>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MesaActions;
