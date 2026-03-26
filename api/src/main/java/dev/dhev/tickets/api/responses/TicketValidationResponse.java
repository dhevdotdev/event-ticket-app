package dev.dhev.tickets.api.responses;

import dev.dhev.tickets.domain.entities.TicketValidationStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketValidationResponse {
  private UUID ticketId;
  private TicketValidationStatus status;
}
