
import React, { Component } from 'react';
import SelectAddressCommon from './selectAddressCommon'

class SelectAddress extends Component {
  render() {
    return (
      <div className="wrap-address">
        <SelectAddressCommon displayForm="false" {...this.props} />
      </div>
    );
  }
}
export default SelectAddress;
