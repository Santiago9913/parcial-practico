import { Test, TestingModule } from '@nestjs/testing';
import { AirlineAirportService } from './airline-airport.service';
import { Repository } from 'typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { times } from 'lodash';
import { faker } from '@faker-js/faker/.';
import { v4 as uuid } from 'uuid';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airlines: AirlineEntity[];
  const airports: AirportEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirlineAirportService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    airportRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await airlineRepository.clear();
    await airportRepository.clear();

    await generateAirlines();
  };

  const generateOneAirport = () => {
    const airport = new AirportEntity();
    airport.id = uuid();
    airport.name = faker.airline.airport().name;
    airport.city = faker.location.city();
    airport.country = faker.location.country();
    airport.code = faker.number.int({ min: 100, max: 999 }).toString();
    return airport;
  };

  const generateAirports = () => {
    return times(10, () => {
      const airport = new AirportEntity();
      airport.id = uuid();
      airport.name = faker.airline.airport().name;
      airport.city = faker.location.city();
      airport.country = faker.location.country();
      airport.code = faker.number.int({ min: 100, max: 999 }).toString();
      return airport;
    });
  };

  const generateAirlines = async () => {
    const airlineAirports = generateAirports();
    airports.push(...airlineAirports);
    await airportRepository.save(airports);

    airlines = times(5, () => {
      const airline = new AirlineEntity();
      airline.id = uuid();
      airline.name = faker.airline.airline().name;
      airline.description = faker.lorem.sentence();
      airline.website = faker.internet.url();
      airline.foundationDate = faker.date.past();
      airline.airports = airlineAirports;
      return airline;
    });

    await airlineRepository.save(airlines);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('adds an airport to an airline', async () => {
    const newAirport = generateOneAirport();
    await airportRepository.save(newAirport);
    const airline = airlines[0];

    const addedAirline = await service.addAirportToAirline(
      airline.id,
      newAirport.id,
    );

    expect(addedAirline).toBeDefined();
    expect(addedAirline.id).toEqual(airline.id);
    expect(addedAirline.airports).toHaveLength(airline.airports.length + 1);
    expect(addedAirline.airports).toContainEqual(newAirport);
    expect(addedAirline.airports).toContainEqual(
      expect.objectContaining({
        id: newAirport.id,
        name: newAirport.name,
        city: newAirport.city,
        country: newAirport.country,
        code: newAirport.code,
      }),
    );
  });

  it('finds all the airports from an airline', async () => {
    const airline = airlines[0];
    const foundAirports = await service.findAirportsFromAirline(airline.id);

    expect(foundAirports).toHaveLength(airline.airports.length);
    expect(foundAirports).toEqual(airline.airports);
  });

  it('finds an airport from an airline', async () => {
    const airline = airlines[0];
    const airport = airline.airports[0];

    const foundAirport = await service.findAirportFromAirline(
      airline.id,
      airport.id,
    );

    expect(foundAirport).toBeDefined();
    expect(foundAirport.id).toEqual(airport.id);
    expect(foundAirport.name).toEqual(airport.name);
    expect(foundAirport.city).toEqual(airport.city);
    expect(foundAirport.country).toEqual(airport.country);
    expect(foundAirport.code).toEqual(airport.code);
  });

  it('updates the airports from an airline', async () => {
    const airline = airlines[0];
    const airport = airline.airports[0];
    const newAirport = generateOneAirport();
    await airportRepository.save(newAirport);

    const updatedAirline = await service.updateAirportsFromAirline(airline.id, [
      airport.id,
      newAirport.id,
    ]);

    expect(updatedAirline).toBeDefined();
    expect(updatedAirline.id).toEqual(airline.id);
    expect(updatedAirline.airports).toHaveLength(2);
    expect(updatedAirline.airports).toContainEqual(airport);
    expect(updatedAirline.airports).toContainEqual(newAirport);
  });

  it('deletes an airport from an airline', async () => {
    const airline = airlines[0];
    const airport = airline.airports[0];

    const updatedAirline = await service.deleteAirportFromAirline(airline.id);

    expect(updatedAirline).toBeDefined();
    expect(updatedAirline.id).toEqual(airline.id);
    expect(updatedAirline.airports).toHaveLength(airline.airports.length - 1);
    expect(updatedAirline.airports).not.toContainEqual(airport);
  });
});
