import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';
import { FindOneParam } from '../shared/params/findOneParam';
import { AirlineAirportDto } from './airline-airport.dto';

@Controller('airlines')
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Put(':id/airport')
  async addAirportToAriline(
    @Param() { id: airlineId }: FindOneParam,
    @Body() airlineAirportDto: AirlineAirportDto,
  ) {
    const { airportId } = airlineAirportDto;
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':id/airports')
  async findAirportsFromAirline(@Param() { id: airlineId }: FindOneParam) {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airlineId/airports/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put(':id/airports')
  async updateAirportsFromAirline(
    @Param() { id }: FindOneParam,
    @Body() airlineAirportDto: AirlineAirportDto,
  ) {
    const { airportsIds } = airlineAirportDto;
    return await this.airlineAirportService.updateAirportsFromAirline(
      id,
      airportsIds,
    );
  }

  @Delete(':id/airports')
  @HttpCode(204)
  async removeAirportFromAirline(
    @Param() { id }: FindOneParam,
    @Body() airlineAirportDto: AirlineAirportDto,
  ) {
    const { airportId } = airlineAirportDto;
    return await this.airlineAirportService.deleteAirportFromAirline(
      id,
      airportId,
    );
  }
}
