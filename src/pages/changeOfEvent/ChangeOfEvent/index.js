
import React, { Component } from 'react';
import MegaMentMenu from '../../eventManagement/Navigation/ManagementMenu'
import { getLabels } from '../../global/Labels/actions'
import { connect } from 'react-redux'
import Image from 'lib/ZUILib/Image';
import appconfig from '../../../config/appconfig';

@connect(
  store => ({
    labels: store.labels.labels
  }),
  { getLabels }
)

class ChangeOfEvent extends Component {
  UNSAFE_componentWillMount = () => {
    this.props.getLabels()
  }
  render() {
    const { labels } = this.props;
    const eventManagement = labels ? labels.eventManagement : null;
    return (
      <div>
        <div className="container fill">
          <div className="row fill">
            <div className="col-xs-2 fill">
              <MegaMentMenu />
            </div>
            <div className="col-xs-10">
              <div className="container-full white shadow mt-30 mb-60">
                <div className="row">
                  <div className="col-xs-3">
                    <div className="imgUser"><Image asset src="/images/adminImage.png" className="eventImg" alt="Liverpool" /></div>
                  </div>
                  <div className="col-xs-2 col-xs-offset-7 right">
                    <div className="iClass icon-descarga icono-grande-inline mr-15" />
                    <div className="iClass icon-imprimir icono-grande-inline" />
                  </div>
                </div><br />
                <div className="row mb-15">
                  <div className="col-xs-6"><span className="block infoText">Nombre del evento</span><span className="block titleText salto">Maria Eugenia y Sergio <span className="iClass icon-editar linkIcon" /></span><span className="block infoText">Fecha del evento </span><span className="block dateText salto">12/09/2018</span><span className="block infoText">Número de evento</span><span className="block boldText salto">1234567</span><span className="block infoText">Tipo de evento</span><span className="block boldText linkText salto" id="changeEvent">{appconfig.eventTypes.Boda}</span></div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xs-12">
                    <p className="block titleText">Festejados y Administradores</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6"><span className="block subtitleText bold mb-15">Novia (Administrador)</span><span className="block infoText">Nombre</span><span className="block boldText salto-doble">Maria Eugenia								</span><span className="block infoText">Apellido Paterno</span><span className="block boldText salto-doble">Hernandez</span><span className="block infoText">Apellido Materno</span><span className="block boldText salto-doble">Menchaca</span><span className="block infoText">Alias</span><span className="block boldText salto-doble">Mary</span><span className="block infoText">Celular</span><span className="block boldText salto-doble">5566773344</span><span className="block infoText">Correo electrónico</span><span className="block boldText salto-doble">Maria@mail.com</span></div>
                  <div className="col-xs-6"><span className="block subtitleText bold mb-15">Novio </span><span className="block infoText">Nombre</span><span className="block boldText salto-doble">Maria Eugenia								</span><span className="block infoText">Apellido Paterno</span><span className="block boldText salto-doble">Hernandez</span><span className="block infoText">Apellido Materno</span><span className="block boldText salto-doble">Menchaca</span><span className="block infoText">Alias</span><span className="block boldText salto-doble">Mary</span><span className="block infoText">Celular</span><span className="block boldText salto-doble">5566773344</span><span className="block infoText">Correo electrónico</span><span className="block boldText salto-doble">						</span></div>
                </div>
                <div className="row mb-60">
                  <div className="col-xs-6">
                    <button className="btnPrimaryAction size-ExtraLarge">Editar</button>
                  </div>
                  <div className="col-xs-6">
                    <button className="btnPrimaryAction size-ExtraLarge">Editar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modalContent">
          <div className="modal fade modal-custom" id="eventChangeModal" role="dialog">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <button className="close" type="button" data-dismiss="modal">×</button>
                  <div className="col-xs-12">
                    <p>{eventManagement && eventManagement['dashboard.eventType.change.message']}</p>
                  </div>
                  <div className="row show-grid-row">
                    <div className="col-xs-6">
                      <button className="btnSecondaryAction size-Full" data-dismiss="modal">Cancelar</button>
                    </div>
                    <div className="col-xs-6">
                      <button className="btnPrimaryAction size-Full" data-dismiss="modal">Aceptar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default ChangeOfEvent;
