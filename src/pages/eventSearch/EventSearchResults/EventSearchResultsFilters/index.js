
import React, { Component } from 'react';
import EventSearchModal from '../../EventSearchModal';
import Datetime from 'lib/datetime/DateTime';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';
import moment from 'moment';
import appconfig from '../../../../config/appconfig';
export default class EventSearchResultsFilters extends Component {

  handleOpenSearchModal = (e) => {
    e.preventDefault();
    this.EventSearchModal.handleShow();
  }

  handleRouteToSearchResults = (queryString) => {
    this.props.router.push(commonUtil.generateRedirect(`${routeconfig.eventsearch}?${queryString}`));
  }

  render() {
    const { eventTypes, applyFilter, query } = this.props;

    const dateFormat = {
      input: true,
      name: 'eventDate',
      timeFormat: "hh:mm A",
      value: query.eventDate && query.eventDate,
      closeOnSelect: true,
      dateFormat: "YYYY/MM/DD",
      isValidDate: (current) => {
        return current.isAfter(moment().subtract(5, 'year'));
      }
    }
    const eventTypeArr = eventTypes ? eventTypes : []
    const currentEventType = query.eventType;
    if (currentEventType && eventTypeArr.length === 0) {
      eventTypeArr.push(currentEventType)
    }
    const eventTypeOptions = eventTypeArr.map((eventType, index) => {
      const value = appconfig.eventTypes[eventType] ? appconfig.eventTypes[eventType] : eventType;
      const isSelected = value === currentEventType;
      return <option key={index} selected={isSelected} value={value}>{eventType}</option>
    })
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 mainTitle">
            <h1>BÚSQUEDA DE MESA DE REGALOS</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <div className="cSelect filters">
              <select name="eventType" onChange={applyFilter}>
                <option disabled="disabled" selected="selected" value=""> Filtrar por tipo de evento</option>
                {eventTypeOptions}
              </select><i className="icon-caret_down" />
            </div>
          </div>
          <div className="col-xs-3">
            <Datetime
              {...dateFormat}
              onChange={applyFilter}
              name="eventDate"
              // onChange={(e) => applyFilter(e, "calendar")}
              ref={(eventDate) => { this.eventDate = eventDate }}
              placeholder="Fecha del evento" />
          </div>
          <div className="col-xs-3">
            <p className="infoResult">
              <a className="anchor"
                href="javascript:void(0)"
                onClick={this.handleOpenSearchModal}>Nueva búsqueda</a>
            </p>
          </div>
        </div>
        <EventSearchModal routeToSearch={this.handleRouteToSearchResults} onRef={ref => (this.EventSearchModal = ref)} />
      </div>
    );
  }
}
// export default EventSearchResultsFilters;
