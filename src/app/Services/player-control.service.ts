import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerControlService {
  private _videoMagnification: number = 1;
  get videoMagnification(){
    return this._videoMagnification
  }
  set videoMagnification(value){
    this.magnifiedWidth = this.originalVideoWidth * value;
    this._videoMagnification = value;
  }
  timelineZoom: number = 1;
  timelineFramerate = 10;
  videoSpeed: number = 1;
  private originalVideoWidth: number = 0;
  videoDuration = 0;

  timeChangedEvent = new EventEmitter<number>()

  constructor() { }

  magnifiedWidth = 0;

  setOriginalVideoWidth(width: number){
    this.originalVideoWidth = width;
    this.magnifiedWidth = width * this._videoMagnification;
  }


}
