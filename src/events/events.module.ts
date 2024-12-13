import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Booking } from 'src/bookings/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event,Booking])], // Ensure Event is added here
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
