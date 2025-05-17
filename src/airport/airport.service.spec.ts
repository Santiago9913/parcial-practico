import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { times } from 'lodash';
import { faker } from '@faker-js/faker/.';
import { v4 as uuid } from 'uuid';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airports: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirportService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async (): Promise<AirportEntity[]> => {
    await repository.clear();
    airports = times(5, () => {
      const airport = new AirportEntity();
      airport.id = uuid();
      airport.name = faker.airline.airport().name;
      airport.city = faker.location.city();
      airport.country = faker.location.country();
      airport.code = faker.number.int({ min: 100, max: 999 }).toString();
      airport.airlines = [];

      return airport;
    });

    await repository.save(airports);
    return airports;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds all airports', async () => {
    const foundAirports = await service.findAll();
    expect(foundAirports).toHaveLength(airports.length);
  });

  it('finds an airport by id', async () => {
    const airport = airports[0];
    const foundAirport = await service.findOne(airport.id);
    expect(foundAirport).toBeDefined();
    expect(foundAirport!.id).toEqual(airport.id);
    expect(foundAirport!.name).toEqual(airport.name);
    expect(foundAirport!.city).toEqual(airport.city);
    expect(foundAirport!.country).toEqual(airport.country);
    expect(foundAirport!.code).toEqual(airport.code);
  });

  it('creates an airport', async () => {
    const airport = new AirportEntity();
    airport.name = faker.airline.airport().name;
    airport.city = faker.location.city();
    airport.country = faker.location.country();
    airport.code = 'ABC';

    const createdAirport = await service.create(airport);
    expect(createdAirport).toBeDefined();
    expect(createdAirport.id).toBeDefined();
    expect(createdAirport.name).toEqual(airport.name);
    expect(createdAirport.city).toEqual(airport.city);
    expect(createdAirport.country).toEqual(airport.country);
    expect(createdAirport.code).toEqual(airport.code);
  });

  it('updates an airport', async () => {
    const airport = airports[0];
    airport.name = faker.airline.airport().name;
    airport.city = faker.location.city();
    airport.country = faker.location.country();
    airport.code = 'XYZ';

    const updatedAirport = await service.update(airport.id, airport);
    expect(updatedAirport).toBeDefined();
    expect(updatedAirport.id).toEqual(airport.id);
    expect(updatedAirport.name).toEqual(airport.name);
    expect(updatedAirport.city).toEqual(airport.city);
    expect(updatedAirport.country).toEqual(airport.country);
    expect(updatedAirport.code).toEqual(airport.code);
  });

  it('deletes an airport', async () => {
    const airport = airports[0];
    await service.delete(airport.id);
    const foundAirport = await repository.findOneBy({ id: airport.id });
    expect(foundAirport).toBeNull();
  });
});
