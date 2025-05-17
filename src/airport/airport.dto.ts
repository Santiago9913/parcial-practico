import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AirportDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'Code must be a 3-letter IATA code' })
  @IsNotEmpty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;
}
