import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { EnvConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),

    MongooseModule.forRoot(process.env.MONGODB),

    // ### Servir contenido statico ###
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    PokemonModule,

    SeedModule,

    CommonModule,
  ],
})
export class AppModule {}
