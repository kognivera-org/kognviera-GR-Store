import React, { Component } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import { getTrackOrderData } from '../../actions';
import { connect } from 'react-redux';
@connect(
    store => ({
        data: store.regalorecibidos.trackOrderData,
        loading: store.regalorecibidos.trackOrderDataLoading,
        failed: store.regalorecibidos.trackOrderDataFailed,
    }),
    {
        getTrackOrderData
    }
)

class DeliveryStatusModal extends Component {
    componentWillMount = () => {

    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            show: false
        };

    }
    handleShow(params) {
        this.setState({
            show: true
        });
        this.props.getTrackOrderData(params);
    }
    handleClose() {
        document.body.classList.remove('modal-open');
        this.setState({
            show: false
        });
    }
    handleTransformDate(data){
     
        return data==='01 de enero' ? 'Por confirmar':data;
   
    }
    render() {
        let data = this.props.data;
        return (

            <Modal content="w300" show={this.state.show} onHide={this.handleClose} className="modal fade centeredh" tabIndex={-1} aria-labelledby="mySmallModalLabel" id="modalEstatusEntrega">

                <ModalHeader handleClose={this.handleClose}>
                    <ModalTitle >Seguimiento a entrega</ModalTitle>
                </ModalHeader>

                <ModalBody >
                    {
                        this.props.failed ?
                            'Intente nuevamente más tarde' :

                            this.props.loading ? 'Cargando página...'
                                :
                                <div className="row m-row">
                                    <div className="col-md-12 mt-15">
                                        <p className="subtitle">No. de pedido {data != undefined && data.orderTrackInfo.pedidoNo}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <p className="textDetail">Estatus de entrega:</p>
                                    </div>
                                    <div className="col-md-12">
                                        <p className="green textDetail">{data != undefined && data.orderTrackInfo.deliveryStatus}</p>
                                    </div>
                                    <div className="col-md-12">
                                        <p className="textDetail">Fecha estimada de entrega:</p>
                                    </div>
                                    <div className="col-md-12">
                                        <p className="green textDetail">{this.handleTransformDate(data != undefined && data.orderTrackInfo.estimatedDeliveryDate)}</p>
                                    </div>
                                </div>
                    }
                </ModalBody>

            </Modal>


        )
    }
}

export default DeliveryStatusModal;