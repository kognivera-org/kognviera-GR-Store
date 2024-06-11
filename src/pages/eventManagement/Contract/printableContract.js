import React, { Component } from 'react';
import { connect } from 'react-redux';
import DownloadPrintHeader from '../../../components/DownloadPrintHeader'

@connect(
    store => ({
        contract: store.contract.data,
        event: store.eventdashboard && store.eventdashboard.eventData,
        dilisaCardInfo: store.getEmployeeCardDetails && store.getEmployeeCardDetails.data && store.getEmployeeCardDetails.data.dilisaCardInfo,
        eventAddresses: store.eventAddresses.eventDeliveryAddressData,
    }),
)

class PrintContract extends Component {
    render() {
        const { event, contract, dilisaCardInfo } = this.props;
        const contractHtml = contract
            && contract.contractDetailsInfo
            && contract.contractDetailsInfo.contractdata;

        if (!event || !event.eventDetailsInfo || !contractHtml) {
            return null;
        }
        const eventInfo = event.eventDetailsInfo;
        const celebrityInfo = eventInfo.celebrityInfo;
        const celebrityHtml = celebrityInfo.map((cele, index) => {
            let temp = cele.firstName + " ";
            if (cele.lastName) {
                temp = temp + cele.lastName;
            }
            if (cele.motherName) {
                temp = temp + " " + cele.motherName;
            }
            if (cele.email) {
                temp = temp + "<" + cele.email + ">";
            }
            if (index !== celebrityInfo.length - 1) {
                temp = temp + ", "
            }
            return temp;
        })
        const cardNumberHtml = dilisaCardInfo && dilisaCardInfo.map((card, index) => {
            let temp = "Tarjeta Liverpool " + card.firstName + " " + card.lastName + " " + card.cardNumber.toString().replace(/\d(?=\d{4})/g, "x");
            if (index !== dilisaCardInfo.length - 1) {
                temp = temp + ", "
            }
            return temp;
        })

        const updatedAddresses = this.props.eventAddresses && this.props.eventAddresses.deliveryAddressInfo && this.props.eventAddresses.deliveryAddressInfo.addresses
        return (
            <div className="container main-container toPrint display-hidden">
                <DownloadPrintHeader />
                <div className="row">
                    <div className="col-xs-12">
                        <div className="container-full white shadow mt-30">
                            <div className="row eventSummary">
                                <div className="col-md-12">
                                    <p><b>Festejados: </b>{celebrityHtml}</p>
                                    <p><b>Fecha del evento: </b>{eventInfo.eventDate}</p>
                                    <p><b>Tipo de evento:</b> {eventInfo.eventType} </p>
                                    <p><b>Número de evento: </b>{eventInfo.eventId}  </p>
                                    <p><b>Fecha de creación del evento :</b> {eventInfo.additionalInfo.creationDate}</p>
                                    {updatedAddresses && <div><b>Direcciones: </b> {updatedAddresses.map((address, index) =>
                                        <React.Fragment>
                                            {index > 0 &&
                                                <br />
                                            }
                                            <span>
                                                {address.address1}, Ext. {address.exteriorNumber}{address.interiorNumber ? ', Int. ' + address.interiorNumber : ''}{address.building ? ', ' + address.building : ''} {address.city}{address.neighbourhood ? ', ' + address.neighbourhood : ''}{address.delegationMunicipality ? ', ' + address.delegationMunicipality : ''}, C.P.{address.postalCode}, {address.country}, {address.state}
                                            </span>
                                        </React.Fragment>
                                    )
                                    }</div>}
                                    <p><b>{eventInfo.employee && "Evento de empleado"}</b></p>
                                    {dilisaCardInfo && <p><b>Tarjetas asignadas :</b> {cardNumberHtml}</p>}
                                    {/* <p>{dilisaCardInfo && "Tarjetas asignadas :" + cardNumberHtml} </p> */}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <h1 className="titleSection m-30 eventManagementContract"> Contrato Mesa de regalos - {event && event.eventDetailsInfo && event.eventDetailsInfo.eventType}</h1>
                                </div>
                            </div>
                            <div className="row p-30 nmh">
                                <div className="col-md-12 contract-container pdfContent">
                                    <p dangerouslySetInnerHTML={{ __html: contractHtml }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PrintContract;