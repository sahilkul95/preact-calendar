import { Component } from 'preact';
import Calendar from "preact-calendar";

export default class MyClass extends Component {

  getSelectedDate(date) {
    console.log('You clicked: ', date);
  }

  render({}) {
    return (
      <div>
        <Calendar minDate={new Date('2019-01-01')} disablePast={true} onSelect={this.getSelectedDate.bind(this)} highlightSecondFourthSatdays={true}
          highlightSundays={true} highlightToday={true}/>
      </div>
    );
  }
}
