import React from 'react'
import assign from 'object-assign'
import moment from 'moment'
import CalendarContainer from './src/CalendarContainer'
import PropTypes from 'prop-types'
import FloatText from '../FloatText'

const viewModes = Object.freeze({
	YEARS: 'years',
	MONTHS: 'months',
	DAYS: 'days',
	TIME: 'time',
});

class DateTime extends React.Component {
	constructor(props) {
		super(props)
		let state = this.getStateFromProps(props);

		if (state.open === undefined) {
			state.open = !props.input;
		}

		if(props.dateFormat) {
			state.currentView = props.viewMode || state.updateOn || viewModes.DAYS
		} else {
			state = viewModes.TIME
		}

		this.state = state;

		this.updateSelectedDate = this.updateSelectedDate.bind(this);
		this.localMoment = this.localMoment.bind(this);
		this.openCalendar = this.openCalendar.bind(this);
		this.closeCalendar = this.closeCalendar.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.addTime = this.addTime.bind(this);
		this.subtractTime = this.subtractTime.bind(this);
		this.updateTime = this.updateTime.bind(this);
		this.setTime = this.setTime.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onInputKey = this.onInputKey.bind(this);
		this.showView = this.showView.bind(this);
		this.setDate = this.setDate.bind(this);
		this.getUpdateOn = this.getUpdateOn.bind(this);
		this.parseDate = this.parseDate.bind(this);
		this.getFormats = this.getFormats.bind(this);
		this.getStateFromProps = this.getStateFromProps.bind(this);
		this.getComponentProps = this.getComponentProps.bind(this);
	}

