import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './schema/pokemon.schema';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configServices: ConfigService,
  ) {
    this.defaultLimit = configServices.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException(
          `Pokemon exist in db ${JSON.stringify(e.keyValue)} `,
        );
      }

      console.log(e);
      throw new InternalServerErrorException(`Can't Create Pokemon`);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let Pokemon: Pokemon;
    // If it is a number
    if (!isNaN(+term)) {
      Pokemon = await this.pokemonModel.findOne({ no: term });
    }
    //Mongo ID
    if (!Pokemon && isValidObjectId(term)) {
      Pokemon = await this.pokemonModel.findById({ _id: term });
    }
    // Name
    if (!Pokemon) {
      Pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!Pokemon)
      throw new NotFoundException(
        `Pokemon with id , name or no "${term}" not found`,
      );

    return Pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const Pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        Pokemon,
        updatePokemonDto,
        { new: true },
      );
      return updatedPokemon;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException(
          `Pokemon exist in db ${JSON.stringify(e.keyValue)} `,
        );
      }

      console.log(e);
      throw new InternalServerErrorException(`Can't Create Pokemon`);
    }
  }

  async remove(id: string) {
    try {
      const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

      if (deletedCount === 0) {
        throw new NotFoundException(`Pokemon not found`);
      }

      return;
    } catch (e) {
      console.log(e);
      throw new NotFoundException(e.message);
    }
    return;
  }
}
