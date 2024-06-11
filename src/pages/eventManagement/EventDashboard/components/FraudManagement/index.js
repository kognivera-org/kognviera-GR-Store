import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkEventForFraud, updateEventStatus } from '../../actions'
import Button from '../../../../../lib/ZUILib/Button'

@connect(
    store => ({
        checkEventForFraud: store.eventdashboard.checkEventForFraud
    }),
    {
        checkEventForFraud, updateEventStatus
    }
)
class FraudManagement extends Component {

    render() {
        const { checkEventForFraud, handleFraudEvent } = this.props;
        return (
            < div className="col-xs-12" >
                <div className="boxStyle fraudBox">
                    <div className="col-xs-4">
                        <span>Evento bajo revisión</span>
                    </div>
                    <div className="col-xs-4">
                        <Button uiname="DashboardFraudAcceptEvent" onClick={(e) => this.props.handleFraudEvent('reject')} className="btnSecondarySpecial size-Full">Aceptar evento</Button>
                    </div>
                    <div className="col-xs-4">
                        <Button uiname="DashboardFraudChangeStatus" onClick={(e) => this.props.handleFraudEvent('accept')} className="btnSecondarySpecial size-Full">Cambiar estatus del evento</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default FraudManagement;
