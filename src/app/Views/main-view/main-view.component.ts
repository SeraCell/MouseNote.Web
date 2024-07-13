import { ElementRef } from "@angular/core";
import { HostListener } from "@angular/core";
import { ViewChild } from "@angular/core";
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { DataCanvasComponent } from "src/app/Components/data-canvas/data-canvas.component";
import { VideoPlayerComponent } from "src/app/Components/video-player/video-player.component";
import { TimeEntry } from "src/app/Models/time-entry";
import { DataService } from "src/app/Services/data.service";
import { DetailsService } from "src/app/Services/details.service";
import { PlayerControlService } from "src/app/Services/player-control.service";
import { PwaServiceService } from "src/app/Services/pwa-service.service";
import { SettingsService } from "src/app/Services/settings.service";
import { ControlsViewComponent } from "../controls-view/controls-view.component";
import { DetailViewComponent } from "../detail-view/detail-view.component";
import { SettingsViewComponent } from "../settings-view/settings-view.component";
import {ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MainViewComponent implements OnInit {

  @ViewChild('canvasdiv', { static: true }) canvasDiv?: ElementRef<HTMLDivElement>;
  @ViewChild('videoPlayer', { static: true }) videoPlayer?: VideoPlayerComponent;
  @ViewChild('dataCanvas', { static: true }) dataCanvas?: DataCanvasComponent;
  dialogOpen: boolean = false;

  videoSource: any;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.onKeyDown(event);
  }

  ngOnInit(): void {
    this.data.RetrieveStoredData();

    let i = setInterval(() => { if (this.videoPlayer) this.data.UpdateActiveTimes(this.videoPlayer.currentTime) }, 10)
    this.data.SetDataCanvas(this.dataCanvas);

  }
  constructor(
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public details: DetailsService,
    public data: DataService,
    public playerControls: PlayerControlService,
    public settingsProvider: SettingsService,
    public pwaProvider: PwaServiceService,
  ) {
  }

  createMockData() {
    this.data.timeEntries = []
    for (let index = 0; index < 1000; index++) {
      const element = 100;
      var st = 1200 * Math.random();
      let entry = new TimeEntry();
      entry.setValues(st, (st + 5 * Math.random()), index % 5, index % 3);
      this.data.timeEntries.push(entry);
    }
    this.data.StoreData();
  }

  openDetailsDialog() {
    this.dialogOpen = true;
    let dialogRef = this.dialog.open(DetailViewComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;
    });
  }

  openControlsDialog() {
    this.dialogOpen = true;
    let dialogRef = this.dialog.open(ControlsViewComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;
    });
  }
  openSettingsDialog() {
    this.dialogOpen = true;
    let dialogRef = this.dialog.open(SettingsViewComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;
    });
  }

  loadVideo(target: any) {
    let files = (<HTMLInputElement>target).files;
    var URL = window.URL || window.webkitURL
    if (files == null) {
      return;
    }
    let file = files[0]
    var fileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    this.videoSource = fileUrl;
  }
  onKeyDown(event: KeyboardEvent) {
    let key = event.key;

    if (key == " ") {
      key = "SPACE";
    }
    if (!this.dialogOpen && this.videoPlayer) {
      //Check hotkeys
      this.settingsProvider.checkHotkeys(key);
      //Mark datapoint
      this.details.registerKeyPress(key, this.videoPlayer.currentTime);
    }
  }
}
