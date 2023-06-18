import { Injectable, OnDestroy } from '@angular/core';
import {
  auditTime,
  BehaviorSubject,
  distinctUntilChanged,
  fromEvent, map, Observable,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';

import { ScrollContainerDirective } from '../directives/scroll-container.directive';
import { ScrollTargetDirective } from '../directives/scroll-target.directive';
import { Dictionary } from '../models/dictionary';
import { Constants } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ScrollTrackingService implements OnDestroy {

  private ngUnsubscribe$ = new Subject<void>();

  private registeredContainers: Dictionary<string, Subscription> = {};
  private registeredTargets: Dictionary<string, ScrollTargetDirective[]> = {};

  // A new subject is created for every container listened to,
  // even if the container or the targets are not in the DOM yet.
  private listenedContainers: Dictionary<string, BehaviorSubject<string | undefined>> = {};

  constructor() { }

  public listenTo(containerName: string, targetName: string): Observable<boolean> {
    let subject = this.listenedContainers[containerName];
    if (!subject) {
      subject = new BehaviorSubject<string | undefined>(undefined);
      this.listenedContainers[containerName] = subject;
    }

    return subject.pipe(
      distinctUntilChanged(),
      map(activeTargetName => activeTargetName === targetName)
    );
  }

  public listenToContainer(containerName: string): Observable<string | undefined> {
    let subject = this.listenedContainers[containerName];
    if (!subject) {
      subject = new BehaviorSubject<string | undefined>(undefined);
      this.listenedContainers[containerName] = subject;
    }
    return subject.asObservable();
  }

  public registerContainer(container: ScrollContainerDirective): void {
    this.validateContainerUniqueness(container);

    this.addContainerSubscription(container.scrollContainerName, container.element.nativeElement);
  }

  public unregisterContainer(container: ScrollContainerDirective): void {
    const containerSubscription = this.registeredContainers[container.scrollContainerName];
    if (!containerSubscription) {
      return;
    }

    containerSubscription.unsubscribe();
    delete this.registeredContainers[container.scrollContainerName];
  }

  public registerTarget(target: ScrollTargetDirective): void {
    this.validateTargetUniqueness(target);

    let containerTargets = this.registeredTargets[target.containerName];
    if (!containerTargets) {
      this.registeredTargets[target.containerName] = [];
      containerTargets = this.registeredTargets[target.containerName];
    }

    containerTargets.push(target);

    if (!target.hasScrollContainer) {
      this.addContainerSubscription(Constants.defaultContainerName, window);
    }

    this.updateContainerSubject(target.containerName, target.scrollContainerElement || window);
  }

  public unregisterTarget(target: ScrollTargetDirective): void {
    const containerTargets = this.registeredTargets[target.containerName];
    if (!containerTargets) {
      return;
    }

    if (containerTargets.includes(target)) {
      this.registeredTargets[target.containerName] = containerTargets.filter(e => e !== target);
    }
  }

  // NgHooks

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  // Utils

  private addContainerSubscription(containerName: string, element: Window | Element) {
    const existingSubscription = this.registeredContainers[containerName];
    if (existingSubscription) {
      existingSubscription.unsubscribe();
    }

    this.registeredContainers[containerName] = fromEvent(element, 'scroll', { passive: true })
      .pipe(
        auditTime(Constants.defaultAuditTime),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(_ => this.updateContainerSubject(containerName, element));
  }

  private updateContainerSubject(containerName: string, container: Window | Element): void {
    const containerSubject = this.listenedContainers[containerName];
    if (!containerSubject) {
      return;
    }

    const containerTargets = this.registeredTargets[containerName];
    if (!containerTargets?.length) {
      containerSubject.next(undefined);
    }

    const targetDistances = containerTargets.map(target => ({
      target,
      distance: this.computeScrollDistance(target, container),
    }));

    // sorting to find the negative number closest to 0
    const sortedTargets = [...targetDistances].sort((x, y) => y.distance - x.distance);
    const activeTarget = sortedTargets.find(x => x.distance <= 0) || sortedTargets[sortedTargets.length - 1];
    containerSubject.next(activeTarget.target.targetName);
  }

  private computeScrollDistance(target: ScrollTargetDirective, container: Element | Window): number {
    const distanceScrolled = container === window
      ? window.scrollY
      : (container as Element).scrollTop;

    let el = target.element.nativeElement;
    let top = 0;
    do {
      top += el.offsetTop;
      el = el.offsetParent;
    }
    while (!!el && el != container);

    return top - distanceScrolled;
  }

  private validateContainerUniqueness(container: ScrollContainerDirective): void {
    if (!this.registeredContainers[container.scrollContainerName]) {
      return;
    }

    if (container.scrollContainerName === Constants.defaultContainerName) {
      throw new Error(`${ScrollContainerDirective.name}: If you're using multiple scroll containers a unique name must be used with the "scrollContainer" attribute.`);
    }

    throw new Error(`A container with name "${container.scrollContainerName}" is already used, if you're using multiple containers make sure they all have unique names.`);
  }

  private validateTargetUniqueness(target: ScrollTargetDirective): void {
    const containerTargets = this.registeredTargets[target.containerName];
    if (!containerTargets) {
      return;
    }

    if (!containerTargets.includes(target)) {
      return;
    }

    if (target.containerName === Constants.defaultContainerName) {
      throw new Error(`A target with name "${target.targetName}" is already being tracked. make sure all targets have a unique name.`);
    }

    throw new Error(`A target with name "${target.targetName}" is already registered in container "${target.containerName}", make sure all the targets in the same container have unique names.`);
  }

}
