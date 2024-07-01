
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import commonUtil from '../../../../utils/commonUtil';
import { getLabels } from '../../../global/Labels/actions';
import Link from '../../../../lib/ZUILib/Link';
import { getaccountPartialTransferDetails } from '../../actions';
import { sendMail } from '../../requests';
import Image from '../../../../lib/ZUILib/Image';
import appconfig from '../../../../config/appconfig';
import PrintDownload from '../../../global/PrintDownload';

@connect(
  store => ({
    accountPartialTransferData: store.accountSummary.accountPartialTransfer,
    labels: store.labels.labels,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
  }),
  { getaccountPartialTransferDetails, getLabels },
)

class StatementPartialTransference extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    this.pageName = 'statementpartialtransference';
    this.downloadPrintType = '';
    this.state = {
      transferenceDetails: [],
      statementPrintDownload: null,
      emailSendStatus: null,
      pdfLoadingLabel: null,
      disableDownload: false,
    };
    this.loadingTranslations = {
      email: 'Enviando Correo',
      pdf: 'Descargando archivo',
    };
  }
  UNSAFE_componentWillMount() {
    this.props.getaccountPartialTransferDetails(this.eventId);
  }

  componentWillReceiveProps(nextprops) {
    if (!_.isEmpty(nextprops.accountPartialTransferData.transferenceInfo)) {
      this.setState({ transferenceDetails: nextprops.accountPartialTransferData.transferenceInfo.transferenceDetails });
    }
  }

  onSortChange = (type) => {
    const transferenceDetails = this.state.transferenceDetails;
    let sortedData = null;
    sortedData = _.sortBy(transferenceDetails, data => data[type]);
    if (this.state['sort_' + type]) {
      if (this.state['sort_' + type] === 'asc') {
        this.setState({ ['sort_' + type]: 'desc' });
        sortedData.reverse();
      } else {
        this.setState({ ['sort_' + type]: 'asc' });
      }
    } else {
      this.setState({ ['sort_' + type]: 'desc' });
      sortedData.reverse();
    }
    this.setState({ transferenceDetails: sortedData });
  }

  downloadToPDF = (param) => {
    const fileName = 'Contract';
    if (param && param === 'download') {
      this.setState({ disableDownload: true })
      commonUtil.downloadPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'account Statement', () => {
        this.setState({ disableDownload: false })
      });
    } else if (param && param === 'print') {
      window.print();
    } else if (param && param === 'mail') {
      this.setState({ pdfLoadingLabel: this.loadingTranslations.email });
      // commonUtil.mailPdf('.downloadPrintPage', 'accountStatement.pdf', this.accountStatementSendMail, 'false');
      commonUtil.mailPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', this.accountStatementSendMail);
    }
  }
  accountStatementSendMail = (fileName, data) => {
    const emailId = this.props.dashboardUser && this.props.dashboardUser.dashboardUserEmail;
    sendMail(data, fileName, this.eventId, emailId, (res) => {
      if (res.data) {
        this.setState({ emailSendStatus: { isSent: true }, pdfLoadingLabel: null });
      } else {
        this.setState({ emailSendStatus: { isSent: false }, pdfLoadingLabel: null });
      }
    });
  }

  componentDidUpdate = () => {
    commonUtil.errorScrollUp();
  }
  render() {
    const { accountPartialTransferData, labels } = this.props;
    const partialWebRow = function (data, index) {
      const number = data.number.replace(/.(?=.{4})/g, 'x');
      return (
        <tr key={index}>
          <td>{commonUtil.formatDate(data.date, 'dd/mm/yyyy')}</td>
          <td>{data.storeName}</td>
          <td>{data.userName}</td>
          <td>
            <p>{data.transferenceMethod}</p>
            <p>{number}</p>
          </td>
          <td>-{data.commission}</td>
          <td>-{commonUtil.getCurrency(data.amountTransferred)}</td>
        </tr>
      );
    };

    const sortUpIcon = (<span className="iClass icon-flecha_filtros_arriba pointer" />);
    const sortDownIcon = (<span className="iClass icon-flecha_filtros_abajo pointer" />);
    return (
      <div>
        {!_.isEmpty(accountPartialTransferData) ?
          <div className="container wrapStatement">
            {!_.isEmpty(accountPartialTransferData.transferenceInfo.transferenceSummary) ?
              <React.Fragment>
                <div className="col-xs-12">
                  <h2 className="mainTitle">{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.label1')}</h2>
                </div>
                <div className="row show-grid-row">
                  <div className="white-box">
                    <div className="col-xs-3 right-border text-right ph60"><span className="titleInfoDetail" /><span className="qtyDetail" /></div>
                    <div className="col-xs-3 right-border text-right ph60"><span className="titleInfoDetail">{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.label3')}</span><span className="qtyDetail">{accountPartialTransferData.transferenceInfo.transferenceSummary.totalTransactionToMonedero}</span></div>
                    <div className="col-xs-3 right-border text-right ph60"><span className="titleInfoDetail">{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.label4')}</span><span className="qtyDetail">{accountPartialTransferData.transferenceInfo.transferenceSummary.totalTransactionsToBank}</span></div>
                    <div className="col-xs-3 text-right ph60"><span className="titleInfoDetail">{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.label5')}</span><span className="qtyDetail">-{commonUtil.getCurrency(accountPartialTransferData.transferenceInfo.transferenceSummary.totalTransferredAmount)}</span></div>
                  </div>
                </div>
                {this.state.emailSendStatus ?
                  <React.Fragment>
                    {this.state.emailSendStatus.isSent ?
                      <div className="alertSuccess" > <i className="icon-check" />
                        <p>{commonUtil.getLabel(labels, 'accountStatement.emailsent.message')}</p>
                        <a className="icon-tache2 closeAlert" onClick={() => this.setState({ emailSendStatus: null })} />
                      </div> :
                      <div className="alertError" > <i className="icon-tache2" />
                        <p>{commonUtil.getLabel(labels, 'accountStatement.emailfailed.message')}</p>
                        <a className="icon-tache2 closeAlert" onClick={() => this.setState({ emailSendStatus: null })} />
                      </div>}
                  </React.Fragment> : null}
                <div className="row show-grid-row">
                  <div className="col-xs-offset-10">
                    <div className="account-iconWrap">
                      <Link disabled={this.state.disableDownload} uiname="AccountStatementEmail" className="icon-correo" onClick={e => this.downloadToPDF('mail')} />
                      {/* <Link disabled={this.state.disableDownload} uiname="AccountStatementDownload" className="icon-descarga" onClick={e => this.downloadToPDF('download')} />
                      <Link disabled={this.state.disableDownload} uiname="AccountStatementPrint" className="icon-imprimir" onClick={e => this.downloadToPDF('print')} /> */}
                      <PrintDownload footer='account Statement' elem='.downloadPrintPage' useDefault={true} uiname="AccountStatementDownload" fileName='accountStatement.pdf' usePageHeader='false' />
                      {this.state.pdfLoadingLabel ?
                        <span>{this.state.pdfLoadingLabel}<Image src={appconfig.loadingImage} />
                        </span> : null}
                    </div>
                  </div>
                </div>
              </React.Fragment>
              : null}
            {!_.isEmpty(accountPartialTransferData.transferenceInfo.transferenceDetails) ?
              <div className="col-xs-12">
                <table className="table-partial">
                  <thead>
                    <tr>
                      <td>{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.columnLabel1')}{/* eslint-disable*/}<span onClick={() => this.onSortChange('date')}>{this.state.sort_date ? (this.state.sort_date === 'desc' ? sortDownIcon : sortUpIcon) : sortUpIcon}</span></td>
                      <td>{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.columnLabel2')}{/* eslint-disable*/}<span onClick={() => this.onSortChange('transferenceMode')}>{this.state.sort_transferenceMode ? (this.state.sort_transferenceMode === 'desc' ? sortDownIcon : sortUpIcon) : sortUpIcon}</span></td>
                      <td>{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.columnLabel3')}</td>
                      <td>Destino{/* eslint-disable*/}<span onClick={() => this.onSortChange('transferenceMethod')}>{this.state.sort_transferenceMethod ? (this.state.sort_transferenceMethod === 'desc' ? sortDownIcon : sortUpIcon) : sortUpIcon}</span></td>
                      <td>{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.columnLabel4')}{/* eslint-disable*/}<span onClick={() => this.onSortChange('commission')}>{this.state.sort_commission ? (this.state.sort_commission === 'desc' ? sortDownIcon : sortUpIcon) : sortUpIcon}</span></td>
                      <td>{commonUtil.getLabel(labels, 'accountStatement.partialTransfer.columnLabel5')}{/* eslint-disable*/}<span onClick={() => this.onSortChange('amountTransferred')}> {this.state.sort_amountTransferred ? (this.state.sort_amountTransferred === 'desc' ? sortDownIcon : sortUpIcon) : sortUpIcon}</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.transferenceDetails.map(partialWebRow)}
                  </tbody>
                </table>
              </div>
              : null}
          </div>
          : null}
      </div >
    );
  }
}
export default StatementPartialTransference;
