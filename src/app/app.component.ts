import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public navbarItems = ['Simple', 'Multiple', 'Nested'];
  public navbarActive = 'Simple';
}
