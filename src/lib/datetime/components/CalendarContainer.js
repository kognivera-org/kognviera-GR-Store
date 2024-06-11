import React, { Component } from 'react'
import DaysView from './DaysView'
import MonthsView from './MonthsView'
import YearsView from './YearsView'
import TimeView from './TimeView'

export default class CalendarContainer extends React.Component {
	viewComponents = {
		days: DaysView,
		months: MonthsView,
		years: YearsView,
		time: TimeView
	}

	render() {
		let view = this.props.view
		let element =
			view == 'time' ?
				React.createElement('div', { key: 'dt', className: 'timepicker' },
					React.createElement(this.viewComponents[this.props.view], this.props.viewProps))
				:
				React.createElement('div', { key: 'dt', className: 'datepicker' },
					React.createElement(this.viewComponents[this.props.view], this.props.viewProps))

		return element
	}

}