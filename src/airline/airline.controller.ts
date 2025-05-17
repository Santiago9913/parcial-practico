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
import { AirlineService } from './airline.service';
import { AirlineDto } from './airline.dto';
import { AirlineEntity } from './airline.entity';
import { plainToInstance } from 'class-transformer';

@Controller('airline')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll() {
    return await this.airlineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.airlineService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() airlineDto: AirlineDto) {
    const airline: AirlineEntity = plainToInstance(AirlineEntity, airlineDto);
    return await this.airlineService.create(airline);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() airlineDto: AirlineDto) {
    const airline: AirlineEntity = plainToInstance(AirlineEntity, airlineDto);
    return await this.airlineService.update(id, airline);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.airlineService.delete(id);
  }
}