	updateSelectedDate(e, close) {
		let target = e.target
		let	modifier = 0
		let	viewDate = this.state.viewDate
		let	currentDate = this.state.selectedDate || viewDate
		let date = null;

		if(target.className.indexOf('react-date-time-day') !== -1) {
			if(target.className.indexOf('react-date-time-new') !== -1) {
				modifier = 1;
			} else if(target.className.indexOf('react-date-time-old') !== -1) {
				modifier = -1;
			}

			date = viewDate.clone().month(viewDate.month() + modifier)
														 .date(parseInt(target.getAttribute('data-value'), 10))
		} else if(target.className.indexOf('react-date-time-month') !== -1) {
			date = viewDate.clone().month(parseInt(target.getAttribute('data-value'), 10))
														 .date(currentDate.date())
		} else if(target.className.indexOf('react-date-time-year') !== -1) {
			date = viewDate.clone().month(currentDate.month())
														 .date(currentDate.date())
														 .year(parseInt(target.getAttribute('data-value'), 10));
		}

		date.hours(currentDate.hours())
				.minutes(currentDate.minutes())
				.seconds(currentDate.seconds())
				.milliseconds(currentDate.milliseconds())

		if(!this.props.value) {
			let open = !(this.props.closeOnSelect && close);
			if(!open) {
				this.props.onBlur(date)
			}
			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('month'),
				inputValue: date.format(this.state.inputFormat),
				open
			})
		} else {
			if(this.props.closeOnSelect && close) {
				this.closeCalendar()
			}
		}

		this.props.onChange(date);
	}

	localMoment(date, format, props) {
		props = props || this.props;
		var momentFn = props.utc ? moment.utc : moment;
		var m = momentFn(date, format, props.strictParsing);
		if (props.locale) {
			m.locale(props.locale);
		}
		return m;
	}

	get componentProps() {
		return {
			fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
			fromState: ['viewDate', 'selectedDate', 'updateOn'],
			fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
		}
	}

	openCalendar(e) {
		if (!this.state.open) {
			this.setState({ open: true }, () => {
				console.log(this.state, this.props.onFocus)
				this.props.onFocus(e);
			});
		}
	}

	closeCalendar() {
		this.setState({ open: false }, () => {
			this.props.onBlur(this.state.selectedDate || this.state.inputValue);
		});
	}

	handleClickOutside() {
		if (this.props.input && this.state.open && !this.props.open && !this.props.disableOnClickOutside) {
			this.setState({ open: false }, () => {
				this.props.onBlur(this.state.selectedDate || this.state.inputValue);
			});
		}
	}

	addTime(amount, type, toSelected) {
		return this.updateTime( 'add', amount, type, toSelected );
	}

	subtractTime(amount, type, toSelected) {
		return this.updateTime( 'subtract', amount, type, toSelected );
	}

	updateTime(op, amount, type, toSelected) {
		return () => {
			let update = {}
			let date = toSelected ? 'selectedDate' : 'viewDate'
			update[date] = this.state[date].clone()[op](amount, type);
			this.setState(update)
		}
	}

	get allowedSetTime() {
		return ['hours', 'minutes', 'seconds', 'milliseconds']
	}

	setTime(type, value) {
		let index = this.allowedSetTime.indexOf( type ) + 1;
		let state = this.state;
		let date = (state.selectedDate || state.viewDate).clone()

		date[type](value);
		for (; index < this.allowedSetTime.length; index++) {
			let nextType = this.allowedSetTime[index];
			date[nextType](date[nextType]());
		}

		if(!this.props.value) {
			this.setState({
				selectedDate: date,
				inputValue: date.format(state.inputFormat)
			});
		}
		this.props.onChange(date);
	}

	onInputChange(e) {
		let value = e.target === null ? e : e.target.value
		let localMoment = this.localMoment(value, this.state.inputFormat)
		let update = { inputValue: value }

		if(localMoment.isValid() && !this.props.value) {
			update.selectedDate = localMoment;
			update.viewDate = localMoment.clone().startOf('month');
		} else {
			update.selectedDate = null;
		}

		return this.setState(update, () => {
			return this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue)
		})
	}

	onInputKey(e) {
		if(e.which === 9 && this.props.closeOnTab) {
			this.closeCalendar()
		}
	}

	showView(view) {
		return () => {
			if(this.state.currentView != view) {
				this.props.onViewModeChange(view)
			}

			this.setState({ currentView: view })
		}
	}

	setDate(type) {
		let nextViews = {
			month: viewModes.DAYS,
			year: viewModes.MONTHS
		}

		return (e) => {
			this.setState({
				viewDate: this.state.viewDate.clone()[type](parseInt(e.target.getAttribute('data-value'), 10)).startOf(type),
				currentView: nextViews[type]
			})

			this.props.onViewModeChange(nextViews[type])
		}
	}

	componentWillReceiveProps(nextProps) {
		let formats = this.getFormats(nextProps);
		let updatedState = {};

		let diff_value = nextProps.value !== this.props.value;
		let diff_datetime = formats.datetime !== this.getFormats(this.props).datetime

		if(diff_value || diff_datetime) {
			updatedState = this.getStateFromProps(nextProps);
		}

		if(updatedState.open === undefined) {
			if(typeof nextProps.open !== 'undefined' ) {
				updatedState.open = nextProps.open;
			} else if(this.props.closeOnSelect && this.state.currentView !== viewModes.TIME) {
				updatedState.open = false;
			} else {
				updatedState.open = this.state.open;
			}
		}

		if(nextProps.viewMode !== this.props.viewMode) {
			updatedState.currentView = nextProps.viewMode;
		}

		if(nextProps.locale !== this.props.locale) {
			if(this.state.viewDate) {
				let updatedViewDate = this.state.viewDate.clone().locale( nextProps.locale );
				updatedState.viewDate = updatedViewDate;
			}
			if(this.state.selectedDate) {
				let updatedSelectedDate = this.state.selectedDate.clone().locale( nextProps.locale );
				updatedState.selectedDate = updatedSelectedDate;
				updatedState.inputValue = updatedSelectedDate.format( formats.datetime );
			}
		}

		if(nextProps.utc !== this.props.utc ) {
			if(nextProps.utc) {
				if(this.state.viewDate)
					updatedState.viewDate = this.state.viewDate.clone().utc();
				if(this.state.selectedDate) {
					updatedState.selectedDate = this.state.selectedDate.clone().utc();
					updatedState.inputValue = updatedState.selectedDate.format( formats.datetime );
				}
			} else {
				if(this.state.viewDate)
					updatedState.viewDate = this.state.viewDate.clone().local();
				if(this.state.selectedDate) {
					updatedState.selectedDate = this.state.selectedDate.clone().local();
					updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
				}
			}
		}

		if(nextProps.viewDate !== this.props.viewDate) {
			updatedState.viewDate = moment(nextProps.viewDate);
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

	getUpdateOn(formats) {
		if (formats.date.match(/[lLD]/)) {
			return viewModes.DAYS;
		} else if (formats.date.indexOf('M') !== -1) {
			return viewModes.MONTHS;
		} else if (formats.date.indexOf('Y') !== -1) {
			return viewModes.YEARS;
		}

		return viewModes.DAYS;
	}

	parseDate(date, formats) {
		let parsedDate;

		if(date && typeof date === 'string') {
			parsedDate = this.localMoment(date, formats.datetime);
		}	else if(date) {
			parsedDate = this.localMoment(date);
		}

		if(parsedDate && !parsedDate.isValid()) {
			parsedDate = null;
		}

		return parsedDate;
	}

	getFormats(props) {
		let formats = {
			date: props.dateFormat || '',
			time: props.timeFormat || ''
		}

		let locale = this.localMoment(props.date, null, props).localeData()

		if(formats.date === true) {
			formats.date = locale.longDateFormat('L');
		} else if(this.getUpdateOn(formats) !== viewModes.DAYS) {
			formats.time = '';
		}

		if(formats.time === true) {
			formats.time = locale.longDateFormat('LT');
		}

		if(formats.date && formats.time) {
			formats.datetime = `${formats.date} ${formats.time}`
		} else {
			formats.DateTime = formats.date || formats.time
		}

		return formats;
	}

	getStateFromProps(props) {
		let formats = this.getFormats(props)
		let date = props.value || props.defaultValue;
		let selectedDate = this.parseDate(date, formats);
		let inputValue = null;

		let viewDate = this.parseDate(props.viewDate, formats);

		if(selectedDate) {
			viewDate = selectedDate.clone().startOf('month')
		} else if(viewDate) {
			viewDate = viewDate.clone().startOf('month')
		} else {
			viewDate = this.localMoment().startOf('month')
		}

		let updateOn = this.getUpdateOn(formats);

		if(selectedDate) {
			inputValue = selectedDate.format(formats.datetime);
		} else if(date.isValid && !date.isValid()) {
			inputValue = ''
		} else {
			inputValue = date || ''
		}

		return {
			updateOn: updateOn,
			inputFormat: formats.datetime,
			viewDate: viewDate,
			selectedDate: selectedDate,
			inputValue: inputValue,
			open: props.open
		};
	}

	getComponentProps() {
		let formats = this.getFormats(this.props)
		let props = {dateFormat: formats.date, timeFormat: formats.time}

		this.componentProps.fromProps.forEach((name) => {
			props[name] = this.props[name];
		})

		this.componentProps.fromState.forEach((name) => {
			props[name] = this.state[name];
		})

		this.componentProps.fromThis.forEach((name) => {
			props[name] = this[name];
		})

		return props;
	}

	render() {
		let className = 'react-date-time';
		if(this.props.className) {
			let append = this.props.className;
			if(Array.isArray(append)) {
				append = append.join(' ')
			}
			className += ` ${append}`;
		}

		let input = null;

		if(this.props.input) {
			let finalInputProps = assign({
				type: 'text',
				onClick: this.openCalendar,
				onFocus: this.openCalendar,
				onChange: this.onInputChange,
				onKeyDown: this.onInputKey,
				value: this.state.inputValue,
				name: this.props.name
			}, this.props.inputProps)

			if(this.props.renderInput) {
				input = <div>
					{this.props.renderInput(finalInputProps, this.openCalendar, this.closeCalendar)}
				</div>
			} else {
				console.log(finalInputProps)
				input = <FloatText label={this.props.label} inputProps={finalInputProps} />
			}
		} else {
			className += ' react-date-time-static'
		}

		if(this.state.open) {
			className += ' react-date-time-open'
		}

		return <div className={className}>
			{input}
			<div className='react-date-time-picker'>
				<CalendarContainer view={this.state.currentView} viewProps={this.getComponentProps()} onClickOutside={this.handleClickOutside} />
			</div>
		</div>
	}
}

let TYPES = PropTypes
DateTime.propTypes = {
	// value: TYPES.object | TYPES.string,
	// defaultValue: TYPES.object | TYPES.string,
	// viewDate: TYPES.object | TYPES.string,
	onFocus: TYPES.func,
	onBlur: TYPES.func,
	onChange: TYPES.func,
	onViewModeChange: TYPES.func,
	locale: TYPES.string,
	utc: TYPES.bool,
	input: TYPES.bool,
	// dateFormat: TYPES.string | TYPES.bool,
	// timeFormat: TYPES.string | TYPES.bool,
	inputProps: TYPES.object,
	timeConstraints: TYPES.object,
	viewMode: TYPES.oneOf([viewModes.YEARS, viewModes.MONTHS, viewModes.DAYS, viewModes.TIME]),
	isValidDate: TYPES.func,
	open: TYPES.bool,
	strictParsing: TYPES.bool,
	closeOnSelect: TYPES.bool,
	closeOnTab: TYPES.bool
}

DateTime.defaultProps = {
	className: '',
	defaultValue: '',
	inputProps: {},
	input: true,
	onFocus: function() {},
	onBlur: function() {},
	onChange: function() {},
	onViewModeChange: function() {},
	timeFormat: true,
	timeConstraints: {},
	dateFormat: true,
	strictParsing: true,
	closeOnSelect: false,
	closeOnTab: true,
	utc: false
};

// Make moment accessible through the Datetime class
DateTime.moment = moment;

export default DateTime
