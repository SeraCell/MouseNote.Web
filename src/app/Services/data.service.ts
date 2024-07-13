import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DataCanvasComponent } from '../Components/data-canvas/data-canvas.component';
import { TimeEntry } from '../Models/time-entry';
import { DetailsService, ObservationType, TestGroup } from './details.service';
import { FileSaverService } from './file-saver.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  activeDataIndex: number = -1;
  timeEntries: TimeEntry[] = [];
  dataCanvas?: DataCanvasComponent;

  constructor(private storage: StorageMap, private fileSaverProvider: FileSaverService, ) {
  }

  SetDataCanvas(canvas?: DataCanvasComponent) {
    this.dataCanvas = canvas;
  }


  ClearData() {
    this.timeEntries = [];
    this.storage.set('data', []).subscribe(() => {
      this.RetrieveStoredData();
    });
  }

  StoreData() {
    this.storage.set('data', this.timeEntries).subscribe(() => { });
  }

  RetrieveStoredData() {
    this.storage.get('data').subscribe((data) => {
      if (data == undefined) {
        this.timeEntries = [];
        return;
      }
      (<TimeEntry[]>data).forEach(d => this.timeEntries.push(new TimeEntry(d)));
    });
  }

  deleteEntry(index: number) {
    this.timeEntries.splice(index, 1);
    this.StoreData();
  }

  deleteActiveEntry() {
    this.deleteEntry(this.activeDataIndex);
    this.activeDataIndex = -1
  }

  UpdateData(group: number, type: number, time: number, singlePoint: boolean) {
    this.dataCanvas?.Deactivate();
    let activeIndex = this.timeEntries.findIndex(x => x.group == group && x.type == type && x.active)
    if (activeIndex != -1) {
      if (time < this.timeEntries[activeIndex].start) {
        let buffer = this.timeEntries[activeIndex].start;
        this.timeEntries[activeIndex].start = time;
        time = buffer;
      }
      this.timeEntries[activeIndex].active = false;
      this.timeEntries[activeIndex].end = time;

    }
    else {
      let newEntry = new TimeEntry();
      if (singlePoint) {
        newEntry.setValues(time, time + .2, group, type)
      }
      else {
        newEntry.setValues(time, time, group, type)
        newEntry.active = true;
      }
      this.timeEntries.push(newEntry);
    }
    this.MergeEntries();

    this.StoreData();
  }

  UpdateActiveTimes(time: number) {
    this.timeEntries.forEach((item, index) => {
      if (item.active) {
        item.end = time;
      }
    });
  }

  DeactivateAll() {
    this.timeEntries.forEach(item => { item.active = false })
    this.MergeEntries();
  }

  MergeEntries() {
    let MergedEntries: TimeEntry[] = [];
    this.timeEntries.forEach(e => {
      let preceding = MergedEntries.findIndex(x => x.group == e.group && x.type == e.type && x.start < e.start && x.end > e.start);
      if (preceding != -1) {
        e.start = MergedEntries[preceding].start;
        MergedEntries.splice(preceding, 1);
      }
      let trailing = MergedEntries.findIndex(x => x.group == e.group && x.type == e.type && x.start < e.end && x.end > e.end);
      if (trailing != -1) {
        e.end = MergedEntries[trailing].end;
        MergedEntries.splice(trailing, 1);
      }
      MergedEntries.push(e);
    });
    this.timeEntries = MergedEntries;
  }

  download() {
    this.fileSaverProvider.downloadJson(this.timeEntries, `${new Date()}.mndata`);
  }
  upload(file: Event) {
    let f = (<HTMLInputElement>file.target).files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let result = fileReader.result;
      this.timeEntries = <TimeEntry[]>JSON.parse(<string>result);
      this.StoreData();
    }
    fileReader.readAsText(f);
  }

}


