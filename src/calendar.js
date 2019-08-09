import { Component, createElement } from 'preact';
import './calendar.css';

export default class Calendar extends Component {
  constructor() {
    super();
    this.displayName = 'Calendar';

    this.calc = this.calc.bind(this);
    this.getPrev = this.getPrev.bind(this);
    this.getNext = this.getNext.bind(this);
    this.selectDate = this.selectDate.bind(this);
  }
  calc(year, month) {
    if (this.state.selectedElement) {
      if (this.state.selectedMonth !== month || this.state.selectedYear !== year) {
        this.state.selectedElement.classList.remove('r-selected');
      } else {
        this.state.selectedElement.classList.add('r-selected');
      }
    }
    return {
      firstOfMonth: new Date(year, month, 1),
      daysInMonth: new Date(year, month + 1, 0).getDate()
    };
  }
  componentWillMount() {
    let date = new Date();
    this.state = {
      year: date.getFullYear(),
      month: date.getMonth(),
      selectedYear: date.getFullYear(),
      selectedMonth: date.getMonth(),
      selectedDate: date.getDate(),
      selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      startDay: 1,
      weekNumbers: false,
      minDate: this.props.minDate ? this.props.minDate : null,
      disablePast: this.props.disablePast ? this.props.disablePast : false,
      highlightSecondFourthSatdays: this.props.highlightSecondFourthSatdays ? this.props.highlightSecondFourthSatdays : false,
      highlightSundays: this.props.highlightSundays ? this.props.highlightSundays : false,
      highlightToday: this.props.highlightToday ? this.props.highlightToday : false,
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      firstOfMonth: null,
      daysInMonth: null
    };
    this.setState(this.calc(this.state.year, this.state.month));
  }

  componentDidMount() {
    this.props.onSelect(this.state.selectedDt);
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (this.props.onSelect && prevState.selectedDt !== this.state.selectedDt) {
      this.props.onSelect(prevState.selectedDt);
    }
  }
  getPrev() {
    let state = {};
    if (this.state.month > 0) {
      state.month = this.state.month - 1;
      state.year = this.state.year;
    } else {
      state.month = 11;
      state.year = this.state.year - 1;
    }
    Object.assign(state, this.calc(state.year, state.month));
    this.setState(state);
  }
  getNext() {
    let state = {};
    if (this.state.month < 11) {
      state.month = this.state.month + 1;
      state.year = this.state.year;
    } else {
      state.month = 0;
      state.year = this.state.year + 1;
    }
    Object.assign(state, this.calc(state.year, state.month));
    this.setState(state);
  }
  selectDate(year, month, date, element) {
    if (this.state.selectedElement) {
      this.state.selectedElement.classList.remove('r-selected');
    }
    if (!element.target.classList.contains('r-today')) {
      element.target.classList.add('r-selected');
    }
    this.setState({
      selectedYear: year,
      selectedMonth: month,
      selectedDate: date,
      selectedDt: new Date(year, month, date),
      selectedElement: element.target
    });
  }
  render() {
    return createElement(
      'div',
      { className: 'r-calendar' },
      createElement(
        'div',
        { className: 'r-inner' },
        createElement(Header, { monthNames: this.state.monthNamesFull, month: this.state.month, year: this.state.year, onPrev: this.getPrev, onNext: this.getNext }),
        createElement(WeekDays, { dayNames: this.state.dayNames, startDay: this.state.startDay, weekNumbers: this.state.weekNumbers }),
        createElement(MonthDates, { month: this.state.month, year: this.state.year, daysInMonth: this.state.daysInMonth, firstOfMonth: this.state.firstOfMonth,
          highlightSecondFourthSatdays: this.state.highlightSecondFourthSatdays, highlightSundays: this.state.highlightSundays, startDay: this.state.startDay,
          onSelect: this.selectDate, weekNumbers: this.state.weekNumbers, disablePast: this.state.disablePast, minDate: this.state.minDate,
          highlightToday: this.state.highlightToday })
      )
    );
  }
}

class Header extends Component{
  constructor() {
    super();
    this.displayName = 'Header';
  }
  render() {
    return createElement(
      'div',
      { className: 'r-row r-head' },
      createElement('div', { className: 'r-cell r-prev', onClick: this.props.onPrev.bind(this), role: 'button', tabIndex: '0' }),
      createElement(
        'div',
        { className: 'r-cell r-title' },
        this.props.monthNames[this.props.month],
        ' ',
        this.props.year
      ),
      createElement('div', { className: 'r-cell r-next', onClick: this.props.onNext.bind(this), role: 'button', tabIndex: '0' })
    );
  }
}

