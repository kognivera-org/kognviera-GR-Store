import React, { Component } from 'react';
import commonUtils from '../../../../../utils/commonUtil';
import Link from 'lib/ZUILib/Link';
import routeconfig from '../../../../../config/routeconfig';

class FailedTransactions extends Component {
    render() {
        const eventId = this.props.eventId;
        const { failedTransactionLoading, failedTransaction, failedTransactionFailed } = this.props;

        return (
            <React.Fragment>
                <div className="col-xs-12 marginTop15">
                    <div className="boxStyle">
                        <h3>TRANSACCIONES FALLIDAS</h3>
                        {
                            failedTransactionLoading
                                ? <span>Loading.....</span>
                                : failedTransaction
                                && failedTransaction.failedTransferences
                                && failedTransaction.failedTransferences.map((transaction, index) => {
                                    return <span className="borderRowAll" key={index}>
                                        <p className="weight">{transaction.transferenceNumber} - {transaction.amount}</p>
                                        <p><i className="icon-reloj" /> {transaction.time} / {commonUtils.getESDate(transaction.date)}</p>
                                    </span>
                                })
                        }
                        {/* <span>
                            <Link uiname="EventDashboardFailedTx" className="linkAction alignRight" to={commonUtils.generateRedirect(routeconfig.statementpartialtransference, { eventId })}>Volver a intentar transacción</Link>
                        </span> */}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default FailedTransactions;
