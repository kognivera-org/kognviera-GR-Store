import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import commonUtil from '../../../../utils/commonUtil';

class ChangeTypeModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render() {
        const { labels } = this.props
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose} id="eventChangeModal" className="modal fade modal-custom">
                    {/* <div className="modal-dialog modal-sm">
                        <div className="modal-content"> */}
                    <ModalBody>
                        <button onClick={this.handleClose} className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                        <div className="col-xs-12">
                            {/* <p>{labels && labels['dashboard.eventType.change.message']}</p> */}
                            <p>{commonUtil.getLabel(labels, 'dashboard.eventType.confirmation.message')}</p>
                        </div>
                        <div className="row show-grid-row">
                            <div className="col-xs-6">
                                <button className="btnSecondaryAction size-Full" onClick={this.handleClose}>Cancelar</button>
                            </div>
                            <div className="col-xs-6">
                                <button className="btnPrimaryAction size-Full" onClick={this.props.onAccept}>Aceptar</button>
                            </div>
                        </div>
                        {/* <button className="btnPrimary size-Full" onClick={this.props.onAccept}>Acceptar</button>
                                <button className="btnPrimary size-Full" onClick={this.handleClose}>Cancelar</button> */}
                    </ModalBody>
                    {/* </div>
                    </div> */}
                </Modal>
            </div>
        )
    }
}
export default ChangeTypeModal;

{/* <div className="modalContent">
    <div className="modal fade modal-custom" id="eventChangeModal" role="dialog">
        <div className="modal-dialog modal-sm">
            <div className="modal-content">
                <div className="modal-body">
                    <button className="close" type="button" data-dismiss="modal">×</button>
                    <div className="col-xs-12">
                        <p>{eventManagement && eventManagement['dashboard.eventType.change.message']}</p>
                    </div>
                    <div className="row show-grid-row">
                        <div className="col-xs-6">
                            <button className="btnSecondaryAction size-Full" data-dismiss="modal">Cancelar</button>
                        </div>
                        <div className="col-xs-6">
                            <button className="btnPrimaryAction size-Full" data-dismiss="modal">Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> */}