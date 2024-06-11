import React, { Component } from 'react';

export default class TableHeader extends Component {

    constructor(props) {
        super(props);
    }
    state = {
        sortType: true,
    }

    sortByPrice = (categoryName) => {
        this.setState({
            sortType: !this.state.sortType,
        })
        this.state.sortType === true ? this.props.sortByPrice('descending', categoryName) : this.props.sortByPrice('ascending', categoryName)
    }
    render() {
        return (
            <thead>
                <tr>
                    <td />
                    <td />
                    <td />
                    <td className="little-text" className="little-text">Artículo</td>
                    <td className="little-text" onClick={() => this.sortByPrice(this.props.cat.categoryName)}>Precio {this.state.sortType ? <i className="icon-flecha_filtros_arriba" aria-hidden="true" /> : <i className="icon-flecha_filtros_abajo" aria-hidden="true" />}</td>
                    <td className="little-text" >Cantidad</td>
                    <td className="little-text" >Disponibilidad</td>
                    <td className="little-text" >Dirección de envío</td>
                    <td className="little-text" >Modo de regalo</td>
                </tr>
            </thead>
        )
    }

}
