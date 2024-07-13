import { EventEmitter, Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { PlayerControlService } from './player-control.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: SettingsModel = new SettingsModel();
  private key: string = "settings";

  bigStepForwardEvent = new EventEmitter();
  smallStepForwardEvent = new EventEmitter();
  bigStepBackwardEvent = new EventEmitter();
  smallStepBackwardEvent = new EventEmitter();

  constructor(private storage: StorageMap, public playerControls: PlayerControlService) {
    this.retrieveStoredSettings();
  }

  resetSettings() {
    this.settings = new SettingsModel();
    this.storage.set(this.key, this.settings).subscribe(() => {
      this.retrieveStoredSettings();
    });
  }

  storeSettings() {
    this.storage.set(this.key, this.settings).subscribe(() => { });
  }

  retrieveStoredSettings() {
    this.storage.get(this.key).subscribe((data) => {
      if (data == undefined) {
        this.settings = new SettingsModel();
        return;
      }
      this.settings = <SettingsModel>data;
      this.playerControls.videoMagnification = this.settings.defaultMagnification;
      this.playerControls.timelineZoom = this.settings.defaultTimelineZoom;
      this.playerControls.videoSpeed = this.settings.defaultSpeed;
    });
  }

  checkHotkeys(key: string): boolean {
    if (key == this.settings.bigForwardHotkey) {
      this.bigStepForwardEvent.emit();
    }

    if (key == this.settings.smallForwardHotkey) {
      this.smallStepForwardEvent.emit();
    }

    if (key == this.settings.bigBackHotkey) {
      this.bigStepBackwardEvent.emit();
    }

    if (key == this.settings.smallBackHotkey) {
      this.smallStepBackwardEvent.emit();
    }

    return false;
  }
}

class SettingsModel {
  defaultMagnification: number = 1;
  defaultTimelineZoom: number = 1;
  defaultSpeed: number = 1;
  bigBackHotkey: string = "ArrowDown";
  smallBackHotkey: string = "ArrowLeft";
  bigForwardHotkey: string = "ArrowUp";
  smallForwardHotkey: string = "ArrowRight";
  selectedEntryColor: string = "green";
}
