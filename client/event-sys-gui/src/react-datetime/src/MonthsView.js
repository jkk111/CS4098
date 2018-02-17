import React from 'react';
import onClickOutside from 'react-onclickoutside'



let capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

class DateTimePickerMonths extends React.Component {
	constructor(props) {
		super(props);

		this.renderMonths = this.renderMonths.bind(this);
		this.updateSelectedMonth = this.updateSelectedMonth.bind(this);
		this.renderMonth = this.renderMonth.bind(this);
		this.alwaysValidDate = this.alwaysValidDate.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	renderMonths() {
		let date = this.props.selectedDate;
		let month = this.props.viewDate.month();
		let year = this.props.viewDate.year();
		let rows = [];

		let i = 0;
		let months = [];
		let renderer = this.props.renderMonth || this.renderMonth
		let isValid = this.props.isValidDate || this.alwaysValidDate

		let irrelevantDate = 1;

		while(i < 12) {
			let classes = 'react-date-time-month'
			let currentMonth = this.props.viewDate.clone().set({ year, month: i, date: irrelevantDate })
			let noOfDaysInMonth = currentMonth.endOf('month').format('D')
			let daysInMonth = Array.from({ length: noOfDaysInMonth }, (e, i) => {
				return i + 1;
			})

			let validDay = daysInMonth.find((d) => {
				let day = currentMonth.clone().set('date', d);
				return isValid(day);
			})

			let isDisabled = validDay === undefined;

			if(isDisabled) {
				classes += ' react-date-time-disabled'
			}

			if(date && i === date.month() && year === date.year()) {
				classes += 'react-date-time-active'
			}

			let props = {
				key: i,
				'data-value': i,
				className: classes
			};

			if (!isDisabled) {
				if(this.props.updateOn === 'months') {
					props.onClick = this.updateSelectedMonth
				} else {
					props.onClick = this.props.setDate('month')
				}
			}

			months.push(renderer(props, i, year, date && date.clone()));

			if (months.length === 4) {
				rows.push(React.createElement('tr', { key: month + '_' + rows.length }, months));
				months = [];
			}

			i++;
		}
		return rows;
	}

	updateSelectedMonth(e) {
		this.props.updateSelectedDate(e);
	}

	renderMonth(props, month) {
		var localMoment = this.props.viewDate;
		var monthStr = localMoment.localeData().monthsShort(localMoment.month(month));
		var strLength = 3;
		// Because some months are up to 5 characters long, we want to
		// use a fixed string length for consistency
		var monthStrFixedLength = monthStr.substring(0, strLength);
		return <td {...props}>{capitalize(monthStrFixedLength)}</td>
	}

	alwaysValidDate() {
		return 1;
	}

	handleClickOutside() {
		this.props.handleClickOutside();
	}

	render() {
		return <div className='react-date-time-months'>
			<table>
				<thead>
					<tr>
						<th className='react-date-time-prev' onClick={this.props.subtractTime(1, 'years')}>
							<span>‹</span>
						</th>
						<th className='react-date-time-switch' onClick={this.props.showView('years')} colSpan={2} data-value={this.props.viewDate.year()}>
							{this.props.viewDate.year()}
						</th>
						<th className='react-date-time-next' onClick={this.props.addTime(1, 'years')} >
							<span>›</span>
						</th>
					</tr>
				</thead>
			</table>
			<table>
				<tbody>
					{this.renderMonths()}
				</tbody>
			</table>
			{/*React.createElement('table', { key: 'months' }, React.createElement('tbody', { key: 'b' }, this.renderMonths()))*/}
		</div>
	}
}

export default onClickOutside(DateTimePickerMonths)
