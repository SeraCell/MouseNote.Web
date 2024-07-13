import { Component } from '@angular/core';
import { DetailsService } from './Services/details.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MouseNote';
  constructor(details: DetailsService){}
}
