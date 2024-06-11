import React, { Component } from 'react'

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default class MonthsView extends React.Component {
	render() {
		return React.createElement('div', { className: 'months' }, [
			React.createElement('table', { key: 'a' }, React.createElement('thead', {}, React.createElement('tr', {}, [
				React.createElement('th', { key: 'prev', className: 'prev', onClick: this.props.subtractTime(1, 'years') }, React.createElement('span', { className: 'glyphicon glyphicon-chevron-left', title: 'Previous Month' }, '')),
				React.createElement('th', { key: 'year', className: 'picker-switch', onClick: this.props.showView('years'), colSpan: 2, 'data-value': this.props.viewDate.year() }, this.props.viewDate.year()),
				React.createElement('th', { key: 'next', className: 'next', onClick: this.props.addTime(1, 'years') }, React.createElement('span', { className: 'glyphicon glyphicon-chevron-right', title: 'Next Month' }, ''))
			]))),
			React.createElement('table', { key: 'months' }, React.createElement('tbody', { key: 'b' }, this.renderMonths()))
		]);
	}

	renderMonths = () => {
		var date = this.props.selectedDate,
			month = this.props.viewDate.month(),
			year = this.props.viewDate.year(),
			rows = [],
			i = 0,
			months = [],
			renderer = this.props.renderMonth || this.renderMonth,
			isValid = this.props.isValidDate || this.alwaysValidDate,
			classes, props, currentMonth, isDisabled, noOfDaysInMonth, daysInMonth, validDay,
			// Date is irrelevant because we're only interested in month
			irrelevantDate = 1
			;

		while (i < 12) {
			classes = 'month';
			currentMonth =
				this.props.viewDate.clone().set({ year: year, month: i, date: irrelevantDate });

			noOfDaysInMonth = currentMonth.endOf('month').format('D');
			daysInMonth = Array.from({ length: noOfDaysInMonth }, function (e, i) {
				return i + 1;
			});

			validDay = daysInMonth.find(function (d) {
				var day = currentMonth.clone().set('date', d);
				return isValid(day, date);
			});

			isDisabled = (validDay === undefined);

			if (isDisabled)
				classes += ' disabled';

			if (date && i === date.month() && year === date.year())
				classes += ' active';

			props = {
				key: i,
				'data-value': i,
				className: classes
			};

			if (!isDisabled)
				props.onClick = (this.props.updateOn === 'months' ?
					this.updateSelectedMonth : this.props.setDate('month'));

			months.push(renderer(props, i, year, date && date.clone()));

			if (months.length === 4) {
				rows.push(React.createElement('tr', { key: month + '_' + rows.length }, months));
				months = [];
			}

			i++;
		}

		return rows;
	}

	updateSelectedMonth = (event) => {
		this.props.updateSelectedDate(event);
	}

	renderMonth = (props, month) => {
		var localMoment = this.props.viewDate;
		var monthStr = localMoment.localeData().monthsShort(localMoment.month(month));
		var strLength = 3;
		// Because some months are up to 5 characters long, we want to
		// use a fixed string length for consistency
		var monthStrFixedLength = monthStr.substring(0, strLength);
		return React.createElement('td', props, capitalize(monthStrFixedLength));
	}

	alwaysValidDate = () => {
		return 1;
	}

	handleClickOutside = () => {
		this.props.handleClickOutside();
	}
}

