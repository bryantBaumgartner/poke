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
  totalDexNumbers = 1025;
  currentDexNumbers = 1025;
  dexOffset = 0;

  mode = 0;
  twenty = true;
  changeTwenty() {
    this.twenty = !this.twenty;
  }
  forms = false;
  changeForms() {
    this.forms = !this.forms;
  }

  score = 0;
  total = 0;
  correct = "";

  question = "";
  type = 0;
  secondary = 0;
  tertiary = 0;

  pokemon: Pokemon[] = [];
  images: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  setMode(mode: number) {
    this.mode = mode;
    if (this.mode <= 0) {
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
    this.correct = "";
  }

  setScenario() {
    this.pokemon = [];
    this.images = [];
    this.question = "";

    if (this.twenty == true && this.total >= 20) {
      this.mode = -2;
    }

    //Set the gen
    switch (this.mode) {
      case -2:
        break;

      default:
        this.currentDexNumbers = this.totalDexNumbers;
        this.dexOffset = 0;
        break;

      case 2: //Get 1
        this.currentDexNumbers = 151;
        this.dexOffset = 0;
        break;

      case 3: //Gen 2 and so on
        this.currentDexNumbers = 152;
        this.dexOffset = 100;
        break;

      case 4:
        this.currentDexNumbers = 135;
        this.dexOffset = 252;
        break;

      case 5:
        this.currentDexNumbers = 107;
        this.dexOffset = 387;
        break;

      case 6:
        this.currentDexNumbers = 156;
        this.dexOffset = 494;
        break;

      case 7:
        this.currentDexNumbers = 72;
        this.dexOffset = 650;
        break;

      case 8:
        this.currentDexNumbers = 88;
        this.dexOffset = 722;
        break;

      case 9:
        this.currentDexNumbers = 96;
        this.dexOffset = 810;
        break;

      case 10:
        this.currentDexNumbers = 120;
        this.dexOffset = 906;
        break;
    }

    if (this.mode > 0) { //Just in case
      this.type = this.getRandomInt(4);
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

        case 3:
          this.ability();
          break;
      }
    }
  }

  async stats() {
    this.pokemon[0] = await this.getRandomPokemon();
    this.pokemon[1] = await this.getRandomPokemon();
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
    this.pokemon[0] = await this.getRandomPokemon();
    this.pokemon[1] = await this.getRandomPokemon();
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
    this.pokemon[0] = await this.getRandomPokemon();
    this.pokemon[1] = await this.getRandomPokemon();
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

  async ability() {
    this.pokemon[0] = await this.getRandomPokemon();
    this.pokemon[1] = await this.getRandomPokemon();
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which has the ability ";

    this.secondary = this.getRandomInt(2);
    if (this.secondary == 0) {
      this.tertiary = this.getRandomInt(this.pokemon[0].abilities.length);
      this.question += this.pokemon[0].abilities[this.tertiary].ability.name.toUpperCase() + "?";
    } else {
      this.tertiary = this.getRandomInt(this.pokemon[1].abilities.length);
      this.question += this.pokemon[1].abilities[this.tertiary].ability.name.toUpperCase() + "?";
    }
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

      case 3:
        this.checkAbility(answer);
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

  checkAbility(answer: number) {
    this.correct = "N";

    for (let i = 0; i < this.pokemon[answer].abilities.length; i++) {
      if (this.pokemon[answer].abilities[i].ability.name == this.pokemon[this.secondary].abilities[this.tertiary].ability.name) {
        this.score += 1;
        this.correct = "Y"
        break;
      }
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
  async getRandomPokemon() {
    if (this.forms) {
      let dex = (this.getRandomInt(this.currentDexNumbers) + this.dexOffset).toString();
      let name = await this.apiService.getPokemonSpecies(dex);

      if (name.varieties.length > 0) {
        return await this.apiService.getPokemon(name.varieties[this.getRandomInt(name.varieties.length)].pokemon.name)
      }
      else {
        return await this.apiService.getPokemon(dex);
      }
    }
    else {
      let dex = (this.getRandomInt(this.currentDexNumbers) + this.dexOffset).toString();
      return await this.apiService.getPokemon(dex);
    }
  }
  clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }
}

