import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Create a booking
  @Post()
  @Roles('user') // Only logged-in users can book tickets
  createBooking(
    @Body('userId') userId: number,
    @Body('eventId') eventId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.bookingsService.createBooking(userId, eventId, quantity);
  }

  // Get all bookings for the logged-in user
  @Get()
  @Roles('user')
  findUserBookings(@Body('userId') userId: number) {
    return this.bookingsService.findUserBookings(userId);
  }
}
