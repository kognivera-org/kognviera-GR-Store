
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Link from '../../../../lib/ZUILib/Link';
import { getBonusDetails } from '../../actions';
import { sendMail } from '../../requests';
import { getLabels } from '../../../global/Labels/actions';
import commonUtil from '../../../../utils/commonUtil';
import appconfig from '../../../../config/appconfig';
import Image from '../../../../lib/ZUILib/Image';
import PrintDownload from '../../../global/PrintDownload';

@connect(
  store => ({
    bonusDetailsData: store.accountSummary.data,
    eventDetailsInfo: store.eventdashboard.eventData ? store.eventdashboard.eventData.eventDetailsInfo : null,
    labels: store.labels.labels,
    dashboardUser: store.eventdashboard && store.eventdashboard.dashboardUser,
  }),
  { getBonusDetails, getLabels })


class BonusDetail extends Component {
  constructor(props) {
    super(props);
    this.eventId = (this.props.params && this.props.params.eventId) ? this.props.params.eventId : '';
    this.pageName = 'BonusDetails';
    this.downloadPrintType = '';
    this.state = {
      statementPrintDownload: null,
      emailSendStatus: null,
      pdfLoadingLabel: null,
      loadingText: null,
    };
    this.loadingTranslations = {
      email: 'Enviando Correo',
      pdf: 'Descargando archivo',
    };
  }
  UNSAFE_componentWillMount = () => {
    this.props.getBonusDetails(this.eventId);
  }

