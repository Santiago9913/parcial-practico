import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { In, Repository } from 'typeorm';
import { difference } from 'lodash';

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(AirlineEntity)
    private airlineRepository: Repository<AirlineEntity>,

    @InjectRepository(AirportEntity)
    private airportRepository: Repository<AirportEntity>,
  ) {}

  async addAirportToAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirlineEntity> {
    let airport: AirportEntity;
    let airline: AirlineEntity;

    if (!airportId) {
      throw new HttpException(
        'Airport ID cannot be null or undefined',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      airline = await this.airlineRepository.findOneOrFail({
        where: { id: airlineId },
        relations: {
          airports: true,
        },
      });
    } catch (error) {
      throw new HttpException('Airline not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    try {
      airport = await this.airportRepository.findOneByOrFail({
        id: airportId,
      });
    } catch (error) {
      throw new HttpException('Airport not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    if (
      airline.airports.some(
        (existingAirport) => existingAirport.id === airportId,
      )
    ) {
      throw new HttpException(
        'Airport already exists in the airline',
        HttpStatus.BAD_REQUEST,
      );
    }

    airline.airports = [...airline.airports, airport];

    return await this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new Error('Airline not found');
    }

    return airline.airports;
  }

  async findAirportFromAirline(airlineId: string, airportId: string) {
    let airline: AirlineEntity;
    try {
      airline = await this.airlineRepository.findOneOrFail({
        relations: {
          airports: true,
        },
        where: {
          airports: {
            id: airportId,
          },
          id: airlineId,
        },
      });
    } catch (error) {
      const message = `Airline with ID ${airlineId} does not have an airport with ID ${airportId}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    return airline.airports;
  }

  async updateAirportsFromAirline(airlineId: string, airportIds: string[]) {
    let airline: AirlineEntity;
    let newAirports: AirportEntity[];
    if (!airportIds || airportIds.length === 0) {
      throw new HttpException(
        'Airport IDs cannot be null or empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      airline = await this.airlineRepository.findOneOrFail({
        where: { id: airlineId },
        relations: {
          airports: true,
        },
      });
    } catch (error) {
      throw new HttpException('Airline not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    try {
      newAirports = await this.airportRepository.findBy({
        id: In(airportIds),
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('Airports not found', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    if (newAirports.length !== airportIds.length) {
      const newIds = newAirports.map((airport) => airport.id);
      const missingIds = difference(airportIds, newIds);
      const message = `The following Airports IDs does not exist ${missingIds.join(
        ', ',
      )}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    airline.airports = newAirports;
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    let airline: AirlineEntity;
    if (!airportId) {
      throw new HttpException(
        'Airport ID cannot be null or undefined',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      airline = await this.airlineRepository.findOneOrFail({
        relations: {
          airports: true,
        },
        where: {
          id: airlineId,
          airports: {
            id: airportId,
          },
        },
      });
    } catch (error) {
      const message = `Airline with ID ${airlineId} does not have an airport with ID ${airportId}`;
      throw new HttpException(message, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }

    if (airline.airports.length === 0) {
      throw new HttpException('Airline has no airports', HttpStatus.NOT_FOUND);
    }

    airline.airports = airline.airports.filter(
      (airport) => airport.id !== airportId,
    );

    return await this.airlineRepository.save(airline);
  }
}
