import React, { Component } from 'react';
import ManagementMenu from '../Navigation/ManagementMenu';
import { getLabels } from '../../global/Labels/actions'
import { getContractDetails } from '../../createevent/globalevent/StepG/actions';
import { getEmployeeCardDetails } from '../EmployeeCards/EmployeeCards/action';
import { connect } from 'react-redux';
import PrintContract from './printableContract';
import commonUtil from '../../../utils/commonUtil';
import appconfig from '../../../config/appconfig';
import DownloadPrint from '../../global/DownloadPrint'
import Link from '../../../lib/ZUILib/Link'
import PrintDownload from '../../global/PrintDownload'

@connect(
  store => ({
    labels: store.labels.labels,
    contract: store.contract.data,
    event: store.eventdashboard && store.eventdashboard.eventData,
    dilisaCardInfo: store.getEmployeeCardDetails && store.getEmployeeCardDetails.data && store.getEmployeeCardDetails.data.dilisaCardInfo
  }),
  {
    getLabels,
    getContractDetails,
    getEmployeeCardDetails
  }
)

class Contract extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disableDownload: false,
    }
  }

  componentWillMount = () => {
    const event = this.props.event;
    const isEmployee = (event && event.eventDetailsInfo && event.eventDetailsInfo.employee) || false;
    event && event.eventDetailsInfo && this.props.getContractDetails(event.eventDetailsInfo.eventType, isEmployee.toString(), this.props.params.eventId);
    isEmployee && this.props.params && this.props.params.eventId && this.props.getEmployeeCardDetails(this.props.params.eventId);
  }

  componentWillReceiveProps = (nextProps) => {
    let contract = nextProps.contract;
    contract = contract.contractDetailsInfo && contract.contractDetailsInfo.contractdata;
    const event = nextProps.event;
    const eventId = this.props.params.eventId
    if (!contract && event && event.eventDetailsInfo && event.eventDetailsInfo.eventType) {
      const isEmployee = (event && event.eventDetailsInfo && event.eventDetailsInfo.employee) || false;
      this.props.getContractDetails(event.eventDetailsInfo && event.eventDetailsInfo.eventType, isEmployee.toString(), eventId);
    }
  }

  downloadToPDF = (param) => {
    const { labels, event } = this.props
    const fileName = 'Contract'
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      commonUtil.downloadPdf('.toPrint', 'eventcontract.pdf', 'false', `${labels && commonUtil.getLabel(labels, 'dashboard.event.contract')} - ${event && event.eventDetailsInfo && event.eventDetailsInfo.eventType}`, () => {
        this.setState({ disableDownload: false })
      })
    } else if (param && param === 'print') {
      commonUtil.printPage('.toPrint')
    }
    // this.setState({ enableNextStep: true })
  }

  updateForPrint = () => {
    // this.props.setPrintView()
    window.print()
    // this.setState({ enableNextStep: true })
  }

  render() {
    const { labels, contract, event, dilisaCardInfo } = this.props;
    const contractHtml = contract
      && contract.contractDetailsInfo
      && contract.contractDetailsInfo.contractdata;
    return (
      <div>
        <div className="display-hidden">
          <PrintContract event={event} contractHtml={contractHtml} dilisaCardInfo={dilisaCardInfo} />
        </div>
        <div className="container main-container">
          <div className="row">
            <div className="col-xs-2">
              <ManagementMenu params={this.props.params} />
            </div>
            <div className="col-xs-10">
              <div className="container-full white shadow mt-30">
                <div className="row">
                  <div className="col-md-8">
                    <h1 className="titleSection m-30">{labels && commonUtil.getLabel(labels, 'dashboard.event.contract')} - {event && event.eventDetailsInfo && event.eventDetailsInfo.eventType}</h1>
                  </div>
                  <div className="col-md-4">
                    <div className="right m-30">
                      {/* <Link className="iClass icon-descarga icono-grande-inline mr-15" disabled={this.state.disableDownload} onClick={() => this.downloadToPDF('download')} /> */}
                      {/* <Link className="iClass icon-imprimir icono-grande-inline" disabled={this.state.disableDownload} onClick={() => this.updateForPrint()} /> */}
                      <PrintDownload elem='.toPrint' fileName='eventContract.pdf' footer={`${labels && commonUtil.getLabel(labels, 'dashboard.event.contract')} - ${event && event.eventDetailsInfo && event.eventDetailsInfo.eventType}`} usePageHeader='false' />
                    </div>
                  </div>
                </div>
                <div className="row p-30 nmh">
                  <div className="col-md-12 contract-container pdfContent">
                    <p dangerouslySetInnerHTML={{ __html: contractHtml }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modalContent" />
      </div>

    );
  }
}
export default Contract;