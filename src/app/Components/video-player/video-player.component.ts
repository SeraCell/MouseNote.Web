import { ElementRef, Output, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { PlayerControlService } from 'src/app/Services/player-control.service';
import { SettingsService } from 'src/app/Services/settings.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @Input('video-source') videoSource: string = "";
  @Output('currentTime') currentTime: number = 0;
  duration: number = 0;
  @ViewChild("videoWindow") private videoRef?: ElementRef<HTMLVideoElement>;
  originalWidth:number = 0;



  constructor(public playerControls: PlayerControlService, public settingsProvider: SettingsService) {
    let i = setInterval(()=>this.setCurrentTime(), playerControls.timelineFramerate)
  }

  ngOnInit(): void {
    this.settingsProvider.bigStepForwardEvent.subscribe(()=>{(<HTMLVideoElement>this.videoRef?.nativeElement).currentTime += .1})
    this.settingsProvider.bigStepBackwardEvent.subscribe(()=>{(<HTMLVideoElement>this.videoRef?.nativeElement).currentTime -= .1})
    this.settingsProvider.smallStepForwardEvent.subscribe(()=>{(<HTMLVideoElement>this.videoRef?.nativeElement).currentTime += 0.02})
    this.settingsProvider.smallStepBackwardEvent.subscribe(()=>{(<HTMLVideoElement>this.videoRef?.nativeElement).currentTime -= 0.02})
    this.playerControls.timeChangedEvent.subscribe((time)=>{(<HTMLVideoElement>this.videoRef?.nativeElement).currentTime = time});
  }


  setCurrentTime() {
    this.currentTime = this.videoRef?.nativeElement.currentTime ?? 0;
    this.duration = this.videoRef?.nativeElement.duration ?? 0;
  }
  sliderMoved() {
    if (this.videoRef)
      this.videoRef.nativeElement.currentTime = this.currentTime;
  }
  togglePlay() {
    if (this.videoRef && this.videoRef.nativeElement.duration) {
      this.videoRef.nativeElement.currentTime
      if (this.videoRef.nativeElement.paused) {
        this.videoRef.nativeElement.play();
      }
      else {
        this.videoRef.nativeElement.pause();
      }
    }
  }
  videoLoaded(event:Event){
    var video = (<HTMLVideoElement>event.target);
    this.playerControls.videoDuration = video.duration;
    this.playerControls.setOriginalVideoWidth(video.videoWidth);
    video.playbackRate = this.playerControls.videoSpeed;
  }
}
