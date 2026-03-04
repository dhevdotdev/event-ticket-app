package dev.dhev.tickets.mappers;

import dev.dhev.tickets.domain.CreateEventRequest;
import dev.dhev.tickets.domain.CreateTicketTypeRequest;
import dev.dhev.tickets.domain.UpdateEventRequest;
import dev.dhev.tickets.domain.UpdateTicketTypeRequest;
import dev.dhev.tickets.domain.dtos.CreateEventRequestDto;
import dev.dhev.tickets.domain.dtos.CreateEventResponseDto;
import dev.dhev.tickets.domain.dtos.CreateTicketTypeRequestDto;
import dev.dhev.tickets.domain.dtos.GetEventDetailsResponseDto;
import dev.dhev.tickets.domain.dtos.GetEventDetailsTicketTypesResponseDto;
import dev.dhev.tickets.domain.dtos.GetPublishedEventDetailsResponseDto;
import dev.dhev.tickets.domain.dtos.GetPublishedEventDetailsTicketTypesResponseDto;
import dev.dhev.tickets.domain.dtos.ListEventResponseDto;
import dev.dhev.tickets.domain.dtos.ListEventTicketTypeResponseDto;
import dev.dhev.tickets.domain.dtos.ListPublishedEventResponseDto;
import dev.dhev.tickets.domain.dtos.UpdateEventRequestDto;
import dev.dhev.tickets.domain.dtos.UpdateEventResponseDto;
import dev.dhev.tickets.domain.dtos.UpdateTicketTypeRequestDto;
import dev.dhev.tickets.domain.dtos.UpdateTicketTypeResponseDto;
import dev.dhev.tickets.domain.entities.Event;
import dev.dhev.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

  CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

  CreateEventRequest fromDto(CreateEventRequestDto dto);

  CreateEventResponseDto toDto(Event event);

  ListEventTicketTypeResponseDto toDto(TicketType ticketType);

  ListEventResponseDto toListEventResponseDto(Event event);

  GetEventDetailsTicketTypesResponseDto toGetEventDetailsTicketTypesResponseDto(
      TicketType ticketType);

  GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

  UpdateTicketTypeRequest fromDto(UpdateTicketTypeRequestDto dto);

  UpdateEventRequest fromDto(UpdateEventRequestDto dto);

  UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);

  UpdateEventResponseDto toUpdateEventResponseDto(Event event);

  ListPublishedEventResponseDto toListPublishedEventResponseDto(Event event);

  GetPublishedEventDetailsTicketTypesResponseDto toGetPublishedEventDetailsTicketTypesResponseDto(
      TicketType ticketType);

  GetPublishedEventDetailsResponseDto toGetPublishedEventDetailsResponseDto(Event event);
}
