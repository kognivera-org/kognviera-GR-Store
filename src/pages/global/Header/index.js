import React, { Component } from 'react';
import { navigate } from 'react-router-redux';
import { browserHistory, Link } from 'react-router';
import StoreHeader from './components/StoreHeader';
import EventHeader from './components/EventHeader';
import routeconfig from 'config/routeconfig';
import commonUtil from '../../../utils/commonUtil'

class Header extends Component {

  componentDidMount = () => {
    const showBrowserWarning = this.props.currentRoute && this.props.currentRoute.showBrowserWarning;

    if (typeof window !== 'undefined') {
      showBrowserWarning
        && window.addEventListener('beforeunload', commonUtil.browserRefresh)
    }
  }

  componentWillReceiveProps = () => {
    const showBrowserWarning = this.props.currentRoute && this.props.currentRoute.showBrowserWarning;

    if (typeof window !== 'undefined') {
      showBrowserWarning
        ? window.addEventListener('beforeunload', commonUtil.browserRefresh)
        : window.removeEventListener('beforeunload', commonUtil.browserRefresh)
    }
  }

  render() {
    const { path } = this.props;

    return (
      <React.Fragment>

        {
          // Temporary if conditions. To be made configurable later.
          (path !== routeconfig.root
            && path !== routeconfig.login
            && path !== routeconfig.updatepassword
            && path !== routeconfig.updatepasswordnow
            && path !== routeconfig.downloadPdf) &&
          (
            (path == routeconfig.daytracker
              || path == routeconfig.maindashboard
              || path == routeconfig.eventsearch
              || path == routeconfig.globalstepa
              || path == routeconfig.globalstepb
              || path == routeconfig.globalstepc
              || path == routeconfig.globalstepd
              || path == routeconfig.globalstepe
              || path == routeconfig.globalstepf
              || path == routeconfig.globalstepg
              || path == routeconfig.globalsteph
              || path == routeconfig.globalstepi
              || path == routeconfig.addnewaddress
              || path == routeconfig.addnewcreditcard
              || path == routeconfig.reportsummary
              || path == routeconfig.EventDetails) ?

              <StoreHeader {...this.props} />
              :
              <EventHeader {...this.props} />
          )
        }
      </React.Fragment>
    );
  }
}
export default Header;
