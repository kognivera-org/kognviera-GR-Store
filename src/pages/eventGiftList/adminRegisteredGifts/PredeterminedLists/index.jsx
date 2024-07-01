/* Library */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PredeterminedListsWeb from './components/PredeterminedListsWeb'
import { getLabels } from '../../../../pages/global/Labels/actions'
import commonUtil from '../../../../utils/commonUtil'
import routeconfig from '../../../../config/routeconfig'
import * as request from './requests'
import * as predeterminedListsActions from './actions'

const { getpredeterminedLandingPage,
  getaddPredeterminedItem,

} = predeterminedListsActions


@connect(store => ({
  labels: store.labels.labels,
  error: store.labels.error,
  loading: store.labels.loading,
  extraData: store.labels.extraData,
  event: store.eventdashboard.eventData && store.eventdashboard.eventData.eventDetailsInfo,
}),
  {
    getLabels,
    ...predeterminedListsActions,
  })
class PredeterminedLists extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    const eventTypeSonam = this.props.event && this.props.event.eventType ? this.props.event.eventType : ''

    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : ''


  }

  brand = this.props.params && this.props.params.brand;

  UNSAFE_componentWillMount() {
    const eventType = this.props.event && this.props.event.eventType
    eventType && this.props.getpredeterminedLandingPage(this.brand, eventType)

  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.addPredeterminedItemButton && nextProps.addPredeterminedItemButton.addPredeterminedItemInfo && nextProps.addPredeterminedItemButton.addPredeterminedItemInfo.length >= 0) {
    //   console.log('products', nextProps.addPredeterminedItemButton.addPredeterminedItemInfo)

    // }

    // wait for event detailsInfo to be called for predetermined list.
    const thenEventType = this.props.event && this.props.event.eventType
    const nowEventType = nextProps.event && nextProps.event.eventType

    thenEventType !== nowEventType && this.props.getpredeterminedLandingPage(this.brand, nowEventType)

  }
  handleAddListToMyList = (repoId) => {
    // this.props.getaddPredeterminedItem(this.brand, repoId, this.eventId)
    const params = {
      predeterminedItemId: repoId,
      eventId: this.eventId,
      brand: this.brand,
    }
    request.addToGiftList(params, this.callBackAddItemToList)
  }
  callBackAddItemToList = (response) => {
    if (response.data && response.data.status === 'success') {
      this.props.router.push(commonUtil.generateRedirect(routeconfig.registeredgifts, { eventId: this.eventId }))
    }
  }

  render() {

    const eventType = this.props.event && this.props.event.eventType
    const addPredeterminedItemInfo = this.props.addPredeterminedItemButton ? this.props.addPredeterminedItemButton.addPredeterminedItemInfo : null
    if (this.props.predeterminedLanding && this.props.predeterminedLanding.predeterminedItemInfo && this.props.predeterminedLanding.predeterminedItemInfo.length > 0) {
      const predeterminedListInfo = this.props.predeterminedLanding.predeterminedItemInfo
      const { labels } = this.props

      return (

        <div>


          <PredeterminedListsWeb
            {...this.props}
            predeterminedListInfo={predeterminedListInfo}
            handleAddListToMyList={this.handleAddListToMyList}
            addPredeterminedItemInfo={addPredeterminedItemInfo}
            eventId={this.eventId}
            eventType={this.eventType}
            brand={this.brand}
          />

        </div>

      )
    }
    return null
  }

}
const mapStateToProps = state => ({
  myData: state,
  predeterminedLanding: (state.predeterminedLists.data && state.predeterminedLists.data.predeterminedLanding) ? state.predeterminedLists.data.predeterminedLanding : null,

})
const matchDispatchToProps = dispatch => bindActionCreators({
  getpredeterminedLandingPage,
  getaddPredeterminedItem,


}, dispatch)
export default connect(mapStateToProps, matchDispatchToProps)(PredeterminedLists)
