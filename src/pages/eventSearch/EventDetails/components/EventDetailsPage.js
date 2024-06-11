
import React, { Component } from 'react'
import SelectionTab from '../../../../lib/ZUILib/SelectionTab'
import Barcode from 'react-barcode'
import Favourite from '../../../../components/Favourite'
import Pagination from '../../../../lib/Pagination'
import Image from '../../../../lib/ZUILib/Image'
import BrandFilter from '../../../../../src/pages/eventGiftList/component/BrandFilter'
import commonUtil from '../../../../utils/commonUtil'
import DownloadPrintHeader from '../../../../components/DownloadPrintHeader'
import appconfig from '../../../../config/appconfig';
import PrintDownload from '../../../global/PrintDownload'
// import EventdetailsDownloadPrint from './EventdetailsDownloadPrint'

// const pageName = 'EventDetails'

class EventDetailsPage extends Component {
  constructor(props) {
    super(props)
    this.catId = ''
    this.price = ''
    this.idx = 1
    this.currentPage = 1
    this.state = {
      shouldDownloadPrint: false,
      disableDownload: false,
    }
  }
  param = '';
  resetVerLista = false;
  componentWillReceiveProps = (nextProps) => {
    if (this.props.brand !== nextProps.brand) {
      this.resetVerLista = true;
    } else {
      this.resetVerLista = false;
    }

  }
  showAllItems = async () => {
    await this.props.getGiftListGuestView(this.props.eventId, '', (this.catId || ''), (this.price || ''), (this.props.brand || ''), "true")
  }

  filterAndSorting = (e, priceOptions, categoryList) => {
    if (categoryList) {
      const catId = categoryList.filter(s => s.value === e.target.value).map(e => e.id)
      this.catId = catId.toString()
    }
    if (priceOptions) {
      const price = priceOptions.filter(s => s.value === e.target.value).map(e => e.id)
      this.price = price.toString()
    }
    // const price = this.sortProductByPrice.getID()
    this.props.getGiftListGuestView(this.props.eventId, '1', (this.catId || ''), (this.price || ''))
  }

  onPageChange = (value) => {
    this.props.getGiftListGuestView(this.props.eventId, (value).toString(), (this.catId || ''), (this.price || ''))
  }

  downloadToPDF = async (param) => {
    await this.showAllItems()
    setTimeout(() => {
      if (param && param === 'download') {
        this.setState({ disableDownload: true })
        commonUtil.downloadPdf('.toDownload', 'ListaDeRegalos.pdf', 'false', 'LISTA DE REGALOS', () => {
          this.setState({ disableDownload: false })
        })
      } else if (param && param === 'print') {
        window.print()
      }
    }, 500);
  }

  setFavouriteGift = (giftItemId, skuId, checked) => {
    this.props.setFavouriteGift(giftItemId, skuId, checked)
  }
  handleBrandSelection = (brandTitle) => {
    this.props.onFilterByBrand(brandTitle)
  }

  addPageBreak = () => {
    this.idx = 0
    return (
      <span className="pageBreak" />
    )
  }

