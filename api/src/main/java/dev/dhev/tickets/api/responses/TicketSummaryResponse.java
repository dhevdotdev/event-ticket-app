package dev.dhev.tickets.api.responses;

import dev.dhev.tickets.entities.TicketStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketSummaryResponse {
  private UUID id;
  private TicketStatus status;
  private TicketSummaryTicketTypeResponse ticketType;
}
