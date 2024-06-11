import React, { Component } from 'react';
import commonUtil from '../../utils/commonUtil';
import Image from '../../lib/ZUILib/Image';

export default class DownloadPrintHeader extends Component {
  // constructor(props) {
  // super(props);
  // this.renderHTML = this.renderHTML.bind(this);
  // this.fileName = '';
  // }

  render() {
    // to be changed later. avoid using getElementById
    const selectedbrand = (typeof document !== 'undefined') && document.getElementById('selectedbrandid');
    const brand = (selectedbrand && selectedbrand.value) || commonUtil.getBrand();
    return (
      <React.Fragment>
        {/* <span /> */}
        <div className="container printable print-header exclude-for-print-download">
          <div className="row pdfclass">
            <div className="col-sm-6 LPLogo">
              <Image asset src={'/images/logo-' + brand + '.png'} alt="Liverpool Logo" />
            </div>
            <div className="col-sm-6 LPGRLogo text-right">
              {commonUtil.formatDate(Date.now(), 'monthName')}<br />
              <Image asset src="/images/logoMesa.png" alt="Logo Mesa" />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
