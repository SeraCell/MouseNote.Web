import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeElapsed'
})
export class DurationPipe implements PipeTransform {

  transform(value: number, max = 0): unknown {
    const currentTime = this.FormatTime( Math.floor(value));
    const maxTime = this.FormatTime( Math.floor(max));
    const currentString = `${(maxTime.hours > 0)? (this.padTens(currentTime.hours)) + ":":""}${this.padTens(currentTime.minutes)}:${this.padTens(currentTime.seconds)}`;
    const maxString = `${(maxTime.hours > 0)?(this.padTens(maxTime.hours)) + ":":""}${this.padTens(maxTime.minutes)}:${this.padTens(maxTime.seconds)}`;
    return `${currentString} / ${maxString}`;
  }

  private padTens(num:number):string{
    return `${(num < 10)?"0":""}${num}`
  }

  private FormatTime (totalSeconds:number): Time{
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor(totalSeconds % 3600 / 60);
    var seconds = Math.floor(totalSeconds % 3600 % 60);
    return {hours: hours, minutes: minutes, seconds: seconds}
  }
}

class Time{
  seconds:number = 0;
  minutes: number = 0;
  hours: number = 0;
}
