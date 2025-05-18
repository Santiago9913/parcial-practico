import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { times } from 'lodash';
import { faker } from '@faker-js/faker/.';
import { v4 as uuid } from 'uuid';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlines: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirlineService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    airlines = times(5, () => {
      const airline = new AirlineEntity();
      airline.id = uuid();
      airline.name = faker.airline.airline().name;
      airline.description = faker.lorem.sentence();
      airline.website = faker.internet.url();
      airline.foundationDate = faker.date.past().toDateString();
      airline.airports = [];
      return airline;
    });

    await repository.save(airlines);
    return airlines;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('finds all airlines', async () => {
    const foundAirlines = await service.findAll();
    expect(foundAirlines).toHaveLength(airlines.length);
  });

  it('finds an airline by id', async () => {
    const ariline = airlines[0];
    const foundAirline = await service.findOne(ariline.id);
    expect(foundAirline).toBeDefined();
    expect(foundAirline!.id).toEqual(ariline.id);
    expect(foundAirline!.name).toEqual(ariline.name);
    expect(foundAirline!.description).toEqual(ariline.description);
    expect(foundAirline!.website).toEqual(ariline.website);
    expect(foundAirline!.foundationDate).toEqual(ariline.foundationDate);
  });

  it('creates an airline', async () => {
    const airline = new AirlineEntity();
    airline.name = faker.airline.airline().name;
    airline.description = faker.lorem.sentence();
    airline.website = faker.internet.url();
    airline.foundationDate = faker.date.past().toDateString();

    const createdAirline = await service.create(airline);
    expect(createdAirline).toBeDefined();
    expect(createdAirline.id).toBeDefined();
    expect(createdAirline.name).toEqual(airline.name);
    expect(createdAirline.description).toEqual(airline.description);
    expect(createdAirline.website).toEqual(airline.website);
    expect(createdAirline.foundationDate).toEqual(airline.foundationDate);
  });

  it('updates an airline', async () => {
    const airline = airlines[0];
    airline.name = faker.airline.airline().name;
    airline.description = faker.lorem.sentence();
    airline.website = faker.internet.url();
    airline.foundationDate = faker.date.past().toDateString();

    const updatedAirline = await service.update(airline.id, airline);
    expect(updatedAirline).toBeDefined();
    expect(updatedAirline.id).toEqual(airline.id);
    expect(updatedAirline.name).toEqual(airline.name);
    expect(updatedAirline.description).toEqual(airline.description);
    expect(updatedAirline.website).toEqual(airline.website);
    expect(updatedAirline.foundationDate).toEqual(airline.foundationDate);
  });

  it('deletes an airline', async () => {
    const airline = airlines[0];
    await service.delete(airline.id);
    const foundAirline = await repository.findOneBy({
      id: airline.id,
    });
    expect(foundAirline).toBeNull();
  });
});
