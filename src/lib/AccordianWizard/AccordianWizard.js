import React from 'react';

export default class AccordianWizard extends React.Component {
  constructor(props) {
    super(props);
    this.currentIndex = 0;
  }
  _next = () => {
    this.currentIndex = this.currentIndex + 1;
    this._goToPanel(this.currentIndex > this.props.children.length ? this.currentIndex - 1 : this.currentIndex);
  }
  _prev = () => {
    this.currentIndex = this.currentIndex - 1;
    this._goToPanel(this.currentIndex <= 0 ? 0 : this.currentIndex);
  }
  _goToPanel = (index) => {
    this.currentIndex = index;
    for (let i = 0; i < document.querySelectorAll('div.panel.checkout-step .panel-collapse.collapse').length; i++) {
      if (i === index) {
        document.querySelectorAll('div.panel.checkout-step span.checkout-step-number')[i].classList.remove('inactive');
        document.querySelectorAll('div.panel.checkout-step span.checkout-step-number')[i].classList.add('active');

        document.querySelectorAll('div.panel.checkout-step .titleModule')[i].classList.remove('inactiveTitle');

        document.querySelectorAll('div.panel.checkout-step .panel-collapse.collapse')[i].classList.add('in');
      } else {
        document.querySelectorAll('div.panel.checkout-step span.checkout-step-number')[i].classList.remove('active');
        document.querySelectorAll('div.panel.checkout-step span.checkout-step-number')[i].classList.add('inactive');

        document.querySelectorAll('div.panel.checkout-step .titleModule')[i].classList.add('inactiveTitle');

        document.querySelectorAll('div.panel.checkout-step .panel-collapse.collapse')[i].classList.remove('in');
      }
    }
  }
  render() {
    return (
      <div>
        {this.props.children && this.props.children instanceof Array ? this.props.children.map(child => child) : this.props.children}
      </div>
    );
  }
}
