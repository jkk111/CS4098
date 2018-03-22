import React from 'react';
import onClickOutside from 'react-onclickoutside'

class DateTimePickerYears extends React.Component {
	constructor(props) {
		super(props);

		this.renderYears = this.renderYears.bind(this)
		this.updateSelectedYear = this.updateSelectedYear.bind(this);
		this.renderYear = this.renderYear.bind(this);
		this.alwaysValidDate = this.alwaysValidDate.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	renderYears(year) {
		let years = [];
		let i = -1;
		let rows = [];

		let	renderer = this.props.renderYear || this.renderYear
		let selectedDate = this.props.selectedDate
		let isValid = this.props.isValidDate || this.alwaysValidDate;
		let irrelevantMonth = 0;
		let irrelevantDate = 1;

		year--;
		while (i < 11) {
			let classes = 'react-date-time-year';
			let currentYear = this.props.viewDate.clone().set({
				year: year,
				month: irrelevantMonth,
				date: irrelevantDate
			});


			let noOfDaysInYear = currentYear.endOf('year').format('DDD');
			let daysInYear = Array.from({ length: noOfDaysInYear }, (e, i) => {
				return i + 1;
			});

			let validDay = daysInYear.find(function( d ) {
				var day = currentYear.clone().dayOfYear( d );
				return isValid( day );
			});

			let isDisabled = validDay === undefined;

			if(isDisabled) {
				classes += ' rdtDisabled';
			}

			if(selectedDate && selectedDate.year() === year) {
				classes += ' rdtActive';
			}

			let props = {
				key: year,
				'data-value': year,
				className: classes
			};

			if(!isDisabled) {
				if(this.props.updateOn === 'years') {
					props.onClick = this.updateSelectedYear();
				} else {
					props.onClick = this.props.setDate('year');
				}
			}

			years.push(renderer(props, year, selectedDate && selectedDate.clone()));

			if(years.length === 4) {
				rows.push(<tr key={i}>{years}</tr>);
				years = [];
			}

			year++;
			i++;
		}

		console.log(years)
		return rows;
	}

	updateSelectedYear(e) {
		this.props.updateSelectedDate(e);
	}

	renderYear(props = {}, year) {
		return <td {...props}>{year}</td>
	}

	alwaysValidDate() {
		return 1;
	}


	handleClickOutside() {
		this.props.handleClickOutside();
	}

	render() {
		let year = parseInt(this.props.viewDate.year() / 10, 10) * 10;
		return <div className='react-date-time-years'>
			<table>
				<thead>
					<tr>
						<th className='react-date-time-prev' onClick={this.props.subtractTime(10, 'years')}>
							<span>‹</span>
						</th>
						<th className='react-date-time-switch' onClick={this.props.showView('years')} colSpan={2}>
							<span>{year + '-' + ( year + 9 )}</span>
						</th>
						<th className='react-date-time-prev' onClick={this.props.addTime(10, 'years')}>
							<span>›</span>
						</th>
					</tr>
				</thead>
			</table>
			<table>
				<tbody>
					{this.renderYears(year)}
				</tbody>
			</table>
		</div>
	}
}

export default onClickOutside(DateTimePickerYears)
