import React from 'react';
import moment from 'moment'
import onClickOutside from 'react-onclickoutside'


class DateTimePickerDays extends React.Component {
  renderFooter() {
    if(!this.props.timeFormat) {
      return null;
    } else {
      let date = this.props.selectedDate || this.props.viewDate;
      return <tfoot>
        <tr>
          <td onClick={this.props.showView('time')} colSpan={7} className='react-date-time-toggle'>
            {date.format(this.props.timeFormat)};
          </td>
        </tr>
      </tfoot>
    }
  }

  getDaysOfWeek(locale) {
    let days = locale._weekdaysMin;
    let first = locale.firstDayOfWeek()
    let i = 0;
    let dow = [];
    days.forEach( function( day ) {
      dow[ (7 + ( i++ ) - first) % 7 ] = day;
    });
    return dow;
  }

  renderDays() {
    let date = this.props.viewDate;
    let selected = this.props.selectedDate && this.props.selectedDate.clone();
    let prev_month = date.clone().subtract(1, 'months');
    let currentYear = date.year();
    let currentMonth = date.month();
    let weeks = [];
    let days = [];
    let renderer = this.props.renderDay || this.renderDay;
    let isValidDate = this.props.isValidDate || this.alwaysValidDate;

    prevMonth.date(prevMonth.daysInMonth()).startOf('week');
    let lastDay = prevMonth.clone().add(42, 'd');

    while(prevMonth.isBefore(lastDay)) {
      let classes = [ 'react-date-time-day' ];
      let currentDate = prevMonth.clone();

      let sameYearPrevMonth = prevMonth.year() === currentYear && prevMonth.month() < currentMonth;
      let sameYearNextMonth = prevMonth.year() === currentYear && prevMonth.month() > currentMonth;
      let lastYear = prevMonth.year() < currentYear;
      let nextYear = prevMonth.year() > currentYear;

      if(sameYearPrevMonth || lastYear) {
        classes.push('react-date-time-old');
      } else if(sameYearNextMonth || nextYear) {
        classes.push('react-date-time-new')
      }

      if(selected && prevMonth.isSame(selected, 'day')) {
        classes.push('react-date-time-active');
      }

      if(prevMonth.isSame(moment(), 'day')) {
        classes.push('react-date-time-today')
      }

      let isDisabled = !isValid(currentDate, selected);
      if(isDisabled) {
        classes.push('react-date-time-disabled');
      }

      let dayProps = {
        key: prevMonth.format('M_D'),
        'data-value': prevMonth.date(),
        className: classes.join(' ')
      }

      if(!isDisabled) {
        dayProps.onClick = this.updateSelectedDate;
      }

      days.push(renderer(dayProps, currentDate, selected));

      if(days.length === 7) {
        weeks.push(<tr key={prevMonth.format('M_D')}>
          {days}
        </tr>);
        days = [];
      }

      prevMonth.add(1, 'd')
    }
    return weeks;
  }

  updateSelectedDate(e) {
    this.props.updateSelectedDate(e, true );
  }

  renderDay(props, currentDate) {
    return <td {...props}>
      {currentDate.date()}
    </td>
  }

  alwaysValidDate() {
    return 1;
  }

  handleClickOutside() {
    this.props.handleClickOutside()
  }

  render() {
    let footer = this.renderFooter();
    let date = this.props.viewDate;
    let locale = date.localeData();

    let daysOfWeek = this.getDaysOfWeek(locale)
    daysOfWeek = daysOfWeek.map((day, i) => {
      return <th key={i} className='dow'>
        {day}
      </th>
    })

    return <div className='react-date-time-days'>
      <table>
        <thead>
          <tr>
            <th className='react-date-time-prev' onClick={this.props.subtractTime(1, 'months')}>
              <span>‹</span>
            </th>
            <th className='react-date-time-switch' onClick={this.props.showView('months')} colSpan={5} data-value={this.props.viewDate.month()}>
              {locale.months( date ) + ' ' + date.year()}
            </th>
            <th className='react-date-time-next' onClick={this.props.addTime(1, 'months')}>
              <span>›</span>
            </th>
          </tr>
          <tr>
            {daysOfWeek}
          </tr>
        </thead>
        <tbody>
          {this.renderDays()}
        </tbody>
      </table>
    </div>
  }
}

export default DateTimePickerDays;