class WeekDays extends Component {
  constructor() {
    super();
    this.displayName = 'WeekDays';
  }

  render() {
    let that = this,
      haystack = Array.apply(null, { length: 7 }).map(Number.call, Number);
    return createElement(
      'div',
      { className: 'r-row r-weekdays' },
      (() => {
        if (that.props.weekNumbers) {
          return createElement(
            'div',
            { className: 'r-cell r-weeknum' },
            'wn'
          );
        }
      })(),
      haystack.map((item, i) => {
        return createElement(
          'div',
          { className: 'r-cell' },
          that.props.dayNames[(that.props.startDay + i) % 7]
        );
      })
    );
  }
}

class MonthDates extends Component {
  constructor() {
    super();
    this.displayName = 'MonthDates';
    this.state = {
      // statics: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate(),
      today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      // today: new Date('2019-08-10')
      // }
    };
  }
  render() {
    let haystack,
      day,
      d,
      current,
      // onClick,
      isDate,
      className,
      weekStack = Array.apply(null, { length: 7 }).map(Number.call, Number),
      that = this,
      startDay = this.props.firstOfMonth.getUTCDay(),
      first = this.props.firstOfMonth.getDay(),
      janOne = new Date(that.props.year, 0, 1),
      rows = 5,
      isHighlightSatdays = this.props.highlightSecondFourthSatdays,
      isHighlightSundays = this.props.highlightSundays,
      isHighlightToday = this.props.highlightToday;
    if (startDay === 5 && this.props.daysInMonth === 31 || startDay === 6 && this.props.daysInMonth > 29) {
      rows = 6;
    }
    let satArray = [];
    switch (startDay) {
      case 0:
        satArray = [13, 27];
        break;
      case 1:
        satArray = [12, 26];
        break;
      case 2:
        satArray = [11, 25];
        break;
      case 3:
        satArray = [10, 24];
        break;
      case 4:
        satArray = [9, 23];
        break;
      case 5:
        satArray = [8, 22];
        break;
      case 6:
        satArray = [14, 28];
        break;

      default:
        break;
    }
    className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
    haystack = Array.apply(null, { length: rows }).map(Number.call, Number);
    day = this.props.startDay + 1 - first;
    while (day > 1) {
      day -= 7;
    }
    day -= 1;
    return createElement(
      'div',
      { className },
      haystack.map((item, i) => {
        d = day + i * 7;
        return createElement(
          'div',
          { className: 'r-row' },
          (() => {
            if (that.props.weekNumbers) {
              let wn = Math.ceil(((new Date(that.props.year, that.props.month, d) - janOne) / 86400000 + janOne.getDay() + 1) / 7);
              return createElement(
                'div',
                { className: 'r-cell r-weeknum' },
                wn
              );
            }
          })(),
          weekStack.map((item) => {
            d += 1;
            isDate = d > 0 && d <= that.props.daysInMonth;
            if (isDate) {
              current = new Date(that.props.year, that.props.month, d);
              let className = 'r-cell r-date';
              if (isHighlightToday && (current.setUTCHours(0,0,0,0) === that.state.today.setUTCHours(0,0,0,0))) className += ' r-today';
              if (that.props.disablePast && current.setUTCHours(0,0,0,0) < that.state.today.setUTCHours(0,0,0,0)) {
                className += ' r-past';
              } else if (that.props.minDate !== null && current < that.props.minDate) {
                className += ' r-past';
              }
              if (isHighlightSatdays && satArray.includes(d)) className += ' r-sunday';  //this is Saturday
              if (isHighlightSundays && item === 6) className += ' r-sunday';  //this is Sunday
              if (/r-past/.test(className)) {
                return createElement(
                  'div',
                  { className, role: 'button', tabIndex: '0' },
                  d
                );
              }

              return createElement(
                'div',
                { className, role: 'button', tabIndex: '0', onClick: that.props.onSelect.bind(that, that.props.year, that.props.month, d) },
                d
              );
            }
            return createElement('div', { className: 'r-cell' });
          })
        );
      })
    );
  }
}
