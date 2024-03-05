import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon, PokemonClient } from 'pokenode-ts';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api = new PokemonClient();
  apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  async getPokemon(name: string): Promise<Pokemon> {
    try {
      const pokemonData = await this.api.getPokemonByName(name);
      return pokemonData;
    } catch (error) {
      console.error(error);
      return this.getPokemon("Bulbasaur");
    }
  }
}
