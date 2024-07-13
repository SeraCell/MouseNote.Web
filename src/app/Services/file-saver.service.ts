import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileSaverService {

  constructor() { }
  downloadFile(data: any) {
    const replacer = (key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, "myFile.csv");
  }
  downloadJson(data: any, fileName: string){
    let string = JSON.stringify(data);
    console.log(string);
    let b = new Blob([string])
    saveAs(b, fileName);
  }
}
