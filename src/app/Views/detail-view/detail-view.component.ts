import { Component, Inject, Input, OnInit } from '@angular/core';
import { DetailsService, ObservationType, TestGroup } from 'src/app/Services/details.service';
import { FileSaverService } from 'src/app/Services/file-saver.service';



@Component({
  selector: 'detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit {
  constructor(public details: DetailsService, public FileSaverProvider: FileSaverService) { }
  ngOnInit(): void {
  }
  adjustGroups(event: Event) {
    let val = (<HTMLInputElement>event.target).valueAsNumber;
    if (val > this.details.Groups.length) {
      this.details.addGroup();
    }
    else if (val < this.details.Groups.length) {
      this.details.removeGroup();
    }
    this.details.saveDetails();
  }
  adjustObservationTypes(event: Event) {
    console.log(this.details.ObservationTypes);
    let val = (<HTMLInputElement>event.target).valueAsNumber;
    if (val > this.details.ObservationTypes.length) {
      this.details.addObservationType();
    }
    else if (val < this.details.ObservationTypes.length) {
      this.details.removeObservationType();
    }
    this.details.saveDetails();
  }
  onKeydown(event: Event, index: number){
    let t = <KeyboardEvent>event;
    let key = t.key;
    if(key == " "){
      key = "SPACE";
    }
    this.details.ObservationTypes[index].HotKey = key;
    (<HTMLInputElement>t.target).blur();
  }

  download(){
    let detail = new DetailSaveModel();
    detail.name = this.details.Name;
    detail.observationTypes = this.details.ObservationTypes;
    detail.groups = this.details.Groups;
    this.FileSaverProvider.downloadJson(detail, `${new Date()}.mndetails`);
  }
  upload(file: Event){
    let f = (<HTMLInputElement>file.target).files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let result = fileReader.result;
      let details = <DetailSaveModel>JSON.parse(<string>result);
      this.details.Name = details.name;
      this.details.ObservationTypes = details.observationTypes;
      this.details.Groups = details.groups;
      this.details.saveDetails();
    }
    fileReader.readAsText(f);
  }
  clear(){
    this.details.Name = "";
    this.details.ObservationTypes = [];
    this.details.Groups = [];
  }

}

class DetailSaveModel{
  name:string;
  observationTypes: ObservationType[];
  groups: TestGroup[];
}
