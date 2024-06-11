import React, { Component } from 'react';
import Link from 'lib/ZUILib/Link';
import routeconfig from 'config/routeconfig';
import CommonUtil from '../../../../utils/commonUtil';
import moment from 'moment';

class EventSearchResultsList extends Component {

    handleEventDetaildRedirect = (eventId) => {
        this.props.onEventListRedirect(eventId);
    }
    render() {
        const { searchResults } = this.props;
        var rows = [];
        const getEventRow = (event, key) => {
            let owners = event.owners;
            let customerName = '';
            let row = [];
            owners.map((element, key) => {
                customerName = element.firstName + ' ' + element.lastNameOrPaternalName + (element.motherName ? ' ' + element.motherName : '') + (key !== owners.length - 1 ? ', ' : '')
                row.push(<span key={key}>{customerName}</span>);
            });

            let eventDate = '';
            if (event.eventDate) {
                try {
                    const parsedDate = moment(event.eventDate, 'YYYY/MM/DD');
                    if (parsedDate && parsedDate.isValid()) {
                        eventDate = parsedDate.format("DD/MM/YYYY")
                    }
                } catch (e) { }
            }

            return (
                <tr key={key} >
                    <td>{row}</td>
                    <td>{event.eventType}</td>
                    <td>{event.eventId}</td>
                    <td>{eventDate}</td>
                    <td>
                        <Link className="anchor" to={CommonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: event.eventId })}>Administrar</Link>
                    </td>
                    <td>
                        <Link className="anchor" to={CommonUtil.generateRedirect(routeconfig.EventDetails, { eventId: event.eventId })}>Ver lista</Link>
                    </td>
                </tr>
            )
        }

        searchResults.events.forEach((element, key) => {
            rows.push(getEventRow(element, key));
        })

        return (
            <React.Fragment>
                <table className="table table-striped resultTable">
                    <thead>
                        <tr>
                            <th>Festejados</th>
                            <th>Tipo de mesa</th>
                            <th>Número de evento</th>
                            <th>Fecha del evento</th>
                            <th>Administrar</th>
                            <th>Regalos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}
export default EventSearchResultsList;