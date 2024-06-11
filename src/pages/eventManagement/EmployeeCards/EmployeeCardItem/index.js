import React, { Component } from 'react';
import Button from '../../../../lib/ZUILib/Button';

class EmployeeCardItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <p className="tituloCard">{this.props.cardInfo.firstName} {this.props.cardInfo.lastName}</p>
                <p className="tarjeta">xxxxxxxxxxxx{this.props.cardInfo.cardNumber.slice(-4)}</p>
                <Button uiname="EventEmployeeEditCard" className="editar btnPrimaryAction size-ExtraLarge mb-10" onClick={() => this.props.onClickEditCard()}>Editar</Button>
                <Button uiname="EventEmployeeDeleteCard" className="btnSecondarySpecial size-ExtraLarge" onClick={() => this.props.onClickModalDeleteCard(this.props.cardInfo)}>Eliminar</Button>
            </div>
        )
    }
}
export default EmployeeCardItem;