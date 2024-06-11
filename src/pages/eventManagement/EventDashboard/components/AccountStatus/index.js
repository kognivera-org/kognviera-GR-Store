import React, { Component } from 'react';
import Link from 'lib/ZUILib/Link';
import routeconfig from '../../../../../config/routeconfig';
import commonUtil from '../../../../../utils/commonUtil';
import appconfig from '../../../../../config/appconfig';

class AccountStatus extends Component {
    renderContent = () => {
        const eventId = this.props.eventId;
        const eventDetails = this.props.eventdetail;
        const eventCategory = eventDetails.eventDetailsInfo && eventDetails.eventDetailsInfo.eventCategory;
        const eventAccountInfo = this.props.eventAccountStatementData.eventAccountStatementInfo;
        const itemsInfo = eventAccountInfo && eventAccountInfo.itemsInfo;
        const physicalItemQuantity = itemsInfo && itemsInfo.physicalItemInfo ? itemsInfo.physicalItemInfo.totalPurchasedItems : 0;
        const physicalItemAmount = itemsInfo && parseFloat(itemsInfo.physicalItemInfo ? itemsInfo.physicalItemInfo.totalPurchasedAmount : 0).toFixed(2);
        const electronicItemQuantity = itemsInfo && itemsInfo.electronicItemInfo ? itemsInfo.electronicItemInfo.totalPurchasedItems : 0;
        const electronicItemAmount = itemsInfo && parseFloat(itemsInfo.electronicItemInfo ? itemsInfo.electronicItemInfo.totalPurchasedAmount : 0).toFixed(2);
        const personalItemQuantity = itemsInfo && itemsInfo.personalItemInfo ? itemsInfo.personalItemInfo.totalPurchasedItems : 0;
        const personalItemAmount = itemsInfo && parseFloat(itemsInfo.personalItemInfo ? itemsInfo.personalItemInfo.totalPurchasedAmount : 0).toFixed(2);
        const totalPurchasedItems = itemsInfo && itemsInfo.totalPurchasedItemsCount;
        const totalAmount = eventAccountInfo && eventAccountInfo.amountInfo ? eventAccountInfo.amountInfo.totalPurchasedAmount : 0;
        const bonusAmount = eventAccountInfo && parseFloat(eventAccountInfo.amountInfo ? eventAccountInfo.amountInfo.totalBonusAmount : 0).toFixed(2);
        const transferableAmount = eventAccountInfo && parseFloat(eventAccountInfo.amountInfo ? eventAccountInfo.amountInfo.transferableAmount : 0).toFixed(2);
        const isBonusContainerVisible = commonUtil.isBonusAvailable(eventDetails && eventDetails.eventDetailsInfo);
        return (
            !this.props.fail ?
                <div>
                    <Link uiname="EventDashboardAccountStatement" to={commonUtil.generateRedirect(routeconfig.statementaccountsummary, { eventId })}>
                        <h3 className="accountStateTitle">ESTADO DE CUENTA
                        {/* <Link to={commonUtil.generateRedirect(routeconfig.statementaccountsummary, { eventId: eventId })}> */}
                            <i className="icon-flecha_gruesa_derecha" />
                            {/* </Link> */}
                        </h3>
                    </Link>
                    <span className="borderRow">
                        <p>Total de regalos y compras personales: <b>{totalPurchasedItems}</b></p>
                        <p> <b>{commonUtil.getCurrency(totalAmount)}</b></p>
                    </span>
                    <span className="borderRow">
                        <p>Regalos fisicos: <b>{physicalItemQuantity}</b></p>
                        <p><b> {commonUtil.getCurrency(physicalItemAmount)}</b></p>
                    </span>
                    <span className="borderRow">
                        <p>Regalos electrónicos: <b>{electronicItemQuantity}</b></p>
                        <p><b>{commonUtil.getCurrency(electronicItemAmount)}</b></p>
                    </span>
                    <span className="borderRow">
                        <p>Compras personales: <b>{personalItemQuantity}</b></p>
                        <p><b>{commonUtil.getCurrency(personalItemAmount)}</b></p>
                    </span>
                    {isBonusContainerVisible ?
                        <span className="borderRow">
                            <p>Aproximado de bono a monedero:</p>
                            <p><b> {commonUtil.getCurrency(bonusAmount)}</b></p>
                        </span>
                        : null}
                    <span className="borderRow">
                        <p>Disponible para retiro:</p>
                        <p> <b>{commonUtil.getCurrency(transferableAmount)}</b></p>
                    </span>
                </div>
                :
                <h3>Try again later</h3>
        );
    }
    render() {
        const { eventAccountStatementData, loading, fail } = this.props;
        return (

            <div className="col-xs-12">
                <div className="boxStyle boxLarge">
                    {
                        this.props.loading ?
                            <h3>Loading</h3> :
                            this.renderContent()
                    }
                </div>
            </div>

        );
    }

}
export default AccountStatus;
