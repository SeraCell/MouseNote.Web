import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainViewComponent } from './Views/main-view/main-view.component';
import { DetailViewComponent } from './Views/detail-view/detail-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ControlsViewComponent } from './Views/controls-view/controls-view.component';
import { SettingsViewComponent } from './Views/settings-view/settings-view.component';
import { FormsModule } from '@angular/forms';
import { DataCanvasComponent } from './Components/data-canvas/data-canvas.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';
import { DurationPipe } from './Pipes/duration.pipe';
import { DataInfoBarComponent } from './Components/data-info-bar/data-info-bar.component';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';



@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    DetailViewComponent,
    ControlsViewComponent,
    SettingsViewComponent,
    DataCanvasComponent,
    VideoPlayerComponent,
    DurationPipe,
    DataInfoBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,

    MatCommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
