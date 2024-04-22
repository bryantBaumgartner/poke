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
  king = false;
  kingAnswer = 0;
  changeKing() {
    this.king = !this.king;
  }
  daily = false;
  challenge: challenge = new challenge();

  score = 0;
  total = 0;
  correct = "";
  rerollVal = true;

  question = "";
  type = 0;
  secondary = 0;
  tertiary = 0;

  pokemon: Pokemon[] = [];
  subSetPokemon: Pokemon[] = []; //Used to have a cache of pokemon
  images: string[] = [];
  loadingText: string = "Loading questions...";

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.challenge = new challenge();
  }

  async setMode(mode: number) {
    this.mode = mode;
    this.setLoadText();
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
    this.subSetPokemon = [];
    this.images = [];
    this.correct = "";
    this.daily = false;
  }

  async setScenario() {
    if (!(this.king && this.total > 0)) this.pokemon = [];
    this.images = [];
    this.question = "";

    if (this.mode == 99) {
      this.daily = true;
      this.twenty = true;
      this.king = false;
      this.forms = false;
    }
    if (this.daily == true && this.mode == 99) {
      this.mode = this.getRandomInt(10) + 1;
    }

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
        this.currentDexNumbers = 100;
        this.dexOffset = 152;
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

    //Set the pokemon here so we can inject some customization
    if (this.king && this.total > 0) {
      //this.pokemon[this.kingAnswer]; Keep the one you selected the same
      this.pokemon[Math.abs(this.kingAnswer - 1)] = this.subSetPokemon[Math.abs(this.kingAnswer - 1)] != null ? this.subSetPokemon[Math.abs(this.kingAnswer - 1)] : await this.getRandomPokemon();
    }
    else if (this.daily && this.total < 20) {
      const q = this.challenge.questions[this.total];
      this.pokemon[0] = this.subSetPokemon[0] != null && this.total < 19 ? this.subSetPokemon[0] : await this.getSpecificPokemon(q.options[0]);
      this.pokemon[1] = this.subSetPokemon[1] != null && this.total < 19 ? this.subSetPokemon[1] : await this.getSpecificPokemon(q.options[1]);
      this.subSetPokemon = [];
    }
    else {
      this.pokemon[0] = this.subSetPokemon[0] != null ? this.subSetPokemon[0] : await this.getRandomPokemon();
      this.pokemon[1] = this.subSetPokemon[1] != null ? this.subSetPokemon[1] : await this.getRandomPokemon();
      this.subSetPokemon = [];
    }

    if (this.mode > 0) { //Just in case
      this.type = this.daily ? this.challenge.questions[this.total].questionType : this.getRandomInt(5);
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

        case 4:
          this.move();
          break;
      }
    }

    //Run this after we get the images (NORMALLY)
    /*    if (!this.daily) {*/
    if (this.daily && this.total <= 18) {
      const q = this.challenge.questions[this.total + 1];
      this.subSetPokemon[0] = await this.getSpecificPokemon(q.options[0]);
      this.subSetPokemon[1] = await this.getSpecificPokemon(q.options[1]);
    } else {
      this.subSetPokemon[0] = await this.getRandomPokemon();
      this.subSetPokemon[1] = await this.getRandomPokemon();
    }
