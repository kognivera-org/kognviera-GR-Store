import React, { Component } from 'react';
import _ from 'lodash';

export default class RefundReinvestment extends Component {
  constructor(props) {
      super(props);
    }

  getFormData = () => {
      let reqParams = {};
      reqParams = {
          refundReinvest: true,
          totalAmount: this.props.refundAmount,
        };
      return reqParams;
    }

  render() {
      return (
          <div>
              <div className="reinversionOptions">
                  <div className="col-xs-4">
                      <p className="messageText"><i className="icon-ayuda" /> Total de la devolución</p>
                      <p className="articleName alignHelp">${this.props.refundAmount}</p>
                    </div>
                </div>
            </div>
        );
    }
}

