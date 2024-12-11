import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Event } from 'src/events/event.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking,Event,User])], // Ensure Event is added here
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
