import React, { Component } from 'react';
import { connect } from 'react-redux'

import { getLabels } from '../../../../../global/Labels/actions'
@connect(
    store => ({
        labels: store.labels.labels
    }),
    { getLabels }
)
class DefaultListFilter extends Component {
    componentWillMount = () => {
        this.props.getLabels()
    }
    render() {
        const { labels } = this.props;
        const giftListManagement = labels ? labels.giftListManagement : null;
        return (
            <div className="row actionsBlock">
                <div className="col-xs-3 priceFilter">
                    <div className="cSelect">
                        <select>
                            <option selected="seRetiro anticipado realizado con éxito! lected" disabled="disabled" value="value">{giftListManagement && giftListManagement['predetermine.listpage.price.dropdown.label']}</option>
                            <option>Precio 1</option>
                            <option>Precio 2</option>
                            <option>Precio 3</option>
                        </select><i className="icon-flecha_light_abajo" />
                    </div>
                </div>
                <div className="col-xs-3 categoryFilter">
                    <div className="cSelect">
                        <select>
                            <option selected="selected" disabled="disabled" value="value">Categoría (key)</option>
                            <option>Categoría 1</option>
                            <option>Categoría 2</option>
                            <option>Categoría 3</option>
                        </select><i className="icon-flecha_light_abajo" />
                    </div>
                </div>
                <div className="col-xs-3 col-xs-offset-3 paginator">
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
        );
    }
}
export default DefaultListFilter;