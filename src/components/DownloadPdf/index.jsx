import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { globalstylesheets, stylesheets } from '../../config/stylesheets';
import routeconfig from '../../config/routeconfig';
import commonUtil from '../../utils/commonUtil';

export default class DownloadPdf extends Component {
  constructor(props) {
    super(props);
    this.renderHTML = this.renderHTML.bind(this);
    this.fileName = '';
  }

  componentDidMount() {
    const openerContainer = this.renderHTML();
    if (openerContainer) {
      document.querySelector('#divPrint').classList.value = openerContainer.classList.value;
      document.querySelector('#divPrint').innerHTML = openerContainer.innerHTML;
      document.querySelectorAll('#divPrint .exclude-for-print-download').forEach(function (element) {
        element.classList.add("display-none");
      });
      if (this.props.location && this.props.location.query && this.props.location.query.content && this.props.location.query.content === 'print') {
        this.fileName = this.props.location.query.fileName;
        setTimeout(() => { this.print(); }, 500);
      } else if (this.props.location && this.props.location.query && this.props.location.query.content && this.props.location.query.fileName && this.props.location.query.content === 'download') {
        this.fileName = this.props.location.query.fileName;
        setTimeout(() => { this.printPdf(this.fileName); }, 500);
      }
    }
  }
  printPdf = (fileName) => {
    commonUtil.generatePdf('.printPage', `${fileName}.pdf`);
  }

  print = () => {
    window.print();
  }
  renderHTML = () => {
    let elementSelector = null;
    if (typeof document !== 'undefined' && window.opener !== null) {
      if (this.props.location.query.classname) {
        elementSelector = window.opener.document.querySelector(this.props.location.query.classname);
      }
      else {
        elementSelector = window.opener.document.querySelector('.toPrint');
      }

      return elementSelector;
    }
    return null;
  }

  render() {
    const pathname = this.fileName ? routeconfig[this.fileName] : '';
    let link = stylesheets[pathname];
    link = link ? link : globalstylesheets;
    link = link.map((item) => { return { rel: 'stylesheet', type: 'text/css', href: item } });
    link = [
      ...link,
      { rel: 'stylesheet', type: 'text/css', href: '/assets/css/common-overwrites.css' },
    ];
    return (
      <div className="printPage" id={this.props.location.query && this.props.location.query.fileName}>
        <Helmet link={link} />
        <div className="row pdfclass">
          <div className="col-sm-6 LPLogo">
            <img src="/assets/images/Liverpool_logo.png" alt="Liverpool Logo" />
          </div>
          <div className="col-sm-6 text-right">
            <img src="/assets/images/logoMesa.png" alt="Logo Mesa" />
          </div>
        </div>
        <div id="divPrint" />
        <div className="downloadprint-overlay" />
      </div>
    );
  }
}
