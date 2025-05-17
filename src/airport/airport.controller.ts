import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportDto } from './airport.dto';
import { AirportEntity } from './airport.entity';
import { plainToInstance } from 'class-transformer';

@Controller('airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAll() {
    return await this.airportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.airportService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() airportDto: AirportDto) {
    const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
    return await this.airportService.create(airport);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() airportDto: AirportDto) {
    const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
    return await this.airportService.update(id, airport);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.airportService.delete(id);
  }
}
