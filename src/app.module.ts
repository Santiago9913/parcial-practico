import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline/airline.entity';
import { AirportEntity } from './airport/airport.entity';
import { AirlineService } from './airline/airline.service';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial-practico',
      entities: [AirlineEntity, AirportEntity],
      synchronize: true,
    }),
    AirlineModule,
    AirportModule,
    AirlineAirportModule,
  ],
  controllers: [AppController],
  providers: [AppService, AirlineService],
})
export class AppModule {}
