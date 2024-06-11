import React from 'react'

const RecibidosDownloadGuestMessages = {
    generateTemp(json) {
        console.log("json", json)
        return (
            <html>
                <head>
                    <link rel="stylesheet" href='../../../../../static/assets/css/common-print.css' />
                    {/* <style type="text/css">
                        @media print {
                            @page {
                            size: 330mm 427mm;
                            margin-top: 4cm;
                            margin-bottom: 2cm;
                            margin-left: 2cm;
                            margin-right: 2cm;
                    }}
                </style> */}
                </head>
                <body>
                    <React.Fragment>
                        <div className="col-xs-8">
                            <h3>
                                <p>Tus Mensages de Felicitacion</p>
                            </h3>
                            <p><b>Mensages que tus invitados te han hencho con sus regalos</b></p>
                        </div>
                        <div className="col-xs-4 text-right event">
                            <p>Numero de Evento: {json.eventId}</p>
                            <p>Tipo de evento: {json.eventType}</p>
                            <p>Fecha del evento: {json.eventDate}</p>
                        </div>
                        <div>
                            {json.messageInfo && json.messageInfo.length > 0 ? json.messageInfo.map((data, index) =>
                                <table>
                                    <tr>
                                        <ul>
                                            {data.guestName && <li>{data.guestName}</li>}
                                            {data.guestEmail && <li>{data.guestEmail}</li>}
                                            {data.message && <li>{data.message}</li>}
                                        </ul>
                                    </tr>
                                </table>
                            ) : <div>No messages available</div>
                            }
                        </div>
                    </React.Fragment>
                </body>
            </html>
        )
    }
}
export default RecibidosDownloadGuestMessages;