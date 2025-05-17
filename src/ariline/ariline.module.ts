import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
})
export class ArilineModule {}
