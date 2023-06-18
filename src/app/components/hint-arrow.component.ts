import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hint-arrow',
  template: `
    <span>scroll down</span>
    <div [style.width.px]="sizePx" [style.height.px]="sizePx" class="arrow">
      <svg viewBox="0 0 48 48">
        <path d="M18 31l12-12 12 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  `,
  styleUrls: ['./hint-arrow.component.scss']
})
export class HintArrowComponent {
  @Input() sizePx = 30;
}
