/* eslint-disable import/first */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MesaActions from './components/MesaActions';
import ActivityLog from './components/ActivityLog';
import Reportes from './components/Reportes';
import AddReminderModal from './components/AddReminderModal';
import SelectStoreModal from './components/SelectStoreModal';
import EventSearchModal from '../../eventSearch/EventSearchModal';
import { loadActivityLogs } from './actions';
import { saveSelectedStore } from './components/SelectStoreModal/actions';
import routeconfig from '../../../config/routeconfig';
import commonUtil from '../../../utils/commonUtil';
import appconfig from '../../../config/appconfig';
import tagging from '../../../utils/tagging';

@connect(() => ({}), { saveSelectedStore, loadActivityLogs })
export default class MainDashboard extends Component {
  componentWillMount() {}

  componentDidMount = () => {
    localStorage.removeItem('user_host');
    localStorage.removeItem('iscoOwner');
    localStorage.removeItem('userCoOwner');
    const savedSessionValue =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('storeId')
        : null;

    const userObj =
      typeof window !== 'undefined' && window.localStorage.getItem('user');
    const userFromSession = userObj && JSON.parse(userObj);
    const roleName =
      userFromSession &&
      userFromSession.userRoleInfo &&
      userFromSession.userRoleInfo.roleName;

    if (
      appconfig.storeModalRoles.indexOf(roleName) !== -1 &&
      (savedSessionValue == null || savedSessionValue === 'null')
    ) {
      this.SelectStoreModal.handleShow();
    }
  };

  handleOpenSearchModal = () => {
    this.EventSearchModal.handleShow();
  };

  handleOpenAddReminderModal = () => {
    this.AddReminderModal.handleShow();
  };

  handleRouteToSearchResults = (queryString) => {
    this.props.router.push(
      commonUtil.generateRedirect(`${routeconfig.eventsearch}?${queryString}`));
  };

  saveStore = (storeId) => {
    this.props.saveSelectedStore(storeId);
  };

  updateSessionStorage = (property, saved) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(property, saved);
    }
  };

  handleCreateNewEvent = () => {
    tagging('mr', 'home', 'creation', {});
    this.props.router.push(
      commonUtil.generateRedirect(routeconfig.globalstepa));
  };

  handleGoDayTracker = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.daytracker));
  };

  render() {
    const storeIdFromSession =
      typeof window !== 'undefined' && window.localStorage.getItem('storeId');
    return (
      <React.Fragment>
        <MesaActions
          createnewevent={this.handleCreateNewEvent}
          opensearchmodal={this.handleOpenSearchModal}
        />
        <div className="container">
          <div className="row">
            <ActivityLog />
            <Reportes />
          </div>
        </div>
        <div className="modalContent">
          <AddReminderModal onRef={(ref) => { this.AddReminderModal = ref; }} />
          <EventSearchModal
            routeToSearch={this.handleRouteToSearchResults}
            onRef={(ref) => { this.EventSearchModal = ref; }}
          />
          <SelectStoreModal
            onRef={(ref) => { this.SelectStoreModal = ref; }}
            saveStore={this.saveStore}
            storeIdFromSession={storeIdFromSession}
          />
        </div>
      </React.Fragment>
    );
  }
}
