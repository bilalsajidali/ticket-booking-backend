import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes in this controller
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Get all events (accessible to all users)
  @Get()
  @Roles('user', 'admin')
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  // Get a single event by ID
  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: number): Promise<Event> {
    return this.eventsService.findOne(id);
  }

  // Create a new event (only admin)
  @Post()
  @Roles('admin')
  create(@Body() createEventDto: Partial<Event>): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  // Update an event (only admin)
  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: number,
    @Body() updateEventDto: Partial<Event>,
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  // Delete an event (only admin)
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: number): Promise<void> {
    return this.eventsService.remove(id);
  }
}
