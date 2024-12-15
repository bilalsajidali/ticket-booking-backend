import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  async create(createEventDto: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);

    try {
      return await this.eventRepository.save(event);
    } catch (error) {
      throw new BadRequestException('Could not create the event. Please check the input and try again.');
    }
  }

  // Get all events
  async findAll(): Promise<Event[]> {
    try {
      return await this.eventRepository.find();
    } catch (error) {
      throw new BadRequestException('Could not retrieve events. Please try again.');
    }
  }

  // Get a single event by ID
  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  // Update an event
  async update(id: number, updateEventDto: Partial<Event>): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    try {
      await this.eventRepository.update(id, updateEventDto);
      return await this.eventRepository.findOneBy({ id });
    } catch (error) {
      throw new BadRequestException('Could not update the event. Please check the input and try again.');
    }
  }

  // Delete an event
  async remove(id: number): Promise<{ msg: string }> {
    const event = await this.eventRepository.findOneBy({ id });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    try {
      // Delete all bookings related to this event
      await this.bookingRepository.delete({ eventId: id });

      // Then delete the event itself
      await this.eventRepository.delete(id);

      return { msg: `Event with ID ${id} and all its associated bookings have been deleted.` };
    } catch (error) {
      throw new BadRequestException('Could not delete the event. Please try again.');
    }
  }
}
