import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find();
  }

  async findOne(id: string): Promise<AirlineEntity | null> {
    if (!id) {
      throw new HttpException(
        'ID cannot be null or undefined',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.airlineRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException('Airline not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    const currentDate = DateTime.now();
    const foundationDate = DateTime.fromISO(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new HttpException(
        'Foundation date cannot be in the future',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.airlineRepository.save(airline);
    } catch (error) {
      throw new HttpException(
        'Error creating airline',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const existingAirline = await this.airlineRepository.findOne({
      where: { id },
    });

    if (!existingAirline) {
      throw new HttpException('Airline not found', HttpStatus.NOT_FOUND);
    }

    const currentDate = DateTime.now();
    const foundationDate = DateTime.fromISO(airline.foundationDate);

    if (foundationDate > currentDate) {
      throw new HttpException(
        'Foundation date cannot be in the future',
        HttpStatus.BAD_REQUEST,
      );
    }

    existingAirline.name = airline.name;
    existingAirline.foundationDate = airline.foundationDate;
    existingAirline.description = airline.description;
    existingAirline.website = airline.website;

    try {
      return await this.airlineRepository.save(existingAirline);
    } catch (error) {
      throw new HttpException(
        'Error updating airline',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }

  async delete(id: string): Promise<void> {
    let airline: AirlineEntity;
    try {
      airline = await this.airlineRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('Airline not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    try {
      await this.airlineRepository.remove(airline);
    } catch (error) {
      throw new HttpException(
        'Error deleting airline',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: error },
      );
    }
  }
}
