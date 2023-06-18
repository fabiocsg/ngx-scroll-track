import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ScrollTrackingService } from '../services/scroll-tracking.service';
import { Constants } from '../utils/constants';

@Directive({
  selector: '[scrollContainerListener]',
})
export class ScrollContainerListenerDirective implements OnInit, OnDestroy {

  private ngUnsubscribe$ = new Subject<void>();
  private _scrollContainerName = Constants.defaultContainerName;

  // Using getter and setter because the directive attribute defaults to empty string when used.
  @Input('scrollContainerListener')
  set scrollContainerName(value: string) {
    this._scrollContainerName = value || Constants.defaultContainerName;
  }
  get scrollContainerName(): string {
    return this._scrollContainerName;
  }

  @Output() activeChange = new EventEmitter<string | undefined>();

  constructor(
    private scrollService: ScrollTrackingService,
  ) { }

  // Events

  private handleActiveChange(active: string | undefined): void {
    this.activeChange.emit(active);
  }

  // NgHooks

  ngOnInit(): void {
    this.scrollService.listenToContainer(this.scrollContainerName)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(active => this.handleActiveChange(active));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
