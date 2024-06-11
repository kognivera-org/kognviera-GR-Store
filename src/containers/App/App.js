import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import config from '../../config/appconfig';
import routeconfig from '../../config/routeconfig';
import helmetattrs from '../../config/helmetattrs';
import { globalstylesheets, stylesheets } from '../../config/stylesheets';
import Header from '../../pages/global/Header';
import { logoutUser } from '../../pages/login/LoginPage/actions';
import { flushCreateEventData } from '../../pages/createevent/actions';
import { flushChangeOfEventData } from '../../pages/changeOfEvent/actions'
import { executeEventDetail } from '../../pages/eventManagement/EventDashboard/actions';
import { getLabels } from '../../pages/global/Labels/actions';
import commonUtil from '../../utils/commonUtil';
import { browserHistory } from 'react-router';
import { changeAddressOfDelivery } from '../../pages/eventGiftList/registeredGifts/requests';
import appconfig from '../../config/appconfig';
import PrintableComponent from './PrintableComponent'


@connect(
  store => ({
    user: store.user,
    labels: store.labels.labels,
    loggedOut: store.user.loggedOut,
    event: store.eventdashboard && store.eventdashboard.eventData,
    printView: store.createevent.printView,
    dashboardUserId: store.eventdashboard && store.eventdashboard.dashboardUser && store.eventdashboard.dashboardUser.id,
  }), { logoutUser, pushState: push, flushCreateEventData, flushChangeOfEventData, getLabels, executeEventDetail }
)

