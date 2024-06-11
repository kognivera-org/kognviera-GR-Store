import React, { Component } from 'react';
import _ from 'lodash';
import commonUtil from '../../../../utils/commonUtil';
import routeconfig from '../../../../config/routeconfig';

export default class ClosingGiftPanel extends Component {

  redirectLink = () => {
    this.props.router.push(commonUtil.generateRedirect(routeconfig.eventdashboard, { eventId: this.props.eventId }));
  }
  render() {
    const { submitTransferenceData } = this.props;
    const skusNames = [];
    let remisionNumber = '';
    let selectedAddressName = '';
    if (!_.isEmpty(submitTransferenceData) && !_.isEmpty(submitTransferenceData.closingGiftDetails)) {
      submitTransferenceData.closingGiftDetails.forEach((gift) => {
        skusNames.push(gift.skuName);
        remisionNumber = gift.remisionNumber ? gift.remisionNumber : null;
        selectedAddressName = gift.addressName;
      });
      // skusNames = skusNames.toString().replace(',', ', ');
      // remisionNumber = remisionNumber.toString().replace(',', ', ');
    }

    return (
      <React.Fragment>
        {!_.isEmpty(submitTransferenceData) ?
          <div className="closingGiftPanel">
            {/* <div className="row nmh borde-abajo mb-10 mt-20" /> */}
            <div className="block-verification ">
              <div className="titleSection">Regalo por Cierre</div>
              <div>
                {this.props.loadFrom === 'verificationForm' ?
                  <div>
                    <div>
                      <p><strong>Regalo: </strong>{submitTransferenceData.skusNames}</p>
                    </div>
                    <div>
                      {submitTransferenceData.selectedAddressName ?
                        <p><strong>Entrega a domicilio: </strong>{submitTransferenceData.selectedAddressName}</p>
                        : <p><strong>Entrega en Tienda</strong></p>}
                    </div>
                  </div>
                  : <div className="row">
                    <div className="col-xs-6">
                      <div className="table-header">
                        <p className="table-title nmv">Dettales del regalo</p>
                      </div>
                      <div className="table-body">
                        <div className="row p-5 nmh mt15 mb15">{skusNames.map((item, index) => <div key={index}>{item}</div>)}</div>
                      </div>
                      <div className="table-body">
                        <div className="row p-5 nmh">
                          {!_.isEmpty(remisionNumber) ? <React.Fragment>
                            <div className="col-xs-6 border-right">
                              <div className="text-left"><strong className="label-detail">No. de remision: {remisionNumber}</strong></div>
                            </div>
                            <div className="col-xs-6">
                              <strong className="label-detail">Entrega a domicilio: {selectedAddressName}</strong>
                            </div></React.Fragment> : <div className="col-xs-12">
                              <strong className="label-detail">Entrega en Tienda</strong>
                            </div>}
                        </div>
                      </div>
                      <p className="mt-20"><small>{commonUtil.getLabel(this.props.labels, 'eventClosure.closure.label7')}
                        <a className="primaryLink" onClick={this.redirectLink}> click aqui</a></small></p>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
          : null}
      </React.Fragment>);
  }
}
