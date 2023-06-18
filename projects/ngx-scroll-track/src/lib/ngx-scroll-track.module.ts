import { NgModule } from '@angular/core';

import { ScrollContainerDirective } from './directives/scroll-container.directive';
import { ScrollContainerListenerDirective } from './directives/scroll-container-listener.directive';
import { ScrollListenerDirective } from './directives/scroll-listener.directive';
import { ScrollTargetDirective } from './directives/scroll-target.directive';

@NgModule({
  declarations: [
    ScrollContainerDirective,
    ScrollContainerListenerDirective,
    ScrollListenerDirective,
    ScrollTargetDirective,
  ],
  imports: [],
  exports: [
    ScrollContainerDirective,
    ScrollContainerListenerDirective,
    ScrollListenerDirective,
    ScrollTargetDirective,
  ]
})
export class NgxScrollTrackModule { }
