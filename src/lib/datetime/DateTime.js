import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import assign from 'object-assign';
import CalendarContainer from './components/CalendarContainer';
import onClickOutside from 'react-onclickoutside';

class Datetime extends React.Component {

	constructor(props) {
		super(props);

		var state = this.getStateFromProps(this.props);
		state.open === undefined && (state.open = !this.props.input);
		state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';
		this.state = state;
	}

	componentDidMount() {
		this.props.onRef && this.props.onRef(this);
	}

	formatToRegex = {
		'DD/MM/YYYY': /^(?:0?[1-9]?|[12]\d|3[01])$|^((?:0?[1-9]?|[12]\d|3[01])\/(?:0?[1-9]?|1[012])?)$|^((?:0?[1-9]?|[12]\d|3[01])\/(?:0?[1-9]?|1[012])\/(?:\d{0,4}$)?)$/,
		'DD-MM-YYYY': /^(?:0?[1-9]?|[12]\d|3[01])$|^((?:0?[1-9]?|[12]\d|3[01])-(?:0?[1-9]?|1[012])?)$|^((?:0?[1-9]?|[12]\d|3[01])-(?:0?[1-9]?|1[012])-(?:\d{0,4}$)?)$/,
	}

	resetDate = () => {
		var state = this.getStateFromProps(this.props);
		state.open === undefined && (state.open = !this.props.input);
		state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';
		this.setState({
			...state
		})
	}

	getStateFromProps = (props) => {
		var formats = this.getFormats(props),
			date = props.value || props.defaultValue,
			viewDateFromProps = props.viewDate,
			selectedDate, viewDate, updateOn, inputValue, selectedEndDate, range
			;

		if (range) {
			const arr = date.split(' - ');
			if (arr) {
				selectedDate = this.localMoment(arr[0], formats.datetime);
				selectedEndDate = this.localMoment(arr[1], formats.datetime);
			}
		}
		else if (date && typeof date === 'string') {
			selectedDate = this.localMoment(date, formats.datetime);
		} else if (date) {
			selectedDate = this.localMoment(date);
		}

		if (selectedDate && !selectedDate.isValid()) {
			selectedDate = null;
		}
		if (selectedEndDate && !selectedEndDate.isValid()) {
			selectedEndDate = null;
		}

		viewDate = selectedDate ?
			selectedDate.clone().startOf('month') : viewDateFromProps ? viewDateFromProps.clone().startOf('month') :
				this.localMoment().startOf('month')
			;

		updateOn = this.getUpdateOn(formats);
		if (range) {
			inputValue = selectedDate + ' - ' + selectedEndDate;
		}
		else if (selectedDate)
			inputValue = selectedDate.format(formats.datetime);
		else if (date.isValid && !date.isValid())
			inputValue = '';
		else
			inputValue = date || '';

		return {
			updateOn: updateOn,
			inputFormat: formats.datetime,
			viewDate: viewDate,
			dafaultViewDate: viewDateFromProps,
			selectedDate: selectedDate,
			selectedEndDate: selectedEndDate,
			inputValue: inputValue,
			open: props.open
		};
	}

	getUpdateOn = (formats) => {
		if (formats.date.match(/[lLD]/)) {
			return 'days';
		} else if (formats.date.indexOf('M') !== -1) {
			return 'months';
		} else if (formats.date.indexOf('Y') !== -1) {
			return 'years';
		}

		return 'days';
	}

	getFormats = (props) => {
		var formats = {
			date: props.dateFormat || '',
			time: props.timeFormat || ''
		},
			locale = this.localMoment(props.date, null, props).localeData()
			;

		if (formats.date === true) {
			formats.date = locale.longDateFormat('L');
		}
		else if (this.getUpdateOn(formats) !== 'days') {
			formats.time = '';
		}

		if (formats.time === true) {
			formats.time = locale.longDateFormat('LT');
		}

		formats.datetime = formats.date && formats.time ?
			formats.date + ' ' + formats.time :
			formats.date || formats.time
			;

		return formats;
	}

