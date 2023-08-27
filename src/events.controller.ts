import { Controller, Get, Post, Param, Patch, Delete, Body, HttpCode, ParseIntPipe, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { CreateEventDto } from 'src/create-events.dto';
import { UpdateEventsDTO } from 'src/update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>
    ) {

    }

    @Get()
    async findAll() {
        return await this.eventRepository.find();
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const event = await this.eventRepository.findOneBy({
            id: parseInt(id)
        });

        return event;
    }

    @Post()
    async create(@Body() input: CreateEventDto) {
        return await this.eventRepository.save({
            ...input,
            when: new Date(input.when),
        })
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() input: UpdateEventsDTO) {
        const event = await this.eventRepository.findOneBy({
            id: parseInt(id)
        });
        return await this.eventRepository.save({
            ...event,
            ...input,
            when: input.when ?
                new Date(input.when) : event.when
        })
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        const event = await this.eventRepository.findOneBy({
            id: parseInt(id)
        });
        return await this.eventRepository.remove(event)
    }
}