  render() {
    let verLista = [];
    const eventIdpass = this.props.eventId
    const guestViewGiftListData = this.props.giftListGuestView && this.props.giftListGuestView.data && this.props.giftListGuestView.data.giftListGuestView
    const celebratedPersonName = guestViewGiftListData && guestViewGiftListData.celebratedList ? guestViewGiftListData.celebratedList.map(celebratedName => celebratedName.celebratedName) : []
    const eventDate = guestViewGiftListData && guestViewGiftListData.eventInfo && guestViewGiftListData.eventInfo.eventDate ? guestViewGiftListData.eventInfo.eventDate : ''
    const eventId = guestViewGiftListData && guestViewGiftListData.eventInfo && guestViewGiftListData.eventInfo.eventId ? guestViewGiftListData.eventInfo.eventId : ''
    const eventType = guestViewGiftListData && guestViewGiftListData.eventInfo && guestViewGiftListData.eventInfo.eventType ? guestViewGiftListData.eventInfo.eventType : ''
    const eventName = guestViewGiftListData && guestViewGiftListData.eventInfo && guestViewGiftListData.eventInfo.eventName ? guestViewGiftListData.eventInfo.eventName : ''
    const categoryList = guestViewGiftListData && guestViewGiftListData.categoryList ? guestViewGiftListData.categoryList.map(categoryListSelection => ({ id: categoryListSelection.id, value: categoryListSelection.name })) : []
    this.categoryInfo = guestViewGiftListData && guestViewGiftListData.categoryItemsInfo
    const categoryInfo = this.categoryInfo
    const pagerecords = this.pagerecords
    const paginationInfo = {

      totalNoOfRecords: guestViewGiftListData ? guestViewGiftListData.totalRecords : 0,
      recordsPerPage: guestViewGiftListData ? guestViewGiftListData.recordsPerPage : 0,
      currentPage: guestViewGiftListData ? guestViewGiftListData.currentPage : '0',
      //   // visiblePages: this.pagerecords.itemsCount,
    }

    const PriceBasedSorting = {
      options: [{
        id: 'Ascending',
        value: 'LowToHigh',
        labelResourceId: 'Menor a Mayor',
        disabled: false,
      }, {
        id: 'Descending',
        value: 'HighToLow',
        labelResourceId: 'Mayor a Menor',
        disabled: false,
      }],
    }

    this.idx = 1

    const eventList = (item, index) => {
      this.idx++
      return (<React.Fragment><tr key={index}>
        <td className="rating">
          <div className="table-column">
            <Favourite
              item={item}
              onchange={this.setFavouriteGift}
              checked={item.isFavourite}
              display="icons"
            />
          </div>
        </td>
        <td className="img">
          <div className="table-column">
            <Image alt={item.name} src={item.imageURL} altimg={appconfig.defaultImage} />
          </div>
        </td>
        <td className="details">
          <div className="table-column">
            <p>{item.name}</p>
            <p>SKU:<span>{item.skuId}</span></p>
          </div>
        </td>
        <td className="price">
          <div className="table-column">
            {item.listPrice ? <p className="strike-price">{commonUtil.getCurrency(item.listPrice)}</p> : null}
            {item.salePrice ? <p className="normal-price">{commonUtil.getCurrency(item.salePrice)}</p> : null}
          </div>
        </td>
        <td className="quantity">
          <div className="table-column">
            <p>{item.quantity}</p>
          </div>
        </td>
      </tr>{this.idx % 14 === 0 && this.addPageBreak()}</React.Fragment>)
    }

    const eventCategory = (cat, index) => {
      this.idx++
      // { idx % 10 === 0 && itemsList.push(<span className="pageBreak" />); }
      return (<React.Fragment>
        {this.idx % 14 === 0 && this.addPageBreak()} <div key={index}>
          <div className="col-xs-12">
            <p className="headCat">Categoría: <span>{cat.categoryName}</span></p>
          </div>
          <div className="col-xs-12">
            <table className="listOfArticle">
              <thead>
                <tr>
                  <td><div className="table-column">&nbsp;</div></td>
                  <td className="img"><div className="table-column">&nbsp;</div></td>
                  <td className="details"><div className="table-column">Artículo</div></td>
                  <td className="price"><div className="table-column">Precio</div></td>
                  <td className="quantity"><div className="table-column">Cantidad</div></td>
                </tr>
              </thead>
              <tbody>
                {/* {index === (categoryInfo.length - 1)} */}
                {cat.itemInfo.map(eventList)}
              </tbody>
            </table>
          </div>
        </div ></React.Fragment>)
    }

    if (categoryInfo && categoryInfo.length > 0) {
      categoryInfo.map((cat, index) => {
        verLista.push(eventCategory(cat, index))
      });
    }
    if (this.props.isLoading) {
      if (this.resetVerLista) {
        verLista = [];
      }
      verLista.push('Cargando página..');
    }
    else if (!this.props.loading && this.props.fail) {
      verLista.push('intente nuevamente más tarde');
    }
    else if (!this.props.loading && !this.props.fail && categoryInfo && categoryInfo.length === 0) {
      verLista.push('Tu busqueda arrojo 0 resultados');
    }

    return (
      <React.Fragment>
        <DownloadPrintHeader />
        <div className="container wrapPanel toPrint" >
          <div className="col-xs-12 exclude-for-print-download non-printable">
            <h2>LISTA DE REGALOS</h2>
          </div>
          <div className="row show-grid-row vertical-align">
            <div className="col-xs-2 alignLeft exclude-for-print-download non-printable">
              <Image asset src={appconfig.imageUrl} className="profileImg" alt="Liverpool" /></div>
            <div className="col-xs-7 nameSubname alignCenter exclude-for-print-download non-printable">
              <p>&nbsp;{eventName}</p>
              <p>Los productos visibles dentro de esta sección son exclusivos de tiendas liverpool.</p>
            </div>
            <div className="col-xs-3 detailsEvent alignLeft exclude-for-print-download non-printable">
              <p>Fecha de evento: <span>{eventDate}</span></p>
              <p>Tipo de evento: <span>{eventType}</span></p>
              <p>Número de evento: <span>{eventId}</span></p>
              <Barcode value={eventId} format="CODE128" width="2" height="30" textAlign="center" fontSize="18" />
            </div>
          </div>
          <div className="row show-grid-row vertical-align exclude-for-print-download non-printable">
            <div className="col-xs-6">
              <p>Los festejados también tienen lista de regalo en:</p>
              <BrandFilter onBrandSelection={this.handleBrandSelection} className="linkPlatform giftList" />
            </div>
            <div className="col-xs-6 alignRight">
              {/* <ul className="linkPlatform">
                <li disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('download')} ><a href><i className="icon-descarga" /></a></li>
                <li disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('print')}><a href><i className="icon-imprimir" /></a></li>
              </ul> */}
              <PrintDownload brand={this.props.brand || ''} callBefore={() => this.showAllItems()} footer='LISTA DE REGALOS' elem='.toDownload' useDefault={true} fileName='ListaDeRegalos.pdf' usePageHeader='false' />
              {/* <DownloadPrint uiname={{
                download: 'EventDetailsPrintDownload',
                print: 'EventDetailsPrintDownload'
              }}
                before={{
                  download: () => this.showAllItems(),
                  print: () => this.showAllItems()
                }}
                footer='Event Details'
                brand={this.props.brand || ''}
                filename={{
                  download: 'EventDetailsPrintDownload-' + this.props.eventId + '.pdf',
                  print: 'EventDetailsPrintDownload-' + this.props.eventId + '.pdf'
                }}
              /> */}
            </div>
          </div>
          <div className="row show-grid-row vertical-align exclude-for-print-download non-printable">
            <div className="col-xs-3">
              <div className="cSelect filters">
                <SelectionTab
                  disableCaption="false"
                  optionCaption="Ordenar por precio"
                  options={PriceBasedSorting.options}
                  id={'id'}
                  optionText={'labelResourceId'}
                  optionValue={'value'}
                  required="false"
                  onChange={e => this.filterAndSorting(e, PriceBasedSorting.options, null)}

                />
              </div>
            </div>
            <div className="col-xs-3">
              <div className="cSelect filters">
                <SelectionTab
                  disableCaption="false"
                  options={categoryList}
                  optionCaption="Categoría"
                  optionText={'value'}
                  optionValue={'value'}
                  required="false"
                  onChange={e => this.filterAndSorting(e, null, categoryList)}
                />
              </div>
            </div>
            <div className="col-xs-6 alignRight">
              <p className="searchResult"><span>{guestViewGiftListData && guestViewGiftListData.itemsCount ? guestViewGiftListData.itemsCount : ''}</span> artículos</p>
            </div>
            {guestViewGiftListData && guestViewGiftListData.totalRecords && (+guestViewGiftListData.totalRecords > +guestViewGiftListData.recordsPerPage) &&
              <Pagination paginationInfo={paginationInfo} onPageChange={this.onPageChange} />
            }
          </div>
          <div className="row info display-hidden">
            <div className="col-xs-9 names">
              <h4>
                <p><b>&nbsp;{eventName}</b></p>
              </h4>
              <p><b className="label-liverpool-exclusive">los productos visibles dentro de esta sección son exclusivos de tiendas liverpool.</b></p>
            </div>
            <div className="col-xs-3 event">
              <p><b>Fecha del evento: </b><span>{eventDate}</span></p>
              <p><b>Tipo de evento: </b><span>{eventType}</span></p>
              <p><b>Número de evento: </b><span>{eventId}</span></p>
              <Barcode value={eventId} format="CODE128" width="2" height="30" textAlign="center" fontSize="18" />
            </div>
          </div>
          <div>
            {verLista}
          </div>
          {/* <div style={{ display: 'none' }} className="display-none"> */}
          {/* <EventdetailsDownloadPrint param={this.param} categoryInfo={categoryInfo} eventId={this.props.eventId} catId={this.catId} price={this.price} brand={this.props.brand} /> */}
          {/* {commonUtil.downloadPrint(this.param, 'eventdetails')} */}
          {/* </div> */}

        </div>
      </React.Fragment>
    )
  }
}

export default EventDetailsPage