	componentWillReceiveProps = (nextProps) => {
		var formats = this.getFormats(nextProps),
			updatedState = {}
			;

		if (nextProps.value !== this.props.value ||
			formats.datetime !== this.getFormats(this.props).datetime) {
			updatedState = this.getStateFromProps(nextProps);
		}

		if (updatedState.open === undefined) {
			if (typeof nextProps.open !== 'undefined') {
				updatedState.open = nextProps.open;
			} else if (this.props.closeOnSelect && this.state.currentView !== 'time') {
				updatedState.open = false;
			} else {
				updatedState.open = this.state.open;
			}
		}

		if (nextProps.viewMode !== this.props.viewMode) {
			updatedState.currentView = nextProps.viewMode;
		}

		if (nextProps.locale !== this.props.locale) {
			if (this.state.viewDate) {
				var updatedViewDate = this.state.viewDate.clone().locale(nextProps.locale);
				updatedState.viewDate = updatedViewDate;
			}
			if (this.state.selectedDate) {
				var updatedSelectedDate = this.state.selectedDate.clone().locale(nextProps.locale);
				updatedState.selectedDate = updatedSelectedDate;
				updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
			}
		}

		if (nextProps.utc !== this.props.utc) {
			if (nextProps.utc) {
				if (this.state.viewDate)
					updatedState.viewDate = this.state.viewDate.clone().utc();
				if (this.state.selectedDate) {
					updatedState.selectedDate = this.state.selectedDate.clone().utc();
					updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
				}
			} else {
				if (this.state.viewDate)
					updatedState.viewDate = this.state.viewDate.clone().local();
				if (this.state.selectedDate) {
					updatedState.selectedDate = this.state.selectedDate.clone().local();
					updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
				}
			}
		}
		//we should only show a valid date if we are provided a isValidDate function. Removed in 2.10.3
		/*if (this.props.isValidDate) {
			updatedState.viewDate = updatedState.viewDate || this.state.viewDate;
			while (!this.props.isValidDate(updatedState.viewDate)) {
				updatedState.viewDate = updatedState.viewDate.add(1, 'day');
			}
		}*/
		this.setState(updatedState);
	}

