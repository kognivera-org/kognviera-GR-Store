import React, { Component } from 'react';
import routeconfig from 'config/routeconfig';
import { connect } from 'react-redux';
import { deleteReturnItem, deleteInvalidReturnItem } from '../actions'
import commonUtil from '../../../utils/commonUtil';
import Image from 'lib/ZUILib/Image';


@connect(
    store => ({
        error: store.returnAndRefund.error,
        returnList: store.returnAndRefund.returnList
    }), { deleteReturnItem, deleteInvalidReturnItem }
)
class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failedReturnItemsInfo: this.props.returnList && this.props.returnList.failedReturnItemsInfo,
            showInvalid: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.showInvalid && nextProps.returnList && nextProps.returnList.failedReturnItemsInfo) {
            this.setState({
                failedReturnItemsInfo: nextProps.returnList.failedReturnItemsInfo,
                // showInvalid: nextProps.returnList.failedReturnItemsInfo.length == 0 ? false : true
            });
        }
    }

    eliminar = (e, purchaseItemId, skuId) => {
        if (purchaseItemId)
            this.props.deleteReturnItem(purchaseItemId);
        else {
            //this.props.deleteInvalidReturnItem(skuId);
            let failedReturnItemsInfo = this.state.failedReturnItemsInfo.filter(product => product.skuId != skuId);
            this.setState({
                failedReturnItemsInfo,
                showInvalid: failedReturnItemsInfo.length == 0 ? false : true
            });
        }
    }
    renderSearchResultTable = (value, key) => {
        return (
            <table key={key} className="product" >
                <thead>
                    <tr>
                        <td></td>
                        <td>SKU</td>
                        <td className="item">Producto</td>
                        <td>Tipo de compra</td>
                        <td>Cantidad</td>
                        <td>Precio</td>
                        <td>Total</td>
                        <td>Eliminar</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Image src={value.productImage} /></td>
                        <td>{value.skuId}</td>
                        <td className="item">{value.productName}</td>
                        <td>{value.purchaseType}</td>
                        <td>{value.quantity}</td>
                        <td>{commonUtil.getCurrency(value.unitPrice)}</td>
                        <td>{commonUtil.getCurrency(value.totalPrice)}</td>
                        <td>
                            <button onClick={(e) => { this.eliminar(e, value.purchaseItemId, value.skuId) }} className="non-printable exclude-for-print-download btnPrimarySpecial size-Medium">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table >
        )
    }

    clicked = () => {
        this.props.onConfirmClicked();
    }

    renderFailedReturnSearchResultTable(value, key) {
        return (
            <table key={key} className="product" >
                <thead>
                    <tr>
                        <td></td>
                        <td>SKU</td>
                        <td className="item">Producto</td>
                        <td>Tipo de compra</td>
                        <td>Cantidad</td>
                        <td>Precio</td>
                        <td>Total</td>
                        <td>Eliminar</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Image /></td>
                        <td>{value.skuId}</td>
                        <td className="errorSku" colSpan="5">{value.failedMessage}</td>
                        <td>
                            <button onClick={(e) => { this.eliminar(e, value.purchaseItemId, value.skuId) }} className="non-printable exclude-for-print-download btnSecondarySpecial size-Medium">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table >
        )
    }
    render() {
        const { returnList } = this.props;
        const failedReturnItemsInfo = this.state.failedReturnItemsInfo;
        const searchTable = [];
        let showSearch = 0, isValideSkuPresent = false, isSkuOptionSelected = this.props.show;
        if (returnList && returnList.returnItemsInfo && returnList.returnItemsInfo.length) {
            isValideSkuPresent = true;
            returnList.returnItemsInfo.map((value, key) => {
                searchTable.push(this.renderSearchResultTable(value, key));
            });
        }
        if (failedReturnItemsInfo && failedReturnItemsInfo.length) {
            failedReturnItemsInfo.map((value, key) => {
                searchTable.push(this.renderFailedReturnSearchResultTable(value, key + value.skuId));
            });
        }

        if (searchTable.length) {
            showSearch = 1;
        }

        return (
            <div style={{ display: (showSearch == 1 && isSkuOptionSelected == 1) ? 'block' : 'none' }}>
                <div className="searchResultContent" style={{ display: 'block' }}>
                    <div className="col-xs-12">
                        <h2 className="titleModule">Resultado de búsqueda</h2>
                    </div>
                    <div>
                        <div className="col-xs-12">
                            {searchTable}
                        </div>
                        {(returnList && returnList.totalRefundAmount) ?
                            <div className="row show-grid-row">
                                <div className="col-xs-offset-8">
                                    <div className="totalLabel">
                                        <div className="row show-grid-row">
                                            <div className="col-xs-6">
                                                <p>TOTAL:</p>
                                            </div>
                                            <div className="col-xs-6 alignRight">
                                                <p> {commonUtil.getCurrency(returnList.totalRefundAmount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className={"non-printable exclude-for-print-download btnPrimary size-Full showDevolution " + ((!isValideSkuPresent) ? 'btnPrimaryDisable' : '')} disabled={!isValideSkuPresent}
                                        onClick={() => { this.props.onConfirmClicked() }}>Solicitar devoluciones</button>
                                </div>
                            </div> : ''
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchResult;