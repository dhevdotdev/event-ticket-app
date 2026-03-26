package dev.dhev.tickets.mappers;

import dev.dhev.tickets.application.command.CreateEventCommand;
import dev.dhev.tickets.application.command.CreateTicketTypeCommand;
import dev.dhev.tickets.application.command.UpdateEventCommand;
import dev.dhev.tickets.application.command.UpdateTicketTypeCommand;
import dev.dhev.tickets.api.requests.CreateEventRequest;
import dev.dhev.tickets.api.requests.CreateTicketTypeRequest;
import dev.dhev.tickets.api.requests.UpdateEventRequest;
import dev.dhev.tickets.api.requests.UpdateTicketTypeRequest;
import dev.dhev.tickets.api.responses.CreateEventResponse;
import dev.dhev.tickets.api.responses.EventDetailsResponse;
import dev.dhev.tickets.api.responses.EventDetailsTicketTypeResponse;
import dev.dhev.tickets.api.responses.PublishedEventDetailsResponse;
import dev.dhev.tickets.api.responses.PublishedEventTicketTypeResponse;
import dev.dhev.tickets.api.responses.EventSummaryResponse;
import dev.dhev.tickets.api.responses.EventSummaryTicketTypeResponse;
import dev.dhev.tickets.api.responses.PublishedEventSummaryResponse;
import dev.dhev.tickets.api.responses.UpdateEventResponse;
import dev.dhev.tickets.api.responses.UpdateTicketTypeResponse;
import dev.dhev.tickets.domain.entities.Event;
import dev.dhev.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

  CreateTicketTypeCommand toCommand(CreateTicketTypeRequest request);

  CreateEventCommand toCommand(CreateEventRequest request);

  CreateEventResponse toCreateEventResponse(Event event);

  EventSummaryTicketTypeResponse toEventSummaryTicketTypeResponse(TicketType ticketType);

  EventSummaryResponse toEventSummaryResponse(Event event);

  EventDetailsTicketTypeResponse toEventDetailsTicketTypeResponse(
      TicketType ticketType);

  EventDetailsResponse toEventDetailsResponse(Event event);

  UpdateTicketTypeCommand toCommand(UpdateTicketTypeRequest request);

  UpdateEventCommand toCommand(UpdateEventRequest request);

  UpdateTicketTypeResponse toUpdateTicketTypeResponse(TicketType ticketType);

  UpdateEventResponse toUpdateEventResponse(Event event);

  PublishedEventSummaryResponse toPublishedEventSummaryResponse(Event event);

  PublishedEventTicketTypeResponse toPublishedEventTicketTypeResponse(
      TicketType ticketType);

  PublishedEventDetailsResponse toPublishedEventDetailsResponse(Event event);
}
