import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TimeEntry } from 'src/app/Models/time-entry';
import { DataService } from 'src/app/Services/data.service';
import { DetailsService } from 'src/app/Services/details.service';
import { PlayerControlService } from 'src/app/Services/player-control.service';
import { SettingsService } from 'src/app/Services/settings.service';

@Component({
  selector: 'app-data-canvas',
  templateUrl: './data-canvas.component.html',
  styleUrls: ['./data-canvas.component.css'],
})
export class DataCanvasComponent implements OnInit {
  @Input('max-framerate') maxFramerate: number = 30;
  @Input('magnification') magnification: number = 1;

  private ctx?: CanvasRenderingContext2D;
  private timeCtx?: CanvasRenderingContext2D;
  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeCanvas', { static: true })
  timeCanvas?: ElementRef<HTMLCanvasElement>;
  laneHeight = 25;
  labelWidth = 100;
  groupLabelWidth = 50;
  @Input('current-time') currentTime: number = 0;
  @Input('duration') duration: number = 0;
  readerEndpoint: number = 0;
  offset: number = 0;


  constructor(
    public details: DetailsService,
    public playerControls: PlayerControlService,
    public data: DataService,
    public settings: SettingsService
  ) { }

  ngOnInit(): void {
    this.ctx = this.canvas?.nativeElement.getContext('2d') ?? undefined;
    this.timeCtx = this.timeCanvas?.nativeElement.getContext('2d') ?? undefined;
    this.animate();
  }
  @Output() animate(): void {
    const i = setInterval(() => {
      if (!this.ctx) return;
      const canvas = this.ctx.canvas;
      this.readerEndpoint = canvas.width / 2;
      this.offset =
        this.currentTime * this.playerControls.timelineZoom + this.labelWidth;
      if (this.offset > this.readerEndpoint) {
        this.offset = this.readerEndpoint;
      }

      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.timeCtx?.clearRect(
        0,
        0,
        this.timeCtx.canvas.width,
        this.timeCtx.canvas.height
      );

      this.drawData();

      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(this.offset, 0, 1, canvas.height);

      this.drawLabels();
      this.drawTimes();
      this.drawLaneLines();
    }, this.playerControls.timelineFramerate);
  }
  drawLaneLines() {
    const canvas = this.ctx.canvas;
    this.ctx.fillStyle = 'black';
    let laneCount = this.details.ObservationTypes.length * this.details.Groups.length;
    for (let index = 0; index < laneCount; index++) {
      this.ctx.fillRect(this.labelWidth, ((index + 1) * this.laneHeight) - 1, canvas.width - this.labelWidth, (index + 1) % this.details.ObservationTypes.length == 0 ? 2 : 1);
    }

  }
  drawLabels() {
    if (!this.ctx) return;
    const canvas = this.ctx.canvas;
    this.ctx.fillStyle = 'black';
    this.details.Groups.forEach((group, index) => {
      if (!this.ctx) return;
      let groupStart =
        index * this.laneHeight * this.details.ObservationTypes.length;
      let groupHeight = this.laneHeight * this.details.ObservationTypes.length;
      this.ctx?.fillRect(0, groupStart, this.labelWidth, groupHeight);
      if (index == this.details.ActiveGroup && this.ctx != undefined) {
        this.ctx.fillStyle = 'lavender';
        this.ctx.fillRect(
          1,
          groupStart + 1,
          this.labelWidth - 2,
          groupHeight - 2
        );
      } else {
        this.ctx?.clearRect(
          1,
          groupStart + 1,
          this.labelWidth - 2,
          groupHeight - 2
        );
      }
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(group.Name, 5, index * groupHeight + groupHeight / 2);

      this.details.ObservationTypes.forEach((obs, obsIndex) => {
        let obsStart = groupStart + obsIndex * this.laneHeight;
        this.ctx?.fillRect(
          this.groupLabelWidth,
          obsStart,
          this.labelWidth - this.groupLabelWidth,
          this.laneHeight
        );
        this.ctx?.clearRect(
          this.groupLabelWidth + 1,
          obsStart + 1,
          this.labelWidth - this.groupLabelWidth - 2,
          this.laneHeight - 2
        );
        this.ctx?.fillText(
          obs.Name,
          this.groupLabelWidth + 5,
          groupStart + obsIndex * this.laneHeight + this.laneHeight / 2
        );
      });
    });
  }

