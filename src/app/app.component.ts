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

  mode = 0;

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
  }

  setMode(mode: number){
    this.mode = mode;
    if (this.mode == 0) {
      this.reset();
    } else {
      this.setScenario();
    }
  }

  reset() {
    this.score = 0;
    this.total = 0;
    this.pokemon = [];
    this.images = [];
  }

  setScenario() {
    this.pokemon = [];
    this.images = [];
    this.question = "";

    if (this.mode == 1) { //Random Mode
      this.type = this.getRandomInt(3);
      switch (this.type) {
        default:
          this.stats();
          break;

        case 1:
          this.baseStats();
          break;

        case 2:
          this.shiny();
          break;
      }
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

  async baseStats() {
    this.pokemon[0] = await this.apiService.getPokemon(this.getRandomInt(this.dexNumbers).toString());
    this.pokemon[1] = await this.apiService.getPokemon(this.getRandomInt(this.dexNumbers).toString());
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which has a BASE STAT TOTAL of ";

    if (this.getRandomInt(2) == 0) {
      this.secondary = 0;
      for (let i = 0; i < 6; i++){
        this.secondary += this.pokemon[0].stats[i].base_stat;
      }

      this.question += this.secondary.toString() + "?";
    } else {
      this.secondary = 0;
      for (let i = 0; i < 6; i++){
        this.secondary += this.pokemon[1].stats[i].base_stat;
      }

      this.question += this.secondary.toString() + "?";
    }
  }

  async shiny() {
    this.pokemon[0] = await this.apiService.getPokemon(this.getRandomInt(this.dexNumbers).toString());
    this.pokemon[1] = await this.apiService.getPokemon(this.getRandomInt(this.dexNumbers).toString());
    if (this.getRandomInt(2) == 0) {
      this.images[0] = this.pokemon[0].sprites?.other?.home['front_shiny'] ?? "";
      this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";
      this.secondary = 0;
    } else {
      this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
      this.images[1] = this.pokemon[1].sprites?.other?.home['front_shiny'] ?? "";
      this.secondary = 1;
    }

    this.question = "Which is SHINY?";
  }

  checkAnswer(answer: number) {
    switch (this.type) {
      default:
        this.checkStats(answer);
        break;

      case 1:
        this.checkBaseStats(answer);
        break;

      case 2:
      this.checkShiny(answer);
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

  checkBaseStats(answer: number) {
    this.correct = "";

    if (answer == 0){
      answer = 0;
      for (let i = 0; i < 6; i++){
        answer += this.pokemon[0].stats[i].base_stat;
      }
      if (answer == this.secondary) {
        this.score += 1;
        this.correct = "Y"
      } else {
        this.correct = "N"
      }
    }
    else if (answer == 1){
      answer = 0;
      for (let i = 0; i < 6; i++){
        answer += this.pokemon[1].stats[i].base_stat;
      }
      if (answer == this.secondary) {
        this.score += 1;
        this.correct = "Y"
      } else {
        this.correct = "N"
      }
    }

    this.total += 1;
    this.setScenario();
  }

  checkShiny(answer: number) {
    this.correct = "";

    if (answer == this.secondary) {
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

