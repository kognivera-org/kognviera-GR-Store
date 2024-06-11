import React, { Component } from 'react';
import Image from 'lib/ZUILib/Image';
class MessagesInfo extends Component {
    constructor(props) {
        super(props);
        this.idx = 1
    }
    addPageBreak = () => {
        this.idx = 0
        return <span className="pageBreak" />
    }
    render() {
        let messageData = "";
        if (this.props.message) {
            messageData = this.props.message.messageInfo.map((messageInfo, i) => {
                this.idx++
                return (
                    <React.Fragment>
                        <div key={i} style={{ "height": "90px", "padding-bottom": "5px" }}>
                            <ul>
                                <li>
                                    <h3>{messageInfo.guestName} </h3>
                                    <h4>{messageInfo.guestEmail} </h4>
                                    <h4>{messageInfo.message} </h4>
                                </li>
                            </ul>
                        </div>
                        <br />
                        {(this.idx % 13) === 0 && i !== (this.props.message.messageInfo.length - 1) && this.addPageBreak()}
                    </React.Fragment >
                );
            });
        }
        return (
            <div className="receivedGiftsMessages toPrint display-hidden" >
                <div className="container">
                    <div className="row">
                        <div className="col-xs-9">
                            <div className="box1">
                                <h3 style={{ margin: '10px 0' }}>Tus mensajes de felicitacion</h3>
                                <h6 style={{ margin: '10px 0' }}>Mensajes que tus invitados te han hecho con sus regalos.</h6>
                            </div>
                        </div>
                        <div className="col-xs-3 text-right">
                            <div className="box1">
                                <p><b>Numero de Evento:</b> {this.props.message ? this.props.message.eventId : ''}</p>
                                <p><b>Tipo de Evento:</b> {this.props.message ? this.props.message.eventType : ''}</p>
                                <p><b>Fecha del Evento:</b> {this.props.message ? this.props.message.eventDate : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ maxWidth: "960px", width: "100%", clear: 'both' }}>
                        {messageData}
                    </div>
                </div >
            </div >
        )
    }
}
export default MessagesInfo;