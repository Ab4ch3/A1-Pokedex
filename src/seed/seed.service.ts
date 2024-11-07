import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';
import { Pokemon } from 'src/pokemon/schema/pokemon.schema';
import { PokeResponse } from './interfaces/poke-response.interfaces';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosHTTP: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.axiosHTTP.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no }); //[{name : 'bulbasor', no:'2'}]
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return `Seed Executed`;
  }
}
