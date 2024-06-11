
import React, { Component } from 'react';
import Button from '../../../../../lib/ZUILib/Button'
import { getMessages } from '../../actions'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';

@connect(
    store => ({
        data: store.regalorecibidos.getMessageData,
        loading: store.regalorecibidos.getMessageDataLoading,
        fail: store.regalorecibidos.getMessageDataFailed,

    }),
    { getMessages },
)
class ViewMessageModal extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false,
            itemId: ''
        };
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    handleShow(params, id) {
        this.setState({
            show: true,
            itemId: id
        });
        this.props.getMessages(params);
    }

    handleClose() {
        document.body.classList.remove('modal-open');
        this.setState({
            show: false,
            itemId: ''
        });
    }
    render() {
        const { data, fail, loading } = this.props;
        return (
            <Modal content="w300 br0 modal-sm centeredh" show={this.state.show} onHide={this.handleClose} className="modal fade" tabIndex={-1} role="dialog" id="modalVerMensaje">
                <ModalHeader className="modal-header" closeButton handleClose={this.handleClose}>
                    <ModalTitle className="mainTitle modalTitle">VER MENSAJE INVITADO</ModalTitle>
                </ModalHeader>
                <ModalBody className="grid-centered-big">
                    {
                        fail ? <div className="row">Intente nuevamente más tarde</div> :
                            loading ? <div className="row">Cargando página..</div> :
                                <React.Fragment>
                                    {data && data.messageInfo ? <div className="row">
                                        <div className="col-xs-12 mv-15">
                                            <p className="labelDetail">Invitado :</p>
                                            <p className="textDetail">{data.messageInfo.messageFrom}</p>
                                            <p className="labelDetail">Correo Electrónico:</p>
                                            <p className="textDetail">{data.messageInfo.guestEmail}</p>
                                            <p className="labelDetail">Mensaje para los festejados:</p>
                                            <p className="textDetail">{data.messageInfo.customerMsg}</p>
                                        </div>
                                        <div className="col-xs-12 mb-15">
                                            <Button uiname="RecibidosDeleteMessage" className="btnSecondary btnFull" id="edit" onClick={(action, data, itemId) => this.props.onMessageAction("edit", this.props.data, this.state.itemId)}>Editar</Button>
                                        </div>
                                        <div className="col-xs-12 mb-15">
                                            <Button uiname="RecibidosDeleteMessage" className="btnDelete btnFull" id="delete" onClick={(action, data, itmeId) => this.props.onMessageAction("delete", this.props.data, this.state.itemId)}>Eliminar</Button>
                                        </div>
                                    </div> : null}
                                </React.Fragment>
                    }
                </ModalBody>

            </Modal>
        )
    }
}

export default ViewMessageModal;