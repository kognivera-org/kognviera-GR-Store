import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, ModalHeader, ModalTitle, ModalBody } from 'lib/ZUILib/Modal'
import Form from '../../../../../../lib/ZUILib/Form'
import { flushCreateEventData } from '../../../../../../pages/createevent/actions'
import { format } from 'util'
import commonUtils from '../../../../../../utils/commonUtil';

@connect(
    store => ({
        eventdetail: store.eventdashboard.eventData,
        eventDetailLoading: store.eventdashboard.eventDataLoading,
        user: store.user,
        dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
    }), { flushCreateEventData },
)

class SelectViewModal extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.handleShow = this.handleShow.bind(this)
        this.handleClose = this.handleClose.bind(this)

        this.state = {
            show: false,
        }
    }

    handleClose() {
        this.setState({ show: false })
    }

    handleShow() {
        this.setState({ show: true })
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    routeToDashboard(e) {
        this.props.flushCreateEventData()
        this.props.routeToDashboard()
    }
    setDashboardUser = (e, formValues, formErrors, isValidForm) => {
        e.preventDefault()
        const isConsultant = false;
        let params = { eventId: this.props.params && this.props.params.eventId };
        let dashboardUser = {};
        const celebsInfo = this.props.eventdetail && this.props.eventdetail.eventDetailsInfo && this.props.eventdetail.eventDetailsInfo.celebrityInfo;
        let filteredArr = celebsInfo && celebsInfo.filter(function (el) {
            return (el.repositoryId === formValues.optionsRadios.split('::')[1]);
        });
        if (formValues.optionsRadios === 'storeuser') {
            params = {
                isConsultant: true,
                ...params
            }
        } else {
            params = {
                isConsultant,
                ownerId: formValues.optionsRadios.split('::')[1],
                profileId: (filteredArr[0].profileId === undefined || filteredArr[0].profileId === '') ? '12345678' : filteredArr[0].profileId,
                ...params
            }
        }
        const user = commonUtils.getCurrentStoreUser();


        dashboardUser = {
            userName: unescape(formValues.optionsRadios.split('::')[0]),
            userFirstName: unescape(formValues.optionsRadios.split('::')[2]),
            userEmail: formValues.optionsRadios != 'storeuser' && filteredArr[0].email != undefined ? filteredArr[0].email : '',
            userLastName: formValues.optionsRadios != 'storeuser' && filteredArr[0].lastName != undefined ? filteredArr[0].lastName : '',
            userMaternalName: formValues.optionsRadios != 'storeuser' && filteredArr[0].motherName != undefined ? filteredArr[0].motherName : '',
            dashboardUserRole: formValues.optionsRadios === 'storeuser' ? user.userRoleInfo.roleName : '',
            userMiddleName: formValues.optionsRadios != 'storeuser' && filteredArr[0].middleName != undefined ? filteredArr[0].middleName : '',
        }
        this.props.setOwner(params, dashboardUser)

    }

    render() {
        const { eventdetail, eventDetailLoading, routeToDashboard, params } = this.props
        const rows = []
        if (!eventDetailLoading) {
            const celebsInfo = eventdetail.eventDetailsInfo && eventdetail.eventDetailsInfo.celebrityInfo
            const getEventRow = (celeb, key) => {
                const customerName = celeb.firstName + ' ' + celeb.lastName + (celeb.motherName ? ' ' + celeb.motherName : '');
                return (
                    <div className="radio" key={key}>
                        <input value={`${escape(customerName)}::${celeb.repositoryId}::${celeb.firstName}`} id={`radio${key}-lm`} type="radio" name="optionsRadios" />
                        <label htmlFor={`radio${key}-lm`}>{customerName}</label>
                    </div>
                )
            }
            celebsInfo && celebsInfo.forEach((element, key) => {
                rows.push(getEventRow(element, key + 1))
            })
        }
        const celeblength = rows.length + 1
        return (
            <div>
                <Modal show={this.state.show} onHide={this.handleClose} id="loadModal" className="modal fade modal-custom">
                    <ModalBody>
                        <Form onSubmit={this.setDashboardUser}>
                            <div className="col-xs-12">
                                <p>¿Quien solicita el ingreso a este evento?</p>
                                {rows}
                                <div className="radio">
                                    <input value="storeuser" id={`radio${celeblength}-lm`} type="radio" name="optionsRadios" />
                                    <label htmlFor={`radio${celeblength}-lm`}>Consulta de asesora</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-6">
                                    <input value={params.eventId} type="hidden" name="eventId" />
                                    <button type="button" onClick={(this.props.dashboardUser.dashboardUserName && (this.props.dashboardUser.dashboardEventId === params.eventId)) ? this.handleClose : e => this.routeToDashboard(e)}
                                        className="btnSecondaryAction size-Full">Cancelar</button>
                                </div>
                                <div className="col-xs-6">
                                    <button className="btnPrimary size-Full loadModalContinue">Continuar <i className="iconRight icon-flecha_lightsvg_derecha" /></button>
                                </div>
                            </div>
                        </Form>
                    </ModalBody>
                </Modal>
            </div >
        )
    }
}
export default SelectViewModal
