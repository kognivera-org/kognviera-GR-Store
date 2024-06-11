
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from '../../../../lib/ZUILib/Link';
import { updateBonusInfoReq } from '../../personalPurchase/giftDetail/requests'
import Image from '../../../../lib/ZUILib/Image';
import appconfig from '../../../../config/appconfig';
import commonUtil from '../../../../utils/commonUtil';
@connect(
    store => ({
        messageActionItem: store.regalorecibidos.messageActionItem,
        labels: store.labels.labels,
    }),
)
export default class GiftDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentBonusInfo: '',
            message: '',
            // hide: false
        }
        this.values = {}
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.product) {
            this.setState({
                currentBonusInfo: nextProps.product.bonusInfo
            })
        }
    }
    getParams = () => {
        let eventId = this.props.eventId;
        let channel = 'INSTORE';
        let brand = this.props.brand;
        let params = {
            'eventId': eventId,
            'brand': brand,
            // 'channel': channel,

        };
        return params;
    }
    openViewPurchaseData = (e, product) => {
        this.props.onViewPurchaseDetail(product, product.purchaseTicketId);
    }
    openTrackOrder = (e, product) => {
        this.props.onTrackOrder(product);
    }
    bonusApplicableCheck = (e, modeofDelivery) => {
        if (modeofDelivery === 'physical') {
            this.setState({
                ['bonus' + e]: !(this.state['bonus' + e])
            })
        }
    }
    getSelectedBonusType = (event, sku) => {
        let params = {};
        let bonusSelection = event.target.id;
        params = {
            ...this.getParams(),
            "bonusSelection": bonusSelection,
            "itemId": sku,
        }
        updateBonusInfoReq(params, (response) => {
            if (response && response.data && response.data.status && response.data.status.status
                && response.data.status.status.toLowerCase() === 'success') {
                this.setState({ currentBonusInfo: bonusSelection === 'APPLICA' ? 'true' : 'false' })
                // this.props.setFilterAgain();
            }
        });
    }
    getMessageLink(product) {

        let msgInfo = this.values['itemId' + product.purchaseItemId] !== undefined ? this.values['itemId' + product.purchaseItemId] : product.messageInfo
        if (msgInfo === 'none' || msgInfo === '') {
            return (<div className="mensaje centeredh"><Link uiname="RecibidosWriteNewMessage" className="verMensaje" onClick={(e) => this.props.openMessageModal(e, product)} title="Sin Mensaje">Sin mensaje</Link></div>)
        } else {
            return (<p className="iClass icon-estado_de_mensaje_aprobado aprobado"><Link uiname="RecibidosViewGuestMessage" className="verMensaje" onClick={(e) => this.props.openMessageModal(e, product)} title="Ver Mensaje">Ver mensaje</Link></p>)
        }
    }
    getTrackOrderLink(product) {
        switch (product.deliveryStatus) {
            case 'Devolucion':
                return (<p className="status"><span className="status-grey">Devolución</span></p>);
                break;
            case 'Cancelado':
                return (<p className="status"><span className="status-grey">Cancelado</span></p>);
                break;
            case 'Entregado en tienda':
                return (<p className="status"><span className="status-green">Entregado en tienda</span></p>);
                break;
            case 'Regalo electronico':
                return (<p className="status"><span className="status-green">Regalo Electrónicos</span></p>);
                break;
            case 'Devoluciòn con Reinveriòn':
                return (<p className="status"><span className="status-grey">Devolución con Reinversión</span></p>);
                break;
            case 'Estatus de entrega':
                if (product.pedidoNo != undefined && product.pedidoNo != '') {
                    return (<p className="status"><Link name="Recibidos" className="class" onClick={(e) => this.openTrackOrder(e, product)} title="title">{product.deliveryStatus}</Link></p>);
                }
                break;
        }
    }
    render() {
        const { product } = this.props
        const isBonusContainerVisible = commonUtil.isBonusAvailable(this.props.event);
        const currentBonusInfo = this.state.currentBonusInfo ? this.state.currentBonusInfo : product.bonusInfo
        let modeoDelivery = 'icon-bandera_regalo_fisico';
        let bonusMsg
        let applyFrBonusClass = '';
        let showDrdp = false;
        let validaStatus = '';
        if (product.actionType.toLowerCase() === 'purchase' || product.actionType.toLowerCase() === 'returnreinvested') {
            showDrdp = true;
            if (currentBonusInfo === 'true') {
                applyFrBonusClass = 'selected iClass icon-check icono-select green';
                // } else if (currentBonusInfo === 'false' && product.bonusMessage === 'Extemporaneo') {
                //     applyFrBonusClass = 'selected iClass icon-tache2 icono-select grey';
                //     validaStatus = 'Extemporáneo'
                // }
            }
            else {
                applyFrBonusClass = 'selected iClass icon-tache2 icono-select grey';
                validaStatus = product.bonusMessage
            }
        } else {
            bonusMsg = product.bonusMessage;
            applyFrBonusClass = 'selected iClass icon-tache2 icono-select grey';
        }
        if (product.modeofDelivery === 'electronic') {
            modeoDelivery = 'icon-bandera_regalo_electronico';
        }
        let messageInfo = ''
        if (this.props.messageActionItem.itemId == product.purchaseItemId) {
            messageInfo = this.props.messageActionItem.action
            this.values = {
                ...this.values,
                ['itemId' + product.purchaseItemId]: messageInfo
            }
        }

        return (
            <tr>
                <td className="imgProduct">
                    <Image className="img-detail" alt={product.displayName} src={product.imageURL} altimg={appconfig.defaultImage} />
                </td>
                <td className="detailsTable">
                    <p className="detailTitle"> {product.displayName} </p>
                    <p className="detailSKU">SKU: {product.skuId}</p>
                    <p className="detailLink"> <Link uiname="RecibidosViewPurchaseDetails" className="verDetalle" onClick={(e) => this.openViewPurchaseData(e, product)} title="title">ver detalle</Link></p>
                    {this.getTrackOrderLink(product)}
                </td>
                <td className="price">
                    {/* <p className={product.deliveryStatus !== 'Devolucion' ? "detailPrice" : "detailPrice gray-font"}>$ {product.price}</p> */}
                    <p className="align-center">$ {product.price}</p>
                    <p className="align-center"><span className={"iClass " + modeoDelivery} /> {product.modeofDelivery === "physical" ? "físicos" : "electrónicos"}</p>
                    {product.actionType === "returnReinvested" && <p className=" detailPrice tooltip-container">Abono a dinero electronico<span className="tooltip-box">{commonUtil.getLabel(this.props.labels, 'adminpage.regalosrecibidos.return.reinvested.conversion.tooltip')}</span></p>}
                </td>
                <td className="alignCenter">
                    <p className="detailQuantity">{product.quantity}</p>
                </td>
                <td className="detailLabel">
                    <p className="infoDetail">Invitado: <span className="detail">{product.guestInfo.name}</span></p>
                    <p className="infoDetail">Fecha: <span className="detail">{product.guestInfo.dateofPurchase}</span></p>
                    {product.guestInfo.popupStore !== undefined && <p className="infoDetail">Almacén: <span className="detail">{product.guestInfo.popupStore}</span></p>}
                    {product.guestInfo.popupDelivery !== undefined && <p className="infoDetail">Dirección de entrega: <span className="detail">{product.guestInfo.popupDelivery}</span></p>}
                    {product.guestInfo.popupOwner !== undefined && <p className="infoDetail">Regalo para: <span className="detail">{product.guestInfo.popupOwner}</span></p>}
                </td>

                {isBonusContainerVisible &&
                    <td className="selectAddress">
                        <Link uiname="RecibidosMarkUnmarkBonus" className="bono centeredh" onClick={(e) => this.bonusApplicableCheck(product.purchaseItemId, product.modeofDelivery)}>
                            <div className="custom-select" >
                                <span className={applyFrBonusClass}>{!showDrdp && bonusMsg && <span className="devolucion">{bonusMsg}</span>}{showDrdp && validaStatus && <span className="devolucion">{validaStatus}</span>}</span>

                                {this.state['bonus' + product.purchaseItemId] && showDrdp ?
                                    <React.Fragment>
                                        <ul className="listaselect">
                                            <li id="APPLICA" onClick={(e) => this.getSelectedBonusType(e, product.purchaseItemId)}>
                                                Aplica
                                            </li>
                                            <li id="NOVALIDA" onClick={(e) => this.getSelectedBonusType(e, product.purchaseItemId)}>
                                                No válida
                                            </li>
                                        </ul> <span className="triangulosup" />
                                    </React.Fragment> :
                                    (showDrdp && product.modeofDelivery === 'physical' && <span className="trianguloinf" />)
                                }
                            </div>
                        </Link>
                    </td>
                }
                <td>
                    {this.getMessageLink(product)}
                </td>
            </tr >
        )
    }
}