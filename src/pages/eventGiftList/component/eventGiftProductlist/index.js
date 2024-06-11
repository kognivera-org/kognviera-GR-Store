import React, { Component } from 'react';
import { connect } from 'react-redux'
import Link from 'lib/ZUILib/Link';
import GiftDetail from '../giftDetail'
import commonUtil from '../../../../utils/commonUtil';
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader'

class EventGiftProductlist extends Component {

  state = {
    sort: 'Ascending',
  }
  resetItemInfo = false;
  componentWillReceiveProps = (nextProps) => {
    if (this.props.brand !== nextProps.brand) {
      this.resetItemInfo = true;
    } else {
      this.resetItemInfo = false;
    }

  }
  openViewPurchaseData = (e, product) => {
    this.props.onViewPurchaseDetail(product, product.purchaseTicketId);
  }
  openTrackOrder = (e, product) => {
    this.props.onTrackOrder(product);
  }
  sortByPrice = (e) => {
    let sortType = '';
    if (this.props.sortType === 'Descending') {
      sortType = 'Ascending';
    } else {
      sortType = 'Descending';
    }
    // this.setState({
    //   sort: sortType
    // })
    this.props.onSortByPrice(sortType);
  }

  getTrackOrderLink(product) {
    switch (product.deliveryStatus) {
      case 'Devolucion':
        return (<p className="status"><span className="status-grey">devolución</span></p>)
        break
      case 'Cancelado':
        return (<p className="status"><span className="status-grey">{product.deliveryStatus}</span></p>)
        break
      case 'Entregado en tienda':
        return (<p className="status"><span className="status-green">{product.deliveryStatus}</span></p>)
        break
      case 'Estatus de entrega':
        if (product.pedidoNo != undefined && product.pedidoNo != '') {
          return (<p className="status"><Link name="Recibidos" className="class" onClick={(e) => this.openTrackOrder(e, product)} title="title">{product.deliveryStatus}</Link></p>)
        }
        break
    }
  }
  getMessageLink(product) {
    if (product.messageInfo === 'none' || product.messageInfo === '') {
      return (<div className="mensaje centeredh"><Link className="verMensaje" uiname="RecibidosWriteNewMessage" onClick={(e) => this.props.openMessageModal(e, product)} title="Sin Mensaje">Sin mensaje</Link></div>)
    } else {
      return (<p className="iClass icon-estado_de_mensaje_aprobado aprobado"><Link uiname="RecibidosViewGuestMessage" className="verMensaje" onClick={(e) => this.props.openMessageModal(e, product)} title="Ver Mensaje">Ver mensaje</Link></p>)
    }
  }

  // pageBreak = () => {
  //   this.idx = 0
  //   return <span className="pageBreak" />
  // }
  render() {
    const { data, itemsInfo, fail, loading, onViewPurchaseDetail, onTrackOrder, openMessageModal, sortType } = this.props;
    let itemsList = [];
    this.idx = 1
    const isBonusContainerVisible = commonUtil.isBonusAvailable(this.props.event);
    const createItemRow = (product, key) => {

      return <GiftDetail key={key} product={product} eventId={this.props.eventId}
        brand={this.props.brand} onViewPurchaseDetail={onViewPurchaseDetail} onTrackOrder={onTrackOrder}
        openMessageModal={openMessageModal} event={this.props.event} openEventTypes={this.props.openEventTypes}
      />

    }

    if (itemsInfo && itemsInfo.length > 0) {
      itemsInfo.map((element, key) => {
        this.idx++
        // { (this.idx - 1) % 11 === 0 && itemsList.push(<span className="pageBreak" />); }
        itemsList.push(createItemRow(element, key));
        { this.idx % 13 === 0 && key !== (itemsInfo.length - 1) && itemsList.push(<span className="pageBreak" />); }
      });
    }

    if (loading) {
      if (this.resetItemInfo) {
        itemsList = [];
      }
      itemsList.push('Cargando página..');
    } else if (!loading && fail) {
      itemsList.push('Intente nuevamente más tarde');
    } else if (!loading && !fail && data.searchKeyword !== '' && itemsInfo.length === 0) {
      itemsList.push('Tu busqueda' + ' "' + data.searchKeyword + '" ' + 'arrojo "0" resultados');
    }
    else if (!loading && !fail && data.searchKeyword === '' && itemsInfo.length === 0) {
      itemsList.push('Tu busqueda arrojo 0 resultados');
    }

    let priceSortClass = sortType === 'Descending' ? 'abajo' : 'arriba';
    return (
      <React.Fragment>
        <DownloadPrintHeader />
        <div className="info display-hidden">
          <div className="col-xs-8">
            <h3>
              <p>MIS REGALOS</p>
            </h3>
            <p><b>los productos visibles dentro de esta sección son exclusivos de tiendas liverpool.</b></p>
          </div>
          <div className="col-xs-4 text-right event">
            <p>Fecha del evento: {this.props.event && this.props.event.eventDate}</p>
            <p>Tipo de evento: {this.props.event && this.props.event.eventType}</p>
            <p>Número de evento: {this.props.eventId}</p>
          </div>
          <div className="col-xs-12">
            <p className="resultsTitle">REGALOS RECIBIDOS /<strong> {this.props.totalItems}</strong></p>
          </div>
        </div>
        <div className={`receivedGifts${isBonusContainerVisible ? ' showbonus' : ' nobonus'}`}>
          <div className="col-xs-12">
            <table className="cTable">
              <thead>
                <tr>
                  <td>&nbsp;</td>
                  <td>Artículo</td>
                  <td className="align-center">
                    <Link uiname="RecibidosSortPurchased" onClick={(e) => this.sortByPrice(e)}>
                      <span>Precio<span className={"iClass icon-flecha_filtros_" + priceSortClass} /></span>
                    </Link>
                  </td>
                  <td>Cantidad</td>
                  <td>Detalle de compra</td>
                  {isBonusContainerVisible && <td>Aplica para bono</td>}
                  <td>Mensaje</td>
                </tr>
              </thead>
              <tbody>
                {itemsList}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment >
    )

  }
}

export default EventGiftProductlist;