package dev.dhev.tickets.domain.dtos;

import dev.dhev.tickets.domain.entities.TicketValidationStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationResponseDto {
  private UUID ticketId;
  private TicketValidationStatus status;
}
