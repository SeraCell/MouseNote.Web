import { Component, Input, OnInit } from '@angular/core';
import { PlayerControlService } from 'src/app/Services/player-control.service';
import { SettingsService } from 'src/app/Services/settings.service';

@Component({
  selector: 'controls-view',
  templateUrl: './controls-view.component.html',
  styleUrls: ['./controls-view.component.css']
})
export class ControlsViewComponent implements OnInit {

  @Input() num: number = 0;
  constructor(public playerControls: PlayerControlService, public settingsProvider: SettingsService) {

  }

  ngOnInit(): void {
  }

}
