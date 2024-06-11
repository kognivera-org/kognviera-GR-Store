import React, { Component } from 'react'
import moment from 'moment'

export default class DaysView extends React.Component {

	render() {
		var footer = this.renderFooter(),
			date = this.props.viewDate,
			locale = date.localeData(),
			tableChildren
			;

		tableChildren = [
			React.createElement('thead', { key: 'th' }, [
				React.createElement('tr', { key: 'h' }, [
					React.createElement('th', { key: 'p', className: 'prev', onClick: this.props.subtractTime(1, 'months') }, React.createElement('span', { className: 'glyphicon glyphicon-chevron-left', title: 'Next Day' }, '')),
					React.createElement('th', { key: 's', className: 'picker-switch', onClick: this.props.showView('months'), colSpan: 5, 'data-value': this.props.viewDate.month() }, locale.months(date) + ' ' + date.year()),
					React.createElement('th', { key: 'n', className: 'next', onClick: this.props.addTime(1, 'months') }, React.createElement('span', { className: 'glyphicon glyphicon-chevron-right', title: 'Next Day' }, ''))
				]),
				React.createElement('tr', { key: 'd' }, this.getDaysOfWeek(locale).map(function (day, index) { return React.createElement('th', { key: day + index, className: 'dow' }, day); }))
			]),
			React.createElement('tbody', { key: 'tb' }, this.renderDays())
		];

		if (footer)
			tableChildren.push(footer);

		return React.createElement('div', { className: 'datepicker-days' },
			React.createElement('table', { className: 'table-condensed' }, tableChildren)
		);
	}

	/**
	 * Get a list of the days of the week
	 * depending on the current locale
	 * @return {array} A list with the shortname of the days
	 */
	getDaysOfWeek = (locale) => {
		var days = locale._weekdaysMin,
			first = locale.firstDayOfWeek(),
			dow = [],
			i = 0
			;

		days.forEach(function (day) {
			dow[(7 + (i++) - first) % 7] = day;
		});

		return dow;
	}

	renderDays = () => {
		var date = this.props.viewDate,
			dafaultViewDate = this.props.dafaultViewDate,
			selected = this.props.selectedDate && this.props.selectedDate.clone(),
			selectedEnd = this.props.selectedEndDate && this.props.selectedEndDate.clone(),
			prevMonth = date.clone().subtract(1, 'months'),
			currentYear = date.year(),
			currentMonth = date.month(),
			weeks = [],
			days = [],
			renderer = this.props.renderDay || this.renderDay,
			isValid = this.props.isValidDate || this.alwaysValidDate,
			classes, isDisabled, dayProps, currentDate,
			range = this.props.range
			;

		// Go to the last week of the previous month
		prevMonth.date(prevMonth.daysInMonth()).startOf('week');
		var lastDay = prevMonth.clone().add(42, 'd');

		while (prevMonth.isBefore(lastDay)) {
			classes = 'day';
			currentDate = prevMonth.clone();

			if ((prevMonth.year() === currentYear && prevMonth.month() < currentMonth) || (prevMonth.year() < currentYear))
				classes += ' old';
			else if ((prevMonth.year() === currentYear && prevMonth.month() > currentMonth) || (prevMonth.year() > currentYear))
				classes += ' new';

			if (selected && prevMonth.isSame(selected, 'day')) {
				classes += ' active';
			} else if (!selected && dafaultViewDate && prevMonth.isSame(dafaultViewDate, 'day')) {
				classes += ' active';
			}

			if (selectedEnd && prevMonth.isSame(selectedEnd, 'day'))
				classes += ' active';

			if (range) {
				if (currentDate.isAfter(selected) && currentDate.isBefore(selectedEnd))
					classes += ' activeRange';

				if (selected && !selectedEnd && currentDate.isBefore(selected))
					classes += ' disabled';
			}

			if (prevMonth.isSame(moment(), 'day'))
				classes += ' today';

			isDisabled = !isValid(currentDate, selected, selectedEnd);
			if (isDisabled)
				classes += ' disabled';

			dayProps = {
				key: prevMonth.format('M_D'),
				'data-value': prevMonth.date(),
				className: classes
			};

			if (!isDisabled)
				dayProps.onClick = this.updateSelectedDate;

			days.push(renderer(dayProps, currentDate, selected));

			if (days.length === 7) {
				weeks.push(React.createElement('tr', { key: prevMonth.format('M_D') }, days));
				days = [];
			}

			prevMonth.add(1, 'd');
		}

		return weeks;
	}

	updateSelectedDate = (event) => {
		this.props.updateSelectedDate(event, true);
	}

	renderDay = (props, currentDate) => {

		return React.createElement('td', props, currentDate.date());
	}

	renderFooter = () => {
		if (!this.props.timeFormat)
			return '';

		var date = this.props.selectedDate || this.props.viewDate;

		return React.createElement('tfoot', { key: 'tf' },
			React.createElement('tr', {},
				//React.createElement('td', { onClick: this.props.showView('time'), colSpan: 7, className: 'timeToggle' }, date.format(this.props.timeFormat))
				React.createElement('td', { onClick: this.props.showView('time'), colSpan: 7, className: 'timeToggle' },
					React.createElement('a', { title: 'Select Time' },
						React.createElement('span', { className: 'glyphicon glyphicon-time' }, ''))
				)
			)
		);
	}

	alwaysValidDate = () => {
		return 1;
	}

	handleClickOutside = () => {
		this.props.handleClickOutside();
	}
}