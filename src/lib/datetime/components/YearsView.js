import React, { Component } from 'react'

export default class YearsView extends React.Component {
	render() {
		var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

		return React.createElement('div', { className: 'years' }, [
			React.createElement('table', { key: 'a' }, React.createElement('thead', {}, React.createElement('tr', {}, [
				React.createElement('th', { key: 'prev', className: 'prev', onClick: this.props.subtractTime(10, 'years') }, React.createElement('span', { className: 'glyphicon glyphicon-chevron-left', title: 'Previous Year' }, '')),
				React.createElement('th', { key: 'year', className: 'picker-switch', onClick: this.props.showView('years'), colSpan: 2 }, year + '-' + (year + 9)),
				React.createElement('th', { key: 'next', className: 'next', onClick: this.props.addTime(10, 'years') }, React.createElement('span', { className: 'glyphicon glyphicon-chevron-right', title: 'Next Year' }, ''))
			]))),
			React.createElement('table', { key: 'years' }, React.createElement('tbody', {}, this.renderYears(year)))
		]);
	}

	renderYears = (year) => {
		var years = [],
			i = -1,
			rows = [],
			renderer = this.props.renderYear || this.renderYear,
			selectedDate = this.props.selectedDate,
			isValid = this.props.isValidDate || this.alwaysValidDate,
			classes, props, currentYear, isDisabled, noOfDaysInYear, daysInYear, validDay,
			// Month and date are irrelevant here because
			// we're only interested in the year
			irrelevantMonth = 0,
			irrelevantDate = 1
			;

		year--;
		while (i < 11) {
			classes = 'year';
			currentYear = this.props.viewDate.clone().set(
				{ year: year, month: irrelevantMonth, date: irrelevantDate });

			// Not sure what 'rdtOld' is for, commenting out for now as it's not working properly
			// if ( i === -1 | i === 10 )
			// classes += ' rdtOld';

			noOfDaysInYear = currentYear.endOf('year').format('DDD');
			daysInYear = Array.from({ length: noOfDaysInYear }, function (e, i) {
				return i + 1;
			});

			validDay = daysInYear.find(function (d) {
				var day = currentYear.clone().dayOfYear(d);
				return isValid(day, selectedDate);
			});

			isDisabled = (validDay === undefined);

			if (isDisabled)
				classes += ' disabled';

			if (selectedDate && selectedDate.year() === year)
				classes += ' active';

			props = {
				key: year,
				'data-value': year,
				className: classes
			};

			if (!isDisabled)
				props.onClick = (this.props.updateOn === 'years' ?
					this.updateSelectedYear : this.props.setDate('year'));

			years.push(renderer(props, year, selectedDate && selectedDate.clone()));

			if (years.length === 4) {
				rows.push(React.createElement('tr', { key: i }, years));
				years = [];
			}

			year++;
			i++;
		}

		return rows;
	}

	updateSelectedYear = (event) => {
		this.props.updateSelectedDate(event);
	}

	renderYear = (props, year) => {
		return React.createElement('td', props, year);
	}

	alwaysValidDate = () => {
		return 1;
	}

	handleClickOutside = () => {
		this.props.handleClickOutside();
	}
}
