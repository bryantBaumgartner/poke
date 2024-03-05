import { ApplicationConfig, Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Pokemon } from 'pokenode-ts';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  correct:string = '';
  pokemon:string[] = [];

  ngOnInit() { }
}
