import React from 'react';
import authenticate from '../../../pages/Authenticate';


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.getSelectedOption = this.getSelectedOption.bind(this);
    this.setControlState = this.setControlState.bind(this);
  }
  // give you entire json structure assinged of that particualr index
  getSelectedOption = (selectedOpt) => {
    if (this.props.handleSelectedOption && this.props.optionValue) {
      const _selectedOption = this.props.options.filter(option => option[this.props.optionValue].toString() === selectedOpt);
      if (this.props.id) {
        _selectedOption[0].senderId = this.props.id;
      }
      this.props.handleSelectedOption(_selectedOption[0]);
    }
  }
  clearSelectedData() {
    if (this.selectedOption) {
      this.selectedOption.selectedIndex = '';
    }
  }
  // give you only selected value.
  getValue() {
    if (this.selectedOption.selectedIndex) {
      return this.selectedOption.value;
    }
    return '';
  }

  getID() {
    if (this.selectedOption) {
      const id = this.selectedOption.options[this.selectedOption.selectedIndex].id;
      return id;
    }
    return null;
  }

  getSelectedIndex() {
    return this.selectedOption.selectedIndex;
  }

  setSelectedValue = (newvalue) => {
    const slectedOption = document.querySelector('#' + this.props.id + ' option[value="' + newvalue + '"]');
    if (slectedOption) {
      slectedOption.selected = true;
    }
  }

  setControlState(isValildState, errorMessage, errorAttributes) {
    this.isControlStateValid = isValildState;
    if (isValildState && ((this.props.isMandatory && this.selectedOption.value) || (!this.props.isMandatory))) {
      this.selectedOption.classList.remove(errorAttributes.controlErrorClass);
      this.errorControl.classList.remove(errorAttributes.errorClass);
      this.errorControl.innerHTML = '';
    } else {
      this.selectedOption.classList.add(errorAttributes.controlErrorClass);
      this.errorControl.classList.add(errorAttributes.errorClass);
      this.errorControl.innerHTML = errorMessage;
    }
  }
  render() {
    // const errorStyle = { 'margin-bottom': '0px' }
    const props = this.props;
    const { options, optionText, optionValue, optionCaption, value, disable, id, dropDownClass, classname } = this.props;
    let optionHtml = <option key={'caption' + id}>{optionCaption}</option>;
    if (options) {
      optionHtml = options.map((option, index) => {
        if (optionCaption && index === 0) {
          return ([
            <option
              disabled
              selected
              key={index + 'caption' + props.id}
            >{optionCaption}</option>,
            <option
              disabled={option.disabled}
              id={option.id}
              key={index + 'option' + props.id}
              selected={optionValue ? value === option[optionValue] : false}
              value={optionValue ? option[optionValue] : null}
            >{option[optionText]}</option >]);
        }
        return (
          <option
            disabled={option.disabled}
            id={option.id} key={index + 'option' + props.id}
            selected={optionValue ? value === option[optionValue] : false}
            value={optionValue ? option[optionValue] : null}
          >{option[optionText]}</option>
        );
      });
    }
    return (
      <div>
        <div className={classname}>
          <select
            id={id} disabled={disable} onChange={(option) => {
              this.getSelectedOption(option.target.value);
            }} ref={sel => (this.selectedOption = sel)} className={dropDownClass}
            style={{ marginBottom: '0px' }}
          // TODO: this style attribute will be removed once error css will be available.
          >
            {optionHtml}
          </select>
          <i className="icon-caret_down" />
        </div>
        <label className="error" ref={err => this.errorControl = err} />
      </div>
    );
  }
}
Counter.defaultProps = {
  isMandatory: true,
};
Counter.displayName = 'SelectionTab';
export default authenticate(Counter);
