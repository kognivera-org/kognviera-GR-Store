import React, { Component } from 'react';
import { getLabels } from '../../../../global/Labels/actions';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal';
import commonUtil from '../../../../../../src/utils/commonUtil';
import * as regalorecibidos from '../../actions';
import { dollar } from '../../../../../utils/clientConstant';
import Button from '../../../../../lib/ZUILib/Button'
import Link from '../../../../../lib/ZUILib/Link'

@connect(
  store => ({
    labels: store.labels.labels,
    data: store.regalorecibidos.purchaseTicketData,
    dataLoading: store.regalorecibidos.purchaseTicketDataLoading,
    dataFailed: store.regalorecibidos.purchaseTicketDataFailed,
    dissociatePurchaseTicketData: store.regalorecibidos.dissociatePurchaseTicket,
    dissociatePurchaseTicketLoading: store.regalorecibidos.dissociatePurchaseTicketLoading,
    dissociatePurchaseTicketFailed: store.regalorecibidos.dissociatePurchaseTicketFailed,
  }),
  {
    getLabels,
    ...regalorecibidos,
  }
)

class ViewPurchaseDetailModal extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.showPurchaserName = true;
    this.currentProduct = undefined;
    this.brand = undefined
    this.state = {
      show: false,
      editPurchaserName: false,
      purchaserName: '',
      error: '',
      toggleQuant: false,
      errorMsg: ''
    };
    this.values = [];
    this.lastAddedSku = '';

  }
  showOrgBoletaDetails = (e, eventId, boletaNumber) => {
    e.preventDefault()
    this.handleClose();
    this.handleShow(this.currentProduct, eventId, boletaNumber, this.brand, this.showPurchaserName, 'original')
  }
  handleClose() {
    document.body.classList.remove('modal-open');
    this.showPurchaserName = true;
    this.setState({
      show: false,
      editPurchaserName: false,
      purchaserName: '',
      error: '',
    });
  }
  handleShow(product, eventId, boletaNumber, brand, showPurchaserName, ticketType) {
    document.body.classList.add('modal-open');
    this.showPurchaserName = showPurchaserName;
    this.currentProduct = product;
    this.brand = brand
    this.setState({ show: true });
    let ticketData = this.props.data.purchaseTicketInfo
    let params = {
      'eventId': eventId,
      'brand': this.brand,
      'actionType': ticketType === 'original' ? 'purchase' : product.actionType,
      'boletaNumber': ticketType === 'original' ? ticketData.orgBoletaNumber : boletaNumber,
      'tiendaNumber': ticketType === 'original' ? ticketData.orgTiendaNumber : product.tiendaNumber,
      'terminalNumber': ticketType === 'original' ? ticketData.orgTerminalNumber : product.terminalNumber,
      'authCode': ticketType === 'original' ? ticketData.orgAuthCode : product.authCode,
      'purchasedDate': ticketType === 'original' ? ticketData.orgDateOfPurchase : product.purchasedDate,
      'skuId': ticketType === 'original' ? ticketData.skuId : product.skuId,
    }
    this.props.getPurchaseTicketDetail(params);
  }
  callBackSavePurchaserName = (response) => {
    if (response && response.data && response.data.status.status === 'success') {
      this.setState({
        editPurchaserName: false,
        purchaserName: response.data.purchaserName
      })
      this.props.savePurchaseName();
    } else {
      this.setState({
        editPurchaserName: false,
      })
    }
  }
  savePurchaserName = (purchaseTicketId) => {
    let purchaserName = this.purchaserNameVal !== undefined && this.purchaserNameVal.value;
    if (purchaserName === '') {
      this.setState({
        errorMsg: commonUtil.getLabel(this.props.labels, 'regalosrecibidos.purchaseticket.purchasername.errormessage')
      })
      return;
    } else {
      this.setState({
        errorMsg: ''
      })
    }
    let params = {
      'purchaserName': purchaserName,
      'purchaseTicketId': purchaseTicketId
    }
    this.props.onSavePurchaserName(params, this.callBackSavePurchaserName);
  }
  removePurchaseTicket = () => {
    let ticketData = this.props.data.purchaseTicketInfo
    let params = {
      purchaseTicketId: ticketData.itemId,
    }
    this.props.onRemoveTicket(params)
  }
  componentWillMount = () => {
    this.props.getLabels()
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }
  addItem = (e, pSkuId) => {
    let params = {
      'skuId': pSkuId
    }
    this.lastAddedSku = pSkuId;
    this.props.onAddAgainItem(params, this.callBackAddAgainGiftItem);
  }
  // callBackAddAgainGiftItem = (response) => {
  //   if (response && response.data && response.data.status === 'success') {
  //     let skuId = this.lastAddedSku;
  //     let sku = _.find(this.values, { 'id': skuId })
  //     let quantity = parseInt(sku.quantity) + 1;
  //     var index = _.pullAllBy(this.values, [sku]);
  //     this.values.push({ 'id': skuId, 'quantity': quantity })
  //     // this.props.
  //     this.setState({
  //       toggleQuant: !this.state.toggleQuant
  //     })
  //   }
  // }
  createProductRow(product, key) {
    let skuId = product.skuId
    // let quantity = 0;
    // if (_.find(this.values, { 'id': skuId }) != undefined) {
    //   quantity = _.find(this.values, { 'id': skuId }).quantity;[]
    // } else {
    //   quantity = product.quantity;
    //   this.values.push({ 'id': skuId, 'quantity': quantity })

    // }

    return (
      <tr className="mb10" key={key} >
        <td>
          <p className="articulo">{product.description}</p>
          <p className="articulo">SKU: {skuId}</p>
          <p className="articulo">Sección: {product.section}</p><Link uiname="RegistradosAddGiftPredeterminedList" className="articulo mb20" href="javascript:void(0)" onClick={(e, pSkuId) => this.addItem(e, skuId)}>Agregar nuevamente</Link>
        </td>
        <td>
          <p>{product.quantity || ''}</p>
        </td>
        <td>
          <p>{product.pricePerUnit != undefined ? dollar + product.pricePerUnit : ''}</p>
        </td>
        <td>
          <p>{product.subTotal != undefined ? dollar + product.subTotal : ''}</p>
        </td>
        <td>
          {product.discount != undefined ?
            <React.Fragment><p>-{dollar + product.discount} </p> <span>Descuento</span></React.Fragment>
            :
            <React.Fragment></React.Fragment>
          }
        </td>
        <td>
          <p className="total">{product.total != undefined ? dollar + product.total : ''}</p>
        </td>
      </tr>
    )
  }
  updateState = () => {
    this.setState({
      editPurchaserName: true
    })
  }
  openDeleteTicket = () => {
    this.props.onShowDeletePurchaseTicket();
  }
  handleError(errorMsg) {
    this.setState({
      error: errorMsg
    })
  }
  handleCloseError = () => {
    this.setState({
      error: ''
    })
  }
  render() {

    const { labels } = this.props;
    const giftListManagement = labels ? labels.giftListManagement : null;
    let ticketData = this.props.data.purchaseTicketInfo;
    let itemsList = [];
    let purchaserName = '';
    if (!this.props.dataFailed && !this.props.dataLoading) {
      let products = ticketData.itemsInfo;
      if (products !== undefined) {
        products.map((element, key) => {
          itemsList.push(this.createProductRow(element, key));
        });
      }
      purchaserName = this.state.purchaserName != '' ? this.state.purchaserName : ticketData.purchaserName
    }

    return (
      <Modal content="w900 modal-lg" show={this.state.show} onHide={this.handleClose} className="modal fade modal-custom" id="modalVerDetalle">
        <ModalHeader className="modal-header" closeButton handleClose={this.handleClose}>
          <ModalTitle className="modal-title">DETALLE DE BOLETA</ModalTitle>
          <p>Tipo de Boleta:{ticketData && ticketData.typeOfTicket}</p>
        </ModalHeader>
        <ModalBody className="modal-body">
          {
            this.props.dataFailed ? 'Intente nuevamente más tarde' :
              this.props.dataLoading ? 'Cargando página...'
                :
                <React.Fragment>
                  <table className="detailTicket">
                    <thead>
                      <tr>
                        <td>
                          <p>Empresa:</p>
                        </td>
                        <td>
                          <p>Número de evento:</p>
                        </td>
                        <td>
                          <p>Tienda:</p>
                        </td>
                        <td>
                          <p>Terminal:</p>
                        </td>
                        <td>
                          <p>Boleta:</p>
                        </td>
                        <td>
                          <p>Fetch de compra:</p>
                        </td>
                        <td>
                          <p>Vendedor:</p>
                        </td>
                        <td>
                          <p>Productos:</p>
                        </td>
                        <td>
                          <p>Métodos de pago:</p>
                        </td>
                        <td>
                          <p>Importe total:</p>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p>{ticketData.empressaId}</p>
                        </td>
                        <td>
                          <p>{ticketData.eventId}</p>
                        </td>
                        <td>
                          <p>{ticketData.tiendaNumber}</p>
                        </td>
                        <td>
                          <p>{ticketData.terminalNumber}</p>
                        </td>
                        <td>
                          <p>{ticketData.boletaNumber}</p>
                          <p>{ticketData.orgBoletaNumber && <a style={{ cursor: 'pointer' }} onClick={(e) => this.showOrgBoletaDetails(e, ticketData.eventId, ticketData.orgBoletaNumber)}>{ticketData.orgBoletaNumber}</a>}</p>
                        </td>
                        <td>
                          <p>{ticketData.dateOfPurchase}</p>
                        </td>
                        <td>
                          <p>{ticketData.vendor}</p>
                        </td>
                        <td>
                          <p>{ticketData.numberOfProducts}</p>
                        </td>
                        <td>
                          <p>{ticketData.paymentMethodCount}</p>
                        </td>
                        <td>
                          <p className="total">{dollar + ticketData.totalAmount}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                  <table className="detailTicket">
                    <thead>

                      <tr>
                        <td>
                          <p>Artículo:</p>
                        </td>
                        <td>
                          <p>Cantidad:</p>
                        </td>
                        <td>
                          <p>Precio unitario:</p>
                        </td>
                        <td>
                          <p>Subtotal:</p>
                        </td>
                        <td>
                          <p>Descuento:</p>
                        </td>
                        <td>
                          <p>Total:</p>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList}
                    </tbody>
                  </table>

                  <div className="row detailsOfTicket">
                    <div className="col-xs-4">
                      <p>Métodos de pago:</p>
                      {
                        ticketData.paymentInfo !== undefined &&
                        <React.Fragment>
                          {
                            ticketData.paymentInfo.map(function (element, key) {
                              return (<p key={key}>
                                <span>{element.cardName}</span><span>{element.cardNumber}</span>
                              </p>)
                            })
                          }
                        </React.Fragment>
                      }
                    </div>
                    <div className="col-xs-4">
                      <p>Promociones:</p>
                      {
                        ticketData.promotionsInfo &&
                        ticketData.promotionsInfo.map((element, key) => {
                          return (
                            <span key={key}>{element.promotionDesc}</span>
                          )
                        })
                      }
                    </div>
                    <div className="col-xs-4">
                      <p>Descuento</p>
                      {
                        ticketData.promotionsInfo &&
                        ticketData.promotionsInfo.map((element, key) => {
                          return (
                            <span key={key}>{element.discountedAmount}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className="row detailsOfTicketNoBack">
                    <div className="col-xs-2">
                      <p>Número de pedido: </p><span>{ticketData.remissionNumber != undefined && ticketData.remissionNumber}</span>
                    </div>
                    <div className="col-xs-5">
                      <p>Correo electrónico:</p>
                      {
                        ticketData.emailId != undefined && ticketData.emailId != ''
                          ? <span>{ticketData.emailId}</span>
                          :
                          ''
                      }
                    </div>
                    {
                      this.state.editPurchaserName ?
                        <div >
                          <div className="col-xs-4">
                            <div className="formBlock">
                              <div className="materialStyle">
                                <input className="inputMaterial" defaultValue={purchaserName} ref={(ref) => { this.purchaserNameVal = ref }}
                                  id="inputRemitente" type="text" required="required" name="inputRemitente"
                                />
                                <label className="placeHolderMaterial">Remitente</label>
                                <label className="error">{this.state.errorMsg}</label>
                              </div>
                            </div>
                          </div>
                          <div className="col-xs-2">
                            <button className="btnPrimaryAction btnCustom" id="editarRemitentebtn" onClick={(itemId) => this.savePurchaserName(ticketData.itemId)}>Guardar</button>
                          </div>
                        </div>
                        :
                        (this.showPurchaserName && <div className="case1">
                          <div className="col-xs-4">
                            <p>Remitente:</p><span className="inline" id="remitenteBoleta">{purchaserName}
                              <Link uiname="RecibidosChangePurchaserName" className="inline iClassName icon-editar ml20 pointer" id="editarRemitente"
                                onClick={() => this.updateState()} />
                            </span>
                          </div>
                        </div>)
                    }
                  </div>
                  {
                    this.state.error !== '' &&
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="danger-alert">
                          <div className="red"><i className="icon-tache2"></i></div>
                          <div className="message">
                            <p>{this.state.error}</p>
                          </div>
                          <div className="close-alert">
                            <div className="close-btn"><a onClick={this.handleCloseError} className="icon-tache2 btn-white"></a></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="row">
                    <div className="col-xs-4">
                      <Button className="btnDelete size-Full" id="eliminarBoleta" uiname="RecibidosDissociateTicketViewDetails" onClick={this.openDeleteTicket}>Eliminar boleta</Button>
                    </div>
                  </div>

                </React.Fragment>
          }

        </ModalBody>
      </Modal>
    )
  }
}

export default ViewPurchaseDetailModal;
