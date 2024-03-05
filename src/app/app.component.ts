import { ApplicationConfig, Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './app.services';
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
  title = 'Pokemparisons';
  dexNumbers = 1025;

  score = 0;
  total = 0;
  correct = "";

  question = "";
  type = 0;
  secondary = 0;

  pokemon: Pokemon[] = [];
  images: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.setScenario();
  }

  setScenario() {
    this.pokemon = [];
    this.images = [];
    this.question = "";

    this.type = this.getRandomInt(2);
    switch (this.type) {
      default:
        this.stats();
        break;

      case 1:
        this.stats();
        break;
    }
  }

  async stats() {
    this.pokemon[0] = await this.apiService.getPokemon(this.getRandomInt(this.dexNumbers).toString());
    this.pokemon[1] = await this.apiService.getPokemon(this.getRandomInt(this.dexNumbers).toString());
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which has a higher ";

    this.secondary = this.getRandomInt(6);
    switch (this.secondary) {
      default:
        this.question += "HP?";
        break;

      case 1:
        this.question += "ATTACK?";
        break;

      case 2:
        this.question += "DEFENSE?";
        break;

      case 3:
        this.question += "SPECIAL ATTACK?";
        break;

      case 4:
        this.question += "SPECIAL DEFENSE?";
        break;

      case 5:
        this.question += "SPEED?";
        break;
    }

  }

  checkAnswer(answer: number) {
    switch (this.type) {
      default:
        this.checkStats(answer);
        break;
    }
  }

  checkStats(answer: number) {
    this.correct = "";

    if (answer == 0 && this.pokemon[0].stats[this.secondary].base_stat > this.pokemon[1].stats[this.secondary].base_stat) {
      this.score += 1;
      this.correct = "Y"
    }
    else if (answer == 1 && this.pokemon[1].stats[this.secondary].base_stat > this.pokemon[0].stats[this.secondary].base_stat) {
      this.score += 1;
      this.correct = "Y"
    }
    else {
      this.correct = "N"
    }

    this.total += 1;
    this.setScenario();
  }

  reroll() {
    if (confirm("Do you want to pay 1 point to reroll the question?"))
    {
      this.score = this.clamp(this.score - 1, 0, 999);
      this.correct = "";

      this.setScenario();
    }
  }

  //Utilities
  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }
}