	onInputChange = (e) => {
		const dateFormat = this.props.dateFormat;
		const pattern = dateFormat ? this.formatToRegex[dateFormat] : undefined;
		const inputValue = e.target ? e.target.value : '';
		const range = this.props.range;
		const timeFormat = this.props.timeFormat;

		if (inputValue && !range && !timeFormat && pattern) {
			if (!pattern.test(inputValue)) {
				e.preventDefault()
				return;
			}
		}

		if (range) {
			var value = e.target === null ? e : e.target.value,
				localMoment = this.localMoment(value, this.state.inputFormat);

			const valarr = value.split(' - ');

			if (valarr && valarr.length == 2) {
				const localMomentStart = this.localMoment(valarr[0], this.state.inputFormat);
				const localMomentEnd = this.localMoment(valarr[1], this.state.inputFormat);
				update = { inputValue: valarr[0] + ' - ' + valarr[1] };
				update.selectedDate = localMoment;
				update.selectedEndDate = localMomentEnd;
				update.viewDate = localMoment.clone().startOf('month');

			} else {
				update = { inputValue: value };

				if (localMoment.isValid() && !this.props.value) {
					update.selectedDate = localMoment;
					update.selectedEndDate = null;
					update.viewDate = localMoment.clone().startOf('month');
				} else {
					update.selectedDate = null;
					update.selectedEndDate = null;
				}
			}
			return this.setState(update, function () {
				return this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue);
			});

		} else {
			var value = e.target === null ? e : e.target.value,
				localMoment = this.localMoment(value, this.state.inputFormat),
				update = { inputValue: value }
				;

			if (localMoment.isValid() && !this.props.value) {
				update.selectedDate = localMoment;
				update.viewDate = localMoment.clone().startOf('month');
			} else {
				update.selectedDate = null;
			}

			return this.setState(update, function () {
				return this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue);
			});
		}
	}

	onInputKey = (e) => {
		if (e.which === 9 && this.props.closeOnTab) {
			this.closeCalendar();
		}
	}

	showView = (view) => {
		var me = this;
		return function () {
			me.state.currentView !== view && me.props.onViewModeChange(view);
			me.setState({ currentView: view });
		};
	}

	setDate = (type) => {
		var me = this,
			nextViews = {
				month: 'days',
				year: 'months'
			}
			;
		return function (e) {
			me.setState({
				viewDate: me.state.viewDate.clone()[type](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type),
				currentView: nextViews[type]
			});
			me.props.onViewModeChange(nextViews[type]);
		};
	}

	addTime = (amount, type, toSelected) => {
		return this.updateTime('add', amount, type, toSelected);
	}

	subtractTime = (amount, type, toSelected) => {
		return this.updateTime('subtract', amount, type, toSelected);
	}

	updateTime = (op, amount, type, toSelected) => {
		var me = this;

		return function () {
			var update = {},
				date = toSelected ? 'selectedDate' : 'viewDate'
				;

			update[date] = me.state[date].clone()[op](amount, type);

			me.setState(update);
		};
	}

	allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds']

	setTime = (type, value) => {
		var index = this.allowedSetTime.indexOf(type) + 1,
			state = this.state,
			date = (state.selectedDate || state.viewDate).clone(),
			nextType
			;

		// It is needed to set all the time properties
		// to not to reset the time
		date[type](value);
		for (; index < this.allowedSetTime.length; index++) {
			nextType = this.allowedSetTime[index];
			date[nextType](date[nextType]());
		}

		if (!this.props.value) {
			this.setState({
				selectedDate: date,
				inputValue: date.format(state.inputFormat)
			});
		}
		this.props.onChange(date);
	}

	updateSelectedDate = (e, close) => {
		var target = e.target,
			modifier = 0,
			viewDate = this.state.viewDate,
			currentDate = this.state.selectedDate || viewDate,
			date
			;
		var open = true;
		if (e.target && e.target.classList && e.target.classList.contains('disabled')) {
			return false;
		}

		if (target.className.indexOf('day') !== -1) {
			if (target.className.indexOf('new') !== -1)
				modifier = 1;
			else if (target.className.indexOf('old') !== -1)
				modifier = -1;

			date = viewDate.clone()
				.month(viewDate.month() + modifier)
				.date(parseInt(target.getAttribute('data-value'), 10));
		} else if (target.className.indexOf('month') !== -1) {
			date = viewDate.clone()
				.month(parseInt(target.getAttribute('data-value'), 10))
				.date(currentDate.date());
		} else if (target.className.indexOf('year') !== -1) {
			date = viewDate.clone()
				.month(currentDate.month())
				.date(currentDate.date())
				.year(parseInt(target.getAttribute('data-value'), 10));
		}

		date.hours(currentDate.hours())
			.minutes(currentDate.minutes())
			.seconds(currentDate.seconds())
			.milliseconds(currentDate.milliseconds());

		let finalInputValue = this.state.inputValue;

		if (this.props.range) {

			let currentValue = this.state.inputValue;
			const currArr = currentValue && currentValue.split(' - ');
			if (currArr
				&& currArr.length == 2
				&& this.localMoment(currArr[0]).isValid()
				&& this.localMoment(currArr[0]).isValid()) {
				finalInputValue = date.format(this.state.inputFormat);
				this.setState({
					selectedDate: date,
					selectedEndDate: null,
					viewDate: date.clone().startOf('month'),
					inputValue: finalInputValue,
					open: open
				});
			} else if (currentValue && this.localMoment(currentValue, this.state.inputFormat).isValid()) {

				const currentMoment = this.localMoment(currentValue, this.state.inputFormat);
				finalInputValue = currentValue + ' - ' + date.format(this.state.inputFormat);
				this.setState({
					selectedDate: currentMoment,
					selectedEndDate: date,
					viewDate: date.clone().startOf('month'),
					inputValue: finalInputValue,
					open: open
				});
			} else {
				finalInputValue = date.format(this.state.inputFormat);
				this.setState({
					selectedDate: date,
					selectedEndDate: null,
					viewDate: date.clone().startOf('month'),
					inputValue: finalInputValue,
					open: open
				});
			}
		} else if (!this.props.value) {
			var open = !(this.props.closeOnSelect && close);
			if (!open) {
				this.props.onBlur(date);
			}

			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('month'),
				inputValue: date.format(this.state.inputFormat),
				open: open
			});
		} else {
			if (this.props.closeOnSelect && close) {
				this.closeCalendar();
			}
		}

		this.props.onChange(this.props.range ? finalInputValue : date);
	}

	openCalendar = (e) => {
		if (!this.state.open) {
			this.setState({ open: true }, function () {
				this.props.onFocus(e);
			});
		}
	}

	closeCalendar = () => {
		this.setState({ open: false }, function () {
			this.props.onBlur(this.state.selectedDate || this.state.inputValue);
		});
	}

	handleClickOutside = () => {
		if (this.props.input && this.state.open && !this.props.open) {
			if (!this.state.selectedDate && !this.state.inputValue) {
				this.resetDate()
			} else {
				//this.setState({ open: false, currentView: 'days' }, function () {
				this.setState({ open: false, currentView: this.state.currentView || 'days' }, function () {
					this.props.onBlur(this.state.selectedDate || this.state.inputValue);
				});
			}
		}
	}

	localMoment = (date, format, props) => {
		props = props || this.props;
		var momentFn = props.utc ? moment.utc : moment;
		var m = momentFn(date, format, props.strictParsing);
		if (props.locale)
			m.locale(props.locale);
		return m;
	}

	componentProps = {
		fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints', 'range'],
		fromState: ['viewDate', 'selectedDate', 'updateOn', 'selectedEndDate', 'dafaultViewDate'],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
	}

	getComponentProps = () => {
		var me = this,
			formats = this.getFormats(this.props),
			props = { dateFormat: formats.date, timeFormat: formats.time }
			;

		this.componentProps.fromProps.forEach(function (name) {
			props[name] = me.props[name];
		});
		this.componentProps.fromState.forEach(function (name) {
			props[name] = me.state[name];
		});
		this.componentProps.fromThis.forEach(function (name) {
			props[name] = me[name];
		});

		const selectedDate = this.state.selectedDate;
		if (selectedDate) {
			props.selectedDate = selectedDate
		}
		return props;
	}

	render() {
		const { name, formId, errors, required, placeholder, nodropdown } = this.props

		// TODO: Make a function or clean up this code,
		// logic right now is really hard to follow
		var className = 'rdt' + (this.props.className ?
			(Array.isArray(this.props.className) ?
				' ' + this.props.className.join(' ') : ' ' + this.props.className) : ''),
			children = [];
		className = this.props.nodropdown ? 'rdt date' : 'rdt input-group date'
		if (this.props.input) {
			var finalInputProps = assign({
				type: this.props.nodropdown ? 'hidden' : 'text',
				name: this.props.name,
				className: this.props.required ? 'inputMaterial' : 'form-control',
				onClick: this.openCalendar,
				autoComplete: "off",
				onFocus: this.openCalendar,
				onChange: this.onInputChange,
				onKeyDown: this.onInputKey,
				required: 'required',
				value: this.state.inputValue,
				disabled: this.props.disabled,
				placeholder: this.props.required ? '' : this.props.placeholder,
				validators: this.props.validators ? JSON.stringify(this.props.validators) : ''
			}, this.props.inputProps);
			if (this.props.renderInput) {
				children = [React.createElement('div', { key: 'i' }, this.props.renderInput(finalInputProps, this.openCalendar, this.closeCalendar))];
			} else {
				children = [React.createElement('input', assign({ key: 'i' }, finalInputProps))];
			}
		} else {
			className += ' static';
		}
		const formErrors = formId && errors && errors[formId] ? errors[formId] : errors
		const error = formErrors ? formErrors[name] : null
		if (this.state.open)
			className += ' open';
		const starLabel = required ? React.createElement('label', { className: 'placeHolderMaterial', key: '1' },
			React.createElement('span', {}, '*'), ' ' + placeholder) : '';

		const widgetClassName = this.props.nodropdown
			? 'bootstrap-datetimepicker-widget'
			: 'bootstrap-datetimepicker-widget dropdown-menu';

		return React.createElement('div', { className: 'form-group' },
			React.createElement('div', { className: this.props.nodropdown && 'row' },
				React.createElement('div', { className: this.props.nodropdown && 'col-xs-12' },
					React.createElement('div', { className: className, key: '0' },
						children.concat(
							this.state.open &&
							React.createElement('div', { className: widgetClassName, key: '0' },
								React.createElement('ul', { className: 'list-unstyled', key: '0' },
									React.createElement('li', { className: 'collapse in', key: '0' },
										React.createElement(CalendarContainer,
											{
												view: this.state.currentView,
												viewProps: this.getComponentProps(),
												onClickOutside: this.handleClickOutside
											}
										),
									),
								),
							),
							starLabel,
							!this.props.nodropdown &&
							React.createElement('span', { className: 'input-group-addon', key: '2', onClick: this.openCalendar },
								this.props.view == 'time' ?
									React.createElement('span', { className: 'glyphicon glyphicon-time' }) :
									React.createElement('span', { className: 'glyphicon glyphicon-calendar' })
							)
						)
					)
				)
			),
			error && React.createElement('label', { className: 'error', key: '1', htmlFor: name ? name : 'date' }, error)
		);
	}
}
Datetime.propTypes = {
	// value: PropTypes.object | PropTypes.string,
	// defaultValue: PropTypes.object | PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onChange: PropTypes.func,
	onViewModeChange: PropTypes.func,
	locale: PropTypes.string,
	utc: PropTypes.bool,
	input: PropTypes.bool,
	// dateFormat: PropTypes.string | PropTypes.bool,
	// timeFormat: PropTypes.string | PropTypes.bool,
	inputProps: PropTypes.object,
	timeConstraints: PropTypes.object,
	viewMode: PropTypes.oneOf(['years', 'months', 'days', 'time']),
	isValidDate: PropTypes.func,
	open: PropTypes.bool,
	strictParsing: PropTypes.bool,
	closeOnSelect: PropTypes.bool,
	closeOnTab: PropTypes.bool
}

Datetime.defaultProps = {
	className: '',
	defaultValue: '',
	inputProps: {},
	input: true,
	onFocus: function () { },
	onBlur: function () { },
	onChange: function () { },
	onViewModeChange: function () { },
	onNavigateBack: function () { },
	onNavigateForward: function () { },
	timeFormat: true,
	timeConstraints: {},
	dateFormat: true,
	strictParsing: true,
	closeOnSelect: false,
	closeOnTab: true,
	utc: false,
	locale: 'es-mx',
	isValidDate: function (current) {
		return current.isAfter(Datetime.moment().subtract(1, 'day'));
	}
};

// Make moment accessible through the Datetime class
Datetime.moment = moment;

var clickOutsideConfig = {
	handleClickOutside: function (instance) {
		return instance.handleClickOutside;
	}
};

export default onClickOutside(Datetime, clickOutsideConfig);