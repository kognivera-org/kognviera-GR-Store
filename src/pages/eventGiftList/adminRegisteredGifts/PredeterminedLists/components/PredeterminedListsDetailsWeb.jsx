/* Library */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { asyncConnect } from 'redux-connect'
import PredeterminedListsDetails from './PredeterminedListsDetails'
import * as predeterminedListsActions from '../actions'
import commonUtil from '../../../../../utils/commonUtil'
import routeconfig from '../../../../../config/routeconfig'
import * as request from '../requests'


const {

  getaddPredeterminedItem,

  } = predeterminedListsActions

@connect(store => ({

  lables: store.labels.data,
  error: store.labels.error,
  loading: store.labels.loading,
  extraData: store.labels.extraData,
}),

  {

    ...predeterminedListsActions,
  })


class PredeterminedListsDetailsWeb extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : ''
  }
  brand = this.props.params && this.props.params.brand;
  componentWillReceiveProps(nextProps) {
    if (nextProps.addPredeterminedItemButton && nextProps.addPredeterminedItemButton.predeterminedItemInfo && nextProps.addPredeterminedItemButton.predeterminedItemInfo.length >= 0) {

      // browserHistory.push('/SearchResult');
    }
  }
  handleAddListToMyList = (repoId) => {
    // this.props.getaddPredeterminedItem(this.brand, repoId, this.props.params.eventId)
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

    const addPredeterminedItemInfo = this.props.addPredeterminedItemButton ? this.props.addPredeterminedItemButton.predeterminedItemInfo : null
    const { labels } = this.props
    return (

      <div>


        <PredeterminedListsDetails
          {...this.props}
          onAddListToMyList={this.handleAddListToMyList}
          addPredeterminedItemInfo={addPredeterminedItemInfo}
          eventId={this.eventId}
          brand={this.brand}
        />
      </div>

    )
  }

}
const mapStateToProps = state => ({
  myData: state,


  addPredeterminedItemButton: (state.predeterminedLists.data && state.predeterminedLists.data.addPredeterminedItemButton) ? state.predeterminedLists.data.addPredeterminedItemButton : null,

})
const matchDispatchToProps = dispatch => bindActionCreators({

  getaddPredeterminedItem,


}, dispatch)
export default connect(mapStateToProps, matchDispatchToProps)(PredeterminedListsDetailsWeb)

