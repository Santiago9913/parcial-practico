import { Module } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineAirportController } from './airline-airport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineEntity } from '../airline/airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirportEntity, AirlineEntity])],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