  downloadToPDF = (param) => {
    const fileName = 'Contract';
    if (param && param === 'download') {
      this.setState({ loadingText: 'Descargando' });
      commonUtil.downloadPdf('.downloadPrintPage', 'accountStatement.pdf', 'false', 'ESTADO DE CUENTA', () => {
        this.setState({ loadingText: null });
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
    const { bonusDetailsData, labels, eventDetailsInfo } = this.props;
    let bonusMessage = commonUtil.getLabel(this.props.labels, 'accountStatement.bonusDetail.message1');
    if (!_.isEmpty(bonusDetailsData.bonusDetails)) {
      bonusMessage = bonusMessage.replace('{bonus}', bonusDetailsData.bonusDetails.bonusPercentage).replace('{amount}',
        commonUtil.getCurrency(bonusDetailsData.bonusDetails.totalBonusAmount));
    }
    return (
      <React.Fragment>
        {!_.isEmpty(bonusDetailsData) &&
          !_.isEmpty(bonusDetailsData.bonusDetails) &&
          !_.isEmpty(eventDetailsInfo) ?
            <div className="container wrapStatement wrapConsult">
            <div className="col-xs-12">
              <h2 className="mainTitle">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label1')}</h2>
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
                  <Link disabled={this.state.loadingText} uiname="AccountStatementEmail" className="icon-correo" onClick={e => this.downloadToPDF('mail')} />
                  {/* <Link disabled={this.state.loadingText} uiname="AccountStatementDownload" className="icon-descarga" onClick={e => this.downloadToPDF('download')} />
                  <Link disabled={this.state.loadingText} uiname="AccountStatementPrint" className="icon-imprimir" onClick={e => this.downloadToPDF('print')} /> */}
                  <PrintDownload footer="ESTADO DE CUENTA" elem=".downloadPrintPage" useDefault uiname="AccountStatementPrint" fileName="accountStatement.pdf" usePageHeader="false" />
                  {this.state.pdfLoadingLabel ?
                    <span>{this.state.pdfLoadingLabel}<Image src={appconfig.loadingImage} />
                    </span> : null}
                </div>
              </div>
            </div>
            <div className="col-xs-12 bb-10 p-l-15">
              <h2 className="subtitleSection"><i className="icon-ayuda tooltip-container"><span className="tooltip-box">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.tooltipMessage')}.</span></i>&nbsp;&nbsp;{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label2')}</h2>
            </div>
            {eventDetailsInfo.employee ?
              <div className="col-xs-12 bb-10 p-l-15">
                <p className="informativeTextSecond">{bonusMessage}.</p>
                <p className="informativeTextSecond">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.message2')}.</p>
              </div> :
              <div className="col-xs-12 bb-10 p-l-15">
                <p className="informativeTextSecond">{bonusDetailsData && bonusDetailsData.bonusDetails && bonusDetailsData.bonusDetails.bonusPercentage}% {commonUtil.getLabel(labels, 'accountStatement.bonus.message')}</p>
                <p className="informativeTextSecond">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.message2')}.</p>
              </div>
            }
            <div className="row show-grid-row bb-10">
              <div className="col-xs-12">
                <p className="subTitle">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label4')}:</p>
                <Link to={'/physicalgiftsdetail/' + this.eventId} className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-6">
                  <p className="price-valid">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label5')}:</p>
                  <p className="price-invalid">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label6')}: </p>
                </div>
                <div className="col-xs-6 align-Right">
                  <p className="price-valid">{commonUtil.getCurrency(bonusDetailsData.bonusDetails.physicalItemsBonusInfo.totalBonusEligibleAmont)}</p>
                  <p className="price-invalid">{commonUtil.getCurrency(bonusDetailsData.bonusDetails.physicalItemsBonusInfo.totalAmountNotEligibleForBonus)}</p>
                </div>
              </div>
            </div>
            <div className="row show-grid-row bonusRow">
              <div className="col-xs-6">
                <p>{bonusDetailsData.bonusDetails.bonusPercentage}% {commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label7')}:</p>
              </div>
              <div className="col-xs-6 align-Right">
                <p>{commonUtil.getCurrency(bonusDetailsData.bonusDetails.physicalItemsBonusInfo.totalBonusAccumulated)}</p>
              </div>
            </div>
            <div className="row show-grid-row bb-10">
              <div className="col-xs-12">
                <p className="subTitle">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label8')}:</p>
                <Link to={'/personalpurchasesdetail/' + this.eventId} className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-6">
                  <p className="price-valid">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label9')}:</p>
                  <p className="price-invalid">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label10')}: </p>
                </div>
                <div className="col-xs-6 align-Right">
                  <p className="price-valid">{commonUtil.getCurrency(bonusDetailsData.bonusDetails.personalItemsBonusInfo.totalBonusEligibleAmont)}</p>
                  <p className="price-invalid">{commonUtil.getCurrency(bonusDetailsData.bonusDetails.personalItemsBonusInfo.totalAmountNotEligibleForBonus)}</p>
                </div>
              </div>
            </div>
            <div className="row show-grid-row bonusRow">
              <div className="col-xs-6">
                <p>{bonusDetailsData.bonusDetails.bonusPercentage}% {commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label11')}:</p>
              </div>
              <div className="col-xs-6 align-Right">
                <p>{commonUtil.getCurrency(bonusDetailsData.bonusDetails.personalItemsBonusInfo.totalBonusAccumulated)} </p>
              </div>
            </div>
            <div className="row show-grid-row bb-10">
              <div className="col-xs-6">
                <p className="subTitle">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label12')}</p>
                <Link to={'/electronicgiftsdetail/' + this.eventId} className="primaryAction">Ver detalle<i className="icon-flecha_gruesa_derecha" aria-hidden="true" /></Link>
              </div>
              <div className="row show-grid-row">
                <div className="col-xs-6">
                  <p className="price-invalid">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label13')} </p>
                </div>
                <div className="col-xs-6 align-Right">
                  <p>{commonUtil.getCurrency(bonusDetailsData.bonusDetails.electronicItemsBonusInfo.totalBonusEligibleAmont)}</p>
                </div>
              </div>
            </div>
            <div className="row show-grid-row bonusRow">
              <div className="col-xs-6">
                <p>{bonusDetailsData.bonusDetails.bonusPercentage}% {commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label14')}:</p>
              </div>
              <div className="col-xs-6 align-Right">
                <p>{commonUtil.getCurrency(bonusDetailsData.bonusDetails.electronicItemsBonusInfo.totalBonusAccumulated)} </p>
              </div>
            </div>
            <div className="row show-grid-row bb-10">
              <div className="col-xs-6">
                <p className="price-valid">{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label15')}:</p>
              </div>
              <div className="col-xs-6 align-Right">
                <p className="price-valid">{commonUtil.getCurrency(bonusDetailsData.bonusDetails.totalBonusEligibleAmount)}</p>
              </div>
            </div>
            <div className="row show-grid-row bonusRow lastRow">
              <div className="col-xs-6">
                <p>{commonUtil.getLabel(labels, 'accountStatement.bonusDetail.label16')}:</p>
              </div>
              <div className="col-xs-6 align-Right">
                <p>{commonUtil.getCurrency(bonusDetailsData.bonusDetails.totalBonusAmount)}</p>
              </div>
            </div>
          </div>
          : null}
      </React.Fragment>
    );
  }
}
export default BonusDetail;
