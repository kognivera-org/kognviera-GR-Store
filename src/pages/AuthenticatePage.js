import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { ReduxAsyncConnect } from 'redux-connect'

class AuthenticatePage extends React.Component {

    render() {

        const { router } = this.props;
        const routeCount = router.routes && router.routes.length;
        const currentRoute = router.routes && router.routes[routeCount - 1];

        // Get not allowed component from user
        let user = undefined;
        if (typeof window != 'undefined') {
            let userObj = window.localStorage.getItem("user");
            user = userObj ? JSON.parse(userObj) : undefined;
        }

        const _notallowedpagestouserarray = user && user.userRoleInfo && _.map(user.userRoleInfo.notAllowedPageList, 'pageUrl');

        let notAllowed = _notallowedpagestouserarray && _notallowedpagestouserarray.indexOf(currentRoute.path) !== -1;
        // console.log('AuthenticatePage ' + currentRoute.path + ' is not allowed ? ', notAllowed);
        currentRoute.pagenotallowed = notAllowed;

        return <ReduxAsyncConnect {...this.props} />;
    }
}

export default AuthenticatePage;