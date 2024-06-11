import React, { Component } from 'react';
import GiftAndShoppingModel from './giftAndShoppingModel';
import routeconfig from 'config/routeconfig';
import Link from 'lib/ZUILib/Link';
import CommonUtil from '../../../../../utils/commonUtil';

class GiftAndShopping extends Component {
    handleAddGiftCardModal = () => {
        this.GiftAndShoppingModel.handleShow();
    }

    renderContent = (giftPurchaseData) => {
        const giftsData = giftPurchaseData.giftsAndPurchasesInfo;
        const dashboardUserValid = CommonUtil.isDashboardUserValid(this.props.dashboardUser);
        return (
            !this.props.fail ?
                <div>
                    <h3>REGALO Y COMPRAS</h3>
                    {giftsData && !giftsData.message ?
                        <React.Fragment>
                            <GiftAndShoppingModel onRef={ref => (this.GiftAndShoppingModel = ref)} />
                            <div className="giftRow">
                                <div className="blockNumber">{giftsData.giftRegistered}</div>
                                <Link uiname="EventDashboardRegistrados" to={CommonUtil.generateRedirect(routeconfig.registeredgifts, { eventId: this.props.eventId })}>
                                    <div className="details" > Regalos registrados</div>
                                    <div className="arrow"><i className="icon-flecha_gruesa_derecha" /></div></Link>
                            </div>
                            <div className="giftRow">
                                <div className="blockNumber">{giftsData.giftReceived}</div>
                                <Link uiname="EventDashboardRecibidos" className="giftRow" to={CommonUtil.generateRedirect(routeconfig.receivedgifts, { eventId: this.props.eventId })}>
                                    <div className="details" >Regalos recibidos</div>
                                    <div className="arrow"><i className="icon-flecha_gruesa_derecha" /></div></Link>
                            </div>
                            <div className="giftRow">
                                <div className="blockNumber">{giftsData.personalPurchase}</div>
                                <Link uiname="EventDashboardPersonales" className="giftRow" to={CommonUtil.generateRedirect(routeconfig.personalpurchase, { eventId: this.props.eventId })}>
                                    <div className="details" > Compras personales</div>
                                    <div className="arrow"><i className="icon-flecha_gruesa_derecha" /></div></Link>
                            </div>
                            <span>

                                <Link uiname="EventDashboardInitiateReturn" disabled={!dashboardUserValid} className="linkAction" to={CommonUtil.generateRedirect(routeconfig.searchforreturn, { eventId: this.props.eventId })}>
                                    Realizar devoluciones
                                </Link>
                            </span>
                        </React.Fragment>
                        :
                        <span>{giftsData && giftsData.message}</span>
                    }
                </div>
                :
                <h3>Try again later.</h3>
        )
    }
    render() {
        const { giftPurchaseData, loading, fail } = this.props;

        return (
            <div className="col-xs-6">
                <div className="boxStyle boxLarge">

                    {
                        this.props.loading ?
                            <h3>Loading</h3> :
                            this.renderContent(giftPurchaseData)
                    }
                </div>
            </div>
        )
    }
}

export default GiftAndShopping;
