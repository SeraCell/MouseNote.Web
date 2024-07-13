import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'data-info-bar',
  templateUrl: './data-info-bar.component.html',
  styleUrls: ['./data-info-bar.component.css']
})
export class DataInfoBarComponent implements OnInit {

  @Input() currentTime: number = 0;
  constructor(public data: DataService) { }

  ngOnInit(): void {
  }
  adjustStart(){
    this.data.timeEntries[this.data.activeDataIndex].start = this.currentTime;
    if (this.data.timeEntries[this.data.activeDataIndex].start > this.data.timeEntries[this.data.activeDataIndex].end)
    {
      let start = this.data.timeEntries[this.data.activeDataIndex].start;
      this.data.timeEntries[this.data.activeDataIndex].start = this.data.timeEntries[this.data.activeDataIndex].end;
      this.data.timeEntries[this.data.activeDataIndex].end = start;
    }
    this.data.StoreData();
  }
  adjustEnd(){
    this.data.timeEntries[this.data.activeDataIndex].end = this.currentTime;
    if (this.data.timeEntries[this.data.activeDataIndex].start > this.data.timeEntries[this.data.activeDataIndex].end)
    {
      let start = this.data.timeEntries[this.data.activeDataIndex].start;
      this.data.timeEntries[this.data.activeDataIndex].start = this.data.timeEntries[this.data.activeDataIndex].end;
      this.data.timeEntries[this.data.activeDataIndex].end = start;
    }
    this.data.StoreData();
  }
  delete(){

  }
}
