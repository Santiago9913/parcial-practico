import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find();
  }

  async findOne(id: string): Promise<AirportEntity | null> {
    return await this.airportRepository.findOneBy({ id });
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    const code = airport.code;

    if (code.length !== 3) {
      throw new Error('Airport code must be exactly 3 characters long');
    }

    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const existingAirport = await this.findOne(id);
    if (!existingAirport) {
      throw new Error('Airport not found');
    }

    const code = airport.code;

    if (code.length !== 3) {
      throw new Error('Airport code must be exactly 3 characters long');
    }

    return await this.airportRepository.save({
      ...existingAirport,
      ...airport,
    });
  }

  async delete(id: string): Promise<void> {
    const airport = await this.findOne(id);
    if (!airport) {
      throw new Error('Airport not found');
    }
    await this.airportRepository.remove(airport);
  }
}
