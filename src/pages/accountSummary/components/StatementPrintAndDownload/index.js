import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import commonUtil from '../../../../utils/commonUtil'
import Image from '../../../../lib/ZUILib/Image'
import appconfig from '../../../../config/appconfig'
import { getEventAccountStatementDetails } from '../../actions'
import { getStatementDetailsForPrintAndDownload } from '../../requests'
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader'

@connect(
  store => ({
    accountStatement: store.accountSummary.data,
    eventDetailsInfo: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : null,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
  }),
  { getEventAccountStatementDetails },
)

export default class StatementPrintAndDownload extends Component {

  constructor(props) {
    super(props)
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : ''
    this.pageName = 'statementaccountsummary'
    this.state = {
      statementPrintAndDownload: null,
    }
  }

  componentDidMount() {
    this.props.getEventAccountStatementDetails(this.eventId)
    getStatementDetailsForPrintAndDownload({ eventId: this.eventId }, (res) => {
      if (res.data) {
        this.setState({ statementPrintAndDownload: res.data })
      }
    })
  }

  addPageBreak() {
    this.idx = 0
    return <span className="pageBreak" />
  }

  render() {
    const { eventDetailsInfo, accountStatement } = this.props
    const { statementPrintAndDownload } = this.state
    const isBonusContainerVisible = commonUtil.isBonusAvailable(eventDetailsInfo)
    this.idx = 0
    const physicalGiftRow = (data, index) => {
      if (index === 0) this.idx = 2
      this.idx++
      return (
        <React.Fragment>
          <tr key={index}>
            <td><div className="table-column">
              <p><b>{data.date}</b></p>
            </div>
            </td>
            <td className="imgInner"><div className="table-column">
              <div className="col-xs-3"><Image src={data.image} altimg={appconfig.defaultImage} /></div>
              <div className="col-xs-9">
                <p><b>{data.productName} <br />
                  <span className="sku">SKU:{data.skuId}</span>
                </b>{data.message ? <p className="greytext">{data.message}</p> : <p className="greytext">{data.bonusStatus}</p>}
                </p>
                {data.purchaserName ? <p>Invitado: <b>{data.purchaserName}</b></p> : null}
              </div>
            </div>
            </td>
            <td><div className="table-column">
              <p className={data.bonusEligibility === 'true' ? 'text-center' : 'text-center greytext'}><b>{commonUtil.getCurrency(data.amount)}</b></p>
            </div>
            </td>
            <td><div className="table-column">
              <p className="text-center"><b>{data.quantity}</b></p>
            </div>
            </td>
            <td><div className="table-column">
              <p className="text-center">{data.brand}</p>
            </div>
            </td>
            {isBonusContainerVisible ? <React.Fragment>
              {data.bonusEligibility ?
                <td><div className="table-column">
                  {data.bonusEligibility === 'true' ? <p> <i className="iClass icon-check" aria-hidden="true" /></p> : <p>
                    <i className="iClass icon-tache2" aria-hidden="true" />
                    <div className="bonusstatus greytext">{data.bonusStatus}</div>
                  </p>
                  }
                </div>
                </td>
                : null}
            </React.Fragment> : null}

          </tr>
          {(this.idx % 18) === 0 && index !== (statementPrintAndDownload.accountStatementInfo.statementDetails.physicalItemDetails.length - 1) && this.addPageBreak()}
        </React.Fragment>
      )
    }

    const personalGiftRow = (data, index) => {
      if (index === 0) this.idx = 2
      this.idx++
      return (
        <React.Fragment>
          <tr key={index}>
            <td>
              <div className="table-column">
                <p><b>{data.date}</b></p>
              </div>
            </td>
            <td className="imgInner">
              <div className="table-column">
                <div className="col-xs-3"><Image src={data.image} altimg={appconfig.defaultImage} /></div>
                <div className="col-xs-9">
                  <p><b>{data.productName} <br /><span className="sku">SKU:{data.skuId}</span></b>{data.message ? <p className="greytext">{data.message}</p> : ''}</p>
                </div>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className={data.bonusEligibility === 'true' ? 'text-center' : 'text-center greytext'}><b>{commonUtil.getCurrency(data.amount)}</b></p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center"><b>{data.quantity}</b></p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center">{data.brand}</p>
              </div>
            </td>
            {isBonusContainerVisible ? <React.Fragment>
              {data.bonusEligibility ?
                <td>
                  <div className="table-column">
                    {data.bonusEligibility === 'true' ? <p> <i className="iClass icon-check" aria-hidden="true" /></p> : <p>
                      <i className="iClass icon-tache2" aria-hidden="true" />
                      <div className="bonustext greytext">{data.bonusStatus}</div>
                    </p>
                    }
                  </div>
                </td>
                : null}
            </React.Fragment> : null}

          </tr>
          {(this.idx % 18) === 0 && index !== (statementPrintAndDownload.accountStatementInfo.statementDetails.personalItemDetails.length - 1) && this.addPageBreak()}
        </React.Fragment>
      )
    }

    const electronicsdetail = (data, index) => {
      if (index === 0) this.idx = 2
      this.idx++
      return (
        <React.Fragment>
          <tr key={index}>
            <td>
              <div className="table-column">
                <p><b>{data.date}</b></p>
              </div>
            </td>
            <td className="imgInner">
              <div className="table-column">
                <div className="col-xs-3"><Image src={data.image} altimg={appconfig.defaultImage} /></div>
                <div className="col-xs-9">
                  <p><b>{data.productName} <br /><span className="sku">SKU: {data.skuId}</span></b></p>
                  {data.purchaserName ? <p>Invitado: <b>{data.purchaserName}</b></p> : null}
                </div>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center"><b>{data.quantity}</b></p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center">{data.brand}</p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center"><b>{commonUtil.getCurrency(data.amount)}</b></p>
              </div>
            </td>
          </tr>
          {(this.idx % 18) === 0 && index !== (statementPrintAndDownload.accountStatementInfo.statementDetails.electronicItemDetails.length - 1) && this.addPageBreak()}
        </React.Fragment>
      )
    }

    const partialtransferdetails = (data, index) => {
      if (index === 0) this.idx = 2
      this.idx++
      return (
        <React.Fragment>
          <tr key={index}>
            <td>
              <div className="table-column">
                <p>{data.date}</p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p>{data.storeName}</p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center">{data.userName}</p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p className="text-center">{data.transferenceMethod} <br /> {data.number}</p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p>{data.commission}</p>
              </div>
            </td>
            <td>
              <div className="table-column">
                <p>{commonUtil.getCurrency(data.amountTransferred)}</p>
              </div>
            </td>
          </tr>
          {(this.idx % 18) === 0 && index !== (statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceDetails.length - 1) && this.addPageBreak()}
        </React.Fragment>
      )
    }

    return (
      <div className="downloadPrintPage container toPrint display-hidden toDownload">
        <DownloadPrintHeader />
        {!_.isEmpty(statementPrintAndDownload) && !_.isEmpty(statementPrintAndDownload.accountStatementInfo) && !_.isEmpty(eventDetailsInfo) && !_.isEmpty(accountStatement) ?
          <React.Fragment>
            <div className="container-fluid">
              <div className="row info">
                <div className="col-xs-9 col-sm-9">
                  <h4>
                    <p>Estado de cuenta</p>
                  </h4>
                  <p>
                    <label className="date_operation mt-10">Fecha de operación</label> <span>{commonUtil.formatDate(accountStatement.currTime, 'dd/mm/yyyy')}</span>
                  </p>
                </div>
                <div className="col-xs-3 col-sm-3 event">
                  <p><span className="text-left">Número de evento: </span><span className="text-right">{eventDetailsInfo.eventId}</span></p><br />
                  <p><span className="text-left">Tipo de evento: </span><span className="text-right">{eventDetailsInfo.eventType}</span></p><br />
                  <p><span className="text-left">Fecha del evento: </span><span className="text-right">{eventDetailsInfo.eventDate}</span></p>
                </div>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Total de regalos y compras personales</b></p>
                </div>
                <div className="col-xs-1">
                  <p>{statementPrintAndDownload.accountStatementInfo.statementSummary.totalPurchasedItems}</p>
                </div>
                <div className="col-xs-3">
                  <p>&nbsp;</p>
                </div>
                <div className="col-xs-2">
                  <p>{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.totalPurchasedAmount)}</p>
                </div>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Regalos fisicos</b></p>
                </div>
                <div className="col-xs-1">
                  <p>{statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalPurchasedItemsCount}</p>
                </div>
                <div className="col-xs-3">
                  <p>&nbsp;</p>
                </div>
                <div className="col-xs-2">
                  <p>{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalPurchasedAmount)}</p>
                </div>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Compras personales</b></p>
                </div>
                <div className="col-xs-1">
                  <p>{statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalPurchasedItemsCount}</p>
                </div>
                <div className="col-xs-3">
                  <p>&nbsp;</p>
                </div>
                <div className="col-xs-2">
                  <p>{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalPurchasedAmount)}</p>
                </div>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Regalos Electrónicos</b></p>
                </div>
                <div className="col-xs-1">
                  <p>{statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalPurchasedItemsCount}</p>
                </div>
                {statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.transferredAmount ?
                  <div className="col-xs-3">
                    <p>Retiros anticipados: -{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalPurchasedAmount)}</p>
                  </div> : null}
                <div className="col-xs-2">
                  <p>{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.transferredAmount)}</p>
                </div>
              </div>
              <div className="row margin_top">
                <div className="col-xs-12 table-title">
                  <p>Detalle</p>
                </div>
                <div className="bodytable col-xs-12">
                  <table>
                    <tbody className="rowLines">
                      <tr>
                        <td><b>Regalos físicos</b></td>
                        <td colSpan={isBonusContainerVisible ? '' : '2'}>Número de regalos <br />{statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalPurchasedItemsCount}</td>
                        <td colSpan={isBonusContainerVisible ? '' : '2'}>Monto total de regalos <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalPurchasedAmount)}</td>
                        {isBonusContainerVisible ? <React.Fragment>
                          <td>Monto válido para bono <br /> {commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalAmountEligibleForBonus)}<br /> <span className="monto-no-validado">Monto no válido para bono: {commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalAmountNotEligibleForBonus)}</span></td>
                          <td>Bono por regalos físicos <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalBonusAmount)}</td>
                        </React.Fragment> : null}
                      </tr>
                      <tr>
                        <td><b>Compras personales</b></td>
                        <td colSpan={isBonusContainerVisible ? '' : '2'}>Número de compras <br />{statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalPurchasedItemsCount}</td>
                        <td colSpan={isBonusContainerVisible ? '' : '2'}>Monto total de compras <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalPurchasedAmount)}</td>
                        {isBonusContainerVisible ? <React.Fragment>
                          <td>Monto válido para bono <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalAmountEligibleForBonus)} <br /> <span className="monto-no-validado">Monto no válido para bono: {commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalAmountNotEligibleForBonus)}</span></td>
                          <td>Bono por compras personales <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalBonusAmount)}</td>
                        </React.Fragment> : null}
                      </tr>
                      <tr>
                        <td><b>Regalos electrónicos</b></td>
                        <td>Número de electronicos<br />{statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalPurchasedItemsCount}</td>
                        <td>Monto total de electronicos <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalPurchasedAmount)}</td>
                        <td>Retiros anticipados <br />-{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.transferredAmount)}</td>
                        <td>Disponible para retiro <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {this.addPageBreak()}

              <div className="row margin_top">
                <h3>Regalos físicos</h3>
                <div className="bodytable col-xs-12">
                  <table>
                    <tbody className="rowLines">
                      <tr>
                        <td><b>Regalos físicos</b></td>
                        <td>Número de regalos <br />{statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalPurchasedItemsCount}</td>
                        <td >Monto total de regalos <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalPurchasedAmount)}</td>

                        {isBonusContainerVisible ? <React.Fragment>
                          <td>Monto válido para bono <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalAmountEligibleForBonus)} <br /> <span className="monto-no-validado">Monto no válido para bono: {commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalAmountNotEligibleForBonus)} </span></td>
                          <td>Bono por regalos físicos <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.physicalItemInfo.totalBonusAmount)}</td>
                        </React.Fragment> : null}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {!_.isEmpty(statementPrintAndDownload.accountStatementInfo.statementDetails.physicalItemDetails) ?
                <div className="row">
                  <div className="col-xs-12 contentTable tableResults-div">
                    <table className="tableResults">
                      <thead className="rowLines">
                        <tr>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Fecha</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Artículo</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Precio</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Cantidad</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Tienda</a></div></td>
                          {isBonusContainerVisible ?
                            <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Aplica para bono</a></div></td>
                            : null}

                        </tr>
                      </thead>
                      <tbody>
                        {statementPrintAndDownload.accountStatementInfo.statementDetails.physicalItemDetails.map(physicalGiftRow)}
                      </tbody>
                    </table>
                  </div>
                </div> : null}

              {this.addPageBreak()}

              <div className="row margin_top">
                <h3>Compras personales</h3>
                <div className="bodytable col-xs-12">
                  <table>
                    <tbody className="rowLines">
                      <tr>
                        <td><b>Compras personales</b></td>
                        <td>Número de compras <br />{statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalPurchasedItemsCount}</td>
                        <td>Monto total de compras <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalPurchasedAmount)}</td>
                        {isBonusContainerVisible ? <React.Fragment>
                          <td>Monto válido para bono <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalAmountEligibleForBonus)} <br /> <span className="monto-no-validado">Monto no válido para bono: {commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalAmountNotEligibleForBonus)}</span></td>
                          <td>Bono por compras personales <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.personalItemInfo.totalBonusAmount)}</td>
                        </React.Fragment> : null}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {!_.isEmpty(statementPrintAndDownload.accountStatementInfo.statementDetails.personalItemDetails) ?
                <div className="row">
                  <div className="col-xs-12 contentTable tableResults-div">
                    <table className="tableResults">
                      <thead className="rowLines">
                        <tr>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Fecha</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Artículo</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Precio</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Cantidad</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Tienda</a></div></td>
                          {isBonusContainerVisible ?
                            <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Aplica para bono</a></div></td>
                            : null}
                        </tr>
                      </thead>
                      <tbody>
                        {statementPrintAndDownload.accountStatementInfo.statementDetails.personalItemDetails.map(personalGiftRow)}
                      </tbody>
                    </table>
                  </div>
                </div> : null}

              {this.addPageBreak()}

              <div className="row margin_top">
                <h3>Regalos electrónicos</h3>
                <div className="bodytable col-xs-12">
                  <table>
                    <tbody className="rowLines">
                      <tr>
                        <td><b>Regalos electrónicos</b></td>
                        <td>Número de electronicos<br />{statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalPurchasedItemsCount}</td>
                        <td>Monto total de electronicos <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalPurchasedAmount)}</td>
                        <td>Retiros anticipados <br />-{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.transferredAmount)}</td>
                        <td>Disponible para retiro <br />{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.statementSummary.electronicItemInfo.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {!_.isEmpty(statementPrintAndDownload.accountStatementInfo.statementDetails.electronicItemDetails) ?
                <div className="row">
                  <div className="col-xs-12 contentTable tableResults-div">
                    <table className="tableResults">
                      <thead className="rowLines">
                        <tr>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Fecha</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Artículo</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Cantidad</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Tienda</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Precio</a></div></td>
                        </tr>
                      </thead>
                      <tbody>
                        {statementPrintAndDownload.accountStatementInfo.statementDetails.electronicItemDetails.map(electronicsdetail)}
                      </tbody>
                    </table>
                  </div>
                </div> : null}

              {this.addPageBreak()}

              <div className="row margin_top border-bottom">
                <h3>Retiros anticipados</h3>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Retiros monedero</b></p>
                </div>
                <div className="col-xs-6 text-right">
                  <p>{statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceSummary.totalTransactionToMonedero}</p>
                </div>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Retiros a cuenta bancaria</b></p>
                </div>
                <div className="col-xs-6 text-right">
                  <p>{statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceSummary.totalTransactionsToBank}</p>
                </div>
              </div>
              <div className="row margin_top border-bottom">
                <div className="col-xs-6">
                  <p><b>Retiros anticipados</b></p>
                </div>
                <div className="col-xs-6 text-right">
                  <p>-{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceSummary.totalTransferredAmount)}</p>
                </div>
              </div>
              {!_.isEmpty(statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceDetails) ?
                <div className="row margin_top">
                  <div className="col-xs-12 contentTable tableResults-div">
                    <table className="tableResults">
                      <thead className="rowLines">
                        <tr>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Fecha</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Tienda</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Usuario</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Destino</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Comisión</a></div></td>
                          <td className="text-center"><div className="table-column"><a href="javascript:void(0);">Monto</a></div></td>
                        </tr>
                      </thead>
                      <tbody>
                        {statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceDetails && statementPrintAndDownload.accountStatementInfo.transferenceInfo.transferenceDetails.map(partialtransferdetails)}
                      </tbody>
                    </table>
                  </div>
                </div> : null}

              {this.addPageBreak()}
              <div className="row info margin_top border-bottom">
                <div className="col-xs-12">
                  <h4>
                    <p><b>Aproximando de bono a monedero</b></p>
                  </h4><br />
                  <p>
                    <label className="date_operation">{statementPrintAndDownload.accountStatementInfo.bonusDetails.bonusPercentage}%  por compras personales y regalos válidos para bonificación.</label>
                  </p>
                  <p>
                    <label className="date_operation">El bono estará disponible hasta el cierre de su mesa.</label>
                  </p>
                </div>
              </div>
              <div className="row margin_top">
                <div className="col-xs-12">
                  <h4>
                    <p><b>Regalos físicos:</b></p>
                  </h4>
                </div>
                <div className="col-xs-12">
                  <p><b>Monto válido: <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.physicalItemsBonusInfo.totalBonusEligibleAmont)} </span></b></p>
                </div>
                <div className="col-xs-12">
                  <p>
                    <label className="date_operation">Monto no válido:</label> <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.physicalItemsBonusInfo.totalAmountNotEligibleForBonus)} </span>
                  </p>
                </div>
                <div className="col-xs-12 table-title">
                  <p>{statementPrintAndDownload.accountStatementInfo.bonusDetails.bonusPercentage}% de bono por realos físicos <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.physicalItemsBonusInfo.totalBonusAccumulated)}</span></p>
                </div>
              </div>
              <div className="row margin_top">
                <div className="col-xs-12">
                  <h4>
                    <p><b>Compras personales:</b></p>
                  </h4>
                </div>
                <div className="col-xs-12">
                  <p><b>Monto válido: <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.personalItemsBonusInfo.totalBonusEligibleAmont)} </span></b></p>
                </div>
                <div className="col-xs-12">
                  <p>
                    <label className="date_operation">Monto no válido:</label> <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.personalItemsBonusInfo.totalAmountNotEligibleForBonus)}</span>
                  </p>
                </div>
                <div className="col-xs-12 table-title">
                  <p>{statementPrintAndDownload.accountStatementInfo.bonusDetails.bonusPercentage}% de bono por compras personales <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.personalItemsBonusInfo.totalBonusAccumulated)} </span></p>
                </div>
              </div>
              <div className="row margin_top">
                <div className="col-xs-12">
                  <h4>
                    <p><b>Regalos Electrónicos:<span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.electronicItemsBonusInfo.totalBonusEligibleAmont)}</span></b></p>
                  </h4>
                </div>
                <div className="col-xs-12">
                  <p>Bono disponible al cierre de tu mesa si elijes depósito a monedero</p>
                </div>
                <div className="col-xs-12 table-title">
                  <p>{statementPrintAndDownload.accountStatementInfo.bonusDetails.bonusPercentage}% de bono por realos electrónicos <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.electronicItemsBonusInfo.totalBonusAccumulated)}</span></p>
                </div>
              </div>
              <div className="row margin_top">
                <div className="col-xs-12">
                  <h4>
                    <p><b>Monto total válido para bono:</b> <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.totalBonusEligibleAmount)}</span></p>
                  </h4>
                </div>
                <div className="col-xs-12 table-title">
                  <p>Aproximado de bono total para monedero: <span className="pull-right">{commonUtil.getCurrency(statementPrintAndDownload.accountStatementInfo.bonusDetails.totalBonusAmount)} </span></p>
                </div>
              </div>
            </div>
          </React.Fragment>
          : null}
      </div>
    )
  }
}
