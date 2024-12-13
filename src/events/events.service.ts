import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Booking } from 'src/bookings/booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>, // Inject the booking repository
  ) {}

  // Create a new event
  create(createEventDto: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  // Get all events
  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  // Get a single event by ID
  findOne(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id });
  }

  // Update an event
  async update(id: number, updateEventDto: Partial<Event>): Promise<Event> {
    await this.eventRepository.update(id, updateEventDto);
    return this.eventRepository.findOneBy({ id });
  }

  // Delete an event
  async remove(id: number): Promise<{msg:string}> {
    // Delete all bookings related to this event
    await this.bookingRepository.delete({ eventId: id });

    // Then delete the event itself
    await this.eventRepository.delete(id);
    // Return a message indicating successful deletion
    return { msg: `Event with ID ${id} and all its associated bookings have been deleted.` };

  }
}
