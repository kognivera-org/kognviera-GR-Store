import React, { Component } from 'react';
// import { getLabels } from '../../../global/Labels/actions'
import { connect } from 'react-redux';
import * as updateBonusInfo from '../action';
import GiftDetail from '../giftDetail'


@connect(
  store => ({
  }),
  { ...updateBonusInfo },
)

class EventGiftProductlist extends Component {
  resetItemInfo = false;
  componentWillReceiveProps = (nextProps) => {
    if (this.props.brand !== nextProps.brand) {
      this.resetItemInfo = true;
    } else {
      this.resetItemInfo = false;
    }

  }
  bonusSelected = '';
  itemId = '';
  getParams = () => {
    let eventId = this.props.eventId;
    let channel = 'INSTORE';
    let itemId = '';
    let bonusSelection = '';
    let params = {
      'eventId': eventId,
      'brand': this.props.brand,
      // 'channel': channel,
      "itemId": itemId,
      "bonusSelection": bonusSelection,
    };
    return params;
  }

  openViewPurchaseData = (product) => {
    this.props.onViewPurchaseDetail(product)
  }
  bonusApplicableCheck = (e, scope) => {
    this.setState({
      ['bonus' + e]: !(this.state['bonus' + e])
    })
  }
  getSelectedBonusType = (event, itemId) => {
    let params = this.getParams();
    params = {
      ...params,
      "itemId": itemId,
      "bonusSelection": event.target.title
    }
    this.props.updateBonusInfo(params)
  }

  openTrackOrder = (e, product) => {
    this.props.onTrackOrder(product);
  }
  state = {}
  render() {
    this.idx = 1
    const linkJSON = [
      {
        displayName: 'Aplica',
        children: 'Aplica',
        areaLabel: '',
        route: '#',
        class: 'linkClass',
      }, {
        displayName: 'No válida',
        children: 'No válida',
        areaLabel: 'abc',
        route: '#',
        class: 'linkClass',
      },
    ];
    const { labels, data, itemsInfo, fail, loading, onViewPurchaseDetail, onTrackOrder } = this.props
    const eventAccountTransferenceAndClosure = labels ? labels.eventAccountTransferenceAndClosure : null
    let itemsList = []
    const createItemRow = (product, key) => {
      return <GiftDetail key={key} product={product} eventId={this.props.eventId} resetBonus={this.props.resetBonus}
        brand={this.props.brand} onViewPurchaseDetail={onViewPurchaseDetail} onTrackOrder={onTrackOrder} event={this.props.event}
        openEventTypes={this.props.openEventTypes} />
    }


    if (itemsInfo && itemsInfo.length > 0) {
      itemsInfo.map((element, key) => {
        this.idx++
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

    return (
      <tbody>

        {itemsList}

      </tbody>
    )

  }
}

export default EventGiftProductlist
