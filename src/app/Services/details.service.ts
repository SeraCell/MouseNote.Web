import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TimeEntry } from '../Models/time-entry';
import { DataService } from './data.service';
import { FileSaverService } from './file-saver.service';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(private storage: StorageMap, private data: DataService, private fileSaverProvider: FileSaverService) {
    this.storage.get('details').subscribe((details) => {
      this.Name = (<StoredDetails>details).Name;
      this.Groups = (<StoredDetails>details).Groups;
      this.ObservationTypes = (<StoredDetails>details).ObservationTypes;
    });
  }
  public Groups: TestGroup[] = [{ ID: -1, Name: '' }];
  public ObservationTypes: ObservationType[] = [new ObservationType()];
  public ActiveGroup: number = 0;
  public Name: string;

  addGroup() {
    this.Groups.push(new TestGroup());
  }
  removeGroup() {
    this.Groups.pop();
  }
  addObservationType() {
    let newObs = new ObservationType();
    newObs.ID = Math.max.apply(Math, this.ObservationTypes.map(function (o) { return o.ID; })) + 1;
    this.ObservationTypes.push(newObs);
  }
  removeObservationType() {
    this.ObservationTypes.pop();
  }

  saveDetails() {
    this.ObservationTypes.forEach(element => {
      if (element.isReferencePoint) {
        element.isSinglePoint = true;
      }
    });
    let details: StoredDetails = {
      Name: this.Name,
      Groups: this.Groups,
      ObservationTypes: this.ObservationTypes,
    };
    this.storage.set('details', details).subscribe(() => { });
  }

  clearDetails() {
    this.storage.delete('details');
  }

  registerKeyPress(key: string, time: number) {
    let types = this.ObservationTypes.filter((x) => x.HotKey == key);
    if (types.length == 0) {
      return;
    }
    let type = types[0];
    this.triggerObservation(type, time);
  }

  triggerObservation(type: ObservationType, time: number) {
    let typeIndex = this.ObservationTypes.indexOf(type);
    if (
      type.isReferencePoint &&
      this.data.timeEntries.findIndex(
        (x) => x.group == this.ActiveGroup && x.type == typeIndex
      ) != -1
    ) {
      return;
    }
    this.data.UpdateData(this.ActiveGroup, typeIndex, time, type.isSinglePoint);
  }

  GetLane(timeEntry: TimeEntry) {
    return timeEntry.group * this.ObservationTypes.length + timeEntry.type;
  }

  exportDataToCsv() {
    let csvLines: string[] = [];
    let referenceTypes = this.ObservationTypes.filter(x => x.isReferencePoint);
    let references = this.data.timeEntries.filter(x => this.ObservationTypes[x.type].isReferencePoint);
    let header = 'Group,Observation,Start,Stop,Duration';
    referenceTypes.forEach(element => {
      header = header + `,FROM_${element.Name}`
    });
    header = header + "\n";
    csvLines.push(header);
    let entries = this.data.timeEntries;
    entries.sort((a, b) => (a.group > b.group) ? 1 : (a.group == b.group) ? ((a.type > b.type) ? 1 : (a.type == b.type) ? ((a.start > b.start) ? 1 : -1) : -1) : -1);
    //Reference comparison will have issues if data was entered before the type was set to reference
    entries.forEach(element => {
      let line = new dataCsvEntry(element, this.Groups, this.ObservationTypes, references)
      let lineString = `${line.group},${line.observation},${line.start},${line.end},${line.duration}`;
      line.fromReferences.forEach(ref => {
        lineString = lineString + `,${ref}`
      });
      lineString = lineString + '\n';
      csvLines.push(lineString);
    });
    var blob = new Blob(csvLines)
    saveAs(blob, `Data Results ${new Date()}.csv`);
  }
}

export class TestGroup {
  public ID = -1;
  public Name = '';
}

export class ObservationType {
  public ID = -1;
  public Name = '';
  public HotKey = '';
  public isReferencePoint = false;
  public isSinglePoint = false;
  public color = '#ff00ff';
}

class StoredDetails {
  public Name: string = '';
  public Groups: TestGroup[] = [];
  public ObservationTypes: ObservationType[] = [];
}

class dataCsvEntry {
  group: string;
  observation: string;
  start: number;
  end: number;
  duration: number;
  fromReferences: number[];

  constructor(entry: TimeEntry, groups: TestGroup[], types: ObservationType[], references: TimeEntry[]) {
    console.log(groups)
    console.log(entry.group)
    console.log(groups[entry.group])
    this.group = groups[entry.group].Name;
    this.observation = types[entry.type].Name;
    this.start = entry.start;
    this.end = types[entry.type].isSinglePoint ? entry.start : entry.end;
    this.duration = this.end - this.start;
    this.fromReferences = [];
    references.forEach(ref => {
      this.fromReferences.push(entry.start - ref.start);
    });
  }
}
