import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() items: string[] = [];
  @Input() activeItem: string = null!;
  @Output() activeChange = new EventEmitter<string>();
}
