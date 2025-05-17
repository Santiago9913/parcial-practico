import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AirlineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsDate()
  @IsNotEmpty()
  readonly foundationDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly website: string;
}
