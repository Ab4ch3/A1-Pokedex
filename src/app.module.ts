import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Ab4ch3:ZhuBArtgcjqHoUtl@cluster0.8mfmbkm.mongodb.net/Cluster_Pokemon',
    ),
    // Servir contenido statico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
    SeedModule,
  ],
})
export class AppModule {}
