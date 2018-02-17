import React from 'react';
import DaysView from './DaysView'
import MonthsView from './MonthsView'
import YearsView from './YearsView'
import TimeView from './TimeView'

const viewComponents = {
	days: DaysView,
	months: MonthsView,
	years: YearsView,
	time: TimeView
}

let CalendarContainer = ({ view = 'days', viewProps = {} }) => {
	let View = viewComponents[view]
	return <View {...viewProps} />
}

export default CalendarContainer;

// var React = require('react'),
// 	createClass = require('create-react-class'),
// 	DaysView = require('./DaysView'),
// 	MonthsView = require('./MonthsView'),
// 	YearsView = require('./YearsView'),
// 	TimeView = require('./TimeView')
// 	;

// var CalendarContainer = createClass({
// 	viewComponents: {
// 		days: DaysView,
// 		months: MonthsView,
// 		years: YearsView,
// 		time: TimeView
// 	},

// 	render: function() {
// 		return React.createElement( this.viewComponents[ this.props.view ], this.props.viewProps );
// 	}
// });

// module.exports = CalendarContainer;
