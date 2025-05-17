import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArilineModule } from './ariline/ariline.module';
import { AirportModule } from './airport/airport.module';

@Module({
  imports: [ArilineModule, AirportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