/*    }*/
  }

  async stats() {
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which has a higher ";

    this.secondary = this.daily ? this.challenge.questions[this.total].questionSubType[0] % 6 : this.getRandomInt(6);
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
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which has a BASE STAT TOTAL of ";

    if ((this.daily ? this.challenge.questions[this.total].questionSubType[0] % 2 : this.getRandomInt(2)) == 0) {
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
    if ((this.daily ? this.challenge.questions[this.total].questionSubType[0] % 2 : this.getRandomInt(2)) == 0) {
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
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which has the ability ";

    this.secondary = this.daily ? this.challenge.questions[this.total].questionSubType[0] % 2 : this.getRandomInt(2);
    if (this.secondary == 0) {
      this.tertiary = this.daily ? this.challenge.questions[this.total].questionSubType[1] % this.pokemon[0].abilities.length :
        this.getRandomInt(this.pokemon[0].abilities.length);
      this.question += this.pokemon[0].abilities[this.tertiary].ability.name.toUpperCase() + "?";
    } else {
      this.tertiary = this.daily ? this.challenge.questions[this.total].questionSubType[1] % this.pokemon[1].abilities.length :
        this.getRandomInt(this.pokemon[1].abilities.length);
      this.question += this.pokemon[1].abilities[this.tertiary].ability.name.toUpperCase() + "?";
    }
  }

  async move() {
    this.images[0] = this.pokemon[0].sprites?.other?.home['front_default'] ?? "";
    this.images[1] = this.pokemon[1].sprites?.other?.home['front_default'] ?? "";

    this.question = "Which can learn ";

    this.secondary = this.daily ? this.challenge.questions[this.total].questionSubType[0] % 2 : this.getRandomInt(2);
    if (this.secondary == 0) {
      this.tertiary = this.daily ? this.challenge.questions[this.total].questionSubType[1] % this.pokemon[0].moves.length :
        this.getRandomInt(this.pokemon[0].moves.length);
      this.question += this.pokemon[0].moves[this.tertiary].move.name.toUpperCase() + "?";
    } else {
      this.tertiary = this.daily ? this.challenge.questions[this.total].questionSubType[1] % this.pokemon[1].moves.length :
        this.getRandomInt(this.pokemon[1].moves.length);
      this.question += this.pokemon[1].moves[this.tertiary].move.name.toUpperCase() + "?";
    }
  }

  checkAnswer(answer: number) {
    this.kingAnswer = answer;
    this.rerollVal = true;
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

      case 4:
        this.checkMove(answer);
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

  checkMove(answer: number) {
    this.correct = "N";

    for (let i = 0; i < this.pokemon[answer].moves.length; i++) {
      if (this.pokemon[answer].moves[i].move.name == this.pokemon[this.secondary].moves[this.tertiary].move.name) {
        this.score += 1;
        this.correct = "Y"
        break;
      }
    }

    this.total += 1;
    this.setScenario();
  }

  async reroll() {
    if (this.rerollVal)
    {
      this.rerollVal = false;
      this.subSetPokemon[0] = await this.getRandomPokemon();
      this.subSetPokemon[1] = await this.getRandomPokemon();
      this.setScenario();
    }
  }

  //Utilities
  getRandomInt(max: number, checkSumValue: number = 0) {
    return Math.floor(Math.random() * max);
  }
  async getRandomPokemon() {
    if (this.forms) {
      let dex = (this.getRandomInt(this.currentDexNumbers, 1) + this.dexOffset).toString();
      let name = await this.apiService.getPokemonSpecies(dex);

      if (name.varieties.length > 0) {
        return await this.apiService.getPokemon(name.varieties[this.getRandomInt(name.varieties.length, 1)].pokemon.name)
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
  async getSpecificPokemon(val: number) {
    let dex = val.toString();
    return await this.apiService.getPokemon(dex);
  }
  async getSubSetRandomPokemon(val: number = 20) {
    this.subSetPokemon = [];
    for (let i = 0; i < val * 2; i++) {
      this.subSetPokemon[i] = await this.getRandomPokemon();
    }
  }
  clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }
  setLoadText() {
    switch (this.getRandomInt(5)) {
      default:
        this.loadingText = "Training effort values...";
        break;

      case 1:
        this.loadingText = "Catching them all...";
        break;

      case 2:
        this.loadingText = "Defeating gym leaders...";
        break;

      case 3:
        this.loadingText = "Hunting shinies...";
        break;

      case 4:
        this.loadingText = "Buying repels...";
        break;
    }
  }
}

class challenge {
  seed: number = 0;
  checkSum: number = 0;
  questions: question[] = [];
  max: number = 1025;

  constructor() {
    const time = new Date();
    this.seed = +(time.getDay() + "11" + time.getMonth() + "16" + time.getFullYear())
    for (let i = 0; i < 20; i++) {
      this.questions[i] = new question(this.max, this.seed, this.checkSum+=3);
    }
  }
}

class question {
  options: number[] = [];
  questionType: number = 0;
  questionSubType: number[] = [];

  constructor(maxPokemon: number, dailyToken: number, checkSum: number) {
    this.questionType = this.getSeedableRandomInt(5, dailyToken, checkSum++);
    this.questionSubType[0] = this.getSeedableRandomInt(10, dailyToken, checkSum++);
    this.questionSubType[1] = this.getSeedableRandomInt(10, dailyToken, checkSum++);
    this.options[0] = this.getSeedableRandomInt(maxPokemon, dailyToken, checkSum++);
    this.options[1] = this.getSeedableRandomInt(maxPokemon, dailyToken, checkSum++);
  }

  getSeedableRandomInt(max: number, dailyToken: number, checkSum: number) {
    /*    if (this.dailyCheckSum == 0) alert(this.dailyCheckSum);*/
    return (dailyToken + (checkSum * 16)) % max;
  }
}
