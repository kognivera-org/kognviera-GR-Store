import React from 'react';
import SelectionTab from '../../lib/ZUILib/SelectionTab'
import TextInput from '../../lib/ZUILib/TextInput';

export default class SelectionTabMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTextInputVisible: false,
      value: this.props.selectMoreOptions.defaultValue ? this.props.selectMoreOptions.defaultValue : 1,
      orgValue: this.props.selectMoreOptions.defaultValue ? this.props.selectMoreOptions.defaultValue : 1,
      data: this.props.data,
      type: this.props.textType ? this.props.textType : 'text',
    };
  }
  updateValue = (value) => {
    this.quantity.value = value;
  }
  onChange = (e) => {
    // const re = /^[0-9\b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
    const value = e.target.value;
    if (value !== '0') {
      this.setState({ value })
      // }
      const valObj = {
        id: 'more',
        value: e.currentTarget.value,
        labelResourceId: 'more',
        disabled: false,
        orgValue: this.state.orgValue,
      };
      if (this.props.onChange) {
        if (this.state.data) {
          this.props.onChange(valObj, this.updateValue, this.props.data);
        } else {
          this.props.onChange(valObj, this.updateValue);
        }
      }
    }
  }
  handleSelectedOption = (e) => {
    if (e.target.value !== 'more') {
      if (this.props.onChange) {
        if (this.state.data) {
          this.props.onChange({ ...e, orgValue: this.state.orgValue }, this.updateValue, this.props.data);
        } else {
          this.props.onChange({ ...e, orgValue: this.state.orgValue }, this.updateValue);
        }
      }
    } else {
      this.setState({
        isTextInputVisible: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.selectMoreOptions.defaultValue,
    })

  }
  render() {
    return (
      <div>
        {this.state.isTextInputVisible || (this.props.selectMoreOptions.defaultValue && this.props.selectMoreOptions.defaultValue > 5) ?
          <TextInput
            id={this.props.htmlId}
            name={this.props.name}
            uiname={this.props.uiname}
            type={this.state.type}
            className="selectionTabMoreCustomTextInput form-control"
            onChange={this.onChange}
            // onBlur={this.onChange}
            placeholder={this.state.value}
            inputValue={this.state.value}
            maxlength="3"
            onPaste="return false;"
          /> : <SelectionTab
            uiname={this.props.uiname}
            className="cSelect selectionTabMoreCustomSelect"
            id={this.props.selectMoreOptions.id}
            optionText={this.props.selectMoreOptions.optionText}
            optionValue={this.props.selectMoreOptions.optionValue}
            selected={this.state.value}
            value={this.state.value}
            required="false"
            options={this.props.selectMoreOptions.options}
            onChange={this.handleSelectedOption}
            ref={st => (this.quantity = st)}
          />}
      </div>
    );
  }
}
