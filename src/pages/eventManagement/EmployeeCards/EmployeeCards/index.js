import React, { Component } from 'react';
import routeconfig from '../../../../config/routeconfig';
import { connect } from 'react-redux';
import { getEmployeeCardDetails } from './action';
import { getEmployeeDataForUpdate } from '../AddNewEmployeeCard/action';
import ManagementMenu from '../../Navigation/ManagementMenu';
import EmployeeCardItem from '../EmployeeCardItem';
import { Modal } from '../../../../lib/ZUILib/Modal';
import Button from '../../../../lib/ZUILib/Button';
import CommonUtil from '../../../../utils/commonUtil';
import * as request from '../requests';
import Link from '../../../../lib/ZUILib/Link'
import PrintDownload from '../../../global/PrintDownload'

@connect(
  store => ({
    //eventId: store.event,
    employeeCardDetailsData: store.getEmployeeCardDetails.data,
    eventData: store.eventdashboard.eventData,//.eventDetailsInfo.celebrityInfo
    deleteCardInfo: store.getEmployeeCardDetails.removeCardDetails
  }),
  { getEmployeeCardDetails, getEmployeeDataForUpdate }
)

class EmployeeCards extends Component {

  constructor(props) {
    super(props);
    this.eventId = null;
    this.state = {
      employeeCardsData: {},
      showModalDeleteCard: false,
      cardNo: undefined,
      firstName: undefined,
      disableDownload: false,
    }
  }
  componentWillMount() {
    this.props.getEmployeeCardDetails(this.props.params.eventId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.employeeCardDetailsData !== this.state.employeeCardsData) {
      this.setState({ employeeCardsData: nextProps.employeeCardDetailsData })
    }
  }
  toggleModalDeleteCard = (cardData) => {
    if (cardData) {
      this.setState({
        showModalDeleteCard: !this.state.showModalDeleteCard,
        cardNo: cardData.cardNumber,
        firstName: cardData.firstName,
      })
    } else {
      this.setState({
        showModalDeleteCard: !this.state.showModalDeleteCard,
        cardNo: undefined,
        firstName: undefined,
      })
    }
  }
  addEmployeeCard = () => {
    this.props.getEmployeeDataForUpdate();
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.addnewemployeecard, { eventId: this.props.params.eventId }));
  }
  updateEmployeeCard = (index) => {
    this.props.getEmployeeDataForUpdate();
    this.props.router.push(CommonUtil.generateRedirect(routeconfig.editemployeecard, { eventId: this.props.params.eventId + '?cardIdx=' + index }));
  }
  removeEmployeeCard = () => {
    let params = {
      'eventId': this.props.params.eventId,
      'cardNumber': this.state.cardNo,
    };
    request.removeEmployeeCard(params, (res) => {
      const removeCardSuccess = res && res.data && res.data.status;
      if (removeCardSuccess) {
        this.props.getEmployeeCardDetails(this.props.params.eventId);
        this.setState({
          showModalDeleteCard: false,
          cardNo: undefined,
          firstName: undefined,
        });
      }
    });
  }

  downloadToPDF = (param) => {
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      CommonUtil.downloadPdf('.toDownload', 'employeeCard.pdf', 'true', '', () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      window.print()
    }
  }

  render() {
    const { eventId, eventData } = this.props;
    const employeeCardDetailsData = this.state.employeeCardsData;
    let employeeCardData = "";
    let that = this;
    let isAddCardBtnDisabled = false;
    let addCardBtnDisabledClass = "";
    if (employeeCardDetailsData && employeeCardDetailsData.addCardButtonEnabled != undefined) {
      isAddCardBtnDisabled = !employeeCardDetailsData.addCardButtonEnabled;
      if (!employeeCardDetailsData.addCardButtonEnabled) {
        addCardBtnDisabledClass = "btnPrimaryDisable";
      }
    }
    if (employeeCardDetailsData && employeeCardDetailsData.dilisaCardInfo) {
      if (employeeCardDetailsData.dilisaCardInfo.length > 0) {
        employeeCardData = employeeCardDetailsData.dilisaCardInfo.map(function (cardInfo, i) {
          return (
            <EmployeeCardItem
              key={i}
              cardInfo={cardInfo}
              onClickModalDeleteCard={that.toggleModalDeleteCard}
              onClickEditCard={() => that.updateEmployeeCard(i)} />
          );
        });
      }
    }
    return (
      <React.Fragment>
        <div className="container fill">
          <div className="row fill">
            <div className="col-xs-2 fill">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="container-full white shadow mt-30 toPrint">
                <div className="row">
                  <div className="col-xs-6">
                    <h1 className="titleSection m-30">Tarjetas Liverpool de empleado</h1>
                  </div>
                  <div className="col-xs-4 nph right">
                    <Button uiname="EventEmployeeAddCard" className={`btnPrimary size-ExtraLarge mt-15 ${addCardBtnDisabledClass}`} id="addCard" disabled={isAddCardBtnDisabled} onClick={this.addEmployeeCard}>Agregar tarjeta</Button>
                  </div>
                  <div className="col-xs-2 nph">
                    <div className="left m-30">
                      {/* <Link disabled={this.state.disableDownload} className="download" onClick={() => this.downloadToPDF('download')}><i className="iClass icon-descarga icono-grande-inline mr-15" /></Link>
                      <Link disabled={this.state.disableDownload} className="print" onClick={() => this.downloadToPDF('print')}><i className="iClass icon-imprimir icono-grande-inline" /></Link> */}
                      <PrintDownload elem='.toDownload' fileName='employeeCard.pdf' usePageHeader='true' />
                    </div>
                  </div>
                </div>
                <div className="row m-30" id="cards">
                  <div className="grid-3-equal">
                    {employeeCardData}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modalContent" />
        <Modal
          className={"modal fade"}
          id={"modalDeleteCard"}
          show={this.state.showModalDeleteCard}
          content={"modal-sm"}
        >
          <div className="modal-header">
            <button className="close" type="button" onClick={() => this.toggleModalDeleteCard()}>×</button>
            <p className="parrafo"> ¿Deseas eliminar la tarjeta de {this.state.firstName}?</p>
          </div>
          <div className="grid-centered-big">
            <div />
            <div className="row">
              <div className="col-md-12">
                <div className="grid-two-elements">
                  <div>
                    <Button uiname="EventEmployeeCancelRemoveCard" className="btnSecondaryCustom" onClick={() => this.toggleModalDeleteCard()}>Cancelar</Button>
                  </div>
                  <div />
                  <div>
                    <Button uiname="EventEmployeeRemoveCard" className="btnPrimaryCustom" onClick={() => this.removeEmployeeCard()}>Aceptar</Button>
                  </div>
                </div>
              </div>
            </div>
            <div />
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
export default EmployeeCards;
