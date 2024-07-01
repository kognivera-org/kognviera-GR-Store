
import React, { Component } from 'react';
import { connect } from 'react-redux'
import EventSearchResultsList from './EventSearchResultsList';
import EventSearchResultsFilters from './EventSearchResultsFilters';
import EventSearchNoResults from '../EventSearchNoResults';
import EventSearchPagination from './EventSearchPagination';
import EventSearchModal from 'pages/eventSearch/EventSearchModal';
import { executeEventSearch } from './actions'
import { browserHistory } from 'react-router'
import Pagination from '../../../lib/Pagination'
import qs from 'query-string';
import commonUtil from '../../../utils/commonUtil';
import routeconfig from '../../../config/routeconfig';

@connect(
  store => ({
    searchResult: store.searchevents.results,
    loading: store.searchevents.loading,
  }),
  { executeEventSearch },
)

class EventSearchResults extends Component {

  constructor(props) {
    super(props);
    this.eventTypes = ''
  }

  UNSAFE_componentWillMount() {
    this.props.executeEventSearch(this.props.location.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.query != this.props.location.query) {
      this.props.executeEventSearch(nextProps.location.query);
    }
    if (nextProps.location.query.type && nextProps.location.query.type === 'new') {
      this.eventTypes = ''
    }
    if (!this.eventTypes && nextProps.searchResult && nextProps.searchResult.eventTypes && nextProps.searchResult.eventTypes.length > 0) {
      this.eventTypes = nextProps.searchResult.eventTypes
    }

  }

  handleOpenSearchModal = () => {
    this.EventSearchModal.handleShow();
  }
  handleRouteToSearchResults = (queryString) => {
    this.props.router.push(commonUtil.generateRedirect(`${routeconfig.eventsearch}?${queryString}`));
  }
  handleSearch = (pageNumber) => {
    let newParam = { "pageNum": pageNumber, "resultsPerPage": 10 }
    let query = Object.assign({}, this.props.location.query, newParam);
    let searchString = qs.stringify(query);
    this.props.router.push(commonUtil.generateRedirect(`${routeconfig.eventsearch}?${searchString}`));
    this.props.executeEventSearch(query);
  }

  applyFilter = (e) => {
    const filterParam = e && e._d ? { 'eventDate': e.format('YYYY/MM/DD') } : e && e.currentTarget ? { [e.currentTarget.name]: e.currentTarget.value } : null;
    this.props.location.query.type && delete this.props.location.query.type
    if (!filterParam) {
      if (!e) {
        this.props.location.query.eventDate && delete this.props.location.query.eventDate
      } else if (!e._d) {
        return;
      }
    }
    let query = Object.assign({}, this.props.location.query, filterParam);
    let searchString = qs.stringify(query);
    this.props.router.push(commonUtil.generateRedirect(`${routeconfig.eventsearch}?${searchString}`));

    this.props.executeEventSearch(query);
  }
  handleEventListRedirect = (eventId) => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId }));
  }

  render() {
    const { searchResult } = this.props;
    let paginationInfo = {};
    if (searchResult && searchResult.events) {
      paginationInfo = {
        totalNoOfRecords: searchResult.totalResultsMatchedCount,
        recordsPerPage: 10,
        currentPage: searchResult.currentPageNumber,
      }
    }
    let resultCount = searchResult && searchResult.totalResultsMatchedCount;
    const eventTypes = this.eventTypes ? this.eventTypes : searchResult && searchResult.eventTypes;
    return (
      <div className="container">
        <div className="main">
          {
            resultCount > 0 &&
            <EventSearchResultsFilters eventTypes={eventTypes} applyFilter={this.applyFilter} query={this.props.location.query} {...this.props} />
          }
          {
            resultCount > 0 &&
            <div className="row">
              <div className="col-xs-8 resultTitle">
                <h2>Resultados de búsqueda</h2>
              </div>
              <div className="col-xs-12 paginator">
                {
                  <p className="infoResult numPages">{searchResult.totalResultsMatchedCount}
                    <label className="txtAchorPaginator">&nbsp;resultados</label>
                  </p>
                }
                <Pagination paginationInfo={paginationInfo} onPageChange={this.handleSearch} />
              </div>
            </div >
          }
          {
            this.props.loading ?
              <h4> Loading</h4>
              :
              resultCount > 0 ?
                <EventSearchResultsList onEventListRedirect={this.handleEventListRedirect} searchResults={searchResult} />
                :
                <EventSearchNoResults opensearchmodal={this.handleOpenSearchModal} />
          }
          {resultCount > 0 && <div className="row">
            <div className="col-xs-12 paginator">
              <Pagination paginationInfo={paginationInfo} onPageChange={this.handleSearch} />
            </div>
          </div >}
          <EventSearchModal routeToSearch={this.handleRouteToSearchResults} onRef={ref => (this.EventSearchModal = ref)} />
        </div>
      </div>
    );
  }
}
export default EventSearchResults;
