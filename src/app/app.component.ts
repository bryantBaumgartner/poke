import { AfterContentInit, Component } from '@angular/core';

declare function typeWriter(): any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  title = 'angular';
  i = 0;
  txt = "> Programming, It's What I Do";
  speed = 50;

  ngAfterContentInit(): void {
    typeWriter();
  }
}
