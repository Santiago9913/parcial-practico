import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find();
  }

  async findOne(id: string): Promise<AirlineEntity | null> {
    return await this.airlineRepository.findOneBy({ id });
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const currentDate = DateTime.now();
    const foundationDate = DateTime.fromJSDate(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new Error('Foundation date cannot be in the future');
    }

    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const existingAirline = await this.findOne(id);
    if (!existingAirline) {
      throw new Error('Airline not found');
    }

    const currentDate = DateTime.now();
    const foundationDate = DateTime.fromJSDate(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new Error('Foundation date cannot be in the future');
    }

    return await this.airlineRepository.save({
      ...existingAirline,
      ...airline,
    });
  }

  async delete(id: string): Promise<void> {
    const airline = await this.findOne(id);
    if (!airline) {
      throw new Error('Airline not found');
    }
    await this.airlineRepository.remove(airline);
  }
}
