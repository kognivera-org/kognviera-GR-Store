/* Library */
import React, { Component } from 'react';
// import _ from 'lodash';
// import CheckBox from '../ZUILib/CheckBox';

class MultiSelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxOptions: this.props.data.options,
      isChecked: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onGetSelectedValue = (e) => {
    this.setState({ [e.target.id]: e.target.checked });
    const updateObj = this.state.checkboxOptions;
    // Check if allSelectors is selected
    if (e.target.attributes.getNamedItem('data-isallselector')) {
      for (let i = 0; i < updateObj.length; i++) {
        updateObj[i].isChecked = e.target.checked;
      }
    } else {
      for (let i = 0; i < updateObj.length; i++) {
        if (updateObj[i].id === e.target.id) {
          updateObj[i].isChecked = e.target.checked;
          break;
        }
      }

      // Check for all selector and select/de-select ALL
      let isSelectAll = true;
      for (let i = 0; i < updateObj.length; i++) {
        if (!updateObj[i].isAllSelector && !updateObj[i].isChecked) {
          isSelectAll = false;
          break;
        }
      }
      for (let i = 0; i < updateObj.length; i++) {
        if (updateObj[i].isAllSelector) {
          updateObj[i].isChecked = isSelectAll;
        }
      }
    }

    this.setState({
      checkboxOptions: updateObj,
    });

    // Update to parent
    this.updateToParent();
  }
  updateToParent() {
    const requestParam = [];
    this.state.checkboxOptions.forEach((val) => {
      if (val.isChecked) {
        requestParam.push({
          ...val,
          senderId: this.props.id,
        });
      }
    });
    this.props.onSelectChange(requestParam);
  }

  selectAll = () => {
    const checkboxOptions = this.state.checkboxOptions;
    for (let i = 0; i < checkboxOptions.length; i++) {
      checkboxOptions[i].isChecked = true;
    }
    this.setState({ checkboxOptions });
  }
  deSelectAll = () => {
    const checkboxOptions = this.state.checkboxOptions;
    for (let i = 0; i < checkboxOptions.length; i++) {
      checkboxOptions[i].isChecked = false;
    }
    this.setState({ checkboxOptions });
  }

  handleClickOutside = (e) => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({ isChecked: false });
    }
  }
  toggleChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
  }

  render() {
    const createCheckboxWAP = function (self, obj, index) {
      return (
        <li key={index} className="selectStore bb-1 bc-gray">
          <span>{obj.label}</span>
          <div className="checkSquare">
            <input
              type="checkbox"
              id={obj.id}
              value={obj.value}
              disabled={obj.disabled}
              checked={obj.isChecked}
              onChange={self.onGetSelectedValue}
              data-isallselector={obj.isAllSelector}
            />
            <label htmlFor={obj.id} />
          </div>
        </li>
      );
    };
    const createCheckboxWEB = function (self, obj, index) {
      return (
        <li key={index}>
          <div className="checkbox">
            <input
              type="checkbox"
              id={obj.id}
              value={obj.value}
              disabled={obj.disabled}
              checked={obj.isChecked}
              onChange={self.onGetSelectedValue}
              data-isallselector={obj.isAllSelector}
            />
            <label htmlFor={obj.id}>{obj.label}</label>
          </div>
        </li>
      );
    };
    return (
      <div>
        {this.props.channel === 'WAP' ?
          <div className="contentFilter">
            <div className="row filterSection">
              <p className="title">{this.props.data.title}</p>
            </div>
            <div className="row filterSection">
              <ul className="listFilter b-1-gray">
                {this.state.checkboxOptions.map((chkOption, index) => createCheckboxWAP(this, chkOption, index))}
              </ul>
            </div>
          </div> :
          <div className="cSelect filters" ref={cSelect => this.wrapperRef = cSelect}>
            <p>{this.props.data.title}</p>
            <input type="checkbox" checked={this.state.isChecked} onChange={this.toggleChange} id={this.props.data.id + '_checkclick'} defaultValue="on" />
            <label className="icon-caret_down" htmlFor={this.props.data.id + '_checkclick'} />
            <ul className="cDropDown">
              {this.state.checkboxOptions.map((chkOption, index) => createCheckboxWEB(this, chkOption, index))}
            </ul>
          </div>
        }
      </div>
    );
  }
}
export default MultiSelectDropdown;

