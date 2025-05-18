import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      return await this.airportRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException('Airport not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    const code = airport.code;

    if (code.length !== 3) {
      throw new Error('Airport code must be exactly 3 characters long');
    }

    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    let existingAirport: AirportEntity;
    try {
      existingAirport = await this.airportRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException('Airport not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    existingAirport.name = airport.name;
    existingAirport.code = airport.code;
    existingAirport.country = airport.country;
    existingAirport.city = airport.city;

    try {
      return await this.airportRepository.save(existingAirport);
    } catch (error) {
      throw new HttpException(
        'Error updating airport',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async delete(id: string): Promise<void> {
    let airport: AirportEntity;
    try {
      airport = await this.airportRepository.findOneByOrFail({
        id,
      });
    } catch (error) {
      throw new HttpException('Airport not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    try {
      await this.airportRepository.remove(airport);
    } catch (error) {
      throw new HttpException(
        'Error deleting airport',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
