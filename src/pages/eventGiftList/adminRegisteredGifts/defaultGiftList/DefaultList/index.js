
import React, { Component } from 'react';
import DefaultListHeader from './DefaultListHeader';
import DefaultListGrid from './DefaultListGrid';
class DefaultList extends Component {
render() {
return (
      <div>
        <div className="container">
          <DefaultListHeader/>
          <DefaultListGrid/>
        </div>
      </div>

);
}
}
export default DefaultList;
