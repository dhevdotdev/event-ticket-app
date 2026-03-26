package dev.dhev.tickets.mappers;

import dev.dhev.tickets.api.responses.TicketDetailsResponse;
import dev.dhev.tickets.api.responses.TicketSummaryResponse;
import dev.dhev.tickets.api.responses.TicketSummaryTicketTypeResponse;
import dev.dhev.tickets.domain.entities.Ticket;
import dev.dhev.tickets.domain.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

  TicketSummaryTicketTypeResponse toTicketSummaryTicketTypeResponse(TicketType ticketType);

  TicketSummaryResponse toTicketSummaryResponse(Ticket ticket);

  @Mapping(target = "price", source = "ticket.ticketType.price")
  @Mapping(target = "description", source = "ticket.ticketType.description")
  @Mapping(target = "eventName", source = "ticket.ticketType.event.name")
  @Mapping(target = "eventVenue", source = "ticket.ticketType.event.venue")
  @Mapping(target = "eventStart", source = "ticket.ticketType.event.start")
  @Mapping(target = "eventEnd", source = "ticket.ticketType.event.end")
  TicketDetailsResponse toTicketDetailsResponse(Ticket ticket);

}
