# preact-calendar
## Installation

```shell
npm install preact-calendar -S
```

### This is how it looks
![Screenshot](/assets/my-cal-v1.png)

## Usage

Code Example:
```jsx
import Calendar from "preact-calendar";

function onDateSelect(date) {
  console.log("You clicked: ", date);
}

render(
  <Calendar minDate={new Date('2019-01-01')} disablePast={true} onSelect={this.getSelectedDate()} highlightSecondFourthSatdays={true}
    highlightSundays={true} highlightToday={true}/>,
  document.body
);
```

### Options

Properties used to customise the rendering:

| Name | Type | Description |
|:---- | ---- | ------ |
| minDate | Date | The date from which to start the Calendar |
| disablePast | Boolean | When true, disables the selection of dates before Today |
| onSelect | function | Callback function, called on selecting a date
| highlightSundays | Boolean | When true, highlights all Sundays with red color *(__defaults:__ `false`)*
| highlightToday | Boolean | When true, today's date is highlighted by default *(__defaults:__ `false`)*
| highlightSecondFourthSatdays | Boolean | When true, highlights second & fourth Saturday in each month *(__defaults:__ `false`)*
