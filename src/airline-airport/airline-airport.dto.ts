import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AirlineAirportDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly airlineId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly airportId: string;

  @IsOptional()
  readonly airportsIds: string[];
}
