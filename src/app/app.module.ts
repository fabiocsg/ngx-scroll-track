import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxScrollTrackModule } from 'ngx-scroll-track';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar.component';
import { HintArrowComponent } from './components/hint-arrow.component';
import { Sample1Component } from './sample1/sample1.component';
import { Sample2Component } from './sample2/sample2.component';
import { Sample3Component } from './sample3/sample3.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HintArrowComponent,
    Sample1Component,
    Sample2Component,
    Sample3Component,
  ],
  imports: [
    BrowserModule,
    NgxScrollTrackModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
