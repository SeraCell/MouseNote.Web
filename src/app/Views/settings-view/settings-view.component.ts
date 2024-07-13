import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/Services/settings.service';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.css']
})
export class SettingsViewComponent implements OnInit {

  constructor(public settingsProvider: SettingsService) { }

  ngOnInit(): void {
  }

}