  drawData() {
    if (!this.ctx) {
      return;
    }
    var timeOffSet =
      this.readerEndpoint < this.currentTime
        ? this.currentTime * this.magnification
        : this.readerEndpoint * this.magnification;

    this.data.timeEntries.forEach((datum, index) => {
      if (!this.ctx) {
        return;
      }
      var x =
        this.offset +
        (datum.start - this.currentTime) * this.playerControls.timelineZoom;
      var y = this.laneHeight * this.details.GetLane(datum);
      var w = (datum.end - datum.start) * this.playerControls.timelineZoom;
      var h = this.laneHeight;
      this.ctx.fillStyle = 'rgb(200,200,200)';
      this.ctx.fillRect(x, y, w, h);
      this.ctx.clearRect(x + 1, y + 1, w - 2, h - 2);
      if (index == this.data.activeDataIndex) {
        this.ctx.fillStyle = this.settings.settings.selectedEntryColor;
      } else {
        this.ctx.fillStyle =
          this.details.ObservationTypes[datum.type]?.color ?? 'red';
      }
      this.ctx.fillRect(x, y + 1, w, h - 2);
    });
  }

  drawTimes() {
    if (!this.timeCtx) {
      return;
    }
    let canvasWidth = this.timeCanvas.nativeElement.width - this.labelWidth;
    let magnification = this.playerControls.timelineZoom;
    let secondsShown = canvasWidth / magnification;
    let majorTicks = 5;
    let majorInterval = Math.floor(secondsShown / majorTicks)
    majorInterval = Math.round(majorInterval / 5) * 5;
    majorInterval = majorInterval < 1 ? 1 : majorInterval;

    this.timeCtx.fillStyle = 'black';

    for (let index = 0; index < this.duration; index++) {

      if (index % (majorInterval / 5) == 0) {
        var x =
          this.offset +
          (index - this.currentTime) * this.playerControls.timelineZoom;

        this.timeCtx.fillRect(x, 0, 1, this.timeCtx.canvas.height/2);
      }
      let readableIndex = this.secondsToTime(index);
      if (index % majorInterval == 0) {
        var x =
          this.offset +
          (index - this.currentTime) * this.playerControls.timelineZoom;

        this.timeCtx.fillRect(x, 0, 1, this.timeCtx.canvas.height);
        this.timeCtx.fillText(
          readableIndex,
          x + 5,
          this.timeCtx.canvas.height
        );
      }
    }
  }

  canvasClick(event: Event) {
    let x = (<MouseEvent>event).offsetX;
    let y = (<MouseEvent>event).offsetY;
    if (x < this.labelWidth) {
      this.labelClick(x, y);
    } else {
      this.dataClick(x, y);
    }
  }

  labelClick(x: number, y: number) {
    let groupIndex = Math.floor(
      y / (this.laneHeight * this.details.ObservationTypes.length)
    );
    this.details.ActiveGroup = groupIndex;
    if (x > this.groupLabelWidth) {
      let obsIndex = Math.floor(
        (y - (y % this.laneHeight)) / this.laneHeight -
        groupIndex * this.details.ObservationTypes.length
      );
      let obsType = this.details.ObservationTypes[obsIndex];
      this.details.triggerObservation(obsType, this.currentTime);
    }
  }

  dataClick(x: number, y: number) {

    this.data.DeactivateAll();
    let time =
      (x - this.offset) / this.playerControls.timelineZoom + this.currentTime;
    let lane = Math.floor(y / this.laneHeight);
    let group = Math.floor(lane / this.details.ObservationTypes.length);
    let groupStartLane = group * this.details.ObservationTypes.length;
    let type = lane - groupStartLane;

    this.data.activeDataIndex = this.data.timeEntries.findIndex(
      (x) =>
        x.group == group && x.type == type && x.start <= time && x.end >= time
    );

    this.playerControls.timeChangedEvent.emit(this.data.timeEntries[this.data.activeDataIndex].start);
  }

  @Output() Deactivate() {
    this.data.activeDataIndex = -1;
  }

  secondsToTime(time: number) {
    let minuteCount = Math.floor(time / 60);
    let hours = Math.floor(minuteCount / 60);
    let seconds = time % 60;
    let minutes = minuteCount % 60;
    let hourString = hours == 0 ? "" : `${this.padZeros(hours, 2)}:`;
    let minuteString = `${this.padZeros(minutes, 2)}:`;
    let secondString = `${this.padZeros(seconds, 2)}`;
    return hourString + minuteString + secondString;
  }

  padZeros(num: number, count: number) {
    let stringNum = num.toString();
    while (stringNum.length < count) {
      stringNum = "0" + stringNum;
    }
    return stringNum;
  }
}
