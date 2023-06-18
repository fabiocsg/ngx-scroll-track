import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollTrackingService } from '../services/scroll-tracking.service';
import { Constants } from '../utils/constants';

/**
 * optional directive:
 * marks the scroll container for the scroll targets.
 * if not used the window will be used instead.
 * ---
 * NB: the element MUST have a position of relative or absolute
 * ---
 * NB2: must be used if multiple scroll container needs to be tracked at the same time,
 * a unique scroll container name is required in that case
 */
@Directive({ selector: '[scrollContainer]' })
export class ScrollContainerDirective implements OnInit, OnDestroy {

  private _scrollContainerName = Constants.defaultContainerName;

  // Using getter and setter because the directive attribute defaults to empty string when used.
  @Input('scrollContainer')
  set scrollContainerName(value: string) {
    this._scrollContainerName = value || Constants.defaultContainerName;
  }
  get scrollContainerName(): string {
    return this._scrollContainerName;
  }

  public get element(): ElementRef {
    return this.elementRef;
  }

  constructor(
    private elementRef: ElementRef,
    private scrollTrackingSvc: ScrollTrackingService,
  ) {
  }

  // NgHooks

  ngOnInit(): void {
    this.scrollTrackingSvc.registerContainer(this);
  }

  ngOnDestroy(): void {
    this.scrollTrackingSvc.unregisterContainer(this);
  }
}
