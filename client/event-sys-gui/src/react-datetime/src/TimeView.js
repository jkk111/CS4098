import React from 'react';
import assign from 'object-assign'
import onClickOutside from 'react-onclickoutside'

class DateTimePickerTime extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.calculateState(props);

		this.toggleDayPart = this.toggleDayPart.bind(this);
		this.increase = this.increase.bind(this);
		this.decrease = this.decrease.bind(this);
		this.pad = this.pad.bind(this)
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.calculateState = this.calculateState.bind(this);
		this.renderCounter = this.renderCounter.bind(this);
		this.renderDayPart = this.renderDayPart.bind(this);
		this.updateMilli = this.updateMilli.bind(this)
		this.renderHeader = this.renderHeader.bind(this);
		this.onStartClicking = this.onStartClicking.bind(this);

	}

	get padValues() {
		return {
			hours: 1,
			minutes: 2,
			seconds: 2,
			milliseconds: 3
		}
	}

	toggleDayPart(type) { // type is always 'hours'
		let value = parseInt(this.state[type], 10) + 12;
		if(value > this.timeConstraints[ type ].max) {
			value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
		}
		return this.pad(type, value);
	}

	increase(type) {
		let value = parseInt(this.state[type], 10) + this.timeConstraints[type].step;
		if(value > this.timeConstraints[type].max) {
			value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
		}
		return this.pad(type, value);
	}

	decrease(type) {
		let value = parseInt(this.state[type], 10) - this.timeConstraints[type].step;
		if (value < this.timeConstraints[type].min) {
			value = this.timeConstraints[type].max + 1 - (this.timeConstraints[ type ].min - value);
		}
		return this.pad(type, value);
	}

	pad(type, value) {
		let str = value + '';
		while(str.length < this.padValues[type]) {
			str = '0' + str;
		}
		return str;
	}

	handleClickOutside() {
		this.props.handleClickOutside();
	}

	calculateState(props) {
		let date = props.selectedDate || props.viewDate;
		let format = props.timeFormat;
		let counters = [];

		if(format.toLowerCase().indexOf('h') !== -1) {
			counters.push('hours')
			if(format.indexOf('m') !== -1) {
				counters.push('minutes')
				if(format.indexOf('s') !== -1) {
					counters.push('seconds')
				}
			}
		}

		let hours = date.format('H');
		let daypart = false;
		if(this.state !== null && this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
			if(this.props.timeFormat.indexOf(' A') !== -1) {
				daypart = hours >= 12 ? 'PM' : 'AM'
			} else {
				daypart = hours >= 12 ? 'pm' : 'am'
			}
		}

		return {
			hours: hours,
			minutes: date.format( 'mm' ),
			seconds: date.format( 'ss' ),
			milliseconds: date.format( 'SSS' ),
			daypart: daypart,
			counters: counters
		};
	}

	renderCounter(type, key) {
		if(type !== 'daypart') {
			let value = this.state[type];
			if (type === 'hours' && this.props.timeFormat.toLowerCase().indexOf( ' a' ) !== -1) {
				value = (value - 1) % 12 + 1;

				if (value === 0) {
					value = 12;
				}
			}
			return <div className='react-date-time-counter' key={key}>
				<span className='reate-date-time-button' onMouseDown={this.onStartClicking('increase', type)} onContextMenu={this.disableContextMenu}>
					▲
				</span>
				<div className='react-date-time-count'>
					{value}
				</div>
				<span className='reate-date-time-button' onMouseDown={this.onStartClicking('decrease', type)} onContextMenu={this.disableContextMenu}>
					▼
				</span>
			</div>
		}
		return null;
	}


	renderDayPart() {
		return <div className='react-date-time-counter'>
			<span className='reate-date-time-button' onMouseDown={this.onStartClicking('toggleDayPart', 'hours')} onContextMenu={this.disableContextMenu}>
				▲
			</span>
			<div className='react-date-time-count'>
				{this.state.daypart}
			</div>
			<span className='reate-date-time-button' onMouseDown={this.onStartClicking('toggleDayPart', 'hours')} onContextMenu={this.disableContextMenu}>
				▼
			</span>
		</div>
	}

	componentWillMount() {
		this.timeConstraints = {
			hours: {
				min: 0,
				max: 23,
				step: 1
			},
			minutes: {
				min: 0,
				max: 59,
				step: 1
			},
			seconds: {
				min: 0,
				max: 59,
				step: 1
			},
			milliseconds: {
				min: 0,
				max: 999,
				step: 1
			}
		};

		['hours', 'minutes', 'seconds', 'milliseconds'].forEach((type) => {
			assign(this.timeConstraints[type], this.props.timeConstraints[type]);
		});
		this.setState(this.calculateState(this.props));
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.calculateState(nextProps));
	}

	updateMilli(e) {
		let milli = parseInt(e.target.value, 10);
		if(milli === e.target.value && milli >= 0 && milli < 1000) {
			this.props.setTime('milliseconds', milli);
			this.setState({ milliseconds: milli });
		}
	}

	renderHeader() {
		if (!this.props.dateFormat) {
			return null;
		}

		var date = this.props.selectedDate || this.props.viewDate;
		return <thead>
			<tr>
				<th className='react-date-time-switch' colSpan={4} onClick={this.props.showView('days')}>
					{date.format(this.props.dateFormat)}
				</th>
			</tr>
		</thead>
	}


	disableContextMenu(e) {
		e.preventDefault();
		return false;
	}

	onStartClicking(action, type) {
		let func = () => {
			var update = {};
			update[type] = this[action](type);
			this.setState(update);

			this.timer = setTimeout(() => {
				this.increaseTimer = setInterval(() => {
					console.log(this, action, this[action])
					update[type] = this[action](type);
					this.setState(update);
				}, 70);
			}, 500);

			this.mouseUpListener = () => {
				clearTimeout(this.timer);
				clearInterval(this.increaseTimer);
				this.props.setTime(type, this.state[type]);
				document.body.removeEventListener('mouseup', this.mouseUpListener);
			};

			document.body.addEventListener('mouseup', this.mouseUpListener);
		};

		console.log(this);

		return func.bind(this);
	}

	render() {
		let counters = [];
		this.state.counters.forEach((c, i) => {
			if(counters.length) {
				counters.push(<div key={i} className='react-date-time-counter-separator'>
					:
				</div>)
			}
			counters.push(this.renderCounter(c, i+'counter'))
		})

		if(this.state.daypart !== false) {
			counters.push(this.renderDayPart())
		}

		if(this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1) {
			counters.push(<div key={counters.length} className='react-date-time-counter-separator'>
				:
			</div>)
			counters.push(<div key={counters.length} className='react-date-time-milli'>
				<input value={this.state.milliseconds} onChange={this.updateMilli} />
			</div>)
		}

		return <div className='react-date-time-time'>
			<table>
				{this.renderHeader()}
				<tbody>
					<tr>
						<td>
							<div className='react-date-time-counters'>
								{counters}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	}
}

export default onClickOutside(DateTimePickerTime);
