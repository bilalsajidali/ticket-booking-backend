import { Injectable, BadRequestException } from '@nestjs/common';
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
    const event = await this.eventRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Ensure the user is not booking more tickets than available
    if (quantity <= 0) {
      throw new BadRequestException('Invalid quantity');
    }

    const booking = this.bookingRepository.create({
      user,
      event,
      quantity,
    });

    return this.bookingRepository.save(booking);
  }

  // Get all bookings for a user with event details
async findUserBookings(userId: number): Promise<Booking[]> {
  return this.bookingRepository
    .createQueryBuilder('booking')
    .leftJoinAndSelect('booking.event', 'event') 
    .where('booking.userId = :userId', { userId }) 
    .getMany();
}
}
