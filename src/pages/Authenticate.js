import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
const Authenticate = (WrappedComponent) => {

    @connect(
        store => ({
            eventstatus: store.header.eventDisplayStatus && store.header.eventDisplayStatus.currentStatus,
        })
    )
    class _Authenticate extends React.Component {
        render() {

            // Fetch component name to be looked up
            const coreComponentTypes = ['Button', '_Link', 'CheckBox', 'SelectionTab', 'RadioButton', 'Form', 'TextInput'];
            let componentName = WrappedComponent.displayName ? WrappedComponent.displayName : WrappedComponent.name;
            if (componentName && componentName.indexOf('(') !== -1) {
                let index = componentName.indexOf('(')
                componentName = componentName.substr(index + 1)
                index = componentName.indexOf(')')
                componentName = componentName.substr(0, index)
            }
            if (coreComponentTypes.indexOf(componentName) !== -1) {
                componentName = this.props.uiname;
            }
            // Get not allowed component from user
            let user = undefined;
            if (typeof window != 'undefined') {
                let userObj = window.localStorage.getItem("user");
                user = userObj ? JSON.parse(userObj) : undefined;
            }
            const _notallowedtouserarray = user && user.userRoleInfo && _.map(user.userRoleInfo.notAllowedUIComponents, 'componentName');
            let notAllowed = _notallowedtouserarray && _notallowedtouserarray.indexOf(componentName) !== -1;

            // if (notAllowed) {
            //     console.log('Component ' + componentName + ' was denied for current USER.');
            // }
            // If component is allowed to user, check if it is allowed for current event status 
            if (!notAllowed) {
                const currentEventStatus = this.props.eventstatus;
                if (currentEventStatus) {
                    const eventStatusInfo = user && user.userRoleInfo && user.userRoleInfo.eventStatusInfo;
                    const allNotAllowedEvents = eventStatusInfo && _.mapValues(_.keyBy(eventStatusInfo, 'componentName'), 'eventStatus');
                    if (allNotAllowedEvents) {
                        const _notallowedtoeventarray = allNotAllowedEvents[componentName];
                        notAllowed = _notallowedtoeventarray && _notallowedtoeventarray.indexOf(currentEventStatus) !== -1;
                        // if (notAllowed) {
                        //     console.log('Component ' + componentName + ' was denied for current EVENT STATUS.');
                        // }
                    }
                }
            }

            const component =
                notAllowed
                    ? <WrappedComponent notallowed={notAllowed && notAllowed.toString()} {...this.props} />
                    : <WrappedComponent {...this.props} />;

            return component;
        }
    }
    _Authenticate.displayName = "Authenticate";
    return _Authenticate
}

export default Authenticate;