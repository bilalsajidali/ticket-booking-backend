import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
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
  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