export default class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    routes: PropTypes.array,
  }

  componentDidMount = () => {
    const { router } = this.props;
    const routeCount = router.routes && router.routes.length;
    const currentRoute = router.routes && router.routes[routeCount - 1];

    // redirect to dashboard if dashboard user selection required.
    if (currentRoute.requiresUser) {
      const eventIdParam = this.props.params && this.props.params.eventId;
      this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: eventIdParam }));
    }

    let userFromSession
    // get labels if not already fetched
    const debug = this.props.location.query && this.props.location.query.debug;
    !this.props.labels && this.props.getLabels(debug);

    if (typeof window != 'undefined') {
      let userObj = window.localStorage.getItem("user");
      userFromSession = (userObj && userObj != 'null' && userObj != 'undefined') ? JSON.parse(userObj) : undefined;
    }
    if (!userFromSession) {
      const currentLocation = router.getCurrentLocation()
      const loginUrl = commonUtil.generateRedirect(routeconfig.login);
      if (currentLocation.pathname !== '/' && currentLocation.pathname !== loginUrl) {
        return this.props.router.push(`${loginUrl}?to=${currentLocation.pathname}`);
      }
    }
    if (!currentRoute.pagenotallowed) {
      let user = undefined;
      if (typeof window != 'undefined') {
        let userObj = window.localStorage.getItem("user");
        user = userObj ? JSON.parse(userObj) : undefined;
      }
      // get event data
      this.getEvent(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedOut) {
      if (typeof window != 'undefined') {
        let tempUser = window.localStorage.getItem("user");
        if (tempUser && tempUser != 'null' && tempUser != 'undefined') {
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("storeId");
          window.location.href = routeconfig.root;
        }
      }
    }
    // get event data
    (nextProps.location.query != this.props.location.query) &&
      this.getEvent(nextProps);
  }

  getEvent = (props) => {
    // get event data if event id is passed and not already in store
    const eventIdParam = props.params && props.params.eventId;
    const eventIdReduxStore = props.event && props.event.eventDetailsInfo && props.event.eventDetailsInfo.eventId;

    ((eventIdParam && !eventIdReduxStore)
      || (eventIdParam && eventIdReduxStore && eventIdReduxStore !== eventIdParam)) &&
      this.props.executeEventDetail(eventIdParam, this.props.dashboardUserId || '12345678');
  }

  handleGoBack = () => {
    const currentRoute = this.props.currentRoute;
    const disableBackClick = currentRoute ? currentRoute.disableBackClick : null;
    if (!disableBackClick && browserHistory) {
      browserHistory.goBack()
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    //this.props.router.push('/eventsearch?searchOption=exactSearch&eventNumber=' + e.target.searchTerm.value);
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventsearch + '?searchOption=exactSearch&eventNumber=' + e.target.searchTerm.value));
  }

  handleGoHome = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.root));
  }

  handleLogout = (storeAssociateId) => {
    let retVal = this.props.logoutUser(storeAssociateId);
    if (retVal == true) {
      if (typeof window != 'undefined') {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("storeId");
        window.location.href = routeconfig.root;
      }
    }
  }

  render() {
    let userFromSession = undefined;
    const { loggedOut, router } = this.props;
    const routeCount = router.routes && router.routes.length;
    const currentRoute = router.routes && router.routes[routeCount - 1];

    if (typeof window != 'undefined') {
      let userObj = window.localStorage.getItem("user");
      userFromSession = (userObj && userObj != 'null' && userObj != 'undefined') ? JSON.parse(userObj) : undefined;
    }
    // let pathname;
    // if (!userFromSession) {
    //   pathname = routeconfig.login
    // } else {
    //   pathname = currentRoute.path ? currentRoute.path : '/';
    // }
    // let pathname = this.props.routes && this.props.routes[2].path
    // pathname = pathname == undefined ? '/' : pathname

    let pathname = currentRoute.path ? currentRoute.path : '/';

    // Download & Print pathname for CSS
    let isDownloadPrint = false;
    if (pathname === 'downloadprint' && this.props.location.query.fileName) {
      pathname = routeconfig[this.props.location.query.fileName];
      isDownloadPrint = true;
    }

    // Get assets path for env
    const assetsPath = appconfig.assets;
    const bundleCSS = appconfig.bundleCSS;
    const version = appconfig.version;
    let link;
    if (!bundleCSS) {
      // Generate link tags for stylesheets based on routes
      link = [...globalstylesheets, ...stylesheets[pathname] || []];
    } else {
      link = [...globalstylesheets];
    }
    link = [...link, '/css/common-overwrites.css', '/css/common-print.css']
    link = link && link.map(item => { return { rel: "stylesheet", type: "text/css", href: assetsPath + item + '?v=' + version } });

    let x = '';
    let bemclass = pathname.split('/:')[0].replace(new RegExp('/', 'g'), '-');
    bemclass = bemclass === '-' ? 'root' : bemclass;
    x += bemclass.toLowerCase()

    // Get body attributes for this route
    let bodyAttributes = helmetattrs[pathname] ? helmetattrs[pathname].bodyAttributes : {};
    let classes = bodyAttributes.class || '';
    if (!classes.includes(x)) {
      bodyAttributes.class += ' ' + x;
    }

    const { user } = this.props;

    const mainClass = config.printableComponents && config.printableComponents.indexOf(currentRoute.path) >= 0 ? 'non-printable' : 'toDownload'

    const pagenotallowed = currentRoute && currentRoute.pagenotallowed;
    return (
      <React.Fragment>
        <Helmet {...config.app.head} link={link} bodyAttributes={bodyAttributes} />
        {
          !pagenotallowed ?
            <React.Fragment>
              <div className={mainClass}>
                {!isDownloadPrint &&
                  <Header
                    labels={this.props.labels}
                    push={router.push}
                    userFromSession={userFromSession}
                    logout={this.handleLogout}
                    goHome={this.handleGoHome}
                    search={this.handleSearch}
                    currentRoute={currentRoute}
                    flushCreateEventData={this.props.flushCreateEventData}
                    flushChangeOfEventData={this.props.flushChangeOfEventData}
                    params={this.props.params}
                    path={pathname}
                    router={router}
                  />
                }
                {this.props.children}
              </div>
              <PrintableComponent currentRoute={currentRoute} {...this.props} />
            </React.Fragment>
            :
            <React.Fragment>
              <div className="container">
                <div className="main">
                  <div className="row">
                    <div className="col-xs-12">
                      <h3>No cuentas los permisos necesarios para acceder a esta seccion, revisa tu información.</h3>
                    </div>
                    <div className="col-xs-2">
                      <button className="btnSecondaryAction size-Full" onClick={this.handleGoBack}>
                        <i className="icon-flecha_light_izq"></i> Regresar
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
        }
      </React.Fragment>);
  }
}