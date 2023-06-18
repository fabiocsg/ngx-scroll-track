import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ScrollTrackingService } from '../services/scroll-tracking.service';
import { Constants } from '../utils/constants';

@Directive({
  selector: '[scrollListener]',
})
export class ScrollListenerDirective implements OnInit, OnDestroy {

  private ngUnsubscribe$ = new Subject<void>();

  @Input() scrollListener: string = null!;
  @Input() container: string = Constants.defaultContainerName;

  @Input() activeClass?: string;

  @Output() activeChange = new EventEmitter<boolean>();

  constructor(
    private scrollService: ScrollTrackingService,
    private element: ElementRef,
    private renderer: Renderer2,
  ) { }

  // Events

  private handleActiveChange(active: boolean): void {
    this.activeChange.emit(active);

    if (!this.activeClass) {
      return;
    }

    if (active) {
      this.renderer.addClass(this.element.nativeElement, this.activeClass);
    } else {
      this.renderer.removeClass(this.element.nativeElement, this.activeClass);
    }
  }

  // NgHooks

  ngOnInit(): void {
    if (!this.scrollListener) {
      throw new Error('scrollListener directive must have a value, required to id the element to listen to.');
    }

    this.scrollService.listenTo(this.container, this.scrollListener)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(active => this.handleActiveChange(active));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
