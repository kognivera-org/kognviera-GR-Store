import React, { Component } from 'react';

class EventData extends Component {

    getNextDate = (eventDate, gracePeriod) => {
        const arr = eventDate.split('/');
        let newDate = new Date(arr[1] + '/' + arr[0] + '/' + arr[2]);
        newDate.setDate(newDate.getDate() + gracePeriod);

        const date = newDate.getDate().toString();
        const month = (newDate.getMonth() + 1).toString();

        return (date.length == 1 ? '0' + date : date) + '/'
            + (month.length == 1 ? '0' + month : month) + '/'
            + newDate.getFullYear();
    }

    renderContent = (eventdetail) => {
        let eventOwner = null;
        eventdetail.eventDetailsInfo &&
            eventdetail.eventDetailsInfo.celebrityInfo.forEach(cele => {
                if (cele.iscoOwner === "false") { eventOwner = cele.firstName + ' ' + cele.lastName + (cele.motherName ? ' ' + cele.motherName : ''); }
            })
        const additionalInfo = eventdetail.eventDetailsInfo && eventdetail.eventDetailsInfo.additionalInfo;
        return (
            !this.props.fail ?
                <div>
                    <h3>DATOS DEL EVENTO</h3>
                    <span>
                        <p>Creador del evento:</p>
                        <p>{eventOwner}</p>
                    </span>
                    <span>
                        <p>Tienda de registro:</p>
                        <p>{additionalInfo.storeNameOfEvent}</p>
                    </span>
                    <span>
                        <p>Fecha de registro:</p>
                        <p>{additionalInfo.creationDate}</p>
                    </span>
                    <span>
                        <p>Fecha de evento:</p>
                        <p>{eventdetail.eventDetailsInfo.eventDate}</p>
                    </span>
                    {additionalInfo.gracePeriodDate &&
                        <span>
                            <p>Fecha de vigencia:</p>
                            <p>{additionalInfo.creationDate} al {this.getNextDate(additionalInfo.creationDate, parseInt(additionalInfo.gracePeriodDate || '0'))}</p>
                        </span>
                    }
                    <span>
                        <p>Fecha de cierre:</p>
                        {additionalInfo.closureDate ?
                            <p>{additionalInfo.closureDate}</p>
                            : <p>-</p>
                        }
                    </span>
                    <span>
                        <p>E-card:</p>
                        <p>{additionalInfo.ecardNumber}</p>
                    </span>
                    {additionalInfo.specialPromo &&
                        <span>
                            <p>Promociones especiales:</p>
                            <p className="promo">{additionalInfo.specialPromo}</p>
                        </span>
                    }
                </div>
                :
                <h3>Try again later</h3>
        )
    }

    render() {
        const { eventdetail, loading, fail } = this.props;
        return (
            <div className="col-xs-6">
                <div className="boxStyle boxLarge">
                    {
                        this.props.loading ?
                            <h3>Loading</h3> :
                            eventdetail && this.renderContent(eventdetail)
                    }
                </div>
            </div>
        )
    }
}

export default EventData;