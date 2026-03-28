package dev.dhev.tickets.mappers;

import dev.dhev.tickets.api.responses.TicketValidationResponse;
import dev.dhev.tickets.entities.TicketValidation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketValidationMapper {

  @Mapping(target = "ticketId", source = "ticket.id")
  TicketValidationResponse toTicketValidationResponse(TicketValidation ticketValidation);

}
