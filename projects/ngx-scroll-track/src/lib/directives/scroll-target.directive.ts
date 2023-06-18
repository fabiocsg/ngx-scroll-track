import { Directive, ElementRef, Input, OnDestroy, OnInit, Optional } from '@angular/core';

import { ScrollTrackingService } from '../services/scroll-tracking.service';
import { Constants } from '../utils/constants';
import { ScrollContainerDirective } from './scroll-container.directive';

@Directive({
  selector: '[scrollTarget]'
})
export class ScrollTargetDirective implements OnInit, OnDestroy {

  @Input('scrollTarget') targetName: string = null!;

  public get element(): ElementRef {
    return this.elementRef;
  }

  public get containerName(): string {
    return this.parentDirective?.scrollContainerName || Constants.defaultContainerName;
  }

  public get hasScrollContainer(): boolean {
    return !!this.parentDirective;
  }

  public get scrollContainerElement(): Element | undefined {
    return this.parentDirective?.element.nativeElement;
  }

  constructor(
    private elementRef: ElementRef,
    private scrollTrackingSvc: ScrollTrackingService,
    @Optional() private parentDirective: ScrollContainerDirective
  ) { }

  // NgHooks

  ngOnInit(): void {
    if (!this.targetName) {
      throw new Error('scrollTarget directive must have a value, required to id the element to track.')
    }

    this.scrollTrackingSvc.registerTarget(this);
  }

  ngOnDestroy(): void {
    this.scrollTrackingSvc.unregisterTarget(this);
  }
}
