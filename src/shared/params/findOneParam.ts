import { IsUUID } from 'class-validator';

export class FindOneParam {
  @IsUUID()
  id: string;
}

export class findOneAirport {
  @IsUUID()
  airportId: string;
}

export class findOneAirline {
  @IsUUID()
  airlineId: string;
}
