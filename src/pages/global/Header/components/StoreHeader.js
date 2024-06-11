import React, { Component } from 'react';
import { navigate } from 'react-router-redux';
import { browserHistory, Link } from 'react-router';
import QuitEventModal from 'pages/createevent/globalevent/QuitEventModal';
import Button from '../../../../lib/ZUILib/Button';
import TextInput from '../../../../lib/ZUILib/TextInput';
import Image from 'lib/ZUILib/Image';
import ConfirmModal from '../../../global/ConfirmModal';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from 'config/routeconfig';

class StoreHeader extends Component {

    handleShowQuitEventModal = () => {
        const currentRoute = this.props.currentRoute;
        const showWarning = currentRoute ? currentRoute.showWarning : null;
        if (showWarning) {
            this.QuitEventModal.handleShow()
        } else if (currentRoute.path !== routeconfig.maindashboard) {
            this.ConfirmModal.handleShow()
        } else {
            this.props.goHome();
        }
    }

    handleConfirmOnBack = (type) => {
        this.props.flushCreateEventData();
        this.props.flushChangeOfEventData();
        if (this.ConfirmModal) {
            this.ConfirmModal.handleClose();
        }
        if (type === 'back') {
            browserHistory && browserHistory.goBack();
        } else {
            if (this.eventId) {
                this.eventId.value = ''
            }
            this.props.push(commonUtil.generateRedirect(routeconfig.maindashboard));
        }
    }

    handleQuitEvent = () => {
        this.props.flushCreateEventData();
        this.props.flushChangeOfEventData();
        this.props.goHome();
    }

    handleGoBack = () => {
        const currentRoute = this.props.currentRoute;
        const disableBackClick = currentRoute ? currentRoute.disableBackClick : null;
        if (!disableBackClick && browserHistory) {
            browserHistory.goBack()
        }
    }

    render() {
        const { userFromSession, logout, currentRoute } = this.props;
        const hideBackClick = currentRoute.hideBackClick;
        return (
            <React.Fragment>
                <div className="nav-wrap">
                    <div className="container">
                        <div className="row nav-style vertical-align">
                            {
                                !hideBackClick &&
                                <div className="col-xs-1">
                                    <a className="icon-flecha_gruesa_izq backAction" href="javascript:void(0)" onClick={this.handleGoBack} ></a>
                                </div>
                            }
                            <div className="col-xs-1 wrapLiverpoolLogo">
                                <a className="icon-logo_liver liverpoolAction" href="javascript:void(0)" onClick={this.handleShowQuitEventModal} ></a>
                            </div>
                            <div className={!hideBackClick ? 'col-xs-5' : 'col-xs-6'}>
                                <a href="javascript:void(0)" onClick={this.handleShowQuitEventModal}><Image asset src="/images/logoMesa.png" className="pull-left" alt="Mesa de Regalos" /></a>
                            </div>
                            {
                                userFromSession &&
                                <React.Fragment>
                                    < div className="col-xs-2 wrapSearch ">
                                        <form name="eventSearch" onSubmit={this.props.search}>
                                            <p className="textLabel">Buscar evento:</p>
                                            <div className="input-group">
                                                <TextInput
                                                    value=""
                                                    name="searchTerm"
                                                    htmlId="verificationForm"
                                                    formId="verificationForm"
                                                    className="form-control"
                                                    type="number"
                                                    required="required"
                                                    maxlength="10"
                                                    divClassName=" "
                                                    refProp={eventId => this.eventId = eventId}
                                                />
                                                <span className="input-group-btn">
                                                    <Button uiname="HomeQuickSearch" className="btn btn-default buttonSearch" type="submit">
                                                        <i className="icon-flecha_gruesa_derecha" />
                                                    </Button>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-xs-3 wrapSesion">
                                        <p>{userFromSession.userName}</p>
                                        <p>{userFromSession.userRoleInfo && userFromSession.userRoleInfo.roleName}</p>
                                        <a href="javascript:void(0)" onClick={(e) => logout(userFromSession.storeAssociateId)}>
                                            <b><ins>Cerrar sesión</ins></b>
                                        </a>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>

                <QuitEventModal onRef={ref => (this.QuitEventModal = ref)} handleQuitEvent={this.handleQuitEvent}
                    labels={this.props.labels} />
                <ConfirmModal onRef={ref => (this.ConfirmModal = ref)} handleConfirmOnBack={this.handleConfirmOnBack}
                    displayMessage='¿estás seguro que deseas salir?' />
            </React.Fragment >
        );
    }
}
export default StoreHeader;