
import React, { Component } from 'react';
import { connect } from 'react-redux'
import DownloadPrintHeader from '../../../../../components/DownloadPrintHeader';

@connect(
    store => ({
        contract: store.contract.data,
        eventData: store.createevent.eventData,
    }),
)

class ContractPageForDownloadPDF extends Component {

    render() {
        const { eventData } = this.props; // eslint-disable-line no-shadow
        let contractData = null
        const contractInfo = this.props.contract.contractDetailsInfo

        for (const key in contractInfo) {
            contractData = contractInfo.contractdata
        }
        const eventAddresses = eventData && eventData.eventAddresses;
        let currentDate = new Date();
        currentDate = currentDate.getDate() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear();
        return (
            <div className="container toPrint display-hidden">
                <DownloadPrintHeader />
                <div className="col-xs-12">
                    <div className="row eventSummary">
                        {eventData && <div className="p-t-20">
                            <div><b>Festejados: </b> <span>{eventData.ownerInfo.firstName}{eventData.ownerInfo.middleName ? ' ' + eventData.ownerInfo.middleName : ''} {eventData.ownerInfo.lastName}{eventData.ownerInfo.maternalName ? ' ' + eventData.ownerInfo.maternalName : ''}&lt;{eventData.ownerInfo.emailId}&gt;</span>
                                {eventData.coownerInfo && <React.Fragment>, <span>{eventData.coownerInfo.firstName} {eventData.coownerInfo.lastName}{eventData.coownerInfo.maternalName ? ' ' + eventData.coownerInfo.maternalName : ''} {eventData.coownerInfo.emailId && `<${eventData.coownerInfo.emailId}>`}</span></React.Fragment>}</div>
                            <div><b>Fecha del evento: </b> <span>{eventData.eventDate}</span></div>
                            <div><b>Tipo de evento: </b> <span>{eventData.GRType.tipoCelebracion}</span></div>
                            <div><b>Fecha de creacion del evento: </b> <span>{currentDate}</span></div>
                            <div><b>Direcciones: </b> {Object.keys(eventAddresses).map((key, index) =>
                                <React.Fragment>
                                    {index > 0 &&
                                        <br />
                                    }
                                    <span>
                                        {eventAddresses[key].address1}, Ext. {eventAddresses[key].exteriorNumber}{eventAddresses[key].interiorNumber ? ', Int. ' + eventAddresses[key].interiorNumber : ''}{eventAddresses[key].building ? ', ' + eventAddresses[key].building : ''} {eventAddresses[key].city}{eventAddresses[key].neighbourhood ? ', ' + eventAddresses[key].neighbourhood : ''}{eventAddresses[key].delegationMunicipality ? ', ' + eventAddresses[key].delegationMunicipality : ''}, C.P.{eventAddresses[key].postalCode}, {eventAddresses[key].country}, {eventAddresses[key].state}
                                    </span>
                                </React.Fragment>
                            )
                            }</div>
                            {eventData.GRType.isEmployeeEvent && <div>
                                <div><b>Evento de empleado</b></div>
                                {eventData.employeeCardData && eventData.employeeCardData.length > 0 && <div> <b>Tarjetas asignadas: </b> {eventData.employeeCardData.map((data, id) => <span>{data.firstName}&nbsp;{data.lastName} xxxxxxxxxxxx{data.cardNumber.slice(-4)}{id !== eventData.employeeCardData.length - 1 && ', '}</span>)}</div>}
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
                            <p className="mainText col-xs-12">Contrato para la mesa de regalos de Liverpool</p>
                            <p className="informativeText" dangerouslySetInnerHTML={{ __html: contractData }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContractPageForDownloadPDF;
