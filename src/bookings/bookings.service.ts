import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Event } from '../events/event.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Create a new booking
  async createBooking(userId: number, eventId: number, quantity: number): Promise<Booking> {
    // Check if the event exists
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    // Check if the user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if the user already has a booking for this event
    const existingBooking = await this.bookingRepository.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });
    if (existingBooking) {
      throw new ConflictException('User has already booked this event');
    }

    // Ensure the quantity is valid
    if (quantity <= 0) {
      throw new BadRequestException('Invalid quantity');
    }

    // Create the booking
    const booking = this.bookingRepository.create({
      user,
      event,
      quantity,
    });

    try {
      return await this.bookingRepository.save(booking);
    } catch (error) {
      // If any unexpected error occurs (e.g., database issue), rethrow it for the global filter
      throw new BadRequestException('Could not create booking, please try again.');
    }
  }

  // Get all bookings for a user with event details
  async findUserBookings(userId: number): Promise<Booking[]> {
    // Check if the user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    try {
      return await this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.event', 'event') 
        .where('booking.userId = :userId', { userId }) 
        .getMany();
    } catch (error) {
      // If any unexpected error occurs
      throw new BadRequestException('Could not fetch bookings, please try again.');
    }
  }
}
