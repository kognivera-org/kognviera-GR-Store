
import React, { Component } from 'react'
import { connect } from 'react-redux'
import EventDetailsPage from './components/EventDetailsPage'
import commonUtil from '../../../utils/commonUtil';
import { getGiftListGuestView, setFavouriteGiftAction } from './actions'

@connect(
  store => ({
    giftListGuestView: store.eventdetails,
    fail: store.eventdetails.eventDataFailed,
    isLoading: store.eventdetails.loading,
  }),
  {
    getGiftListGuestView,
    setFavouriteGiftAction,
  },
)
class EventDetails extends Component {
  constructor(props) {
    super(props)
    this.eventId = this.props.params.eventId
    this.catId = ''
    this.price = ''
    this.currentPage = 1
    this.brand = commonUtil.getBrand();
    this.state = {
      selectAllCheckBox: false,
    }
  }

  UNSAFE_componentWillMount() {
    // 300000201
    this.props.getGiftListGuestView(this.eventId, '1', (this.catId || ''), (this.price || ''))

  }
  handleFilterByBrand = (brandTitle) => {
    this.brand = brandTitle
    // const params = this.getParams()
    // _.merge(params, { brand: brandTitle })
    this.props.getGiftListGuestView(this.eventId, '1', (this.catId || ''), (this.price || ''), this.brand)
  }

  setFavouriteGift = (giftItemId, skuId, isFavourite) => {
    const eventId = this.eventId
    this.props.setFavouriteGiftAction(eventId, giftItemId, skuId, (isFavourite).toString())
  }
  render() {
    return (
      <React.Fragment>
        <EventDetailsPage
          eventId={this.eventId}
          giftListGuestView={this.props.giftListGuestView}
          getGiftListGuestView={this.props.getGiftListGuestView}
          setFavouriteGift={this.setFavouriteGift}
          onFilterByBrand={this.handleFilterByBrand}
          fail={this.props.fail}
          isLoading={this.props.isLoading}
          brand={this.brand}
        />
      </React.Fragment>
    )
  }

}
export default EventDetails
