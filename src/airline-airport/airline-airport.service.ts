import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { In, Repository } from 'typeorm';

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
    if (!airportId) {
      throw new Error('Airport ID cannot be null or undefined');
    }

    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });
    const airport = await this.airportRepository.findOneBy({
      id: airportId,
    });

    if (!airline || !airport) {
      throw new Error('Airline or Airport not found');
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
    const airline = await this.airlineRepository.findOne({
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

    if (!airline) {
      throw new Error('The given airline in the airport does not exist');
    }

    if (airline.airports.length === 0) {
      throw new Error('The given airport does not exist in the airline');
    }

    return airline.airports[0];
  }

  async updateAirportsFromAirline(airlineId: string, airportIds: string[]) {
    if (!airportIds || airportIds.length === 0) {
      throw new Error('Airport IDs cannot be null or empty');
    }
    const airline = await this.airlineRepository.findOne({
      where: {
        id: airlineId,
      },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new Error('Airline not found');
    }
    const newAirports = await this.airportRepository.findBy({
      id: In(airportIds),
    });

    if (newAirports.length !== airportIds.length) {
      throw new Error('Some airports do not exist');
    }

    airline.airports = newAirports;
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    if (!airportId) {
      throw new Error('Airport ID cannot be null or undefined');
    }
    const airline = await this.airlineRepository.findOne({
      where: {
        id: airlineId,
      },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new Error('Airline not found');
    }

    if (airline.airports.length === 0) {
      throw new Error('Airline has no airports');
    }
    airline.airports = airline.airports.filter(
      (airport) => airport.id !== airportId,
    );

    return await this.airlineRepository.save(airline);
  }
}
