
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from '../../../../lib/ZUILib/Link'
import { updateBonusInfoReq } from './requests';
import Image from '../../../../lib/ZUILib/Image';
import commonUtil from '../../../../utils/commonUtil'
import appconfig from '../../../../config/appconfig'
// @connect(
//     store => ({
//         bonusData: store.personalPurchase.bonusData
//     }),
//     { ...updateBonusInfo },
// )
export default class GiftDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentBonusInfo: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resetBonus) {
            this.setState({ currentBonusInfo: '' })
        }
    }

    getParams = () => {
        let eventId = this.props.eventId;
        let channel = 'INSTORE';
        let itemId = '';
        let bonusSelection = '';
        let params = {
            'eventId': eventId,
            // 'channel': channel,
            'brand': this.props.brand,
            "itemId": itemId,
            "bonusSelection": bonusSelection,
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
        console.log('this.state.bonus,e', this.state['bonus' + e], e)
    }
    getSelectedBonusType = (event, itemId) => {
        let params = this.getParams();
        const bonusSelection = event.target.title
        params = {
            ...params,
            "itemId": itemId,
            "bonusSelection": bonusSelection
        }
        updateBonusInfoReq(params, (response) => {
            if (response && response.data && response.data.status && response.data.status.status
                && response.data.status.status.toLowerCase() === 'success') {
                this.setState({ currentBonusInfo: bonusSelection === 'APPLICA' ? 'true' : 'false' })
            }
        });
    }
    getMessageLink(product) {
        if (product.messageInfo === 'none' || product.messageInfo === '') {
            return (<div className="mensaje centeredh"><a className="verMensaje" onClick={(e) => this.props.openMessageModal(e, product)} title="Sin Mensaje">Sin mensaje</a></div>)
        } else {
            return (<p className="iClass icon-estado_de_mensaje_aprobado aprobado"><a className="verMensaje" onClick={(e) => this.props.openMessageModal(e, product)} title="Ver Mensaje">Ver mensaje</a></p>)
        }
    }
    getTrackOrderLink(product) {
        switch (product.deliveryStatus) {
            case 'Devolucion':
                return (<p className="status"><span className="status-grey">Devolución</span></p>)
                break;
            case 'Cancelado':
                return (<p className="status"><span className="status-grey">Cancelado</span></p>)
                break;
            case 'Entregado en tienda':
                return (<p className="status"><span className="status-green">Entregado en tienda</span></p>)
                break;
            case 'Regalo electronico':
                return (<p className="status"><span className="status-green">Regalo Electrónicos</span></p>);
                break;
            case 'Devoluciòn con Reinveriòn':
                return (<p className="status"><span className="status-grey">Devolución con Reinversión</span></p>);
                break;
            case 'Estatus de entrega':
                if (product.pedidoNo != undefined && product.pedidoNo != '') {
                    return (<Link uiname="PersonalesViewOrderTracking" className="statusAction" onClick={(e) => this.openTrackOrder(e, product)} title="title">{product.deliveryStatus}</Link>)
                }
                break;
        }
    }
    render() {
        const { product } = this.props
        const isBonusContainerVisible = commonUtil.isBonusAvailable(this.props.event);
        const currentBonusInfo = this.state.currentBonusInfo ? this.state.currentBonusInfo : product.bonusInfo
        let modeoDelivery = 'icon-bandera_regalo_fisico';
        let applyFrBonusClass = ''; let showDrdp = false;
        let bonusMsg
        let validaStatus = '';
        if (product.actionType.toLowerCase() === 'purchase' || product.actionType.toLowerCase() === 'returnreinvested') {
            showDrdp = true;
            if (currentBonusInfo === 'true') {
                applyFrBonusClass = 'selected iClass icon-check icono-select green';
                // } else if (currentBonusInfo === 'false' && product.bonusMessage === 'Extemporaneo') {
                //     applyFrBonusClass = 'selected iClass icon-tache2 icono-select grey';
                //     // validaStatus = 'Extemporáneo'

                // }
            }
            else {
                applyFrBonusClass = 'selected iClass icon-tache2 icono-select grey';
                // validaStatus = 'No válida'
                validaStatus = product.bonusMessage
            }
        } else {
            bonusMsg = product.bonusMessage;
            applyFrBonusClass = 'selected iClass icon-tache2 icono-select grey';
        }
        if (product.modeofDelivery === 'electronic') {
            modeoDelivery = 'icon-bandera_regalo_electronico';
        }

        return (
            <tr>
                <td className="imgProduct">
                    <Image className="img-detail" src={product.imageURL} alt={product.displayName} altimg={appconfig.defaultImage} />
                </td>
                <td className="detailsTable">
                    <p> {product.displayName} </p>
                    <p>SKU: <span>{product.skuId}</span></p>
                    <Link uiname="PersonalesViewPurchaseDetails" className="detailAction" onClick={(e) => this.openViewPurchaseData(e, product)} title="title">ver detalle</Link>
                    {this.getTrackOrderLink(product)}
                </td>
                <td className="price">
                    <p className="priceLabel">{commonUtil.getCurrency(product.price)}</p>
                </td>
                <td className="alignCenter">
                    {product.quantity}
                </td>
                <td className="detailLabel">
                    <p>Fecha: <span>{product.purchaseInfo && product.purchaseInfo.dateofPurchase}</span></p>
                    <p>Almacen: <span>{product.purchaseInfo && product.purchaseInfo.warehouseInfo}</span></p>
                    <p>Dirección de entrega: <span>{product.purchaseInfo && product.purchaseInfo.deliveryAddress}</span></p>
                </td>
                {isBonusContainerVisible &&
                    <td className="selectAddress">
                        <Link uiname="PersonalesMarkUnmarkBonus" className="bono centeredh" onClick={(e) => this.bonusApplicableCheck(product.skuId, product.modeofDelivery)}>
                            <div className="custom-select" >
                                <span className={applyFrBonusClass}>{!showDrdp && bonusMsg && <span className="devolucion">{bonusMsg}</span>}{showDrdp && validaStatus && <span className="devolucion">{validaStatus}</span>}</span>
                                {this.state['bonus' + product.skuId] && showDrdp ?
                                    <React.Fragment>
                                        <ul className="listaselect" onClick={(e) => this.getSelectedBonusType(e, product.purchaseItemId)}>
                                            <li title='APPLICA'>Aplica</li>
                                            <li title='NOVALIDA'>No válida</li>
                                        </ul> <span className="triangulosup" />
                                    </React.Fragment> :
                                    (showDrdp && product.modeofDelivery === 'physical' && <span className="trianguloinf" />)}
                            </div>
                        </Link></td>}
            </tr>
        )
    }
}