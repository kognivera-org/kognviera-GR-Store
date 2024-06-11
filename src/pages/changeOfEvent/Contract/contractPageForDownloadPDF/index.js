
import React, { Component } from 'react';
import { connect } from 'react-redux'
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader';

@connect(
    store => ({
        eventAddresses: store.eventAddresses && store.eventAddresses.eventDeliveryAddressData && store.eventAddresses.eventDeliveryAddressData.deliveryAddressInfo && store.eventAddresses.eventDeliveryAddressData.deliveryAddressInfo.addresses,
        eventData: store.createevent.eventData,
        contract: store.contract.data,
        changeOfEvent: store.changeOfEvent,
        eventDetailsInfo: store.eventdashboard.eventData.eventDetailsInfo,
        eventId: store.eventdashboard.eventData.eventDetailsInfo && store.eventdashboard.eventData.eventDetailsInfo.eventId,
    }),
)
class ContractPageForDownloadPDF extends Component {
    render() {
        const { eventData, contract, changeOfEvent, eventDetailsInfo, eventId, eventAddresses } = this.props;
        const contractData = contract
            && contract.contractDetailsInfo
            && contract.contractDetailsInfo.contractdata;
        const deletedAddIds = changeOfEvent.deletedAddressInfo && changeOfEvent.deletedAddressInfo.map(delAddr => delAddr.addressId);
        const updatedAddresses = this.props.eventAddresses && this.props.eventAddresses.filter((addr) => {
            return deletedAddIds && deletedAddIds.indexOf(addr.addressId) < 0
        });
        let currentDate = new Date();
        currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();
        return (
            <div className="container toPrint display-hidden">
                <DownloadPrintHeader />
                <div className="col-xs-12">
                    <div className="row eventSummary">
                        {eventData && eventDetailsInfo && <div className="p-t-20">
                            <div><b>Festejados: </b> {changeOfEvent.celebrityInfos && changeOfEvent.celebrityInfos.map((celeb, index) =>
                                <React.Fragment>
                                    {index > 0 &&
                                        <React.Fragment>
                                            ,&nbsp;
                                    </React.Fragment>
                                    }
                                    <span>{celeb.firstName} {celeb.lastName}{celeb.middleName ? ' ' + celeb.middleName : ''}{celeb.motherName ? ' ' + celeb.motherName : ''}{celeb.maternalName ? ' ' + celeb.maternalName : ''} {celeb.email && `<${celeb.email}>`}</span>
                                </React.Fragment>
                            )}
                            </div>
                            <div><b>Fecha del evento: </b> <span>{eventDetailsInfo.eventDate}</span></div>
                            <div><b>Tipo de evento: </b> <span>{eventData.GRType.tipoCelebracion}</span></div>
                            <div><b>Numero de evento: </b> <span>{eventId}</span></div>
                            <div><b>Fecha de creacion del evento: </b> <span>{currentDate}</span></div>
                            <div><b>Direcciones: </b> {updatedAddresses.map((address, index) =>
                                <React.Fragment>
                                    {index > 0 &&
                                        <br />
                                    }
                                    <span>
                                        {address.address1}, Ext. {address.exteriorNumber}{address.interiorNumber ? ', Int. ' + address.interiorNumber : ''}{address.building ? ', ' + address.building : ''} {address.city}{address.neighbourhood ? ', ' + address.neighbourhood : ''}{address.delegationMunicipality ? ', ' + address.delegationMunicipality : ''}, C.P.{address.postalCode}, {address.country}, {address.state}
                                    </span>
                                </React.Fragment>
                            )
                            }</div>
                            {eventDetailsInfo && eventDetailsInfo.employee && <div>
                                <div> <b>Evento de empleado</b></div>
                                {changeOfEvent.PlasticCardsInfo && changeOfEvent.PlasticCardsInfo.length > 0 && <div> <b>Tarjetas asignadas: </b> {changeOfEvent.PlasticCardsInfo.map((data, id) => <span>{data.firstName}&nbsp;{data.lastName} xxxxxxxxxxxx{data.plasticCardNumber.slice(-4)}{id !== changeOfEvent.PlasticCardsInfo.length - 1 && ', '}</span>)}<span />
                                </div>}
                            </div>}
                        </div>}
                        <div className="col-xs-4" />
                        <div className="col-xs-12">
                            <h1 className="titleSection m-30">Contrato - Evento de {this.props.eventData && this.props.eventData.GRType && this.props.eventData.GRType.tipoCelebracion}</h1>
                        </div>
                        <div className="col-xs-4" />
                    </div>

                    <div className="innerWrap contractWrapper">
                        <div className="col-md-12 contract-container pdfContent">
                            <p className="mainText">Contrato para la mesa de regalos de Liverpool</p>
                            <p className="informativeText" dangerouslySetInnerHTML={{ __html: contractData }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContractPageForDownloadPDF;
