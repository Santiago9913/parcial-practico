import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airline')
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Put(':airlineId/airport')
  async addAirportToAriline(
    @Param('airlineId') airlineId: string,
    @Body() airportId: string,
  ) {
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      airportId,
    );
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(':airlineId/airport/:airportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') airportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Param('airlineId') airlineId: string,
    @Body() airportsIds: string[],
  ) {
    return await this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      airportsIds,
    );
  }

  @Delete(':airlineId/airport/')
  async removeAirportFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airlineAirportService.deleteAirportFromAirline(airlineId);
  }
}
